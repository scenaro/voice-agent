# Install cert-manager
k8-init-cert-manager: k8-require-env
  @echo "🔐 Installing cert-manager..."
  kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml
  @echo "⏳ Waiting for cert-manager to be ready..."
  kubectl wait --for=condition=Ready pods --all -n cert-manager --timeout=300s
  @echo "✅ cert-manager installed successfully!"

# Create ClusterIssuers
k8-setup-cert-issuers: k8-require-env
  @echo "🏭 Creating ClusterIssuers..."
  kubectl apply -f docker/k8/cluster/cert-manager/cluster-issuer.yml
  @echo "✅ ClusterIssuers created!"

# Create Certificates (optional, ingress can auto-create them)
k8-setup-certificates: k8-require-env
  @echo "📜 Creating Certificates..."
  kubectl apply -f docker/k8/cluster/cert-manager/certificates.yml
  @echo "✅ Certificates created!"

# Full cert-manager setup
k8-setup-cert-manager: k8-require-env k8-init-cert-manager k8-setup-cert-issuers
  @echo "🎯 cert-manager setup complete!"
  @echo ""
  @echo "💡 Check certificate status with:"
  @echo "   just k8-check-cert-manager"
  @echo ""
  @echo "💡 Or check specific certificates:"
  @echo "   kubectl get certificates -n scenaro-voice-agent"
  @echo "   kubectl describe certificate voice-agent-tls -n scenaro-voice-agent"
  @echo "   kubectl describe certificate traefik-dashboard-tls -n scenaro-voice-agent"

# Check cert-manager status
k8-check-cert-manager: k8-require-env
  @echo "🔍 Checking cert-manager status..."
  kubectl get pods -n cert-manager
  @echo ""
  @echo "📋 ClusterIssuers:"
  kubectl get clusterissuers
  @echo ""
  @echo "📜 Certificates:"
  kubectl get certificates -A