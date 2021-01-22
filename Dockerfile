FROM node:14

ADD docker/build-entrypoint.sh /entrypoint.sh
VOLUME /source
VOLUME /target

ENV REV=main

WORKDIR /target
ENTRYPOINT /entrypoint.sh
