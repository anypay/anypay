docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag anypay anypay/api.anypay.global:latest

docker push anypay/api.anypay.global:latest
