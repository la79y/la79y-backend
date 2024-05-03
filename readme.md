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
kubectl get service -n backend-namespace
kubectl port-forward service/postgres 5431:5432 -n backend-namespace
```

## Setup k8s dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.2.0/aio/deploy/recommended.yaml
kubectl proxy
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/


## Local build
DOCKER_BUILDKIT=1 docker build . -t la79y-backend-local2
docker run --network app-tier -e DB_NAME="la79y" -e DB_USER="admin" -e DB_PASSWORD="1234" -e DB_HOST=la79y-postgres -e JWT_SECRET=4b8e5678fa4c46d5b5f6a2295d50b224   -e SERVER_PORT=8080 la79y-backend-local2

# Cert
Certificate is saved at: /etc/letsencrypt/live/la79y.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/la79y.com/privkey.pem
This certificate expires on 2024-07-31.
