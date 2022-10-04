FROM node:16.13.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install -g mocha 
RUN npm install 

# Bundle app source
COPY . /usr/src/app

CMD ts-node main.ts
