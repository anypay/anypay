FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install 

RUN npm install -g seed-phrase

# Bundle app source
COPY . /usr/src/app

CMD npm start

