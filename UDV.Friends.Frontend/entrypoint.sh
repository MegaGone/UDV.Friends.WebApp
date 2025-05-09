#!/bin/sh

FRIEND_CHANNEL_ESCAPED=$(printf '%s\n' "$FRIEND_CHANNEL" | sed -e 's/[\/&]/\\&/g')
BASE_URL_ESCAPED=$(printf '%s\n' "$BASE_URL" | sed -e 's/[\/&]/\\&/g')

find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) -exec sed -i "s|FRIEND_CHANNEL_PLACEHOLDER|${FRIEND_CHANNEL_ESCAPED}|g" {} \;
find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) -exec sed -i "s|BASE_URL_PLACEHOLDER|${BASE_URL_ESCAPED}|g" {} \;

exec "$@"