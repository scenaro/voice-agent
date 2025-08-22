konfig: k8-require-env
  @echo "$KUBECONFIG"

# Exporter le kubeconfig dans le shell courant. `eval $(just use-konfig)`
use-konfig: k8-require-env
  @echo "🔧 Copier le contenu du kubeconfig dans le shell courant :"
  @echo "export KUBECONFIG=${KUBECONFIG}"

k9s: k8-require-env
  bash -c k9s

kubectl +CMD: k8-require-env
  kubectl {{CMD}}

helm +CMD: k8-require-env
  helm {{CMD}}

docker +CMD: k8-require-env
  docker {{CMD}}

# Status du déploiement
k8-status: k8-require-env
  @echo "📊 Kubernetes deployment status:"
  @echo "\n🏷️  Namespaces:"
  kubectl get namespaces | grep -E "(scenaro|traefik)"
  @echo "\n🐳 Pods:"
  kubectl get pods -n scenaro-voice-agent -o wide
  @echo "\n🔌 Services:"
  kubectl get services -n scenaro-voice-agent
  @echo "\n🌐 Ingress:"
  kubectl get ingress -n scenaro-voice-agent
  @echo "\n🔐 Certificates:"
  kubectl get certificates -n scenaro-voice-agent || echo "No certificates found"


# Test de connectivité réseau
k8-test-network: k8-require-env
  @echo "🔍 Testing network connectivity..."
  @echo "Frontend to Agent:"
  kubectl exec -n scenaro-voice-agent $(kubectl get pods -n scenaro-voice-agent -l app=front -o jsonpath='{.items[0].metadata.name}') -- wget -qO- --timeout=5 http://agent-service:7880/health || echo "❌ Frontend cannot reach Agent"

k8-images-ls: k8-require-env
 kubectl kustomize docker/k8/apps/overlays/staging | grep -A5 -B5 "image:"
