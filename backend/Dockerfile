# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json into the container
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire backend source code into the container
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
