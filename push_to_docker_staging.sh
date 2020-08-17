docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag anypay anypay/api.anypayinc.com:staging
docker push anypay/api.anypayinc.com:staging
