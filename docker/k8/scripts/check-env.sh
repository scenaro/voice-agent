#!/bin/bash

# =============================================================================
# Script de validation des variables d'environnement Kubernetes
# =============================================================================
#
# Usage:
#   ./check-env.sh prod
#   ./check-env.sh staging
#

set -e

ENV=${1:-"none"}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "🔍 Validation des variables d'environnement pour: $ENV"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
MISSING_VARS=0
TOTAL_VARS=0

# Fonction pour vérifier une variable
check_var() {
    local var_name="$1"
    local var_description="$2"
    local is_secret="$3"

    TOTAL_VARS=$((TOTAL_VARS + 1))

    if [ -z "${!var_name}" ]; then
        echo -e "  ${RED}✗${NC} $var_name - $var_description"
        MISSING_VARS=$((MISSING_VARS + 1))
    else
        if [ "$is_secret" = "true" ]; then
            echo -e "  ${GREEN}✓${NC} $var_name - $var_description (valeur masquée)"
        else
            echo -e "  ${GREEN}✓${NC} $var_name - $var_description = ${!var_name}"
        fi
    fi
}

# Chargement des variables d'environnement si fichier local existe
ENV_FILE="$PROJECT_ROOT/docker/k8/config/.env.k8s.$ENV"

if [ -f "$ENV_FILE" ]; then
    echo "📁 Chargement du fichier: $ENV_FILE"
    export $(cat "$ENV_FILE" | grep -v "^#" | xargs)
else
    echo "📡 Utilisation des variables d'environnement système (mode CI/CD)"
    echo "   Fichier non trouvé: $ENV_FILE"
fi

echo ""
echo "=== VALIDATION DES VARIABLES REQUISES ==="
echo ""

# =============================================================================
# Variables Kubernetes
# =============================================================================
echo "☸️  Variables Kubernetes:"
check_var "K8_ENV" "Environment Kubernetes courant" false
check_var "SCW_SECRET_KEY" "Clé secrète Scaleway Registry" true
check_var "CLUSTER_NAME" "Nom du cluster K8s" false
check_var "K8S_NAMESPACE" "Namespace Kubernetes" false
check_var "REGISTRY_BASE" "Registry de base" false

echo ""
echo "=== RÉSUMÉ ==="
echo ""

if [ $MISSING_VARS -eq 0 ]; then
    echo -e "${GREEN}✅ Toutes les variables sont définies ($TOTAL_VARS/$TOTAL_VARS)${NC}"
    echo ""
    echo "💡 Pour charger ces variables dans votre shell actuel :"
    echo "   export \$(cat $ENV_FILE | grep -v \"^#\" | xargs)"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Variables manquantes: $MISSING_VARS/$TOTAL_VARS${NC}"
    echo ""
    echo "💡 Pour corriger:"
    echo "   1. Éditez le fichier: $ENV_FILE"
    echo "   2. Ou définissez les variables dans votre environnement"
    echo "   3. Relancez: just k8-check-env $ENV"
    echo ""
    echo "💡 Pour charger ces variables dans votre shell actuel :"
    echo "   export \$(cat $ENV_FILE | grep -v \"^#\" | xargs)"
    echo ""
    exit 1
fi