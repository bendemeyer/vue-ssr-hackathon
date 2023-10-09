terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 4.51.0"
    }
  }
}

locals {
  project = "dvplt-hackathon-sandbox"
  region = "us-east1"
  zone = "us-east1-b"
}

provider "google" {
  project = local.project
  region = local.region
  zone = local.zone
}

resource "google_service_account" "infra_manager" {
  account_id   = "infra-manager"
  display_name = "Infra manager SA"
}

output "infra-manager-sa" {
  value = google_service_account.infra_manager.email
}

resource "google_project_iam_member" "infra_manager_roles" {
  for_each = toset([
    "roles/config.agent",
    "roles/storage.admin",
  ])

  project = local.project
  member = "serviceAccount:${google_service_account.infra_manager.email}"
  role    = each.key
}

resource "google_storage_bucket" "infra_manager_bucket" {
  name = "dvplt-hackathon-infra-manager"
  location = local.region
  versioning {
    enabled = true
  }
}

resource "google_storage_bucket_iam_member" "infra_manager_read" {
  bucket = google_storage_bucket.infra_manager_bucket.name
  member = "serviceAccount:${google_service_account.infra_manager.email}"
  role   = "roles/storage.objectViewer"
}

output "infra-manager-bucket" {
  value = google_storage_bucket.infra_manager_bucket.name
}
