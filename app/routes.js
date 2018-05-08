var express = require('express');
var passport = require('passport');
var router = express.Router();

var Post = require('./models/post');

var getPost = require('./obtenerpost.js');
var getPosts = getPost.getPosts;

var path = require('path');
var multer = require('multer');


// ---------- RUTA / ----------
router.get('/', function(req, res, next) {
  if(isLoggedIn){
    res.redirect('/inicio');
  }
  else {
    res.render('login.ejs', { message: req.flash('inicioMessage') });
  }
});

// ---------- INICIO ----------
router.get('/inicio', isLoggedIn, function(req, res) {
  getPosts(req.user)
    .then((response) => {
      res.render('index.ejs', {
        user: req.user,
        post: response
      });
    })
    .catch((response) => {
      console.log("Error al buscar posts");
    })
});

// ---------- LOGIN ----------
router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/inicio',
  failureRedirect: '/login',
  failureFlash: true,
}));

// ---------- LOGUOT ----------
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// ---------- SIGNUP ----------
router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/inicio',
  failureRedirect: '/signup',
  failureFlash: true,
}));

// Google SIGNUP
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



// ---------- SUBIR_POST ----------
router.post('/subir_post',isLoggedIn, (req, res) => {

  console.log(req.body)
  var newPost = new Post({
    estado: req.body.estado,
    owner: req.user._id,
  });

  newPost.save(function(err) {
    if(err) return console.log(err);
  });
  
  res.redirect('/inicio');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}
