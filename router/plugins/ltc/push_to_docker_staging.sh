docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag ltc.anypay.global anypay/ltc.anypay.global:staging
docker push anypay/ltc.anypay.global:staging
