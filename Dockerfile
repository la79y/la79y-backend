FROM node:20-alpine3.17
RUN npm install -g npm@10.5.0
WORKDIR .
COPY package*.json .

RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
