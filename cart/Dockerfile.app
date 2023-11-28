FROM node:alpine

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY ./cart/package*.json ./
COPY ./cart/env .env
# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./cart .

# Command to start your Node.js application
CMD ["npm", "run", "start:dev"]
