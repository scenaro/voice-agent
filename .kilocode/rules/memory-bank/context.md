# Context

## État Actuel du Projet

Le projet Scenaro Voice Agent est **en développement actif** avec une architecture fonctionnelle complète.

## Focus Actuel

### Agent Vocal Caviste (Développement)

L'agent est actuellement configuré comme un assistant caviste expert pour valider l'architecture et les fonctionnalités. Cette orientation servira de modèle pour les futures orientations configurables.

### Fonctionnalités Opérationnelles

- ✅ Communication vocale bidirectionnelle (LiveKit)
- ✅ 16 outils spécialisés organisés en 6 catégories
- ✅ Interface utilisateur React/Preact responsive
- ✅ Système de prompts centralisé
- ✅ Gestion de données (sélection et panier)
- ✅ Environnement de développement Docker

## Changements Récents

### Infrastructure de Production

**Dernière mise à jour** : Janvier 2025

- **Dockerfiles de Production** : Ajout de containers optimisés pour la production
  - [`docker/prod/agent.Dockerfile`](docker/prod/agent.Dockerfile) : Container agent Python avec uv
  - [`docker/prod/front.Dockerfile`](docker/prod/front.Dockerfile) : Container frontend multi-stage avec Bun
  - Build optimisé avec cache des dépendances et images allégées
- **Commandes Just étendues** : Nouveau workflow de build production
  - `just prod-build-agent [tag]` : Build image agent
  - `just prod-build-front [tag]` : Build image frontend
  - Support des tags personnalisés (défaut: `latest`)
- **Documentation enrichie** : README.md mis à jour avec instructions production

### Configuration Astro Avancée

- **Gestion d'environnement renforcée** : Configuration `.env.${NODE_ENV}` dynamique
- **Validation de schéma** : Variables d'environnement validées avec Zod
- **Output static** : Build optimisé pour serveur Bun en production
- **Host configuré** : Support des domaines autorisés incluant tunnels zrok

### Enrichissement des Dépendances Frontend

- Ajout de nombreuses dépendances frontend pour améliorer l'expérience utilisateur :
  - `@hedystia/astro-bun` : Intégration Bun/Astro optimisée
  - Iconographie : `@iconify-json/lucide`, `@iconify-json/mdi`, `@iconify/react`, `astro-icon`
  - Utilitaires CSS : `@tailwindcss/vite`, `clsx`, `tailwind-merge`, `tailwindcss-animate`
  - Outils développement : `dayjs`, `evemit`, `zod`, `@types/bun`, `wouter-preact` (router inutilisé pour le moment)
- Script `bun serve` pour serveur de production
- Structure du thème Scenaro préparée (dossier vide)

### Confirmation Architecture Stable

- Les 16 outils agent sont confirmés et opérationnels
- L'outil [`feature_ask_knowledge_base_question`](agent/cognition/tools/feature_ask_knowledge_base_question.py:13) fonctionne correctement
- Architecture LiveKit/Python + Astro.js/Preact stable et performante

## Travail en Cours

### Développement

- **Mode développement** : Docker Compose avec hot-reload
- **Services** : Agent Python + Frontend Astro.js séparés
- **Configuration** : Variables d'environnement via fichiers `.env`

### Tests et Validation

- Test de l'interaction vocale en temps réel
- Validation des outils métier "caviste"
- Optimisation des performances audio

## Prochaines Étapes

### Déploiement Production

- Tests des containers de production
- Configuration serveur avec environnement sécurisé
- Optimisation des performances en production

### Évolution Plateforme

- La configuration de l'orientation métier sera externalisée vers la plateforme Scenaro
- L'architecture modulaire permettra l'ajout facile de nouveaux domaines

### Améliorations Techniques

- Optimisation des performances LiveKit
- Extension du système d'outils
- Amélioration de l'interface utilisateur
- Finalisation du thème Scenaro

## Notes Importantes

### Limitations Actuelles

- Maximum 3 étapes d'outils par interaction (configuration LiveKit)
- Orientation "caviste" codée en dur (temporaire)
- Interface simple mais fonctionnelle

### Points d'Attention

- Les clés API sont requises pour tous les services (OpenAI, Cartesia, Deepgram)
- HTTPS requis en production pour l'accès microphone
- Performance dépendante de la latence réseau LiveKit

## Configuration Actuelle

### Environnement de Développement

- **OS Principal** : macOS avec Docker
- **Services** : Agent en mode host network, Frontend sur port 4321
- **Hot-reload** : Actif pour développement en temps réel
- **Justfile** : Automatisation des tâches Docker et build

### Environnement de Production

- **Containers Ubuntu 24.04** : Images optimisées pour production
- **Agent** : uv pour gestion dépendances Python rapide
- **Frontend** : Build multi-stage avec Bun.js
- **Ports** : Agent sur 7880, Frontend sur 4321
- **Commandes** : `uv run main.py` (agent), `bun run serve` (frontend)

### État des Services

- **Agent Backend** : Fonctionnel avec 16 outils
- **Frontend** : Interface complète avec thème d'exemple et configuration avancée
- **Communication** : LiveKit WebRTC opérationnel avec validation environnement
- **Visualisation** : Indicateur audio simple intégré
- **Infrastructure** : Prêt pour déploiement production avec containers optimisés
