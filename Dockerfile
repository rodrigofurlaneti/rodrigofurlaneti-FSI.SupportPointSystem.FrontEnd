# Estágio 1: Build da aplicação React/Vite
FROM node:20-alpine AS build
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Remove o caractere BOM (UTF-8) apenas dos arquivos necessários para não lotar o disco
RUN find . -maxdepth 2 -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.css" | xargs sed -i '1s/^\xEF\xBB\xBF//'

# Gera o build de produção (pasta dist)
RUN npm run build

# Estágio 2: Servidor de Produção usando Nginx
FROM nginx:stable-alpine

# Copia os arquivos gerados no estágio anterior para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta interna do container (será mapeada para a 3000 no host)
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]