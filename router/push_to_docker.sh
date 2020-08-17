docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag router.anypayinc.com anypay/router.anypayinc.com:$CIRCLE_BRANCH

docker push anypay/router.anypayinc.com:$CIRCLE_BRANCH
