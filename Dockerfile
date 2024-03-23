FROM node:20-alpine3.17
WORKDIR .
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
