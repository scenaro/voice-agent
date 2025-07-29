# Technologies

## Stack Principal

### Backend Agent (`agent/`)

- **Python 3.13+** : Langage principal
- **LiveKit Agents** : Framework pour agents vocaux
- **OpenAI GPT-4o** : Modèle de langage (température 0.7)
- **uv** : Gestionnaire de dépendances Python rapide

### Frontend (`front/`)

- **Astro.js 5.11.0** : Framework SSG/SSR
- **Preact 10.26.9** : Alternative légère à React
- **Bun.js** : Runtime JavaScript et gestionnaire de paquets
- **TailwindCSS 4.1.11** : Framework CSS utility-first

## Services Audio/Vocaux

### Text-to-Speech (TTS)

- **Cartesia "sonic-2"** : Synthèse vocale française
- Voice ID : `0418348a-0ca2-4e90-9986-800fb8b3bbc0`
- Sample rate : 16000 Hz

### Speech-to-Text (STT)

- **Deepgram "nova-2"** : Reconnaissance vocale française
- Configuration optimisée pour le temps réel

### Détection Vocale

- **Silero VAD** : Voice Activity Detection
- Préchargé au démarrage pour optimiser les performances

## Communication

### LiveKit

- **WebRTC** : Communication temps réel bidirectionnelle
- **Data Channel** : Échange d'événements JSON personnalisés
- **Token-based Authentication** : Sécurisation des sessions
- **livekit-client 2.15.2** : SDK client
- **livekit-server-sdk 2.13.1** : SDK serveur

### Composants LiveKit React

- **@livekit/components-react 2.9.13** : Composants UI pré-construits
- Intégration avec hooks React/Preact personnalisés

## Dépendances Python

```toml
[project]
name = "app"
requires-python = ">=3.13"
dependencies = [
    "livekit-agents",
    "livekit-plugins-cartesia",
    "livekit-plugins-deepgram",
    "livekit-plugins-openai",
    "livekit-plugins-silero",
    "livekit-plugins-turn-detector",
    "python-dotenv",
    "requests",
]
```

## Dépendances Frontend

### Principales

```json
{
  "@astrojs/preact": "^4.1.0",
  "@hedystia/astro-bun": "^0.3.2",
  "@iconify-json/lucide": "^1.2.56",
  "@iconify-json/mdi": "^1.2.3",
  "@livekit/components-react": "^2.9.13",
  "@tailwindcss/vite": "^4.1.11",
  "astro": "^5.11.0",
  "clsx": "^2.1.1",
  "dayjs": "^1.11.13",
  "evemit": "^1.0.4",
  "livekit-client": "^2.15.2",
  "livekit-server-sdk": "^2.13.1",
  "preact": "^10.26.9",
  "tailwind-merge": "^3.3.1",
  "tailwindcss": "^4.1.11",
  "tailwindcss-animate": "^1.0.7",
  "wouter-preact": "^3.7.1",
  "zod": "^3.25.75"
}
```

### Overrides React → Preact

```json
{
  "overrides": {
    "react": "npm:@preact/compat@latest",
    "react-dom": "npm:@preact/compat@latest"
  }
}
```

## Environnement de Développement

### Docker

- **Multi-container** : Services agent et frontend séparés
- **Host networking** : Agent en mode réseau host
- **Volume mounting** : Code source monté pour hot-reload
- **Port mapping** : Frontend sur port 4321

### Outils de Build

- **Bun** : Compilateur JavaScript ultra-rapide
- **Astro** : Build optimisé avec SSG/SSR hybride
- **uv** : Gestionnaire Python moderne et rapide

### Scripts de Développement

#### Justfile (Automatisation)

```just
# Docker compose dev
dev-dc *args: docker compose (from ./docker/dev/)
dev-agent: Bash dans container agent
dev-front: Bash dans container frontend
setup: Copie des fichiers .env d'exemple
clean: Nettoyage des artifacts

# Production builds
prod-build-agent [tag]: Build image agent production
prod-build-front [tag]: Build image frontend production
```

