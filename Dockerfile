# Use an image that starts from google/cloud-sdk:slim and then installs 
# the nodejs v12 runtime
# Dockerfile is checked in at https://github.com/snapmaster-io/gcloud-node-image.git 
FROM ogazitt/gcloud-node-image

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . ./

# REPLACE THIS WITH GCP PROJECT WHICH YOU ARE AN OWNER
ENV PROJECT=snapmaster-dev

# Run the web service on container startup.
CMD [ "node", "./server.js"]
