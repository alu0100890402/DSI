var express = require('express');
var passport = require('passport');
var router = express.Router();

var path = require('path');
var multer = require('multer');


// ---------- LOGIN ----------
router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/inicio',
  failureRedirect: '/login',
  failureFlash: true,
}));

// ---------- SIGNUP ----------
router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/inicio',
  failureRedirect: '/signup',
  failureFlash: true,
}));



module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}