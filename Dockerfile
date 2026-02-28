# No seu Dockerfile do Front-end
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# O comando abaixo remove o caractere BOM de todos os arquivos caso ele ainda exista
RUN find . -type f -exec sed -i '1s/^\xEF\xBB\xBF//' {} +
RUN npm run build