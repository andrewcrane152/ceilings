### Multi-stage: Node ###
FROM node:10-alpine AS builder

WORKDIR /app
ADD package*.json /app/
RUN npm install
ADD ./ /app/

ARG environment
RUN npm run "build:${environment}"

### Multi-stage: Nginx ###
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
# Only copies built assets
COPY --from=builder /app/dist .
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
