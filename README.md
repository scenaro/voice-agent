# Agent Vocal IA - Scenaro XP Voice Agent

## Architecture

### Structure du projet

- agent/ : Backend Python
- front/ : Frontend Next.js (basé sur un boilerplate LiveKit trouvé dans leurs dépôts)
- Docker : Docker compose pour l'environnement de développement
- justfile : (optionnel) Fichier de commandes pour l'environnement de développement

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

Lancer Next.js (dev) :

```bash
bun dev
```

L'interface web sera disponible sur : <http://localhost:3000>

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
