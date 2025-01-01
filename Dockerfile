FROM node:20-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Debug - List files in dist
RUN ls -la dist

# Install serve
RUN npm install -g serve

EXPOSE 8080
ENV PORT=8080
CMD ["serve", "-s", "dist", "-l", "8080"]