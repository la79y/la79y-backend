./start_postgres.sh
npm install
node server.js

npx sequelize-cli db:migrate
npx sequelize-cli db:migrate --url "postgresql://admin:1234@localhost:5431/la79y"
npx sequelize-cli db:migrate:undo


Use the OAuth 2.0 Playground (https://developers.google.com/oauthplayground) to obtain a refresh token.

## Deploy to digital ocean

### deploy database

```shell
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-postgres.yaml
kubectl apply -f 01-k8s-prod.yaml
kubectl port-forward service/postgres 5431:5432 -n backend-namespace
```
