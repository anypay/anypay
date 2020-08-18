docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag bch.anypayinc.com anypay/bch.anypayinc.com:staging
docker push anypay/bch.anypayinc.com:staging
