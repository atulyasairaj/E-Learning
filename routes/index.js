var mongoose = require('mongoose');
var user = mongoose.model('User');
var course = mongoose.model('Course');
var exam = mongoose.model('Exams');
var passport = require('../config/passport.js');

var Token = require('../config/token.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	var token = req.signedCookies.token, isLoggedIn, type;
	Token.validateUserToken(token, function(err, usr){
		if(usr){
			isLoggedIn = true;
			if(usr.trainer)
				type = '/trainer';
			else
				type = '/learner';
		} else
			isLoggedIn = false;
		res.render('index', { title : 'Welcome', isLoggedIn: isLoggedIn, type: type});
		res.end();
	});
	
});

router.get('/signup', function(req, res) {
	var token = req.signedCookies.token, isLoggedIn, type;
	Token.validateUserToken(token, function(err, usr){
		if(usr){
			isLoggedIn = true;
			if(usr.trainer)
				type = '/trainer';
			else
				type = '/learner';
		} else
			isLoggedIn = false;
		res.render('signup', { title: 'Signup', hide: 'true', isLoggedIn: isLoggedIn, type: type});
		res.end();
	});
});

router.get('/logout', function(req, res) {
	var token = req.signedCookies.token;
	if(token){
		Token.removeUserToken(token, function(err, usr){
			if(err){
				res.json({error : 'no user'})
			} else {
				res.clearCookie('token');
				res.json({success: 'logged out'});
			}
		});
	} else {
		res.redirect('/');
	}
});

router.post('/login', passport.authenticate('local-login',{session:false}), function(req,res){
	if(req.user){
		Token.createUserToken(req.user.email, function(err, usersToken){

			var redirect_path;
			if(err){
				res.json({error: 'Issue generating token'});
			} else {
				res.cookie('token', usersToken, {signed: true});
				res.locals.email = req.user.email;
				if(req.user.trainer == false){
					redirect_path = '/learner'
					res.locals.type = 'learner';
					if(res.cookie.redirect)
						redirect_path = res.cookie.redirect ? res.cookie.redirect : '/learner';
					delete res.cookie.redirect;
					res.status(200).json({url: redirect_path});
					res.end();
				}else{
					redirect_path = '/trainer'
					res.locals.type = 'trainer';

					if(res.cookie.redirect){
						redirect_path = res.cookie.redirect ? res.cookie.redirect : '/trainer';
					}
					console.log('Redirect Path ' + res.cookie.redirect);
					delete res.cookie.redirect;
					res.json({url: redirect_path});
				}
			}
		});
	} else {
		throw err;
		//res.json({error : 'login'});
	}
});

router.post('/signup',passport.authenticate('local-signup',{session:false}), function(req,res){
	if(req.user){
		res.json({success: 'done'});
	} else {
		res.json({error: 'error'});
	}
});


router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook',{session:false}), function(req,res){
	console.log(req);
	if(req.user){
		Token.createUserToken(req.user.email, function(err, usersToken){
			if(err){
				res.json({error: 'Issue generating token'});
			} else {
				res.cookie('token', usersToken, {signed: true});
				res.redirect('/trainer');
			}
		});
	} else {
		res.json({error : 'login'})
	}
});

module.exports = router;