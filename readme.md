./start_postgres.sh
npm install
node server.js

npx sequelize-cli db:migrate
npx sequelize-cli db:migrate --url "postgresql://admin:1234@localhost:5431/la79y"
npx sequelize-cli db:migrate:undo

## Deploy to digital ocean

### deploy database

```shell
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-postgres.yaml
kubectl apply -f 01-k8s.yaml
kubectl port-forward service/postgres 5431:5432 -n backend-namespace
```
