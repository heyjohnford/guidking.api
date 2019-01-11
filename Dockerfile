FROM node:10.1-alpine

COPY . /app
WORKDIR /app

# RUN useradd -ms /bin/bash guid-king
# USER guid-king

RUN npm install --production

# ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start"]
