FROM node:8.9.1-onbuild

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install

# Bundle app source
COPY . /usr/src/app

CMD ["node", "servers/blockcypher/server.js"]
