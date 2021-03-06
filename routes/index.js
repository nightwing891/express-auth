var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { user: req.user, message: req.flash() });
});

router.get('/register', function(req, res) {
	if (req.user)
			return res.back();
	res.render('register', { });
});

router.post('/register', function(req, res) {
	User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
		if (err) {
			return res.render('register', { user: user });
		}

		passport.autheticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
});

// router.get('/login', function(req, res) {
// 	res.render('login', { user : req.user });
// });

router.post('/login', passport.authenticate(
	'local', {successRedirect: '/dashboard', failureRedirect: '/', failureFlash: true }), 
	function(req, res) {
		res.redirect('/dashboard');
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

router.get('/about', function(req, res) {
	res.render('about');
});

function isAuthenticated(req, res, next) {
	if (req.user)
		return next();
	else
		res.redirect('/');
};

router.get('/dashboard'. isAuthenticated, function(req, res) {
	res.render('dashboard', { user: req.user });
})

module.exports = router;
