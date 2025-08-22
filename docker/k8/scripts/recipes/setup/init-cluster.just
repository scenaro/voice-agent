init-cluster: k8-require-env
  @echo "🚀 Initialisation du cluster Scaleway pour Scenaro Voice Agent"
  @echo "🔍 Test de la connexion au cluster..."
  kubectl cluster-info

  @echo "📦 Création du namespace pour l'application..."
  kubectl create namespace scenaro-voice-agent --dry-run=client -o yaml | kubectl apply -f -

  @: # init stack
  just k8-init-traefik
  just k8-setup-cert-manager