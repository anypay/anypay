docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag bch.anypay.global anypay/bch.anypay.global:staging
docker push anypay/bch.anypay.global:staging
