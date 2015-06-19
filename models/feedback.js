var mongoose = require('mongoose');

var feedbackSchema = mongoose.Schema({
	course_id: String,
	Feedback:[{
          date: {type: Date, default: new Date()},
          user_id: String,
          objectives: Number,
		  content: Number,
		  topics: Number,
		  course_length: Number,
		  learning_enrmnt: Number,
		  subject_matter: Number,
		  self_learning: Number,
		  overall: Number,
          Comment:String
        }]
    });
module.exports = mongoose.model('feedback', feedbackSchema);
