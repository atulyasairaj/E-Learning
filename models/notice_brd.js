var mongoose = require('mongoose');

// define the schema for our registered model

var notice_brdSchema = mongoose.schema({
  				U_id: String,
  				date: Date,
  				Name: String,
  				Query:String,
  				expression: Code,

  				Response:[{
  					U_id: String,
  					date: Date,
  					Name: String,
  					Reply:String,
  					expression: Code
  				}]


// create the model for course and expose it to our app
module.exports = mongoose.model('notice_brd', notice_brdSchema);
