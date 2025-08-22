# Commandes de diagnostic et gestion Traefik

# Check Traefik status
k8-traefik-status: k8-require-env
  @echo "🔍 Traefik status:"
  kubectl get pods -n traefik-system
  @echo ""
  @echo "📊 Traefik services:"
  kubectl get svc -n traefik-system
  @echo ""
  @echo "🌐 Ingress resources:"
  kubectl get ingress -A

# Vérifier l'état complet de Traefik (détaillé)
k8-traefik-status-detailed: k8-require-env
  @echo "🔍 État détaillé de Traefik..."
  @echo ""
  @echo "📋 Pods Traefik actuels:"
  kubectl get pods -n traefik-system -l app.kubernetes.io/name=traefik
  @echo ""
  @echo "📋 Service LoadBalancer:"
  kubectl get service traefik -n traefik-system
  @echo ""
  @echo "📋 Deployment Traefik:"
  kubectl get deployment traefik -n traefik-system
  @echo ""
  @echo "📋 ReplicaSet Traefik:"
  kubectl get replicaset -n traefik-system -l app.kubernetes.io/name=traefik

# Redémarrer Traefik proprement
k8-traefik-restart: k8-require-env
  @echo "🔄 Redémarrage de Traefik..."
  kubectl rollout restart deployment/traefik -n traefik-system
  @echo "⏳ Attente du redémarrage..."
  kubectl rollout status deployment/traefik -n traefik-system --timeout=300s
  @echo "✅ Traefik redémarré avec succès"

# Traefik logs
k8-traefik-logs: k8-require-env
  @echo "📋 Traefik logs:"
  kubectl logs -f -l app.kubernetes.io/name=traefik -n traefik-system

# Vérifier les logs Traefik pour diagnostiquer les problèmes (sans follow)
k8-traefik-logs-recent: k8-require-env
  @echo "📝 Logs Traefik récents..."
  kubectl logs -n traefik-system -l app.kubernetes.io/name=traefik --tail=50

# Logs Traefik
k8-traefik-logs-follow: k8-require-env
  @echo "📋 Traefik logs (follow mode):"
  kubectl logs -f -l app.kubernetes.io/name=traefik -n traefik-system --tail=100

# Vérifier les événements du namespace traefik-system
k8-traefik-events: k8-require-env
  @echo "📋 Événements récents du namespace traefik-system:"
  kubectl get events -n traefik-system --sort-by='.lastTimestamp' --field-selector type!=Normal

# Test de connectivité LoadBalancer
k8-traefik-test-connectivity: k8-require-env
  @echo "🌐 Test de connectivité LoadBalancer..."
  @echo ""
  @echo "📋 Hostname externe attribué:"
  kubectl get service traefik -n traefik-system -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
  @echo ""
  @echo ""
  @echo "🔗 Test HTTP (attention: peut échouer si pas encore configuré):"
  @LB_IP=$(kubectl get service traefik -n traefik-system -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'); \
  if [ ! -z "$LB_IP" ]; then \
    echo "Tentative de connexion à $LB_IP:80..."; \
    curl -I "http://$LB_IP" --connect-timeout 5 2>/dev/null || echo "❌ Pas de réponse (normal si Ingress pas encore configuré)"; \
  else \
    echo "❌ Pas d'IP externe attribuée"; \
  fi

# Diagnostic complet - à utiliser pour résoudre les problèmes
k8-traefik-diagnose: k8-require-env
  @echo "🔍 DIAGNOSTIC COMPLET TRAEFIK"
  @echo "=============================="
  @echo ""
  just k8-traefik-status-detailed
  @echo ""
  @echo "📋 Événements récents:"
  just k8-traefik-events
  @echo ""
  @echo "📝 Logs récents:"
  just k8-traefik-logs-recent
  @echo ""
  @echo "🌐 Test connectivité:"
  just k8-traefik-test-connectivity