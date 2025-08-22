# Correction de problème d'IP LoadBalancer Scaleway

# Diagnostic complet du problème d'IP LoadBalancer
k8-diagnose-loadbalancer-ip: k8-require-env
  @echo "🔍 DIAGNOSTIC IP LOADBALANCER"
  @echo "============================="
  @echo ""
  @echo "📋 Configuration souhaitée:"
  @echo "IP fixe cible: 51.158.68.116"
  @echo ""
  @echo "📋 État actuel du service Traefik:"
  kubectl get service traefik -n traefik-system -o wide
  @echo ""
  @echo "📋 IP externe attribuée:"
  kubectl get service traefik -n traefik-system -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null && echo "" || echo "Pas d'IP trouvée"
  @echo "📋 Hostname externe attribué:"
  kubectl get service traefik -n traefik-system -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null && echo "" || echo "Pas de hostname trouvé"
  @echo ""
  @echo "📋 Configuration du service (loadBalancerIP):"
  kubectl get service traefik -n traefik-system -o jsonpath='{.spec.loadBalancerIP}' && echo ""
  @echo ""
  @echo "📋 Annotations Scaleway:"
  kubectl get service traefik -n traefik-system -o jsonpath='{.metadata.annotations}' && echo ""

# Vérifier si l'IP fixe est libre dans Scaleway
k8-check-ip-availability: k8-require-env
  @echo "🔍 Vérification de la disponibilité de l'IP fixe..."
  @echo ""
  @echo "📋 IP à vérifier: 51.158.68.116"
  @echo ""
  @echo "⚠️  Vérifiez manuellement dans la console Scaleway:"
  @echo "1. Aller dans 'Network' > 'Load Balancers'"
  @echo "2. Vérifier si l'IP 51.158.68.116 est attachée à un autre LB"
  @echo "3. Si oui, la détacher avant de continuer"
  @echo ""
  @echo "📋 État actuel du cluster:"
  kubectl get service traefik -n traefik-system -o wide
