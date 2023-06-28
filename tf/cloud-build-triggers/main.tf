resource "google_cloudbuildv2_repository" "my-repository" {
  provider = google-beta
  name = "bendemeyer-vue-ssr-hackathon"
  parent_connection = google_cloudbuildv2_connection.my-connection.id
  remote_uri = "https://github.com/bendemeyer/vue-ssr-hackathon.git"
}

resource "google_cloudbuild_trigger" "repo-trigger" {
  name     = "test-tf-trigger"
  provider = google-beta
  location = "us-central1"

  repository_event_config {
    repository = google_cloudbuildv2_repository.my-repository.id
    push {
       branch = "^tf-test$"
    }
  }

  service_account = "482137462660-compute@developer.gserviceaccount.com"
  filename = "cloudbuild.yaml"
}


resource "google_cloudbuildv2_repository" "tf-connection-repo" {
  # (resource arguments)
}
