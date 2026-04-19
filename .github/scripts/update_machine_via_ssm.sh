#!/usr/bin/env bash
set -euo pipefail

log_info() {
  echo "[INFO] $*"
}

log_error() {
  echo "[ERRO] $*" >&2
}

# Valida a entrada obrigatoria vinda do workflow.
if [ -z "${AWS_INSTANCE_ID:-}" ]; then
  log_error "Variavel AWS_INSTANCE_ID nao definida."
  exit 1
fi

# O jq e usado para criar um payload JSON seguro para o comando SSM.
if ! command -v jq >/dev/null 2>&1; then
  log_error "jq nao encontrado no runner."
  exit 1
fi

# Script remoto para atualizar a maquina Ubuntu via apt.
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

if ! command -v apt-get >/dev/null 2>&1; then
  log_info "apt-get nao encontrado. Pulando update da maquina."
  exit 0
fi

log_info "Iniciando update simples da maquina (best effort)..."
APT_OPTS="-o Acquire::ForceIPv4=true -o Acquire::Retries=2 -o Acquire::http::Timeout=20"

if ! apt-get ${APT_OPTS} update; then
  log_info "Sem acesso aos mirrors no momento. Pulando update sem bloquear deploy."
  exit 0
fi

if ! DEBIAN_FRONTEND=noninteractive apt-get ${APT_OPTS} -y upgrade; then
  log_info "Upgrade falhou por conectividade. Seguindo sem bloquear deploy."
  exit 0
fi

log_info "Update da maquina finalizado"
EOF
)

PARAMETERS=$(jq -n --arg script "${REMOTE_SCRIPT}" '{commands:[$script]}')

COMMAND_ID=$(aws ssm send-command \
  --instance-ids "${AWS_INSTANCE_ID}" \
  --document-name "AWS-RunShellScript" \
  --comment "Update machine packages" \
  --parameters "${PARAMETERS}" \
  --query "Command.CommandId" \
  --output text)

if [ -z "${COMMAND_ID}" ] || [ "${COMMAND_ID}" = "None" ]; then
  log_error "Nao foi possivel criar comando SSM de update."
  exit 1
fi

log_info "CommandId do update via SSM: ${COMMAND_ID}"

if ! aws ssm wait command-executed \
  --command-id "${COMMAND_ID}" \
  --instance-id "${AWS_INSTANCE_ID}" >/dev/null 2>&1; then
  log_info "Waiter do SSM nao retornou sucesso imediato; coletando status final..."
fi

# Le tudo de uma vez para reduzir repeticao de chamadas.
INVOCATION_JSON=$(aws ssm get-command-invocation \
  --command-id "${COMMAND_ID}" \
  --instance-id "${AWS_INSTANCE_ID}" \
  --output json)

STATUS=$(echo "${INVOCATION_JSON}" | jq -r '.Status')
OUTPUT=$(echo "${INVOCATION_JSON}" | jq -r '.StandardOutputContent // ""')
ERROR_OUTPUT=$(echo "${INVOCATION_JSON}" | jq -r '.StandardErrorContent // ""')

log_info "Status do update via SSM: ${STATUS}"
log_info "Saida do update da maquina:"
printf '%s\n' "${OUTPUT}"

if [ "${STATUS}" != "Success" ]; then
  log_error "Saida de erro do update da maquina:"
  printf '%s\n' "${ERROR_OUTPUT}" >&2
  exit 1
fi

log_info "Update da maquina finalizado com sucesso."
