FROM node:12.20.0

WORKDIR /usr/src/app
COPY package*.json ./ 
COPY yarn.lock ./ 

RUN yarn

COPY src/views/css/styles.css src/views/css/

RUN yarn build-tailwindcss

COPY . .

ENV COOKIE_AGE=86400000

EXPOSE 8081

CMD ["node", "src/app.js"]