# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR C:\nginx-1.25.3\www\Dockerfile

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Bundle your application source code inside the Docker image
COPY . .

# Expose the port your application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]
