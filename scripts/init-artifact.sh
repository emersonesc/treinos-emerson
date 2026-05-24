#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACT="$REPO_ROOT/treino_emerson_4.html"
PORT="${PORT:-8080}"

if [[ ! -f "$ARTIFACT" ]]; then
  echo "Erro: arquivo não encontrado em $ARTIFACT"
  exit 1
fi

echo "MFIT · Emerson — iniciando servidor local"
echo "Acesse: http://localhost:$PORT/treino_emerson_4.html"
echo "Pressione Ctrl+C para encerrar."

if command -v python3 &>/dev/null; then
  python3 -m http.server "$PORT" --directory "$REPO_ROOT"
elif command -v python &>/dev/null; then
  cd "$REPO_ROOT" && python -m SimpleHTTPServer "$PORT"
else
  echo "Erro: python3 não encontrado. Instale Python 3 para usar este script."
  exit 1
fi
