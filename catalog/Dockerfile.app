FROM node:alpine

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY ./catalog/package*.json ./
#COPY ./catalog/env .env
# Install dependencies
RUN npm install
RUN mkdir -p uploads/brands uploads/categories uploads/subCategories uploads/products \
    && echo "Directories created successfully!"
# Copy the rest of the application files
COPY ./catalog .

# Command to start your Node.js application
CMD ["npm", "run", "start:dev"]
