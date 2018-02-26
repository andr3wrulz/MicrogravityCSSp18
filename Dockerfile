FROM node

#Create working directory
WORKDIR /src

#Copy package list so we can use npm
COPY package.json /src

#Run npm to get our packages
RUN npm install

#Copy our source code into the working directory
COPY . /src

#Run the node app
CMD node server.js

#Expose port 8080 to docker
EXPOSE 8080