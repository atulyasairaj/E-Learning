var express = require('express');

var mongoose = require('mongoose')
	course = mongoose.model('Course'),
	exam = mongoose.model('Exams'),
	question =  mongoose.model('Question');
	user = mongoose.model('User'),
	score = mongoose.model('score'),
	answered = mongoose.model('answered'),
	enroll = mongoose.model('Enrolled'),
	feedback = mongoose.model('feedback'),
	auth = require('../config/authenticate.js'),
	Token = require('../config/token.js'),
	fs = require('fs');

var router = express.Router();

router.post('/score', function(req, res){
	var email = Token.decode(req.signedCookies.token).email;
	var course_id = req.session.cid;
	
	score.findOne({'U_id' : email, 'course_id': course_id}, function(err, doc){
		if(!doc)
			res.json({score : 0});
		else
			res.json({score: doc.score});		
	});
});

router.get('/liststudents/:id', function(req, res){
	enroll.find({'Course.C_id': req.params.id}, function(err, docs){
		res.render('registered-learners',{title:'Students Enrolled', students: docs});
	});
});

router.get('/viewfeedback/:id', function(req, res){

	feedback.findOne({'course_id': req.params.id}, function(err, comments){
		
		feedback.aggregate([
			{	"$match" : {'course_id' : req.params.id } },
			{	"$unwind" : "$Feedback"},
			{ $group: {
					_id: '$_id',
					objectivesAvg: { $avg: '$Feedback.objectives' },
					contentAvg: { $avg: '$Feedback.content' },
					topicsAvg: { $avg: '$Feedback.topics' },
					course_lengthAvg: { $avg: '$Feedback.course_length' },
					learning_enrmntAvg: { $avg: '$Feedback.learning_enrmnt' },
					subject_matterAvg: { $avg: '$Feedback.subject_matter' },
					self_learningAvg: { $avg: '$Feedback.self_learning' },		  
			        OverallAvg: { $avg: '$Feedback.overall' } 
			} } 
			], function(err, results){
				
				if(Object.keys(results).length === 0){
					results = [{objectivesAvg:0, contentAvg:0,topicsAvg:0,course_lengthAvg:0,learning_enrmntAvg:0,subject_matterAvg:0,self_learningAvg:0}];
				}
				
				res.render('course-feedback',{title:'Course Feedback', comments: comments, ratings : results});
			}
		);
		//res.render('course-feedback',{title:'Course Feedback', comments: comments});
	});
	
});

router.get('/writefeedback/:id', function(req, res){
	var id = req.params.id;
	course.findOne({_id: req.params.id}, function(err, course){
		user.findOne({'email' : course.Trainer_Id}, function(err, usr){
			res.render('feedback', {title:'Give your feedback', id: course._id, course_title: course.Title, course_trainer: usr.name});
		});
	});
});

router.post('/writefeedback', function(req, res){
	feedback.findOne({'course_id': req.body.id}, function(err, feed){
		if(feed == null){
			console.log(req.body);
			var newFeed = new feedback({course_id : req.body.id});
			newFeed.Feedback.push({
				user_id : Token.decode(req.signedCookies.token).email,
				objectives : req.body.q1,
				content: req.body.q2,
				topics: req.body.q3,
				course_length: req.body.q4,
				learning_enrmnt: req.body.q5,
				subject_matter: req.body.q6,
				self_learning: req.body.q7,
				overall: req.body.q8,
				Comment:req.body.comment
			});

			newFeed.save(function(err, ok){
				res.json({success: true});
			});
		} else{
			feed.Feedback.push({
				user_id : Token.decode(req.signedCookies.token).email,
				objectives : req.body.q1,
				content: req.body.q2,
				topics: req.body.q3,
				course_length: req.body.q4,
				learning_enrmnt: req.body.q5,
				subject_matter: req.body.q6,
				self_learning: req.body.q7,
				overall: req.body.q8,
				Comment:req.body.comment
			});

			feed.save(function(err, ok){
				res.json({success: true});
			});
		}
	})
});

/* GET users listing. */
router.get('/category/:category', function(req, res) {
	course.find({'Details.Category': req.params.category}, function(err, courses){
		if(err){
			console.log('Error not found course')
		}else{
			res.render('list-courses', {title: req.params.category, courses : courses});
		}
	});  
});

