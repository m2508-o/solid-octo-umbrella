# Użycie oficjalnego obrazu Node.js.
FROM node:14

# Utworzenie i przejście do katalogu aplikacji.
WORKDIR /usr/src/app

# Skopiowanie manifestów zależności aplikacji do obrazu kontenera.
COPY package*.json ./

# Zainstalowanie zależności.
RUN npm install

# Skopiowanie pliki aplikacji.
COPY . .

# Zbudowanie aplikacji.
RUN npm run build

# Użycie obrazu nginx do obsługi aplikacji.
FROM nginx:alpine
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Otarcie portu, na którym działa aplikacja.
EXPOSE 80

# Uruchomienie nginx przy starcie kontenera.
CMD ["nginx", "-g", "daemon off;"]
