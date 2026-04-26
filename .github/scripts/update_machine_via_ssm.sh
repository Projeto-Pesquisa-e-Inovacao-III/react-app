#!/usr/bin/env bash
set -euo pipefail

log_info() {
  echo "[INFO] $*"
}

log_error() {
  echo "[ERRO] $*" >&2
}

if ! command -v apt-get >/dev/null 2>&1; then
  log_info "apt-get nao encontrado. Pulando update da maquina."
  exit 0
fi

APT_OPTS=(
  -o Acquire::ForceIPv4=true
  -o Acquire::Retries=2
  -o Acquire::http::Timeout=20
)

if [ "$(id -u)" -eq 0 ]; then
  APT_PREFIX=()
elif command -v sudo >/dev/null 2>&1; then
  APT_PREFIX=(sudo)
else
  log_info "Sem privilegio de root e sem sudo. Pulando update sem bloquear deploy."
  exit 0
fi

log_info "Iniciando update simples da maquina (best effort)..."

if ! "${APT_PREFIX[@]}" apt-get "${APT_OPTS[@]}" update; then
  log_info "Sem acesso aos mirrors no momento. Pulando update sem bloquear deploy."
  exit 0
fi

if ! DEBIAN_FRONTEND=noninteractive "${APT_PREFIX[@]}" apt-get "${APT_OPTS[@]}" -y upgrade; then
  log_info "Upgrade falhou por conectividade/permissao. Seguindo sem bloquear deploy."
  exit 0
fi

log_info "Update da maquina finalizado com sucesso."
