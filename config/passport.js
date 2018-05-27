var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../app/models/user');


module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy({
    clientID: "912541620202-94k2084r8tlsfd4igqlc93sjbe2lngqk.apps.googleusercontent.com",
    clientSecret: "LLC1z9A2WgpMt1uU75hFKhLw",
    callbackURL: "http://localhost:3000/"
  },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email':  email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'Este correo está asociado a otro usuario.'));
        } else {
          if(!(/^([a-zA-Z0-9]{6,})$/.test(req.body.password))){
            return done(null, false, req.flash('signupMessage', 'Esta contraseña no es válida'));
          }
          var newUser = new User();
          newUser.local.name = req.body.name;
          newUser.local.surname = req.body.surname;
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'Usuario no encontrado.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Contraseña incorrecta.'));
      return done(null, user);
    });
  }));

};
