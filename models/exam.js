var mongoose = require('mongoose');

var questionsSchema = mongoose.Schema({
	Question: String,
	Option1: String,
	Option2: String,
	Option3: String,
	Option4: String,
	Level: String,
	Answer: String
});

var examSchema = mongoose.Schema({
	course_id: String,
	questions: [questionsSchema]
});

module.exports = mongoose.model('Question', questionsSchema);
module.exports = mongoose.model('Exams', examSchema);