router.get('/viewcourse/:id', function(req,res){

	course.findOne({'_id':req.params.id}, function(err, course){
		if(err){
			console.log('Error not found course');
			throw err;
		}else{

			feedback.findOne({'course_id': req.params.id}, function(err, comments){
		
				feedback.aggregate([
					{	"$match" : {'course_id' : req.params.id } },
					{	"$unwind" : "$Feedback"},
					{ $group: {
							_id: '$_id',
							OverallAvg: { $avg: '$Feedback.overall' } 
					} } 
				], function(err, results){
				
					if(Object.keys(results).length === 0){
						results = [{'OverallAvg': 0}];
					}

					var isEnrolled;
					user.findOne({'email':course.Trainer_Id}, function(err, user){
						Token.validateUserToken(req.signedCookies.token, function(err, usr){
							
							if(usr){
								enroll.findOne({'U_id': usr.email,'Course.C_id':course._id}, function(err, enrolled){
									if(enrolled != null)
										isEnrolled=true;
									else
										isEnrolled=false;
									res.render('view-course',{user:user, course:course, title:course.Title, enrolled: isEnrolled, Feedback: results});						
								});
							} else if(err){
								res.render('view-course',{user:user, course:course, title:course.Title, enrolled: false, Feedback: results});
							}
						});
						
												
					});
				});
			});			
		}
	});
});

router.post('/viewcourse/:id', auth.authentication, function(req,res){
	var email = Token.decode(req.signedCookies.token).email;
	
	enroll.findOne({U_id:email}, function(err, user){
		if(user == null){
			var newEnroll = new enroll();
			newEnroll.U_id = email;
			newEnroll.Course.push({C_id: req.params.id});

			newEnroll.save(function(err, docs){
				if(err)
					res.json({success:false});
				else
					res.json({success:true});
			});
		} else {

			user.Course.push({C_id: req.params.id});

			user.save(function(err, docs){
				if(err)
					res.json({success:false});
				else
					res.json({success:true});
			});
		}
	});
});

router.get('/video/:id', auth.authentication, function(req, res){
	var email = Token.decode(req.signedCookies.token).email;
	user.findOne({email: email}, function(err, usr){
		if(usr)
			res.render('video', {title: 'Video Chat', name: usr.name, roomid: req.params.id});
	});
});

router.get('/learnervideo/:id', auth.authentication, function(req, res){
	var email = Token.decode(req.signedCookies.token).email;
	user.findOne({email: email}, function(err, usr){
		if(usr)
			res.render('learner_video', {title: 'Video Chat', name: usr.name, roomid: req.params.id});
	});
});

router.post('/questions',function(req,res){	
	var quest = new question ({
		Question: req.body.question,
		Option1: req.body.option1,
		Option2: req.body.option2,
		Option3: req.body.option3,
		Option4: req.body.option4,
		Answer: req.body.answer,
		Level: req.body.level
	});

	exam.findOne({'course_id': req.session.course_id}, function(err, newExam){
		if(newExam){
			newExam.questions.push(quest);
			newExam.save(function(err, docs){
				if (err) 
					res.json(err);
				else
					res.json({success: 'done'});
			});
		}
	});
	
});

function getQuestion(cid, level, email, cb){
	var found = 0;
	console.log(level);
	exam.findOne({"course_id":cid}, function(err, docs){
		
		console.log(err);
		if(docs == null){
			cb(err);
			return;
		}
		docs.questions.forEach(function(doc){
			if(doc.Level === level.toString()){
				answered.findOne({'U_Id': email, 'course_id': cid, 'questions.qid': doc._id}, function(err, unanswered){
					
					if(unanswered == null && found ==0){
						
						found = 1;
						var question_sent = doc;
						
						answered.findOne({'U_Id': email, 'course_id': cid }, function(err, answeringNewExam){
							if(answeringNewExam == null){
								var new_question = new answered({'U_Id' : email, 'course_id': cid});
								new_question.save(function(err, enterNew){
									
									enterNew.questions.push({'qid' : question_sent._id});
									enterNew.save(function(err, ok){
										cb(question_sent);
										return false;
										//res.render('Exam', {quest: question_sent});
									});
								});
							} else {
								answeringNewExam.questions.push({'qid' : question_sent._id});
								answeringNewExam.save(function(err, ok){
									cb(question_sent);
									return false;
									//res.render('Exam', {quest: question_sent});
									//res.end();
								});
							}
						});
					}							
				});
			}
			
		});
	});
}

