# Use an official Node.js runtime as base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the project files
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Start the app (replace with your start script if different)
CMD ["npm", "run", "dev"]
