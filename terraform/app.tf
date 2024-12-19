# app.tf

provider "kubernetes" {
  host                   = "https://${google_container_cluster.default.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.default.master_auth[0].cluster_ca_certificate)

  ignore_annotations = [
    "^autopilot\\.gke\\.io\\/.*",
    "^cloud\\.google\\.com\\/.*"
  ]
}

data "google_client_config" "default" {}

resource "kubernetes_deployment_v1" "default" {
  metadata {
    name = "webwallet-vite-app-deployment"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "vite-app"
      }
    }

    template {
      metadata {
        labels = {
          app = "vite-app"
        }
      }

      spec {
        container {
          image = "bernalraul/webwallet:latest"
          name  = "vite-app-container"

          port {
            container_port = 3000
            name           = "vite-app-svc"
          }

          security_context {
            allow_privilege_escalation = false
            privileged                 = false
            read_only_root_filesystem  = false

            capabilities {
              add  = []
              drop = ["NET_RAW"]
            }
          }

          liveness_probe {
            http_get {
              path = "/login"
              port = "3000"
            }

            initial_delay_seconds = 60
            period_seconds        = 5
          }
        }

        security_context {
          run_as_non_root = true

          seccomp_profile {
            type = "RuntimeDefault"
          }
        }

        toleration {
          effect   = "NoSchedule"
          key      = "kubernetes.io/arch"
          operator = "Equal"
          value    = "amd64"
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "default" {
  metadata {
    name = "webwallet-vite-app-loadbalancer"
    annotations = {
      "networking.gke.io/load-balancer-type" = "External"
    }
  }

  spec {
    selector = {
      app = kubernetes_deployment_v1.default.spec[0].selector[0].match_labels.app
    }

#    ip_family_policy = "RequireDualStack"

    port {
      port        = 443
      target_port = kubernetes_deployment_v1.default.spec[0].template[0].spec[0].container[0].port[0].name
    }

    type = "LoadBalancer"
  }

  depends_on = [time_sleep.wait_service_cleanup]
}

resource "kubernetes_ingress_v1" "default" {
  metadata {
    name = "webwallet-ingress"
    annotations = {
      "kubernetes.io/ingress.class" : "gce",
      "networking.gke.io/managed-certificates" : "gke-wallet-cert"
    }
  }

  spec {
    rule {
      host = "gke-wallet.bitcanna.io"
      http {
        path {
          path = "/"
          backend {
            service {
              name = kubernetes_service_v1.default.metadata[0].name
              port {
                number = 443
              }
            }
          }
        }
      }
    }
  }
}
