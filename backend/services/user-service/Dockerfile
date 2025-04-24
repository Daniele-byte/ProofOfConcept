# Usa un'immagine base di Node.js
FROM node:18-slim

# Imposta la directory di lavoro all'interno del container
WORKDIR /usr/src/app

# Copia il file package.json e package-lock.json (se presente)
COPY package*.json ./


# Installa le dipendenze
RUN npm install

# Copia il resto dei file sorgente dell'applicazione
COPY . .

# Copia il certificato nel container
COPY global-bundle.pem /usr/src/app/global-bundle.pem

# Espone la porta sulla quale gira l'applicazione (modifica se necessario)
EXPOSE 3000

# Comando per avviare l'applicazione
CMD ["npm", "start"]
