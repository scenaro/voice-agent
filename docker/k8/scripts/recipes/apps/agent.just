# Logs de l'agent
k8-agent-logs: k8-require-env
  @echo "📋 Agent logs (follow mode):"
  kubectl logs -f -l app=agent -n scenaro-voice-agent --tail=100


# Shell dans un pod agent (pour debug)
k8-agent-shell: k8-require-env
  @echo "🐚 Opening shell in agent pod..."
  kubectl exec -it $(kubectl get pods -n scenaro-voice-agent -l app=agent -o jsonpath='{.items[0].metadata.name}') -n scenaro-voice-agent -- bash