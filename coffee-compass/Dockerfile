# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the React project files to the container
COPY . /app/

# Install dependencies and build the React app for production
RUN npm install
RUN npm run build

# Expose the desired port for the React app (optional if using Nginx)
EXPOSE 3000

# Define the command to start the React app (optional if using Nginx)
CMD ["npm", "start"]
