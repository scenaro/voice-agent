# DRAFT Système Multi-Environnements K8s

Guide d'utilisation du système de gestion multi-environnements pour le déploiement Kubernetes.

## Structure

```

docker/k8/
├── config/
│   ├── .env.k8s.prod.example
│   └── .env.k8s.staging.example
└── apps/
    └── overlays/
        ├── prod/
        └── staging/
```

## Configuration Initiale

### 1. Setup des fichiers d'environnement

```bash
# Créer les fichiers d'environnement depuis les templates
just k8-setup-env prod
just k8-setup-env staging

# Éditer les fichiers avec vos vraies valeurs
nano docker/k8/config/.env.k8s.prod
nano docker/k8/config/.env.k8s.staging
```

### 2. Variables requises

Voir les fichiers d'exemples dans `docker/k8/config/`:

- `.env.k8s.prod.example`
- `.env.k8s.staging.example`

## Usage Local

### 1. Chargement des variables

```bash
# Charger les variables pour production
set -a && source docker/k8/config/.env.k8s.prod && set +a

# Charger les variables pour staging
set -a && source docker/k8/config/.env.k8s.staging && set +a

# Alternative en une ligne
export $(grep -v '^#' docker/k8/config/.env.k8s.prod | xargs)
```

### 2. Validation des variables

```bash
# Valider la configuration production
just k8-check-env prod

# Valider la configuration staging
just k8-check-env staging
```

### 3. Déploiement

```bash
# Déploiement production (après chargement des variables prod)
just k8-deploy-apps v1.0.0

# Déploiement staging (après chargement des variables staging)
just k8-deploy-apps v1.0.0-staging

# Avec paramètre d'environnement explicite
kubectl apply -k docker/k8/apps/overlays/prod
kubectl apply -k docker/k8/apps/overlays/staging
```

## Usage CI/CD (GitHub Actions)

### 1. Configuration des secrets

Dans les paramètres GitHub, définir les secrets par environnement :

```yaml
# Production
PROD_SCW_SECRET_KEY
PROD_LIVEKIT_API_KEY
PROD_LIVEKIT_API_SECRET
PROD_DOMAIN
# etc.

# Staging
STAGING_SCW_SECRET_KEY
STAGING_LIVEKIT_API_KEY
STAGING_LIVEKIT_API_SECRET
STAGING_DOMAIN
# etc.
```

### 2. Workflow exemple

```yaml
env:
  SCW_SECRET_KEY: ${{ secrets.PROD_SCW_SECRET_KEY }}
  LIVEKIT_API_KEY: ${{ secrets.PROD_LIVEKIT_API_KEY }}
  DOMAIN: ${{ secrets.PROD_DOMAIN }}
  # etc.

steps:
  - name: Validate environment
    run: just k8-check-env prod

  - name: Deploy
    run: just k8-deploy-apps ${{ github.sha }}
```

## Environnements Disponibles

### Production

- **Namespace** : `scenaro-voice-agent`
- **Domain** : `voice-agent.scenaro.io`
- **Replicas** : agent=3, front=3
- **Resources** : Élevées (1.5-3 CPU, 2-6Gi RAM pour agent)

### Staging

- **Namespace** : `scenaro-voice-agent-staging`
- **Domain** : `staging.voice-agent.scenaro.io`
- **Replicas** : agent=1, front=1
- **Resources** : Réduites (0.5-1 CPU, 1-2Gi RAM pour agent)

## Commandes Utiles

```bash
# Afficher les variables chargées
just k8-show-env prod
just k8-show-env staging

# Helper chargement manuel
just k8-load-env prod
just k8-load-env staging

# Validation avant déploiement
just k8-check-env prod && echo "✅ Prêt pour déploiement"

# Gestion des secrets K8s
just k8-update-secrets

# Scaling
just k8-scale-agent 2
just k8-scale-front 2
```

## Dépannage

### Variables manquantes

```bash
# Identifier les variables manquantes
just k8-check-env prod

# Éditer le fichier de configuration
nano docker/k8/config/.env.k8s.prod
```

### Problèmes de chargement

```bash
# Vérifier que le fichier existe
ls -la docker/k8/config/.env.k8s.*

# Tester le chargement manuel
source docker/k8/config/.env.k8s.prod
echo $DOMAIN
```

### Validation de déploiement

```bash
# Vérifier les overlays
kubectl kustomize docker/k8/apps/overlays/prod
kubectl kustomize docker/k8/apps/overlays/staging

# Status des déploiements
kubectl get pods -n scenaro-voice-agent
kubectl get pods -n scenaro-voice-agent-staging
```

## Sécurité

- ⚠️ Les fichiers `docker/k8/config/.env.k8s.*` contiennent des secrets et ne doivent PAS être commités
- ✅ Ils sont automatiquement ignorés par git via `.gitignore`
- ✅ Utilisez les secrets GitHub Actions pour les déploiements automatiques
- ✅ Validez toujours la configuration avant le déploiement : `just k8-check-env <env>`
