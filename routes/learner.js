var express = require('express'),
	Token = require('../config/token.js'),
	mongoose = require('mongoose'),
	user = mongoose.model('User'),
	enroll = mongoose.model('Enrolled'),
	course = mongoose.model('Course');
var router = express.Router();

router.get('/*', function(req,res, next){
	var userType = Token.decode(req.signedCookies.token).type;
	if(userType == false){
		next();
	}
	else
		res.redirect('/trainer');	
});




router.get('/', function(req, res){
	var email = Token.decode(req.signedCookies.token).email;
	var enrolledCourses = [],count =0;

	var eachMonthCount = [0,0,0,0,0,0,0,0,0,0,0,0];

	user.findOne({'email': email}, function(err, usr){
		
		enroll.findOne({'U_id': email}, function(err, enrolled){
			if(enrolled!=null){				
				enrolled.Course.forEach(function(doc, i){	
					count++;

					var i = doc.Register_date.getMonth();
					eachMonthCount[i] ++;
						
					course.findOne({'_id': doc.C_id}, function(err, crse){
						count--;
						enrolledCourses.push(crse);
						if (count == 0) {
			          		res.render('learner', { title:'Welcome Learner', user: usr, courses: enrolledCourses,data:eachMonthCount});
			          		res.end();
			        	}
					});										
				});
			} else
				res.render('learner', { title:'Welcome Learner', user: usr, data:eachMonthCount});
		});
	});
	
});

router.post('/request', function(req,res){
	var email = Token.decode(req.signedCookies.token).email;
	user.update({email: email}, {request: true}, function(err, usr){
		if(err)
			res.status("Error");
		else
			res.send("Done");
	});
});

module.exports = router;