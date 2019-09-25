FROM node:10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN yarn 
RUN yarn global add typescript
RUN yarn global add ts-node

# Bundle app source
COPY . /usr/src/app

CMD ./bin/anypay.ts --api --actors slack
