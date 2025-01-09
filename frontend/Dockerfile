# Use official Node.js image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire frontend project
COPY . .

# Expose the React development server port
EXPOSE 3000

# Command to run the React development server
CMD ["npm", "start"]
