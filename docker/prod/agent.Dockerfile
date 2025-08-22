

# ARG UBUNTU_VERSION=noble-20250127
ARG UBUNTU_VERSION=24.04

FROM --platform=linux/amd64 ubuntu:${UBUNTU_VERSION}

# For tzdata and other interactive shell
ARG DEBIAN_FRONTEND=noninteractive

# https://stackoverflow.com/questions/48162574/how-to-circumvent-apt-key-output-should-not-be-parsed
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

# ffmpeg required for cartesia
RUN apt-get clean && apt-get update && apt-get upgrade -y && apt-get install -y coreutils iputils-ping locales openssl apt-utils wget dnsutils host ffmpeg

# Node.js / Bun.js: gnupg gcc g++ make
RUN apt-get install -y inotify-tools gnupg gcc g++ make build-essential ca-certificates htop nano neovim git curl unzip
RUN useradd -ms /bin/bash app && update-ca-certificates

# Create app directory
RUN mkdir /app
RUN chown app:app /app

USER app

# Install Python env
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Configure uv PATH
ENV PATH="/home/app/.local/bin:$PATH"

# Aliases
RUN echo "\n\n# Vim\nalias vim=nvim\nexport EDITOR=vim\n\n" >> /home/app/.bashrc && . /home/app/.bashrc

WORKDIR /app

# Copy Python configuration files
# Optimize layers and build cache (faster builds)
# COPY  --from=builder --chown=app:app agent/pyproject.toml ./
# COPY  --from=builder --chown=app:app agent/uv.lock ./

# # Install Python dependencies
# RUN uv sync --locked

# # Copy application code
# COPY  --from=builder --chown=app:app agent/ ./

#---
COPY  --chown=app:app agent/pyproject.toml ./
COPY  --chown=app:app agent/uv.lock ./

# Install Python dependencies
RUN uv sync --locked

# Copy application code
COPY  --chown=app:app agent/ ./

# Environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 7880

# Default command (ensure execution permissions)
CMD ["/home/app/.local/bin/uv", "run", "main.py", "start"]
