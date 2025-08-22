# Logs du front
k8-front-logs: k8-require-env
  @echo "📋 Front logs (follow mode):"
  kubectl logs -f -l app=front -n scenaro-voice-agent --tail=100

# Shell dans un pod front (pour debug)
k8-front-shell: k8-require-env
  @echo "🐚 Opening shell in front pod..."
  kubectl exec -it $(kubectl get pods -n scenaro-voice-agent -l app=front -o jsonpath='{.items[0].metadata.name}') -n scenaro-voice-agent -- bash