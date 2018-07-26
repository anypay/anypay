docker login --email $DOCKER_EMAIL \
             --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag payment-service anypay/paymentservice_rest-api:latest
docker tag payment-service anypay/api.anypay.global:latest

docker push anypay/paymentservice_rest-api:latest
docker push anypay/api.anypay.global:latest
