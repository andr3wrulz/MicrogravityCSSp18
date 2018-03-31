import MySQLdb# sudo apt-get install python-mysqldb
import socket
import sys

recieveAddress = ('localhost', 10000)

# Create our database connection
db = MySQLdb.connect(host = 'localhost',
                    user = 'webuser',
                    passwd = 'Super!Secure',
                    db = 'ground_control')

# Create a cusor on our database connection
cur = db.cursor()

try:
    # Create tcp/ip socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Bind the socket to localhost and our port
    print >>sys.stderr, 'Starting socket on %s:%s' % recieveAddress
    sock.bind(recieveAddress)

    while True:
        # Start listening
        print >>sys.stderr, 'Awaiting incoming connection'
        sock.listen(1)
        while 
finally:
    # Close our cursor
    cur.close()
    # Close the database connection
    db.close()