# Ground Control
This project was created by Andrew Geltz, Luis O'Donnel and Priscilla Ryan as a senior design project for the UCF CS department. This project is sponsored by Florida Space Institute. The goal for this project was to create a ground interface for a reduced gravity experiment system to provide sensor information and basic commands while tests are being run. The system consists of a capsule tethered to a balloon that is repeatedly dropped and reeled back up to provide payload with reduced gravity.

## Getting Started
One of the main goals of our design was for it to be easily deployed and extendable. For this reason we chose to implement a (M)EAN (MySQL instead of MongoDB) in a docker container. The docker container contains everything except the database (becuase we were unable to find a good way to dockerize a MySQL database).

1. Clone this repository
2. Install and configure MySQL
    1. Setup any accounts you want and an account for the application's connection
    2. Create a database name ground_control (you can name it differently but there are several places it needs to be changed)
    3. Run the schema.sql script inside the database to generate the tables and stored procedures
    4. Add the correct connection string to config/database.js
3. Install Docker and Node, I do not plan on covering this step since it varies widely based on the operating system you are deploying on
4. Build the docker script `docker build -t ground_control .` - build the docker contain described in the Dockerfile in . (local directory) and name it ground_control
5. Start the docker container `docker run -d -p 8080:8080 --name ground_control ground_control` - run a docker container detached (-d) and expose port 8080 (-p {host port}:{container port}) and name it ground_control using the ground_control image we created earlier
6. Verify the container is up and running `docker ps -a` - will list all running or stopped (-a for stopped) docker containers
7. To remove the container `docker rm ground_control` - since we named the container ground_control, we can remove it by name

## Notes
schema.sql was generated with the following command:
mysqldump -u [username] -p[password] ground_control --no-data=true --routines > schema.sql
