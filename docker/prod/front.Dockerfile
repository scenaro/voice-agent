# ARG UBUNTU_VERSION=noble-20250127
ARG UBUNTU_VERSION=24.04

# Build stage
FROM --platform=${BUILDPLATFORM:-linux/amd64} ubuntu:${UBUNTU_VERSION} AS builder

# For tzdata and other interactive shell
ARG DEBIAN_FRONTEND=noninteractive

# https://stackoverflow.com/questions/48162574/how-to-circumvent-apt-key-output-should-not-be-parsed
# hadolint ignore=SecretsUsedInArgOrEnv
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

# ffmpeg required for cartesia
RUN apt-get clean && apt-get update && apt-get upgrade -y && apt-get install -y coreutils iputils-ping locales openssl apt-utils wget dnsutils host ffmpeg

# Node.js / Bun.js: gnupg gcc g++ make
RUN apt-get install -y inotify-tools gnupg gcc g++ make build-essential ca-certificates htop nano neovim git curl unzip
RUN useradd -ms /bin/bash app && update-ca-certificates

# Create app directory
RUN mkdir /app && chown app:app /app

USER app

# Setup Bun.js
RUN curl -fsSL https://bun.sh/install | bash && . /home/app/.bashrc

# Configure Bun PATH
ENV PATH="/home/app/.bun/bin:$PATH"

# Aliases
RUN echo "\n\n# Vim\nalias vim=nvim\nexport EDITOR=vim\n\n" >> /home/app/.bashrc && . /home/app/.bashrc

WORKDIR /app

# Copy package.json and bun.lock
# Optimize layers and build cache (faster builds)
COPY --chown=app:app front/package.json front/bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY --chown=app:app front/ ./

# Build for production
RUN bun run build

# Production stage - lighter image
FROM --platform=${BUILDPLATFORM:-linux/amd64} ubuntu:${UBUNTU_VERSION} AS production

ARG DEBIAN_FRONTEND=noninteractive
# hadolint ignore=SecretsUsedInArgOrEnv
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

# Install runtime dependencies
RUN apt-get clean && apt-get update && apt-get upgrade -y && apt-get install -y coreutils iputils-ping locales openssl apt-utils wget dnsutils host inotify-tools gnupg gcc g++ make build-essential ca-certificates htop nano neovim git curl unzip ffmpeg
RUN useradd -ms /bin/bash app && update-ca-certificates

# Create app directory
RUN mkdir /app && chown app:app /app

USER app

# Install Bun for production
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/home/app/.bun/bin:$PATH"

# Aliases
RUN echo "\n\n# Vim\nalias vim=nvim\nexport EDITOR=vim\n\n" >> /home/app/.bashrc && . /home/app/.bashrc

WORKDIR /app

# Set working directory
# Copy only the built dist folder with package.json
COPY --from=builder --chown=app:app /app/package.json /app/bun.lock ./
COPY --from=builder --chown=app:app /app/dist ./dist/

RUN bun install --frozen-lockfile

# Environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 4321

# Production command - run the built server
CMD ["bun", "run", "serve"]
