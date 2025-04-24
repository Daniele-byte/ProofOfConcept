# Stage 1: Costruisci l'app React
FROM node:18 AS build

WORKDIR /app

# Copia i file package e installa le dipendenze
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copia il codice sorgente e costruisci l'app
COPY . ./
RUN npm run build

# Stage 2: Usa Nginx per servire l'app in HTTPS
FROM nginx:alpine

# Rimuovi la configurazione di default di Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia la tua configurazione personalizzata per HTTPS
COPY ./nginx-config/default.conf /etc/nginx/conf.d/default.conf

# Copia i file della build nell'area servita da Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia i certificati nella cartella di Nginx
COPY ./certs /etc/nginx/certs


# Espone le porte 80 (HTTP) e 443 (HTTPS)
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
