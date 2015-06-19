var mongoose = require('mongoose');

// define the schema for our registered model

var score_Schema = mongoose.Schema({
	U_id: String,
	date: {type: Date, default: new Date()},
	course_id: String,
	score: { type: Number, default: 0 }
});

module.exports = mongoose.model('score', score_Schema);