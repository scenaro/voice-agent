# Dev Tools

## Codebase indexing

- <https://kilocode.ai/docs/features/experimental/codebase-indexing>

Lancer Ollama avec le modèle d'embbedding `mxbai-embed-large`

```sh
ollama pull mxbai-embed-large
ollama serve # if not already running
```

Lancer Qdrant:

```sh
docker compose -f docker/devtools/docker-compose.yml up -d
```

Configurer Kilocode pour utiliser le domaine local (service.orb)

- Qdrant UI: <http://localhost:6333> (ou domaine local)

## MCP

Dans les prompts on peut indiquer:

```
use context7
```
