#!/usr/bin/python
import MySQLdb

# Connect to database
db = MySQLdb.connect(host="localhost", user="webuser", passwd="Super!Secure", db="ground_control")

# Create cursor object so we can run queries
cur = db.cursor()

# Clear out all tables
cur.execute("TRUNCATE TABLE errors")
cur.execute("TRUNCATE TABLE readings")
cur.execute("TRUNCATE TABLE run_errors")
cur.execute("TRUNCATE TABLE runs")
cur.execute("TRUNCATE TABLE sensor_type")
cur.execute("TRUNCATE TABLE sensors")

# Add some sensor types
cur.execute("INSERT INTO sensor_type (sensor_type_id, description) VALUES "
			"(1, 'accelerometer'), (2, 'thermometer'), (3, 'barometer')")
db.commit()

# Add some sensors
cur.execute("INSERT INTO sensors (sensor_id, sensor_type_id, description, units) VALUES "
			"(1, 1, 'Nosecone accelerometer', 'm/s^2'), "
			"(2, 1, 'Tail accelerometer', 'm/s^2'), "
			"(3, 2, 'Experiment compartment thermometer', 'c'), "
			"(4, 3, 'Experiment compartment barometer', 'atm')")
db.commit()
			
# Add some error codes
cur.execute("INSERT INTO errors (error_id, type, description) VALUES "
			"(1, 'Non-critical sensor', 'Unable to read barometer'), "
			"(2, 'Fatal systems problem', 'Power supply insufficient!')")
db.commit()
			
# Release our connection to the database
db.close()