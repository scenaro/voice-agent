# Infra k8s

Le cluster se gère avec `just` et `k9s`. Le dashboard Kubernetes est accessble depuis Scaleway.

Voir la commande `just` pour lister les commandes disponibles.

## Init the cluster

```bash
# load/check env (prod or staging)
just k8-check-env staging

# Then execute the provided commands to load the environment variables

# login to registry
just k8-registry-login

# Initialize the cluster
just init-cluster
```

## Deploy

```bash
# Deploy applications
just k8-deploy-apps
```

## Environments

- Dans le dossier `k8/config/`, les variables d'environnement liées au cluster en lui même, sont définies dans les fichiers `.env.k8s.*`.
- Dossier de surcharge des manifests Kubernetes selon l'environnement : `k8/apps/overlays/`.
  - C'est ici qu'il faut paramétrer les spécificités liées aux environnements (prod et staging).
- Le point d'entrée pour surcharger les manifests Kubernetes est `k8/apps/overlays/prod/kustomization.yml` (pour la prod par exemple).
- Pour la gestion des secrets, voir le fichier (pour la prod par exemple) `k8/apps/overlays/prod/patches/prod-secret-config-patch.yml`.

## Admin

- Console Scaleway
- Recettes définies avec `just`.

```bash
just k9s
```

Lister toutes les commandes disponibles :

```bash
just
```

Exemple :

```bash
# Check the status of the deployment
just k8-status
```

## Build / Push images

```bash
# Build and push agent image
just k8-build-agent
just k8-push-agent

# Build and push front image
just k8-build-front
just k8-push-front
```
