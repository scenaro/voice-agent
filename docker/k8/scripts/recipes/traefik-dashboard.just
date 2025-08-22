# Access Traefik Dashboard via SSH tunnel (secure)
k8-traefik-dashboard-tunnel: k8-require-env
  @echo "🔐 Creating SSH tunnel to Traefik dashboard..."
  @echo "Dashboard will be available at: http://localhost:8080"
  @echo "Press Ctrl+C to stop the tunnel"
  kubectl port-forward --namespace traefik-system svc/traefik 8080:8080



