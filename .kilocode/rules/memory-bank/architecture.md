# Architecture

## Vue d'Ensemble

Le projet Scenaro Voice Agent est organisé en deux composants principaux :

- **Agent Backend** (`agent/`) : Agent vocal Python basé sur LiveKit
- **Frontend Web** (`front/`) : Interface utilisateur Astro.js/Preact avec composants React

## Structure des Dossiers

### Agent Backend (`agent/`)

```
agent/
├── main.py                    # Point d'entrée principal
├── entrypoint.py              # Configuration LiveKit et logique de session
├── env.py                     # Configuration environnement
├── pyproject.toml             # Dépendances Python
├── cognition/                 # Logique métier de l'agent
│   ├── system_prompt.md       # Prompt système et instructions
│   ├── chat_session/
│   │   └── chat_session_livekit.py  # Agent LiveKit principal
│   └── tools/                 # Outils spécialisés (16 outils)
│       ├── feature_*.py       # Fonctionnalités métier
│       ├── data_bucket_*.py   # Gestion données (sélection/panier)
│       └── session_memory_update.py
```

### Frontend Web (`front/`)

```
front/
├── package.json               # Configuration Bun/Astro
├── astro.config.mjs          # Configuration Astro avancée avec validation
├── src/
│   ├── pages/
│   │   ├── index.astro        # Page d'accueil simple
│   │   └── api/token.ts       # Génération tokens LiveKit
│   ├── app/
│   │   ├── components/
│   │   │   ├── agent/         # Composants agent vocal
│   │   │   └── ui/            # Composants UI génériques
│   │   └── hooks/             # Hooks React (connexion, volume)
│   └── themes/
│       ├── example/           # Thème d'exemple avec ExampleApp.tsx
│       └── scenaro/           # Thème Scenaro (en préparation)
```

### Infrastructure de Production (`docker/prod/`)

```
docker/prod/
├── agent.Dockerfile          # Container agent Python optimisé
└── front.Dockerfile          # Container frontend multi-stage
```

## Composants Clés

### 1. Agent Vocal (`ChatSessionLiveKitAgent`)

**Fichier** : [`agent/cognition/chat_session/chat_session_livekit.py`](agent/cognition/chat_session/chat_session_livekit.py:37)

- Hérite de `livekit.agents.Agent`
- Configure les modèles LLM (GPT-4o), STT, TTS, VAD
- Charge le système prompt depuis [`system_prompt.md`](agent/cognition/system_prompt.md)
- Enregistre 16 outils spécialisés

### 2. Point d'Entrée LiveKit (`entrypoint`)

**Fichier** : [`agent/entrypoint.py`](agent/entrypoint.py:27)

- Configuration TTS : Cartesia "sonic-2" français
- Configuration STT : Deepgram "nova-2" français
- Gestion des événements personnalisés via data channel
- Session avec limite de 3 étapes d'outils

### 3. Interface React (`Agent.tsx`)

**Fichier** : [`front/src/app/components/agent/Agent.tsx`](front/src/app/components/agent/Agent.tsx:21)

- Composant principal d'interaction
- Gestion connexion/déconnexion LiveKit
- Visualiseur audio simple
- Contrôles microphone et boutons d'action

### 4. Système d'Outils

Les outils sont organisés en 6 catégories :

#### **Recherche de Produits**

- [`feature_search_products_search.py`](agent/cognition/tools/feature_search_products_search.py:12) : Recherche par critères
- [`feature_search_products_highlight.py`](agent/cognition/tools/feature_search_products_highlight.py:13) : Mise en valeur

#### **Présentation**

- [`feature_product_presentation_display.py`](agent/cognition/tools/feature_product_presentation_display.py:12) : Fiche produit
- [`feature_product_presentation_producer.py`](agent/cognition/tools/feature_product_presentation_producer.py:12) : Info producteur

#### **Comparaison**

