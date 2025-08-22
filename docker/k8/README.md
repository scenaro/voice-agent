# Infra k8s

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

## Admin

```bash
just k9s
```

## Check status

```bash
# Check the status of the deployment
just k8-status
```
