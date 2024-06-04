# Użycie oficjalnego obrazu Node.js.
FROM node:14

# Utworzenie i przejście do katalogu aplikacji.
WORKDIR /usr/src/app

# Skopiowanie manifestów zależności aplikacji do obrazu kontenera.
COPY package*.json ./

# Zainstalowanie zależności.
RUN npm install

# Skopiowanie plików aplikacji.
COPY . .

# Otwarcie portu, na którym działa aplikacja.
EXPOSE 5000

# Uruchomienie usługi sieciowej przy starcie kontenera.
CMD [ "npm", "start" ]
