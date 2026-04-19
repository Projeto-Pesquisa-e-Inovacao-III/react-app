#!/usr/bin/env bash
set -euo pipefail

log_info() {
  echo "[INFO] $*"
}

log_error() {
  echo "[ERRO] $*" >&2
}

# Valida entradas obrigatorias.
if [ -z "${AWS_INSTANCE_ID:-}" ]; then
  log_error "Variavel AWS_INSTANCE_ID nao definida."
  exit 1
fi

if [ -z "${APP_IMAGE:-}" ]; then
  log_error "Variavel APP_IMAGE nao definida."
  exit 1
fi

# O jq e usado para montar com seguranca o payload JSON dos parametros do SSM.
if ! command -v jq >/dev/null 2>&1; then
  log_error "jq nao encontrado no runner."
  exit 1
fi

# Script remoto executado na instancia via SSM.
REMOTE_SCRIPT=$(cat <<'EOF'
set -eu

if (set -o pipefail) 2>/dev/null; then
  set -o pipefail
fi

log_info() {
  echo "[INFO] $*"
}

log_error() {
  echo "[ERRO] $*" >&2
}

# Guarda o ID da imagem atual para rollback se o novo deploy falhar.
PREV_IMAGE_ID=$(docker inspect --format={{.Image}} front-server 2>/dev/null || true)
log_info "ID da imagem anterior: ${PREV_IMAGE_ID:-nenhum}"

rollback() {
  # Remove o container novo possivelmente quebrado antes de recriar o antigo.
  docker rm -f front-server || true

  if [ -n "$PREV_IMAGE_ID" ]; then
    log_info "Executando rollback para $PREV_IMAGE_ID"
    docker run -d --name front-server --restart always -p 80:8080 "$PREV_IMAGE_ID"
  else
    log_error "Rollback indisponivel: sem imagem anterior registrada."
  fi
}

# Baixa a nova imagem antes de mexer no container atual.
if ! docker pull "$APP_IMAGE"; then
  log_error "Falha ao baixar a nova imagem. Mantendo container atual sem alteracoes."
  exit 1
fi

# Para e remove o container atual somente depois que a nova imagem estiver disponivel.
if docker inspect front-server >/dev/null 2>&1; then
  docker stop front-server
  docker rm front-server
fi

# Sobe nova versao e faz rollback imediato se o run falhar.
if ! docker run -d --name front-server --restart always -p 80:8080 "$APP_IMAGE"; then
  log_error "Falha ao iniciar novo container. Tentando rollback."
  rollback
  exit 1
fi

sleep 3

if ! docker ps --filter name=front-server --filter status=running | grep -q front-server; then
  log_error "Novo container nao permaneceu em execucao."
  rollback
  exit 1
fi

if ! curl -fsS http://localhost/ >/dev/null; then
  log_error "Healthcheck HTTP falhou."
  rollback
  exit 1
fi

docker ps --filter name=front-server
log_info "Deploy concluido com sucesso."
EOF
)

# Injeta o valor de APP_IMAGE no script remoto e codifica em JSON para o SSM.
REMOTE_SCRIPT="APP_IMAGE=\"${APP_IMAGE}\""$'\n'"${REMOTE_SCRIPT}"
PARAMETERS=$(jq -n --arg script "${REMOTE_SCRIPT}" '{commands:[$script]}')

# Envia comando remoto e captura o CommandId.
COMMAND_ID=$(aws ssm send-command \
  --instance-ids "${AWS_INSTANCE_ID}" \
  --document-name "AWS-RunShellScript" \
  --comment "Deploy image with rollback by previous image id" \
  --parameters "${PARAMETERS}" \
  --query "Command.CommandId" \
  --output text)

if [ -z "${COMMAND_ID}" ] || [ "${COMMAND_ID}" = "None" ]; then
  log_error "Nao foi possivel criar comando SSM de deploy."
  exit 1
fi

log_info "CommandId do deploy via SSM: ${COMMAND_ID}"

# Aguarda execucao remota.
if ! aws ssm wait command-executed \
  --command-id "${COMMAND_ID}" \
  --instance-id "${AWS_INSTANCE_ID}" >/dev/null 2>&1; then
  log_info "Waiter do SSM nao retornou sucesso imediato; coletando status final..."
fi

# Le tudo em uma chamada so.
INVOCATION_JSON=$(aws ssm get-command-invocation \
  --command-id "${COMMAND_ID}" \
  --instance-id "${AWS_INSTANCE_ID}" \
  --output json)

STATUS=$(echo "${INVOCATION_JSON}" | jq -r '.Status')
OUTPUT=$(echo "${INVOCATION_JSON}" | jq -r '.StandardOutputContent // ""')
ERROR_OUTPUT=$(echo "${INVOCATION_JSON}" | jq -r '.StandardErrorContent // ""')

log_info "Status do deploy via SSM: ${STATUS}"
log_info "Saida remota do deploy:"
printf '%s\n' "${OUTPUT}"

# Em falha, exibe stderr remoto.
if [ "${STATUS}" != "Success" ]; then
  log_error "Saida de erro remota:"
  printf '%s\n' "${ERROR_OUTPUT}" >&2
  exit 1
fi

log_info "Container front-server deployado e ativo."
