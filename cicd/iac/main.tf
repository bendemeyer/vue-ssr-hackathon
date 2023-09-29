terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 4.51.0"
    }
  }
}

provider "google" {
  project = "dvplt-hackathon-sandbox"
  region = "us-east1"
  zone = "us-east1-b"
}

locals {
  domain = "hackday3.vetruvet.com"
  region = "us-east1"
  project = "dvplt-hackathon-sandbox"
  envs = { for tuple in regexall("(.*)=(.*)", file(".env")) : tuple[0] => tuple[1] }
}

data "google_project" "project" {}

resource "google_compute_global_address" "lb_ip" {
  name = "hackday-lb-ip"
}

output "lb_ip" {
  value = google_compute_global_address.lb_ip.address
}

resource "google_project_service" "certificatemanager_svc" {
  service = "certificatemanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "iap_svc" {
  service = "iap.googleapis.com"
  disable_on_destroy = false
}

resource "google_iap_brand" "hackday_brand" {
  support_email = "val.trubachev@zoro.com"
  application_title = "Hackathon Test"
  # org_internal_only = true
}

resource "google_iap_client" "iap_client" {
  display_name = "Hackathon Test Client"
  brand = google_iap_brand.hackday_brand.name
}

resource "google_project_service_identity" "iap_sa" {
  provider = google-beta
  project = local.project
  service = "iap.googleapis.com"
}

resource "google_project_iam_binding" "iap_cloudrun" {
  project = local.project
  role = "roles/run.invoker"
  members = [
    "serviceAccount:${google_project_service_identity.iap_sa.email}"
    # "serviceAccount:service-${data.google_project.project.number}@gcp-sa-iap.iam.gserviceaccount.com"
  ]
}

resource "google_dns_managed_zone" "hackday3_zone" {
  name = "hackday3-zone"
  dns_name = "${local.domain}."
  visibility = "public"
  force_destroy = true
}

output "dns_ns_records" {
  value = google_dns_managed_zone.hackday3_zone.name_servers
}

resource "google_dns_record_set" "dns_cert_auth" {
  name = google_certificate_manager_dns_authorization.hackday3.dns_resource_record[0].name
  managed_zone = google_dns_managed_zone.hackday3_zone.name
  type = google_certificate_manager_dns_authorization.hackday3.dns_resource_record[0].type
  ttl = 300
  rrdatas = [google_certificate_manager_dns_authorization.hackday3.dns_resource_record[0].data]
}

resource "google_dns_record_set" "lb_ip_root" {
  name = "${local.domain}."
  managed_zone = google_dns_managed_zone.hackday3_zone.name
  type = "A"
  ttl = 300
  rrdatas = [google_compute_global_address.lb_ip.address]
}

resource "google_dns_record_set" "lb_ip_wildcard" {
  name = "*.${local.domain}."
  managed_zone = google_dns_managed_zone.hackday3_zone.name
  type = "A"
  ttl = 300
  rrdatas = [google_compute_global_address.lb_ip.address]
}

resource "google_certificate_manager_dns_authorization" "hackday3" {
  name = "hackday-dnsauth"
  domain = local.domain
}

resource "google_certificate_manager_certificate" "wildcard_cert" {
  name = "hackday3-wildcard"
  managed {
    domains = [local.domain, "*.${local.domain}"]
    dns_authorizations = [
      google_certificate_manager_dns_authorization.hackday3.id
    ]
  }
}

resource "google_certificate_manager_certificate_map" "cert_map" {
  name = "hackday3-certmap"
}

resource "google_certificate_manager_certificate_map_entry" "cert_map_root_entry" {
  name = "hackday3-certmap-root-entry"
  map = google_certificate_manager_certificate_map.cert_map.name
  certificates = [google_certificate_manager_certificate.wildcard_cert.id]
  hostname = local.domain
}

resource "google_certificate_manager_certificate_map_entry" "cert_map_wildcard_entry" {
  name = "hackday3-certmap-wildcard-entry"
  map = google_certificate_manager_certificate_map.cert_map.name
  certificates = [google_certificate_manager_certificate.wildcard_cert.id]
  hostname = "*.${local.domain}"
}

resource "google_compute_region_network_endpoint_group" "cloudrun_neg" {
  name = "hackday3-neg"
  network_endpoint_type = "SERVERLESS"
  region = local.region
  cloud_run {
    url_mask = "<service>.${local.domain}"
  }
}

resource "google_compute_backend_service" "cloudrun_backend" {
  name = "hackday-backend"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  backend {
    group = google_compute_region_network_endpoint_group.cloudrun_neg.id
  }
  iap {
    oauth2_client_id = google_iap_client.iap_client.client_id
    oauth2_client_secret = google_iap_client.iap_client.secret
  }
}

output "authorized-redirect-uri" {
  value = "https://iap.googleapis.com/v1/oauth/clientIds/${local.envs["OAUTH_CLIENT_ID"]}:handleRedirect"
}

resource "google_compute_url_map" "cloudrun_map" {
  name = "hackday-url-map"
  default_service = google_compute_backend_service.cloudrun_backend.id
}

resource "google_compute_target_https_proxy" "https_proxy" {
  name = "hackday-proxy-https"
  certificate_map = "//certificatemanager.googleapis.com/${google_certificate_manager_certificate_map.cert_map.id}"
  url_map = google_compute_url_map.cloudrun_map.id
}

resource "google_compute_global_forwarding_rule" "frontend_https" {
  name = "hackday-frontend-https"
  target = google_compute_target_https_proxy.https_proxy.id
  port_range = "443"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  ip_address = google_compute_global_address.lb_ip.id
}

resource "google_compute_url_map" "https_redirect_map" {
  name = "hackday-https-redirect-map"
  default_url_redirect {
    https_redirect = true
    strip_query = false
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
  }
}

resource "google_compute_target_http_proxy" "http_proxy" {
  name = "hackday-proxy-http"
  url_map = google_compute_url_map.https_redirect_map.id
}

resource "google_compute_global_forwarding_rule" "frontend_http" {
  name = "hackday-frontend-http"
  target = google_compute_target_http_proxy.http_proxy.id
  port_range = "80"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  ip_address = google_compute_global_address.lb_ip.id
}

