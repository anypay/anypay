docker login --email $DOCKER_EMAIL \
             --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag paymentservice_rest-api stevenzeiler/paymentservice_rest-api:latest
docker push stevenzeiler/paymentservice_rest-api:latest
