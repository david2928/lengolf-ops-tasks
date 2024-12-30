FROM node:18-alpine
WORKDIR /app
COPY dist .
ENV PORT=8080
EXPOSE 8080
RUN npm install -g serve
CMD serve -s . -l $PORT