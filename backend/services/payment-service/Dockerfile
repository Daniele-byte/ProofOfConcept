# Usa un'immagine Node.js come base
FROM node:18

# Imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice sorgente
COPY . .

# Esponi la porta del servizio
EXPOSE 3003

# Comando per avviare l'applicazione
CMD ["npm", "start"]
