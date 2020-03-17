docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag router.anypay.global anypay/router.anypay.global:$CIRCLE_BRANCH

docker push anypay/router.anypay.global:$CIRCLE_BRANCH
