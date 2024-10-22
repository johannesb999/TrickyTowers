# Verwende das offizielle Nginx Image aus dem Alpine-Repository
FROM nginx:stable-alpine

# Setze das Arbeitsverzeichnis im Container
WORKDIR /usr/share/nginx/html

# Lösche alle bestehenden Dateien in diesem Verzeichnis
RUN rm -rf ./*

# Kopiere die HTML-Dateien aus deinem Projektverzeichnis in den Container
COPY . .

# Gib den Port 80 frei, um auf den Webserver zugreifen zu können
EXPOSE 80

# Starte den Nginx-Webserver
CMD ["nginx", "-g", "daemon off;"]
