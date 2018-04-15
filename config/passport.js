var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
	// If no admin user exists, create one with username: admin and password: admin
	dbConnection.query("SELECT COUNT(*) AS count FROM users WHERE admin_flag = 'Y'", function (error, results, fields) {
		if (error) {
			console.log("[ERROR] Received SQL error when checking admin user count!");
			console.log(error);
			return;
		}
		if (results[0].count == 0) {
			console.log("[NOTICE] No admin users found! Creating admin user with username: admin and password: admin");
			bcrypt.hash("admin", null, null, function (err, hash) {
				dbConnection.query("INSERT INTO users (username, password, admin_flag) VALUES (?, ?, ?)", ["admin", hash, 'Y'],
					function (error, results, fields) {
						if (error) {
							console.log("[ERROR] Received SQL error when trying to add default admin user!");
							console.log(error);
							return;
						}
						console.log("[NOTICE] Successfully added default admin user!");
					}
				);
			});
		}
	});

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

	// Setup passport
	passport.use('local-login', new LocalStrategy(
		function(username, password, done) {
			console.log("[NOTICE] Trying to authenticate " + username);
			dbConnection.query("CALL get_user(?)", username,
				function(error, results, fields) {
					if (error) {
						console.log("[ERROR] passport.local-login SQL error finding user!");
						console.log(error);
					}
					//console.log(JSON.stringify(results[0][0]));

					if (!results[0][0]) {// User didn't exist
						console.log("[ERROR] passport.local-login user (" + username + ") does not exist!");
						return done(null, false, {message: 'Incorrect username.'});
					}

					if (!bcrypt.compareSync(password, results[0][0].password)) {// Bad password for user
						console.log("[ERROR] passport.login-local incorrect password for user " + username + "! exp: [" + password + "], got: [" + results[0][0].password + "]");
						return done(null, false, {message: 'Incorrect password.'});
					}

					// User was authenticated
					console.log("[NOTICE] User " + username + " was successfully authenticated!");
					return done(null, results[0]);
				}
			);
		}
	));

	passport.use('local-signup', new LocalStrategy(
		function(username, password, done) {
			dbConnection.query("CALL get_user(?)", username,// Check to see if username exists already
				function(error, results, fields) {
					if (error) {
						console.log("Got error when trying to signup user!");
						console.log(error);
						return done(error);
					}

					if (results.length) {// User didn't exist
						return done(null, false, {message: 'Username already exists.'});
					}

					bcrypt.hash(password, null, null, function (err, hash) {

						// Insert user into database
						dbConnection.query("INSERT INTO users (username, password, admin_flag) VALUES (?, ?, ?)", [username, hash, 'N'],
							function (error, results, fields) {
								if (error) {
									console.log("Error creating new user!");
									done(error);
								}
								return done (null, newUser);
							}
						);
					});
					
				}
			);
		}
	));
}