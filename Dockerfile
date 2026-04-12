FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf
