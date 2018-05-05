FROM node:10.0-alpine

COPY . /var/www/app
WORKDIR /var/www/app

RUN useradd -ms /bin/bash guid-king
USER guid-king

RUN npm install --production

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start"]
