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

### Enrichissement des Dépendances Frontend

**Dernière mise à jour** : Juillet 2025

- Ajout de nombreuses dépendances frontend pour améliorer l'expérience utilisateur :
  - `@hedystia/astro-bun` : Intégration Bun/Astro optimisée
  - Iconographie : `@iconify-json/lucide`, `@iconify-json/mdi`, `@iconify/react`, `astro-icon`
  - Utilitaires CSS : `@tailwindcss/vite`, `clsx`, `tailwind-merge`, `tailwindcss-animate`
  - Outils développement : `dayjs`, `evemit`,  `zod`, `@types/bun`
- Ajout du script `bun serve` pour serveur de production
- Structure du thème Scenaro préparée (dossier vide)

### Confirmation Architecture Stable

- Les 16 outils agent sont confirmés et opérationnels
- L'outil [`feature_ask_knowledge_base_question`](agent/cognition/tools/feature_ask_knowledge_base_question.py:13) fonctionne correctement
- Architecture LiveKit/Python + Astro.js/Preact stable et performante

### Préparation Thème Scenaro

- Création du dossier `front/src/themes/scenaro/` (vide, en préparation)
- Maintien du thème `example` fonctionnel pour développement

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

### Évolution Plateforme

- La configuration de l'orientation métier sera externalisée vers la plateforme Scenaro
- L'architecture modulaire permettra l'ajout facile de nouveaux domaines

### Améliorations Techniques

- Optimisation des performances LiveKit
- Extension du système d'outils
- Amélioration de l'interface utilisateur

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

### État des Services

- **Agent Backend** : Fonctionnel avec 16 outils (nouveau : base de connaissances)
- **Frontend** : Interface complète avec thème d'exemple
- **Communication** : LiveKit WebRTC opérationnel
- **Visualisation** : Indicateur audio simple intégré
- **Base de Connaissances** : Système RAG intégré pour questions expertes