- [`feature_benchmark_products_compare.py`](agent/cognition/tools/feature_benchmark_products_compare.py:13) : Données comparaison
- [`feature_benchmark_products_generate.py`](agent/cognition/tools/feature_benchmark_products_generate.py:13) : Tableau benchmark

#### **Base de Connaissances**

- [`feature_ask_knowledge_base_question.py`](agent/cognition/tools/feature_ask_knowledge_base_question.py:13) : Interrogation RAG

#### **Gestion Données**

- [`data_bucket_selection_*`](agent/cognition/tools/) : Gestion sélection de travail
- [`data_bucket_cart_*`](agent/cognition/tools/) : Gestion panier d'achat

#### **Conclusion**

- [`feature_conclusion_finish.py`](agent/cognition/tools/feature_conclusion_finish.py:12) : Fin sans commande
- [`feature_conclusion_order.py`](agent/cognition/tools/feature_conclusion_order.py:12) : Lancement commande

## Communication Frontend ↔ Agent

### 1. Connexion LiveKit

- WebRTC pour audio bidirectionnel
- Tokens générés via [`/api/token.ts`](front/src/pages/api/token.ts)
- Connexion gérée par [`useConnection`](front/src/app/hooks/useConnection.tsx)

### 2. Événements Personnalisés

- Data channel LiveKit pour échange JSON
- Événements `custom_action`, `user_interaction`
- Réponses `custom_response`, `status_update`

### 3. Composants React

- [`ExampleApp.tsx`](front/src/themes/example/components/ExampleApp.tsx:66) : Application principale
- [`ConnectionProvider`](front/src/app/hooks/useConnection.tsx) : Gestion état connexion
- [`SimpleAudioIndicator`](front/src/app/components/agent/SimpleAudioIndicator.tsx) : Visualiseur

## Patterns Architecturaux

### 1. Modularité des Outils

- Chaque outil métier est un fichier Python indépendant
- Décorateur `@function_tool()` pour l'enregistrement automatique
- Interface standardisée avec `RunContext`

### 2. Système de Prompts

- Prompt système centralisé dans [`system_prompt.md`](agent/cognition/system_prompt.md)
- Instructions structurées par objectifs de conversation
- Gestion de la mémoire de session et des buckets de données

### 3. Thématisation Frontend

- Architecture par thèmes dans [`src/themes/`](front/src/themes/)
- Composants UI réutilisables dans [`src/app/components/`](front/src/app/components/)
- Styles CSS modulaires par thème

### 4. Environnement de Développement

- Docker Compose pour isolation
- [`justfile`](justfile) pour automatisation et raccourci de commandes
- Variables d'environnement séparées par service

### 5. Infrastructure de Production

- **Containers Docker optimisés** : Images Ubuntu 24.04 avec builds multi-stage
- **Agent** : uv pour gestion rapide des dépendances Python
- **Frontend** : Build Bun.js avec cache optimisé et image sans le code source
- **Configuration avancée** : Validation Zod et gestion d'environnement dynamique

## Points d'Extension

### 1. Nouveaux Outils Métier

- Ajouter fichiers dans [`agent/cognition/tools/`](agent/cognition/tools/)
- Enregistrer dans [`chat_session_livekit.py`](agent/cognition/chat_session/chat_session_livekit.py:52)

### 2. Nouvelles Orientations

- Modifier [`system_prompt.md`](agent/cognition/system_prompt.md)
- Adapter les outils aux nouveaux domaines
- Configuration externe future via plateforme Scenaro

### 3. Interface Utilisateur

- Créer nouveaux thèmes dans [`src/themes/`](front/src/themes/)
- Étendre composants dans [`src/app/components/`](front/src/app/components/)
- Personnaliser visualiseurs audio

### 4. Déploiement Production

- Utiliser les Dockerfiles optimisés dans [`docker/prod/`](docker/prod/)
- Configurer les variables d'environnement par environnement
- Build avec `just prod-build-agent [tag]` et `just prod-build-front [tag]`
