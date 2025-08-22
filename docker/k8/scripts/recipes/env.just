# =============================================================================
# Gestion des variables d'environnement Kubernetes
# =============================================================================

# Tente de charger un .env.k8s.{env}, puis check les variables d'environnement.
k8-check-env env="":
  #!/bin/bash
  ENV_ARG="{{env}}"

  # Détermine l'environnement à utiliser
  if [ "$ENV_ARG" = "" ] && [ "${K8_ENV:-}" = "" ]; then
    echo "❌ Erreur: aucune variable d'environnement n'a été définie"
    echo "💡 Utilisez: just k8-check-env prod|staging"
    echo "💡 Ou définissez: export K8_ENV=prod"
    exit 1
  elif [ "$ENV_ARG" = "" ] && [ "${K8_ENV:-}" != "" ]; then
    echo "⚠️  env non définie, utilisation de la variable d'environnement K8_ENV: $K8_ENV"
    FINAL_ENV="$K8_ENV"
  else
    FINAL_ENV="$ENV_ARG"
  fi

  echo "🔍 Validation des variables d'environnement: $FINAL_ENV"
  "{{rootDir}}/docker/k8/scripts/check-env.sh" "$FINAL_ENV"

# Affichage des variables d'environnement chargées (pour debug)
k8-show-env env="": k8-require-env
  #!/bin/bash
  ENV="{{env}}"
  rootDir="{{rootDir}}"
  ENV_FILE="$rootDir/docker/k8/config/.env.k8s.$ENV"

  echo "🔍 Variables d'environnement pour: $ENV"
  echo "📁 Fichier: $ENV_FILE"
  echo ""

  if [ -f "$ENV_FILE" ]; then
    echo "=== CONTENU DU FICHIER ==="
    cat "$ENV_FILE" | grep -E '^[A-Z_].*=' | grep -v '^#' || true
  else
    echo "❌ Fichier non trouvé: $ENV_FILE"
    echo "💡 Créez-le avec: just k8-setup-env $ENV"
  fi

k8-require-env:
  #!/bin/bash
  if [ "${KUBECONFIG:-}" = "" ] || [ "${K8_ENV:-}" = "" ]; then
    echo "❌ Erreur: Variables d'environnement non définies"
    echo "💡 Utilisez: just k8-check-env prod|staging"
    echo "💡 Ou définissez les secrets depuis le CI/CD"
    exit 1
  fi