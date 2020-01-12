docker login --username $DOCKER_USER \
             --password $DOCKER_PASSWORD 

docker tag anypay anypay/cashback.anypayapp.com:$CIRCLE_BRANCH

docker push anypay/cashback.anypayapp.com:$CIRCLE_BRANCH
