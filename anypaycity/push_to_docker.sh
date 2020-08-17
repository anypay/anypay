docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag energycity anypay/energycity:$CIRCLE_BRANCH

docker push anypay/energycity:$CIRCLE_BRANCH

