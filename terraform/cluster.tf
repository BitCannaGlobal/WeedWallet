# cluster.tf

resource "google_compute_network" "default" {
  name = "webwallet-network"

  auto_create_subnetworks  = false
  enable_ula_internal_ipv6 = false
}

resource "google_compute_subnetwork" "default" {
  name = "webwallet-subnetwork"

  ip_cidr_range = "10.0.0.0/16"
  region        = "us-central1"

  stack_type       = "IPV4_ONLY"
  ipv6_access_type = null

  network = google_compute_network.default.id
  secondary_ip_range {
    range_name    = "services-range"
    ip_cidr_range = "192.168.0.0/24"
  }

  secondary_ip_range {
    range_name    = "pod-ranges"
    ip_cidr_range = "192.168.1.0/24"
  }
}

resource "google_container_cluster" "default" {
  name               = "webwallet-cluster"
  location           = "us-central1"
  enable_autopilot   = true

  network    = google_compute_network.default.id
  subnetwork = google_compute_subnetwork.default.id

  ip_allocation_policy {
    stack_type                    = "IPV4"
    services_secondary_range_name = google_compute_subnetwork.default.secondary_ip_range[0].range_name
    cluster_secondary_range_name  = google_compute_subnetwork.default.secondary_ip_range[1].range_name
  }

  deletion_protection = false
}

resource "time_sleep" "wait_service_cleanup" {
  depends_on = [google_container_cluster.default]

  destroy_duration = "180s"
}
