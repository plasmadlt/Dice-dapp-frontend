FROM nginx:1.15-alpine

ARG stage
ARG version
ARG app

LABEL com.plasmabank.vendor=plasma \
      com.plasmabank.version=${version} \
      com.plasmabank.app=${app} \
      com.plasmabank.stage=${stage}

COPY ./dist /plasma/${app}
