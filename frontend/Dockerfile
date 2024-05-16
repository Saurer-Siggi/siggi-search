# Use an official Nginx runtime as the base image
FROM nginx:stable

# Copy the frontend files to the Nginx public directory
COPY . /usr/share/nginx/html

# Expose the port on which the frontend app will run
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]