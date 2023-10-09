resource "google_storage_bucket" "im_test" {
  name = "dvplt-hackathon-im-test-${var.suffix}"
  location = "us-east1"
#  versioning {
#    enabled = true
#  }
}
