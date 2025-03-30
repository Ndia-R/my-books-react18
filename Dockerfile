FROM node:20.17-slim

ARG PKG="git sudo"

RUN apt-get update && apt-get install -y ${PKG}

WORKDIR /my-books-frontend

RUN chown node:node .
RUN mkdir node_modules && chown node:node node_modules

COPY --chown=node:node ./package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

# CMD ["npm", "run", "dev"]
