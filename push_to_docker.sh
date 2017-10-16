docker login --email $DOCKER_EMAIL \
             --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag dashpaymentservice_rest-api stevenzeiler/dashpaymentservice_rest-api:latest
docker push stevenzeiler/dashpaymentservice_rest-api:latest
