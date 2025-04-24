FROM kong:latest

# Crea la directory e copia la configurazione dichiarativa
USER root

# Installa build-essential per avere make e gcc per la compilazione
RUN apt-get update && apt-get install -y build-essential

# Installa hmac e le sue dipendenze
RUN luarocks install hmac

RUN test -d /usr/local/kong/declarative || mkdir -p /usr/local/kong/declarative
COPY kong.yml /usr/local/kong/declarative/kong.yml
USER kong
