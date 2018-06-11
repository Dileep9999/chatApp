FROM node:alpine

WORKDIR /usr/src/app


# RUN npm install babel-cli babel-preset-env -g

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "prod"]
