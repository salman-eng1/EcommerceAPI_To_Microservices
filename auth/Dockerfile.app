FROM node:alpine

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY ./auth/package*.json ./
#COPY ./auth/env .env
# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./auth .

# Command to start your Node.js application
CMD ["npm", "run", "start:dev"]
