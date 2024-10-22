# Basis-Image für den Nginx Webserver verwenden
FROM nginx:alpine

# Kopiere alle Dateien des aktuellen Verzeichnisses in das Standardverzeichnis von Nginx
COPY . /usr/share/nginx/html

# Standardmäßig nutzt Nginx Port 80
EXPOSE 80

# Starte den Nginx-Server
CMD ["nginx", "-g", "daemon off;"]