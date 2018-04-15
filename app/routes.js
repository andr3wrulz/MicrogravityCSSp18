

module.exports = function (app, passport, fileDir) {// fileDir should be [projectRoot]/public/
	// ===== Passport routes =====
	// login
	app.post('/login',
		passport.authenticate('local-login', {// Use ./config/passport to handle auths
			successRedirect: '/',
			failureRedirect: '/login.html'
		})
	);

	// logout
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/login.html');
	});


	// ===== Page routes =====
	// style.css
	app.get('/styles.css', function (req, res) {
		res.sendFile(fileDir + 'styles.css');
	});
	// root
	app.get('/', auth, function (req, res) {
		res.redirect('/index.html');
	});
	// index
	app.get('/index.html', auth, function (req, res) {
		res.sendFile(fileDir + 'index.html');
	});
	// login
	app.get('/login.html', function (req, res) {
		if (isAuthed(req)) {// If the user is already logged in, redirect
			res.redirect('/');
		}
		res.sendFile(fileDir + "login.html");
	});
	// settings
	app.get('/settings.html', auth, function (req, res) {
		res.sendFile(fileDir + 'settings.html');
	});
	// errors
	app.get('/errors.html', auth, function (req, res) {
		res.sendFile(fileDir + 'errors.html');
	});
	// sensors
	app.get('/sensors.html', auth, function (req, res) {
		res.sendFile(fileDir + 'sensors.html');
	});
	// users
	app.get('/users.html', auth, function (req, res) {
		res.sendFile(fileDir + 'users.html');
	});
}

function isAuthed(req) {
	// Is the user object part of the request? (only happens after auth)
	if (!req.user || !req.user[0]) {
		return false;
	}
	return true;
}

function auth(req, res, next) {
	console.log("Checking if user is authenticated.");
	console.log(JSON.stringify(req.user));
	// Is the user object part of the request? (only happens after auth)
	if (!req.user || !req.user[0]) {
		// Redirect if not logged in
		res.redirect('/login.html');
	}
	// We authenticated, continue the request
	return next();
}