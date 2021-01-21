FROM node:14

WORKDIR /home/node/dashboard/
VOLUME . /home/node/dashboard/

RUN npm install
RUN npm run build
