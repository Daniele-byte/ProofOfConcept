# Usa un'immagine base di Node.js
FROM node:18

# Imposta la directory di lavoro all'interno del container
WORKDIR /usr/src/app

# Copia il file package.json e package-lock.json (se presente)
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dei file sorgente dell'applicazione
COPY . .

# Espone la porta sulla quale gira l'applicazione
EXPOSE 3002

# Comando per avviare l'applicazione
CMD ["npm", "start"]
