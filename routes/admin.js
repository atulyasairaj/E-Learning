var express = require('express');
var router = express.Router();

var Token = require('../config/token.js'),
	mongoose = require('mongoose'),
	user = mongoose.model('User'),
	mongoose = require('mongoose');

var admin = mongoose.model('Admin');

router.get('/dashboard', function(req, res) {
	user.find({request: true}, function(err, usr){
		res.render('admin-dashboard', { title : 'Welcome', requests: usr });
	});
});
router.get('/', function(req, res) {	
	/*var ad = new admin({id: 'admin', password: '1234'});
	ad.save(function(err, admin){

	});*/
		res.render('admin-login', { title : 'Welcome' });
	
});

router.post('/login', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	 admin.findOne({ id : email, password: password }, function(err, admin) {
	 	console.log(admin)
	 	if (err)
	 		throw err;

        else if(admin!=null){
           res.json({url: '/admin/dashboard'})
        }
    });
});

router.get('/notification', function(req, res) {
	user.find({request: true, read: false}, function(err, usr){
		res.json({count: usr.length, request: usr});
	});
});

router.get('/read', function(req, res) {
	user.update({read: false, request: true}, {read: true}, {multi: true}, function(err, usr){
			res.json({success: true});
	});		
});
router.get('/learner', function(req, res) {
	user.find({trainer: false}, function(err, usr){
		res.json({lcount: usr.length, trainer:usr})
	});
});

router.get('/trainer', function(req, res) {
	user.find({trainer: true}, function(err, usr){		
		res.json({lcount: usr.length, trainer:usr})
	});
});
router.post('/trainer-approval', function(req, res) {
	user.find({_id: req.body.id}, function(err, users){
		console.log(users);
		if(err){
			console.log('Error not found ')
		}else{
			user.update({_id: req.body.id}, {trainer:true, request:false},function(err,approved){
				res.json({success:true});
				res.end();
			})
		}
	});  
});

router.post('/trainer-reject', function(req, res) {
	user.find({_id: req.body.id}, function(err, users){
		if(err){
			console.log('Error not found ')
		}else{
			user.update({_id: req.body.id}, {request:false},function(err,approved){
				res.json({success:true});
				res.end();
			})
		}
	});  
});

module.exports = router;