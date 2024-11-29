#!/bin/sh

# Start GuacD in the background and specify the config directory
/usr/local/sbin/guacd -C /backend &

# Start the backend server
node /backend/server.js &

# Start NGINX in the foreground
exec nginx -g 'daemon off;'