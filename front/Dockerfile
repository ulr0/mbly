FROM node:16.13.2

WORKDIR /usr/src/app/front

COPY . .

RUN npm install --silent

RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]