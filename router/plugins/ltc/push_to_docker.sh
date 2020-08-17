docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag ltc.anypayinc.com anypay/ltc.anypayinc.com:latest

docker push anypay/ltc.anypayinc.com:latest
