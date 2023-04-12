#!/bin/bash

DOCKERFILE_BACKEND="$(cat ./app/api/Dockerfile)"
DOCKERFILE_FRONTEND="$(cat ./app/frontend/Dockerfile)"

DENY=(
  "RUN npm start"
)

echo "--------------------------"
echo '-app/api/Dockerfile---'
echo "--------------------------"
echo "$DOCKERFILE_BACKEND"
echo "--------------------------"
echo '-app/frontend/Dockerfile--'
echo "--------------------------"
echo "$DOCKERFILE_FRONTEND"
echo "--------------------------"
echo "--------------------------"

error=0

for I in "${DENY[@]}"; do
  if [[ "$DOCKERFILE_BACKEND" == *"$I"* ]]; then
    echo "ERRO em 'app/api/Dockerfile': O comando '${I}' não é autorizado"
    error=1
  fi
  if [[ "$DOCKERFILE_FRONTEND" == *"$I"* ]]; then
    echo "ERRO em 'app/frontend/Dockerfile': O comando '${I}' não é autorizado"
    error=1
  fi
done

if [[ $error -eq 1 ]]; then
  echo "--------------------------"
  echo "--------------------------"
  echo "O avaliador não irá continuar devido a um erro"
  exit 1
fi