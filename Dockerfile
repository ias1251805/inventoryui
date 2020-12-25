FROM node:10.13-alpine AS builder
COPY . ./test-a-application
WORKDIR /test-a-application
RUN npm i
RUN $(npm bin)/ng build --prod

FROM nginx:1.15.8-alpine
COPY --from=builder /test-a-application//dist/angular-signup-verification-boilerplate/ /usr/share/nginx/html