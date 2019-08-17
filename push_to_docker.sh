docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag anypay anypay/anypay:$CIRCLE_BRANCH

docker push anypay/anypay:$CIRCLE_BRANCH

