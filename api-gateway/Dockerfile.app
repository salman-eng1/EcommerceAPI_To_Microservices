FROM node:alpine

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY ./api-gateway/package*.json ./
COPY ./api-gateway/env .env
# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./api-gateway .

# Command to start your Node.js application
CMD ["npm", "run", "start:dev"]
