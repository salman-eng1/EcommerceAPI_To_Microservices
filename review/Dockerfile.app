FROM node:alpine

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY ./review/package*.json ./
COPY ./review/env .env
# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./review .

# Command to start your Node.js application
CMD ["npm", "run", "start:dev"]
