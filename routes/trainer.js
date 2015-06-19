var express = require('express');
 	mongoose = require('mongoose'),
 	enroll = mongoose.model('Enrolled'),
	course = mongoose.model('Course'),
 	user = mongoose.model('User'),
 	Token = require('../config/token.js'),
 	exam = mongoose.model('Exams'),
 	async = require('async');

var router = express.Router();

router.get('*', function(req, res, next){
	console.log();
	var userType = Token.decode(req.signedCookies.token).type;
	if(userType == true){
		next();
	}
	else
		res.redirect('/learner');
});

router.get('/', function(req, res){
	var email = Token.decode(req.signedCookies.token).email;

	var eachMonthCount = [0,0,0,0,0,0,0,0,0,0,0,0];
	var count =0, enrolledCourses = [];
                  
	

		user.findOne({'email': email}, function(err, usr){
			enroll.findOne({'U_id': email}, function(err, enrolled){
				if(enrolled!=null){				
					enrolled.Course.forEach(function(doc, i){	
						count++;

						//console.log(doc.Register_date.getMonth());
						var i = doc.Register_date.getMonth();
						eachMonthCount[i] ++;
						

						course.findOne({'_id': doc.C_id}, function(err, crse){
							count--;
							enrolledCourses.push(crse);
							if (count == 0) {
								//console.log(eachMonthCount);
				          		course.find({'Trainer_Id': email}, function(err, training){
				          			res.render('trainer', {title:"Welcome Trainer", user: usr, trainings: training, courses: enrolledCourses, data:eachMonthCount});
				          			res.end();
				          		});			          		
				        	}
						});										
					});
				} else{
					course.find({'Trainer_Id': email}, function(err, training){
	          			res.render('trainer', { title:'Welcome Trainer', user: usr, trainings: training, courses: enrolledCourses, data:eachMonthCount});
	          			res.end();
				    });					
				}
			});
		});

	//});
});



router.get('/setexam/:id', function(req, res){
		exam.findOne({course_id: req.params.id}, function(err, docs){
			req.session.course_id = req.params.id;
			req.session.save();
			if(!docs){
				var newExam = new exam ({
					course_id : req.params.id
				}).save(function(err,docs){
					if (err) 
						res.json(err);
				});
			}
		res.render('questions',{title:'Set Exam'});
	});	
});

router.get('/create', function(req, res){
	res.render('create-course', {title: 'Create New Course'});
});

router.post('/create', function(req, res){
	var Course = new course({
		Title : req.body.title,
		Trainer_Id: Token.decode(req.signedCookies.token).email,
		Details:{
			Description:req.body.description,
			Category: req.body.category,
			StartDate : req.body.start,
			EndDate : req.body.end,
			Intro : req.body.intro,
			Prerequisites: req.body.prerequisites,
			Agenda: req.body.agenda,
			Certificate: req.body.certificate==='no' ? false : true,
			Level: req.body.level,
			RoomId: req.body.roomname,
			Percentage: req.body.percentage,
			Video_Path: req.body.video_path,
			Image_Path: req.body.image_path,
			Session:[{
				Start: req.body.start_session,
				End: req.body.end_session
			}],
		},
		Free: req.body.price==='no' ? false : true
	});
	Course.save(function(err){
		if(err){
			res.end('{"Error" : "Error"');
		}
		else{
			res.end('{"success" : "Updated Successfully", "status" : 200}');			
		}
	});
});


router.get('/managecourse/:id', function(req, res){

	course.findOne({'_id': req.params.id}, function(err, crse){
		res.render('manage-course', {'title' : 'Manage Course', course: crse});
	});	
});

router.post('/upload/', function(req, res){
	var file_name = req.body.filname;
	course.findOne({'_id': req.body._id}, function(err, docs){
		docs.Content.push({'Notes_url' : '/content/' + file_name, note_name: file_name});
		docs.save(function(err, saved){
			res.json({name: file_name, id:saved._id});
			res.end();
		});
	});
});

module.exports = router;