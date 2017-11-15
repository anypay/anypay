docker login --email $DOCKER_EMAIL \
             --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag paymentservice_rest-api anypay/paymentservice_rest-api:staging
docker push anypay/paymentservice_rest-api:staging
