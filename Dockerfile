FROM node:11.8-alpine

# RUN addgroup -S guid-king && adduser -S guid-king -G guid-king
# USER guid-king

COPY . /app
WORKDIR /app

RUN npm install --production

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start"]
