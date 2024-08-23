# Use Node.js v14
FROM node:14

# Create app directory
WORKDIR ./

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose the port
EXPOSE 5000

CMD [ "node", "index.js" ]
