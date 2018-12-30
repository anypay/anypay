FROM node:9.4.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN yarn 
RUN yarn global add typescript
RUN yarn global add ts-node

# Bundle app source
COPY . /usr/src/app

CMD ./bin/anypay.ts
