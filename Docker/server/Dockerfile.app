FROM node:alpine
WORKDIR '/app'
COPY . .
RUN mv env .env
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
