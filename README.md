# Agent Vocal IA - Scenaro Voice Agent

## Architecture

### Structure du projet

- agent/ : Backend Python
- front/ : Frontend Astro.js
- Docker : Docker compose pour l'environnement de développement
- justfile : (optionnel) Fichier de commandes.

## Installation et Configuration

Créer les fichiers  `front/.env` et `agent/.env`.

Pour connaître la liste des commandes disponibles, lancer la commande `just` (ou voir le fichier `justfile`).

Lancer l'environnement de développement avec Docker Compose :

```bash
just dev-dc up
```

### Agent

Ouvrir un autre terminal.

Se connecter au container agent :

```bash
just dev-agent
```

Dans le container, lancer le serveur :

```bash
uv run main.py dev
```

### Front

Ouvrir un autre terminal.

Se connecter au container front :

```bash
just dev-front
```

Dans le container, installer les dépendances :

```bash
bun install
```

Lancer Astro.js (dev) :

```bash
bun dev
```

L'interface web sera disponible sur : <http://localhost:4321>

## Production

### Build containers (local)

Créer localement les images de prod (pour tester le build localement) :

```bash
# Build with default tag (latest)
just prod-build-agent
just prod-build-front

# Build with custom tag
just prod-build-agent v1.0.0
just prod-build-front v1.0.0
```

Pour Kubernetes, vor le dossier `docker/k8` et la commande `just` pour lister toutes les commandes disponibles.

## Dépannage

### Problèmes Courants

- **Microphone non accessible**
  - Vérifier les permissions du navigateur
  - Utiliser HTTPS en production

- **Pas de transcription**
  - Vérifier la clé API OpenAI
  - Vérifier le niveau audio (seuil de détection)

- **Pas de synthèse vocale**
  - Vérifier les clés API de Cartesia et Deepgram
  - Vérifier la configuration de la voix

## Questions ?

- Contacte Nicolas ;)
