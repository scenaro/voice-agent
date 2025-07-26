set dotenv-load := false

# Lists recipes
default:
  @just --list --unsorted

# docker compose wrapper for dev environment (from host).
dev-dc *args:
  #!/bin/bash
  echo "docker compose dev command (from host)"
  (cd ./docker/dev/ && docker compose {{args}}; exit $?);

devtools-up:
  #!/bin/bash
  echo "docker compose up for devtools (from host)"
  (cd ./docker/devtools/ && docker compose up; exit $?);

# docker compose wrapper to exec bash in agent container (from host).
dev-agent:
  #!/bin/bash
  echo "Execute bash in agent container (from host)"
  just dev-dc exec agent bash

# docker compose wrapper to exec bash in front container (from host).
dev-front:
  #!/bin/bash
  echo "Execute bash in front container (from host)"
  just dev-dc exec front bash

# Setup environment files
setup:
  @echo "🔧 Configuration de l'environnement..."
  cp agent/.env.example agent/.env
  cp front/.env.example front/.env
  @echo "📝 Éditez agent/.env avec vos clés API:"


# Clean build artifacts and dependencies
clean:
  @echo "🧹 Nettoyage..."
  cd front && rm -rf .next node_modules dist
  cd agent && rm -rf .venv __pycache__ *.pyc

