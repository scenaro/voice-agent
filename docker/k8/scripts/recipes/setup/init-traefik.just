# Install Traefik
k8-init-traefik: k8-require-env
  @echo "🌐 Installing Traefik with Helm..."
  @echo "📋 Adding Traefik Helm repository..."
  helm repo add traefik https://traefik.github.io/charts
  helm repo update

  @echo "📦 Installing Traefik..."
  helm upgrade --install traefik traefik/traefik \
  --namespace traefik-system \
  --create-namespace \
  --values docker/k8/helm-chart/traefik-values.yml

  # Attendre que Traefik soit prêt
  @echo "⏳ Attente du démarrage de Traefik..."
  kubectl wait --for=condition=ready --timeout=300s pod -l app.kubernetes.io/name=traefik -n traefik-system

  echo "🔍 Vérification du Load Balancer..."
  kubectl get services -n traefik-system

  @echo ""
  @echo "✅ Traefik installed! Dashboard will be available after ingress setup"