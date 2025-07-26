

# ARG UBUNTU_VERSION=noble-20250127
ARG UBUNTU_VERSION=24.04

FROM --platform=${BUILDPLATFORM:-linux/amd64} ubuntu:${UBUNTU_VERSION}

ARG JUST_VERSION=1.39.0

# For tzdata and other interactive shell
ARG DEBIAN_FRONTEND=noninteractive

# https://stackoverflow.com/questions/48162574/how-to-circumvent-apt-key-output-should-not-be-parsed
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

# ffmpeg required for cartesia
RUN apt-get clean && apt-get update && apt-get upgrade -y && apt-get install -y coreutils iputils-ping locales openssl apt-utils wget dnsutils host ffmpeg

# Node.js / Bun.js: gnupg gcc g++ make
RUN apt-get install -y inotify-tools gnupg gcc g++ make build-essential ca-certificates htop nano neovim git curl unzip
RUN useradd -ms /bin/bash app && update-ca-certificates

# Install just
RUN wget -O /tmp/just.tar.gz https://github.com/casey/just/releases/download/${JUST_VERSION}/just-${JUST_VERSION}-x86_64-unknown-linux-musl.tar.gz
RUN mkdir /tmp/just && tar -xvf /tmp/just.tar.gz -C /tmp/just && mv /tmp/just/just /usr/local/bin && rm -rf /tmp/just*

# Install neovim
# RUN curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim-linux-x86_64.tar.gz \
#   && rm -rf /opt/nvim \
#   && tar -C /opt -xzf nvim-linux-x86_64.tar.gz \
#   && echo "\n\n# nvim\nexport PATH=\"\$PATH:/opt/nvim-linux-x86_64/bin\"\n\n" >> /home/app/.bashrc \
#   && . /home/app/.bashrc

# Create app directory
RUN mkdir /app
RUN chown app:app /app

USER app

# Setup Bun.js
RUN curl -fsSL https://bun.sh/install | bash && . /home/app/.bashrc

# Manage autocompletion for just.
RUN just --completions bash >> ~/.bashrc && . /home/app/.bashrc

# Install Python env
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Aliases
RUN echo "\n\n# Vim\nalias vim=nvim\nexport EDITOR=vim\n\n" >> /home/app/.bashrc && . /home/app/.bashrc

WORKDIR /app
