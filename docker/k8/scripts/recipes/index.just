rootDir := `pwd`
export KUBECONFIG := rootDir + "/docker/k8/config/kubeconfig-k8s-voice-agents.yml"

# Environment Management
import "./env.just"

# Setup Kubernetes services
import "./setup/init-cluster.just"
import "./setup/init-traefik.just"
import "./setup/init-cert-manager.just"

# Kubernetes Commands
import "./k8.just"
import "./registry.just"
import "./traefik.just"
import "./traefik-dashboard.just"
import "./scaleway-loadbalancer-debug.just"

# Applications
import "./apps/deploy.just"
import "./apps/agent.just"
import "./apps/front.just"