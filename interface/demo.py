#!/usr/bin/python
import MySQLdb
import time
import random

# Make database connection
db = MySQLdb.connect(host="localhost", user="webuser", passwd="Super!Secure", db="ground_control")

# Create cursor object from connection
cur = db.cursor()

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
# 30 
accelA_data = [random.uniform(2,8) for _ in xrange(20000)]
accelB_data = [random.uniform(3,9) for _ in xrange(20000)]
thermo_data = [random.uniform(20,30) for _ in xrange(20000)]
baro_data = [random.uniform(0.5,1.0) for _ in xrange(20000)]
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
	
	if index == 100:# After 400 readings throw an error for fun
		cur.execute("INSERT INTO run_errors (error_id, run_id, sensor_id) VALUES (1, %s, 1)", (run_id,))
		db.commit()
	
	time.sleep(0.1)# Wait 100ms
	
print "Test complete!"

db.close()