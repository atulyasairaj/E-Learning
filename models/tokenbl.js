var mongoose = require('mongoose');

// define the schema for our token model

var tokenSchema = mongoose.schema({
        U_id: String,
        token_id: String,
        issue: Date,
        expiry: Date
  });

// create the model for course and expose it to our app
module.exports = mongoose.model('TokenBlackList', tokenSchema);
