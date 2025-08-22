# DRAFT Configuration Kubernetes - Voice Agent

Ce document explique l'architecture de configuration du projet Voice Agent pour Kubernetes, avec une approche multi-environnements (staging/production).

## 🏗️ Architecture de Configuration

### Vue d'Ensemble

La configuration suit une approche **en couches** pour maximiser la flexibilité et la réutilisabilité :

```
📁 docker/k8/
├── apps/base/              # 🎯 Templates de base (fallback)
│   ├── configmap.yml       # ConfigMaps avec placeholders
│   └── secrets.yml         # Secrets avec placeholders
├── config/                 # 🔧 Configuration par environnement
│   ├── .env.k8s.staging    # Variables d'infrastructure staging
│   ├── .env.k8s.prod       # Variables d'infrastructure production
│   ├── staging-secret-config-patch.yml  # 🔐 Valeurs réelles staging
│   └── prod-secret-config-patch.yml     # 🔐 Valeurs réelles production
└── apps/overlays/          # 🎨 Kustomization par environnement
    ├── staging/
    └── prod/
```

## 📋 Types de Variables

### 1. **Variables d'Infrastructure** (`docker/k8/config/.env.k8s.*`)

Variables liées au cluster et à l'infrastructure Scaleway :

```bash
K8_ENV=staging                        # Environment courant
SCW_SECRET_KEY=xxx                    # Clé Scaleway Registry
CLUSTER_NAME=scenaro-voice-agent      # Nom du cluster
REGISTRY_BASE=rg.fr-par.scw.cloud/scenaro
K8S_NAMESPACE=scenaro-voice-agent-staging
```

### 2. **Variables d'Application** (`docker/k8/config/*-secret-config-patch.yml`)

Secrets et configuration spécifiques à l'application :

#### **Secrets** (données sensibles)

- `shared-secrets` : `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- `agent-secrets` : `CARTESIA_API_KEY`, `OPENAI_API_KEY`, `DEEPGRAM_API_KEY`

#### **ConfigMaps** (configuration publique)

- `shared-config` : `LIVEKIT_URL`, `DOMAIN`
- `agent-config` : `ENV_MODE`, `LOG_LEVEL`, `METRICS_ENABLED`
- `front-config` : `NODE_ENV`, `CACHE_ENABLED`

### 3. **Templates Base** (`docker/k8/apps/base/`)

Fichiers avec placeholders servant de fallback :

```yaml
# configmap.yml
data:
  LIVEKIT_URL: "${LIVEKIT_URL}"  # Fallback si pas défini ailleurs
```

## 🔄 Ordre de Priorité des Variables

1. **🥇 Priorité 1** : Fichiers `*-secret-config-patch.yml` (valeurs réelles)
2. **🥈 Priorité 2** : Variables d'environnement `.env.k8s.*`
3. **🥉 Priorité 3** : Placeholders dans les fichiers `base/`

## 🚀 Utilisation

### Déploiement Staging

```bash
# Charger les variables d'infrastructure
export $(cat docker/k8/config/.env.k8s.staging | xargs)

# Déployer avec les secrets spécifiques
kubectl apply -f docker/k8/config/staging-secret-config-patch.yml
kustomize build docker/k8/apps/overlays/staging | kubectl apply -f -
```

### Déploiement Production

```bash
# Charger les variables d'infrastructure
export $(cat docker/k8/config/.env.k8s.prod | xargs)

# Déployer avec les secrets spécifiques
kubectl apply -f docker/k8/config/prod-secret-config-patch.yml
kustomize build docker/k8/apps/overlays/prod | kubectl apply -f -
```

## 📝 Fichiers Clés

### Infrastructure

- [`docker/k8/config/.env.k8s.staging`](config/.env.k8s.staging) : Variables infrastructure staging
- [`docker/k8/config/.env.k8s.prod`](config/.env.k8s.prod) : Variables infrastructure production
- [`docker/k8/config/.env.k8s.prod.example`](config/.env.k8s.prod.example) : Template pour nouveau environnement

### Secrets d'Application

- [`docker/k8/config/staging-secret-config-patch.yml`](config/staging-secret-config-patch.yml) : Secrets et config staging
- [`docker/k8/config/prod-secret-config-patch.yml`](config/prod-secret-config-patch.yml) : Secrets et config production
- [`docker/k8/config/staging-secret-config-patch.example.yml`](config/staging-secret-config-patch.example.yml) : Template

### Templates Base

- [`docker/k8/apps/base/configmap.yml`](apps/base/configmap.yml) : ConfigMaps avec placeholders
- [`docker/k8/apps/base/secrets.yml`](apps/base/secrets.yml) : Secrets avec placeholders

## 🔐 Sécurité

### ⚠️ Fichiers Sensibles (Ajoutés au .gitignore)

```bash
# Ne JAMAIS commiter ces fichiers !
docker/k8/config/.env.k8s.staging
docker/k8/config/.env.k8s.prod
docker/k8/config/staging-secret-config-patch.yml
docker/k8/config/prod-secret-config-patch.yml
```

### ✅ Fichiers Templates (Safe pour Git)

```bash
# Ces fichiers peuvent être commitées
docker/k8/config/.env.k8s.prod.example
docker/k8/config/staging-secret-config-patch.example.yml
```

## 🔧 Maintenance

### Ajouter un Nouvel Environnement

1. Copier `.env.k8s.prod.example` vers `.env.k8s.nouveauenv`
2. Copier `staging-secret-config-patch.example.yml` vers `nouveauenv-secret-config-patch.yml`
3. Ajuster les valeurs selon l'environnement
4. Créer l'overlay dans `apps/overlays/nouveauenv/`

### Ajouter une Nouvelle Variable

1. **Variable d'infrastructure** : Ajouter dans `.env.k8s.*`
2. **Variable d'application** : Ajouter dans `*-secret-config-patch.yml`
3. **Template fallback** : Ajouter placeholder dans `apps/base/`

### Validation

```bash
# Vérifier les variables d'un environnement
just k8-check-env staging

# Tester le build Kustomize
kustomize build docker/k8/apps/overlays/staging --dry-run
```

## 📚 Ressources Complémentaires

- [`README-secrets.md`](README-secrets.md) : Gestion détaillée des secrets
- [`README-multi-env.md`](README-multi-env.md) : Configuration multi-environnements
- [`README.md`](README.md) : Documentation générale Kubernetes

## ❓ FAQ

**Q: Pourquoi utiliser des placeholders dans les fichiers base ?**
R: Les placeholders permettent d'avoir des valeurs par défaut et une fallback si les variables ne sont pas définies ailleurs.

**Q: Comment savoir quelles variables sont utilisées ?**
R: Consultez ce README et les fichiers `*-secret-config-patch.example.yml` pour la liste complète.

**Q: Puis-je modifier directement les fichiers base ?**
R: Non, utilisez toujours les fichiers de configuration spécifiques à l'environnement (`*-secret-config-patch.yml`).
