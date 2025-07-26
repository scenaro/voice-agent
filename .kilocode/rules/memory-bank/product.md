# Produit

## Vision

Scenaro est un agent vocal intelligent conçu pour aider les utilisateurs à résoudre leurs problèmes en utilisant des techniques de conversation naturelle et de réponse contextuelle. L'orientation métier est dynamique et configurable.

## Orientation Actuelle

**Agent Vocal Caviste** : Pendant le développement, l'agent est configuré comme un assistant caviste expert qui aide les clients dans leur parcours d'achat de vins. Cette orientation est temporaire et servira de modèle pour les futures orientations configurables.

## Fonctionnalités Principales

### Interaction Vocale

- Communication bidirectionnelle en temps réel via LiveKit
- Support de la langue française (TTS et STT)
- Détection vocale automatique (VAD)
- Interface web responsive avec visualiseur audio

### Système d'Agent Intelligent

- Personnalité chaleureuse et experte (caviste)
- Réponses concises et informatives
- Processus de conversation structuré en objectifs

### Fonctionnalités Métier Caviste

#### **Recherche et Découverte**

- Recherche de vins selon critères spécifiques
- Mise en valeur de produits recommandés
- Base de connaissances sur les vins, régions, domaines

#### **Présentation et Information**

- Fiches produits complètes (prix, disponibilité)
- Informations producteur (histoire, photos)
- Comparaison entre produits

#### **Gestion de Sélection**

- Espace de travail "Sélection" pour explorer
- Panier d'achat pour finalisation
- Système de comparaison avancé

#### **Processus de Vente**

- Compréhension des besoins client
- Collecte d'informations pertinentes
- Propositions personnalisées
- Finalisation commande ou report de décision

## Expérience Utilisateur

### Parcours Type

1. **Accueil** : Connexion et activation du microphone
2. **Compréhension** : L'agent découvre les besoins
3. **Exploration** : Recherche et sélection collaborative
4. **Présentation** : Affichage détaillé des options
5. **Comparaison** : Aide à la décision si plusieurs choix
6. **Finalisation** : Commande ou report

### Interface

- Design centré sur la conversation vocale
- Visualiseur audio simple et élégant
- Composants React/Preact modulaires
- Thèmes configurables (exemple fourni)

## Architecture Produit

### Évolutivité

- L'orientation "caviste" est un cas d'usage de développement
- La plateforme Scenaro (externe) configurera l'orientation dynamiquement
- L'architecture permet l'ajout de nouveaux domaines métier
- Système d'outils modulaires et extensibles

### Communication

- Communication temps réel via WebRTC (LiveKit)
- Échange de données structurées entre frontend/agent
- Événements personnalisés pour interactions avancées
- API token pour sécurisation des sessions
