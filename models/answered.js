var mongoose = require('mongoose');

// define the schema for our registered model

var ans_Schema = mongoose.Schema({
	U_Id: String,
	course_id: String,
	questions: [{qid:String}]
});
module.exports = mongoose.model('answered', ans_Schema);
