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

variable "suffix" {
  type = string
  default = "foo"
}
