#!/usr/bin/python
import MySQLdb
import time
import random

# Make database connection
db = MySQLdb.connect(host="localhost", user="webuser", passwd="Super!Secure", db="ground_control")

# Create cursor object from connection
cur = db.cursor()

while True:
	# Wait until we recieve a start signal in the database
	print "Waiting for start signal"
	cur.execute("SELECT command_id FROM commands WHERE command_type = 'START' and time_sent IS NULL")
	row = cur.fetchone()
	while row is None:
		time.sleep(1)# Wait 1 second
		cur.execute("SELECT command_id FROM commands WHERE command_type = 'START' and time_sent IS NULL")
		db.commit()
		row = cur.fetchone()
		
	# We got a start command
	command_id = row[0]
	print "Found start command: " + str(command_id)

	# Mark it as sent
	cur.execute("UPDATE commands SET time_sent = CURRENT_TIMESTAMP() WHERE command_id = " + str(command_id))
	db.commit()

	# Create new run
	cur.execute("INSERT INTO runs (title, description) VALUES ('Demo run', 'Demo run description')")
	db.commit()
	run_id = cur.lastrowid
	print "Created run: " + str(run_id)

	# Generate fake sensor data
	print "Generating data..."

	accelA_data = []
	accelA = 1.0
	accelB_data = []
	accelB = 1.0
	thermo_data = []
	thermo = 20.0
	baro_data = []
	baro = 1.0
	for i in range(0,20000):
		accelA += random.uniform(-0.1, 0.1)
		accelA_data.append(accelA)
		accelB += random.uniform(-0.1, 0.1)
		accelB_data.append(accelB)
		thermo += random.uniform(-0.1, 0.1)
		thermo_data.append(thermo)
		baro += random.uniform(-0.01, 0.01)
		baro_data.append(baro)

	index = 0

	print "Starting reading insertion..."
	# Get end time
	end_time = time.time() + 30# 30 seconds from now

	while time.time() < end_time:
		cur.execute("INSERT INTO readings (run_id, sensor_id, reading) VALUES "
					"(%s, 1, %s), (%s, 2, %s), (%s, 3, %s), (%s, 4, %s)",
					(run_id, round(accelA_data[index], 2), run_id, round(accelB_data[index], 2),
					run_id, round(thermo_data[index], 2), run_id, round(baro_data[index], 2)))
		db.commit()
		index += 1
		
		if index == 20:# After 100 readings throw an error for fun
			cur.execute("INSERT INTO run_errors (error_id, run_id, sensor_id) VALUES (1, %s, 3)", (run_id,))
			db.commit()
		
		time.sleep(0.5)# Wait 500ms
		
	print "Test complete!"

db.close()