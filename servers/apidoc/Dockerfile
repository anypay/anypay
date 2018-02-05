FROM nginx:latest

VOLUME ["nginx.conf:/etc/nginx/conf.d/default.conf"]
VOLUME ["dist:/www/data"]

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /www/data

EXPOSE 80 443

