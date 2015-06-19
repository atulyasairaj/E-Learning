var mongoose = require('mongoose');

// define the schema for our registered model

var registerSchema = mongoose.Schema({  
  U_id: String,
  Course:[{
    C_id          : String,
    Register_date : {type: Date, default: new Date()},
    Complete      : Boolean,
    Grade         : String
          }]
  });


// create the model for course and expose it to our app
module.exports = mongoose.model('Enrolled', registerSchema);
