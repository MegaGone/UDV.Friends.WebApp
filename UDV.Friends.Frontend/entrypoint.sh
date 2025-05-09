#!/bin/sh

# Reemplazar variables de entorno en los archivos JavaScript
echo "Configurando variables de entorno:"
echo "FRIEND_CHANNEL=${FRIEND_CHANNEL}"
echo "BASE_URL=${BASE_URL}"

for file in /usr/share/nginx/html/*.js; do
  sed -i "s|FRIEND_CHANNEL|${FRIEND_CHANNEL}|g" $file
  sed -i "s|BASE_URL|${BASE_URL}|g" $file
done

# Iniciar nginx
exec "$@"