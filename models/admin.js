var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var adminSchema = mongoose.Schema({

     
        id           : String,        
        password     : String,
        
});

// methods ======================
// generating a hash
/*adminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};*/

// create the model for users and expose it to our app
module.exports = mongoose.model('Admin', adminSchema);