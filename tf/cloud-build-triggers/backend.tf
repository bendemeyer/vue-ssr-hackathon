# Terraform versions/backend/providers
terraform {
  required_version = ">= 1.0.0"

  backend "gcs" {
   bucket = "hackathon-cloudbuild-trigger-tf-bucket"        
   prefix = "tf/cloud-build-triggers"       
  }

  required_providers {
    google = {
      version = ">= 4.69.1"
      source  = "hashicorp/google"
    }
  }
}

# Provider - Google
provider "google" {
  project = "decomp-phase-2-hack-day"
  region  = "us-east1"
}