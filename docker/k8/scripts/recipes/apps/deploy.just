# Déploiement des applications basé sur l'environnement courant (K8_ENV)
k8-deploy-apps: k8-require-env
  #!/bin/bash
  set -e

  # K8_ENV doit être défini - faire planter sinon
  if [ -z "$K8_ENV" ]; then
    echo "❌ Les variables d'environnements ne sont pas chargées"
    echo "   Utilisez des secrets ou \`just k8-check-env {env name}\`"
    exit 1
  fi

  ENV="$K8_ENV"
  OVERLAY_PATH="docker/k8/apps/overlays/$ENV"

  echo "☸️ Déploiement des applications Scenaro Voice Agent"
  echo "📋 Environnement: $ENV"
  echo "📂 Overlay utilisé: $OVERLAY_PATH"

  # Vérification que l'overlay existe
  if [ ! -d "$OVERLAY_PATH" ]; then
    echo "❌ Overlay non trouvé: $OVERLAY_PATH"
    echo "   Vérifiez dans le dossier apps/overlays"
    exit 1
  fi

  # Déploiement via Kustomize
  echo ""
  echo "🚀 Déploiement des applications..."
  kubectl apply -k "$OVERLAY_PATH"

  echo ""
  echo "⏳ Attente de la finalisation des déploiements..."
  kubectl rollout status deployment/agent -n "$K8S_NAMESPACE" --timeout=300s
  kubectl rollout status deployment/front -n "$K8S_NAMESPACE" --timeout=300s

  echo ""
  echo "🔍 Vérification de l'état des services..."
  kubectl get pods -n "$K8S_NAMESPACE" -o wide
  kubectl get services -n "$K8S_NAMESPACE"

  echo ""
  echo "✅ Applications déployées avec succès dans l'environnement '$ENV'!"
  echo "🌐 Namespace: $K8S_NAMESPACE"

# Management

# Restart avec confirmation
k8-restart: k8-require-env
  @read -p "Continue? (y/n): " answer; \
    if [ "$$answer" != "y" ]; then echo "Abandon de la commande."; exit 1; fi

  @echo "🔄 Restarting deployments to pick up new changes..."
  kubectl rollout restart deployment/agent -n scenaro-voice-agent
  kubectl rollout restart deployment/front -n scenaro-voice-agent
  @echo "⏳ Waiting for restart to complete..."
  kubectl rollout status deployment/agent -n scenaro-voice-agent
  kubectl rollout status deployment/front -n scenaro-voice-agent

# Rollback du déploiement
k8-rollback: k8-require-env
  @echo "🔄 Rolling back to previous deployment..."
  kubectl rollout undo deployment/agent -n scenaro-voice-agent
  kubectl rollout undo deployment/front -n scenaro-voice-agent
  @echo "⏳ Waiting for rollback to complete..."
  kubectl rollout status deployment/agent -n scenaro-voice-agent
  kubectl rollout status deployment/front -n scenaro-voice-agent

# Scaling des deployments (provilégier le GitOps)
k8-scale replicas="2": k8-require-env
  @echo "📈 Scaling deployments to {{replicas}} replicas..."
  kubectl scale deployment/agent --replicas={{replicas}} -n scenaro-voice-agent
  kubectl scale deployment/front --replicas={{replicas}} -n scenaro-voice-agent
  @echo "⏳ Waiting for scaling to complete..."
  kubectl rollout status deployment/agent -n scenaro-voice-agent
  kubectl rollout status deployment/front -n scenaro-voice-agent

# Scaling agent (provilégier le GitOps)
k8-scale-agent replicas="2": k8-require-env
  @echo "📈 Scaling deployments to {{replicas}} replicas..."
  kubectl scale deployment/agent --replicas={{replicas}} -n scenaro-voice-agent
  @echo "⏳ Waiting for scaling to complete..."
  kubectl rollout status deployment/agent -n scenaro-voice-agent

# Scaling front (provilégier le GitOps)
k8-scale-front replicas="2": k8-require-env
  @echo "📈 Scaling (front) deployments to {{replicas}} replicas..."
  kubectl scale deployment/front --replicas={{replicas}} -n scenaro-voice-agent
  @echo "⏳ Waiting for scaling (front) to complete..."
  kubectl rollout status deployment/front -n scenaro-voice-agent

# Nettoyage complet du cluster
k8-cleanup: k8-require-env
  @echo "🧹 Cleaning up Kubernetes resources..."
  @echo "⚠️  This will delete ALL resources in the scenaro-voice-agent namespace"
  @read -p "Continue? (y/n): " confirm && [ "$$confirm" = "y" ] || exit 1
  kubectl delete namespace scenaro-voice-agent
  @echo "✅ Cleanup completed!"

k8-delete-pod-front: k8-require-env
  @echo "🧹 Deleting pod front..."
  kubectl delete pods -n scenaro-voice-agent -l app=front --force;
  @echo "✅ Pod front deleted!"



