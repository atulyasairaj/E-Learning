var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

     
        id           : String,
        email        : String,
        password     : String,
        name         : String,
        gender       : String,
        occupation   : String,
        dob          : Date,
        country      : String,
        trainer      : {type: Boolean, default: false},
        request      : {type: Boolean, default: false},
        read         : {type: Boolean, default: false},
        token        : Object
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
