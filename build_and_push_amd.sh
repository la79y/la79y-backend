DOCKER_BUILDKIT=1 docker build --platform linux/amd64 . -t la79y-backend-v11-amd64
docker tag la79y-backend-v11-amd64:latest bandersaeed94/la79y:backend-v11
docker push bandersaeed94/la79y:backend-v11