# Use a stable, modern Node version
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app code
COPY . .

# Expose the app's port (defaults to 80 if not overridden)
EXPOSE 8080

# Run the app
CMD ["node", "index.js"]