#### Scripts Agent

```bash
uv run main.py dev  # Lancement agent développement
```

#### Scripts Frontend

```bash
bun install        # Installation dépendances
bun dev           # Serveur développement
bun build         # Build production
bun serve         # Serveur production
```

#### Dépendances de Développement

```json
{
  "@iconify/react": "^6.0.0",
  "@types/bun": "^1.2.18",
  "astro-icon": "^1.1.5"
}
```

## Configuration

### Configuration Astro Avancée

- **Gestion d'environnement dynamique** : Configuration `.env.${NODE_ENV}` avec validation
- **Validation Zod** : Variables d'environnement validées avec schéma strict
- **Output static** : Build optimisé pour serveur Bun en production
- **Host configuré** : Support domaines autorisés incluant tunnels zrok

### Variables d'Environnement

#### Agent (`.env.development`)

- `OPENAI_API_KEY` : Clé API OpenAI (GPT-4o)
- `CARTESIA_API_KEY` : Clé API Cartesia (TTS)
- `DEEPGRAM_API_KEY` : Clé API Deepgram (STT)
- `LIVEKIT_URL` : URL serveur LiveKit
- `LIVEKIT_API_KEY` : Clé API LiveKit
- `LIVEKIT_API_SECRET` : Secret API LiveKit

#### Frontend (`.env.${NODE_ENV}`)

- `NODE_ENV` : Environment (development/production)
- `APP_ENV` : Application environment (dev/prod/test, optionnel)
- `LIVEKIT_URL` : URL serveur LiveKit (public)
- `LIVEKIT_API_KEY` : Clé API LiveKit (secret, génération tokens)
- `LIVEKIT_API_SECRET` : Secret API LiveKit (secret)

### Limites et Contraintes

#### Session LiveKit

- **max_tool_steps: 3** : Limite d'étapes d'outils par interaction
- **Timeout**: Gestion automatique des déconnexions
- **Allow interruptions**: Possibilité d'interrompre l'agent

#### Performance

- **Préchargement VAD** : Modèle Silero préchargé au démarrage
- **Hot-reload** : Rechargement automatique en développement
- **Sample rate optimisé** : 16kHz pour équilibrer qualité/performance

## Architecture de Déploiement

### Développement

- **Docker Compose** : Orchestration locale
- **Hot-reload** : Développement en temps réel
- **Logs centralisés** : Debugging facilité

### Production

#### Containers Docker

- **Agent Production** : [`docker/prod/agent.Dockerfile`](docker/prod/agent.Dockerfile)
  - Base Ubuntu 24.04
  - uv pour gestion dépendances Python rapide
  - Build optimisé avec cache des dépendances
  - Port 7880, commande `uv run main.py`

- **Frontend Production** : [`docker/prod/front.Dockerfile`](docker/prod/front.Dockerfile)
  - Build multi-stage avec Bun.js
  - Base Ubuntu 24.04
  - Build optimisé avec cache et image allégée
  - Port 4321, commande `bun run serve`

#### Infrastructure Production

- **LiveKit Cloud** : Gestion des sessions de conversation
- **Edge deployment** : Latence minimisée
- **Load balancing** : Gestion de la montée en charge
- **SSL/HTTPS** : Requis pour accès microphone navigateur

## Compatibilité

### Navigateurs

- **Chrome/Chromium** : Support complet WebRTC
- **Firefox** : Support WebRTC standard
- **Safari** : Support WebRTC récent
- **HTTPS requis** : Accès microphone sécurisé

### Systèmes

- Scenero est développé et testé sur Linux via Docker.
- En production, il est déployé sur un serveur Linux utilisant Docker également.
- **macOS** : Le développement se fait principalement sur MacOS avec Docker.
