FROM node:12.20.0

WORKDIR /usr/src/app
COPY package*.json ./ 

RUN yarn

COPY yarn.lock ./ 
COPY src/views/css/styles.css src/views/css/

RUN yarn build-tailwindcss

COPY . .

EXPOSE 8081

CMD ["node", "src/app.js"]