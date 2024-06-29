# Use an official Node.js runtime as a parent image
### STAGE 1: Build ###
FROM node:12.22-alpine3.10 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install -g @angular/cli

# Install app dependencies:
RUN npm i 

COPY . .
RUN ng build --prod
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/* /usr/share/nginx/html

# # Command to run the Angular application
# CMD ["ng", "serve", "--host", "0.0.0.0"]

# # Use an official Node.js image
# FROM node:20.9 as build

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Install necessary angular cli
# RUN npm install -g @angular/cli

# # Expose the port the app runs on
# # EXPOSE 4200

# #

