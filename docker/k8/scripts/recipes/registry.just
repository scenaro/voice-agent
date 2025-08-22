# Login au registry Scaleway (nécessite SCW_SECRET_KEY)
k8-registry-login:
  @echo "🔑 Logging into Scaleway Registry"
  @echo "Make sure SCW_SECRET_KEY is set in your environment"
  docker login rg.fr-par.scw.cloud/scenaro -u nologin --password-stdin <<< "$SCW_SECRET_KEY"

# Build image agent pour Kubernetes avec registry Scaleway
k8-build-agent tag="latest":
  @echo "🐳 Building agent image for Kubernetes (tag: {{tag}})"
  docker build --platform linux/amd64 -f docker/prod/agent.Dockerfile \
    -t rg.fr-par.scw.cloud/scenaro/voice-agent:{{tag}} .

# Build image front pour Kubernetes avec registry Scaleway
k8-build-front tag="latest":
  @echo "🐳 Building front image for Kubernetes (tag: {{tag}})"
  docker build --platform linux/amd64 -f docker/prod/front.Dockerfile \
    -t rg.fr-par.scw.cloud/scenaro/voice-front:{{tag}} .

# Build toutes les images
k8-build-all tag="latest":
  @echo "🐳 Building all images for Kubernetes (tag: {{tag}})"
  just k8-build-agent {{tag}}
  just k8-build-front {{tag}}

# Push des images vers Scaleway Registry
k8-push-images tag="latest":
  @echo "📤 Pushing images to Scaleway Registry (tag: {{tag}})"
  docker push rg.fr-par.scw.cloud/scenaro/voice-agent:{{tag}}
  docker push rg.fr-par.scw.cloud/scenaro/voice-front:{{tag}}

# Push de l'image front vers Scaleway Registry
k8-push-front tag="latest":
  @echo "📤 Pushing front image to Scaleway Registry (tag: {{tag}})"
  docker push rg.fr-par.scw.cloud/scenaro/voice-front:{{tag}}

# Push de l'image agent vers Scaleway Registry
k8-push-agent tag="latest":
  @echo "📤 Pushing agent image to Scaleway Registry (tag: {{tag}})"
  docker push rg.fr-par.scw.cloud/scenaro/voice-agent:{{tag}}
