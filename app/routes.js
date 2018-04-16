

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

	// ===== Fonts =====
	app.get('/Gotham-Bold.otf', function (req, res) {
		res.sendFile(fileDir + 'Gotham-Bold.otf');
	});
	app.get('/Gotham-Medium.otf', function (req, res) {
		res.sendFile(fileDir + 'Gotham-Medium.otf');
	});
	app.get('/Gotham-BookItalic.otf', function (req, res) {
		res.sendFile(fileDir + 'Gotham-BookItalic.otf');
	});

	// ===== Page routes =====
	// style.css
	app.get('/styles.css', function (req, res) {
		res.sendFile(fileDir + 'styles.css');
	});
	// index.js
	app.get('/index.js', function (req, res) {
		res.sendFile(fileDir + 'index.js');
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
	app.get('/settings.html', auth, reqAdmin, function (req, res) {
		res.sendFile(fileDir + 'settings.html');
	});
	// errors
	app.get('/errors.html', auth, reqAdmin, function (req, res) {
		res.sendFile(fileDir + 'errors.html');
	});
	// sensors
	app.get('/sensors.html', auth, reqAdmin, function (req, res) {
		res.sendFile(fileDir + 'sensors.html');
	});
	// users
	app.get('/users.html', auth, reqAdmin, function (req, res) {
		res.sendFile(fileDir + 'users.html');
	});
	// history.js
	app.get('/history.js', auth, function (req, res) {
		res.sendFile(fileDir + 'history.js');
	});
	// history
	app.get('/history.html', auth, function (req, res) {
		res.sendFile(fileDir + 'history.html');
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
	//console.log("Checking if user is authenticated.");
	//console.log(JSON.stringify(req.user));
	// Is the user object part of the request? (only happens after auth)
	if (!req.user || !req.user[0]) {
		// Redirect if not logged in
		res.redirect('/login.html');
	}
	// We authenticated, continue the request
	return next();
}

function reqAdmin(req, res, next) {
	console.log("Checking if user is admin.");
	console.log(JSON.stringify(req.user));
	// Is the user object part of the request? (only happens after auth)
	if (!req.user || !req.user[0] || req.user[0].admin_flag != 'Y') {
		// Redirect if not logged in
		res.status(403).send({error: true, data: {}, message: "You must be an administrator to access this!"});
	}
	// We authenticated, continue the request
	return next();
}