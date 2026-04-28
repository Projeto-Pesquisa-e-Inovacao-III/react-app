#!/usr/bin/env bash
set -euo pipefail

APP_IMAGE="${APP_IMAGE:-}"
CONTAINER_NAME="${CONTAINER_NAME:-front-server}"
HOST_PORT="${HOST_PORT:-80}"
CONTAINER_PORT="${CONTAINER_PORT:-8080}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://localhost:${HOST_PORT}/}"
HEALTHCHECK_MAX_RETRIES="${HEALTHCHECK_MAX_RETRIES:-30}"
HEALTHCHECK_INTERVAL_SECONDS="${HEALTHCHECK_INTERVAL_SECONDS:-2}"

log_info() {
  echo "[INFO] $*"
}

log_error() {
  echo "[ERRO] $*" >&2
}

if [ -z "$APP_IMAGE" ]; then
  log_error "APP_IMAGE nao foi definido"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  log_error "docker nao encontrado no runner"
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  log_error "curl nao encontrado no runner"
  exit 1
fi

log_info "Iniciando deploy do front..."
log_info "Nova imagem: $APP_IMAGE"

PREV_IMAGE_ID=$(docker inspect --format='{{.Image}}' "$CONTAINER_NAME" 2>/dev/null || true)
log_info "Imagem anterior: ${PREV_IMAGE_ID:-nenhuma}"

rollback() {
  log_error "Executando rollback..."
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true

  if [ -n "$PREV_IMAGE_ID" ]; then
    docker run -d --name "$CONTAINER_NAME" --restart always -p "${HOST_PORT}:${CONTAINER_PORT}" "$PREV_IMAGE_ID"
  else
    log_error "Rollback indisponivel: sem imagem anterior registrada"
  fi
}

if ! docker pull "$APP_IMAGE"; then
  log_error "Falha ao baixar imagem"
  exit 1
fi

if docker inspect "$CONTAINER_NAME" >/dev/null 2>&1; then
  docker stop "$CONTAINER_NAME"
  docker rm "$CONTAINER_NAME"
fi

if ! docker run -d --name "$CONTAINER_NAME" --restart always -p "${HOST_PORT}:${CONTAINER_PORT}" "$APP_IMAGE"; then
  rollback
  exit 1
fi

for i in $(seq 1 "$HEALTHCHECK_MAX_RETRIES"); do
  if curl -fsS "$HEALTHCHECK_URL" >/dev/null; then
    log_info "Healthcheck OK"

    CURRENT_IMAGE_ID=$(docker inspect --format='{{.Image}}' "$CONTAINER_NAME" 2>/dev/null || true)
    if [ -n "$PREV_IMAGE_ID" ]; then
      if [ "$PREV_IMAGE_ID" = "$CURRENT_IMAGE_ID" ]; then
        log_info "Imagem anterior e igual a atual. Nenhuma limpeza necessaria."
      elif docker image rm "$PREV_IMAGE_ID" >/dev/null 2>&1; then
        log_info "Imagem anterior removida com sucesso: $PREV_IMAGE_ID"
      else
        log_info "Nao foi possivel remover a imagem anterior (pode estar em uso). Seguindo deploy."
      fi
    fi

    docker ps --filter "name=$CONTAINER_NAME"
    log_info "Deploy concluido com sucesso"
    exit 0
  fi

  if [ -z "$(docker ps -q -f "name=$CONTAINER_NAME" -f status=running)" ]; then
    log_error "Container parou antes do healthcheck"
    docker logs "$CONTAINER_NAME" || true
    rollback
    exit 1
  fi

  sleep "$HEALTHCHECK_INTERVAL_SECONDS"
done

log_error "Healthcheck falhou em $HEALTHCHECK_URL"
docker logs "$CONTAINER_NAME" || true
rollback
exit 1
