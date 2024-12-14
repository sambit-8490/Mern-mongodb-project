# Use Node.js as the base image for building the React app
FROM node:18-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package.json ./

# Install frontend dependencies
RUN npm install

# Copy the entire frontend source code into the container
COPY . .

# Build the React application
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:1.25-alpine

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the frontend port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
