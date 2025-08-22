# DRAFT Gestion des Secrets Kubernetes

## Architecture

Cette architecture utilise **Kustomize** pour gérer les secrets de manière sécurisée :

- Les **secrets avec ${VAR}** restent dans `apps/base/` (commités)
- Les **vraies valeurs** sont dans `config/*-secret-config-patch.yml` (NON-commités)
- **Kustomize** merge automatiquement les deux lors du déploiement

## Structure

```
docker/k8/
├── config/
│   ├── staging-secret-config-patch.yml         # NON-COMMITÉ (vraies valeurs)
│   ├── prod-secret-config-patch.yml            # NON-COMMITÉ (vraies valeurs)
│   └── staging-config-secret.example.yml # COMMITÉ (template)
├── apps/base/
│   ├── secrets.yml                       # COMMITÉ (avec ${VAR})
│   └── configmap.yml                    # COMMITÉ (avec ${VAR})
└── apps/overlays/
    ├── staging/kustomization.yml         # Référence staging-secret-config-patch.yml
    └── prod/kustomization.yml            # Référence prod-secret-config-patch.yml
```

## Usage

### 🛠️ Développement Local

1. **Créer le fichier de secrets pour staging :**

```bash
cp docker/k8/config/staging-config-secret.example.yml docker/k8/config/staging-secret-config-patch.yml
```

2. **Éditer avec les vraies valeurs :**

```bash
vim docker/k8/config/staging-secret-config-patch.yml
# Remplacer ${VAR} par les vraies valeurs ou définir les variables d'environnement
```

3. **Déployer :**

```bash
kubectl apply -k docker/k8/apps/overlays/staging/
```

### 🚀 CI/CD (GitHub Actions)

Les valeurs sont injectées depuis les secrets GitHub :

```yaml
# .github/workflows/deploy-staging.yml
- name: Create secrets file
  env:
    LIVEKIT_API_KEY: ${{ secrets.LIVEKIT_API_KEY }}
    LIVEKIT_API_SECRET: ${{ secrets.LIVEKIT_API_SECRET }}
    LIVEKIT_URL: ${{ secrets.LIVEKIT_URL_STAGING }}
    CARTESIA_API_KEY: ${{ secrets.CARTESIA_API_KEY }}
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    DEEPGRAM_API_KEY: ${{ secrets.DEEPGRAM_API_KEY }}
  run: |
    envsubst < docker/k8/config/staging-config-secret.example.yml > docker/k8/config/staging-secret-config-patch.yml

- name: Deploy to staging
  run: kubectl apply -k docker/k8/apps/overlays/staging/
```

### 📝 Variables d'environnement à définir dans GitHub Secrets

**Secrets (sensibles) :**

- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `CARTESIA_API_KEY`
- `OPENAI_API_KEY`
- `DEEPGRAM_API_KEY`

**Configuration par environnement :**

- `LIVEKIT_URL` (différent par environnement)
- `ENV_MODE` (staging/prod)
- `LOG_LEVEL` (debug/info/warn/error)
- `METRICS_ENABLED` (true/false)
- `NODE_ENV` (production/development)
- `CACHE_ENABLED` (true/false)

## Fonctionnement

### ✅ Ce qui est commité

- Templates avec `${VAR}` dans `apps/base/`
- Fichiers `.example.yml` avec `${VAR}` dans `config/`
- Configuration Kustomize

### ❌ Ce qui n'est PAS commité

- Fichiers `*-secret-config-patch.yml` avec vraies valeurs
- Exclus par `.gitignore`

### 🔄 Merge Kustomize

Kustomize merge automatiquement :

1. **Base** : `shared-secrets` avec `LIVEKIT_API_KEY: "${LIVEKIT_API_KEY}"`
2. **Overlay** : `shared-secrets` avec `LIVEKIT_API_KEY: "vraie_valeur"`
3. **Résultat** : `LIVEKIT_API_KEY: "vraie_valeur"`

## Sécurité

- ✅ Aucun secret en dur dans le repo
- ✅ Injection locale ou CI/CD avec substitution de variables
- ✅ Templates pour guider
- ✅ Structure claire base/environment
- ✅ ConfigMaps et Secrets tous configurables

## Workflow complet

### Local

```bash
# 1. Copier le template
cp docker/k8/config/staging-config-secret.example.yml docker/k8/config/staging-secret-config-patch.yml

# 2. Remplacer manuellement ${VAR} par les vraies valeurs ou définir les variables
vim docker/k8/config/staging-secret-config-patch.yml

# 3. Déployer
kubectl apply -k docker/k8/apps/overlays/staging/
```

### CI/CD

```bash
# 1. Substitution automatique des variables d'environnement
envsubst < staging-config-secret.example.yml > staging-secret-config-patch.yml

# 2. Déployer
kubectl apply -k docker/k8/apps/overlays/staging/
