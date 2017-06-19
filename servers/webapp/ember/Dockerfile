FROM nginx:latest

VOLUME ["nginx.conf:/etc/nginx/conf.d/default.conf"]
VOLUME ["dist:/www/data"]

COPY servers/webapp/ember/nginx.conf /etc/nginx/conf.d/default.conf
COPY servers/webapp/ember/dist /www/data

EXPOSE 80 443