router.get('/exam/:id',function(req,res){
	var email = Token.decode(req.signedCookies.token).email;
	
	
	//if(!req.session.level){
		req.session.number_of_questions = 1;
		req.session.level = 1;
		req.session.cid = req.params.id;
		req.session.save();
	//}

	getQuestion(req.params.id, req.session.level, email, function(question_sent){
		console.log(question_sent)
		res.render('Exam', {quest: question_sent});
		res.end();
	});
});

/*router.post('/verifyAnswer', function(req, res){	
	var option = req.body.optnSelected;
	
	var qid = req.body.qid;
	var course_id = req.session.cid;
	var level = req.session.level,
		number_of = req.session.number_of_questions;
	var email = Token.decode(req.signedCookies.token).email;
	console.log('Number of Answered ' + number_of);
	if(number_of <= 2){
		exam.findOne({'course_id': course_id, 'questions._id': qid}, function(err, quest){
			var correct_answer = quest.questions.Answer;
			if(correct_answer === option){
				level++;
			}
		});
		score.findOne({'U_id' : email, 'course_id': course_id}, function(err, doc){
			if(!doc){
				var newScore = score({'U_id' : email, 'course_id': course_id, 'score ': level});
				newScore.save(function(err, ok){

				});
			} else{
				doc.score = level;
				doc.save(function(err, ok){

				});
			}
		});

		getQuestion(req.session.cid, req.session.level, email, function(question_sent){
			req.session.number_of_questions +=1;
			req.session.save();
			res.json({quest: question_sent});
			res.end();
		});
	} else
	{
		score.findOne({'U_id' : email, 'course_id': course_id}, function(err, doc){
			if(!doc)
				res.json({score : 0});
			else
				res.json({score: doc.score});		
		});
		
	}
});*/

router.post('/verifyAnswer', function(req, res){	
	var option = req.body.option;
	
	var qid = req.body.qid;
	var course_id = req.session.cid;
	var level = req.session.level,
		number_of = req.session.number_of_questions;
	var email = Token.decode(req.signedCookies.token).email;
	console.log('Number of Answered ' + number_of);
	
	exam.findOne({'questions._id': qid},{'questions.$': 1}, function(err, quest){
		var correct_answer = quest.questions[0].Answer;
		if(correct_answer === option){
			req.session.level= level+1;
			console.log(correct_answer + 'Right answer')
			req.session.save();

			console.log("After correct" + req.session.level);
		}

		score.findOne({'U_id' : email, 'course_id': course_id}, function(err, doc){
			if(!doc){
				var newScore = score({'U_id' : email, 'course_id': course_id, 'score ': level});
				newScore.save(function(err, ok){

				});
			} else{
				doc.score = req.session.level-1;
				doc.save(function(err, ok){
					if(number_of <= 2){
						getQuestion(req.session.cid, req.session.level, email, function(question_sent){
							req.session.number_of_questions +=1;
							req.session.save();
							res.json({quest: question_sent});
							res.end();
						});
					} else
					{
						score.findOne({'U_id' : email, 'course_id': course_id}, function(err, doc){
							if(!doc)
								res.json({score : 0});
							else
								res.json({score: doc.score});		
						});
					}
				});
			}
		});		
	});
});

router.get('/learncourse/:id', function(req, res){
	course.findOne({'_id': req.params.id}, function(err, crse){
		res.render('learn-course', {'title' : 'Learn Course', course: crse});
	});	
});

router.get('/download/:id', function(req, res){
	var file_name = req.params.id;
	var file_path = __dirname + '/../public/content/' + file_name;
	res.download(file_path);
});

router.get('/delete', function(req, res){
	var id = req.query.id;
	//course.
	course.findOne({ 'Content._id': id},function(err, data){
		

		var a = data.Content.filter(function( obj ) {
  			return obj._id == id;
		});

		data.Content.pull({_id:id});
		
		fs.unlink(__dirname + '/../public/content/' + a[0].note_name);
		data.save(function(err, saved){
			console.log(saved)
			if(saved)
				res.json({done:'done'})
			else
				throw err;
				
		});				
	});
});

module.exports = router;