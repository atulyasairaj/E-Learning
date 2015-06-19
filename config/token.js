var mongoose = require('mongoose'),
	jwt = require('jwt-simple'),
	user = mongoose.model('User'),
	tokenSecret = 'put-a-$Ecr3t-h3re';

var TokenAuth = new mongoose.Schema({
	token: {type: String},
	date_created: {type: Date, default: Date.now},
});

TokenAuth.statics.hasExpired = function(created){
	var now = new Date();
	var diff = (now.getTime() - created);
	return diff > 3600000;
}

var TokenModel = mongoose.model('TokenModel', TokenAuth);

var Token = new mongoose.Schema({});

Token.statics.encode = function(data){
	return jwt.encode(data, tokenSecret, 'HS512');
}

Token.statics.decode = function(data){
	return jwt.decode(data, tokenSecret);
}

Token.statics.createUserToken = function(email, cb) {
	var self = this;
	user.findOne({'email': email}, function(err, usr){
		if(err || !usr){
			console.log('err');
		}
		//create a token and add to user and save
		var token = self.encode({email: email, type: usr.trainer, date: new Date()});
		usr.token = new TokenModel({token: token});
		usr.save(function(err, usr){
			if(err){
				cb(err,null);
			} else {
				cb(false, token);
			}
		});
	});
}

Token.statics.removeUserToken = function(token, cb){
	var self= this;
	if(token){
		var decoded = self.decode(token);
		if(decoded && decoded.email){
			user.findOne({'email': decoded.email}, function(err,usr){
				if(err){
					cb(err,null)
				} else{
					usr.token = null;
					usr.save(function(err, usr){
						if(err) {
							cb(err, null);
						} else {
							cb(false,'removed');
						}
					})
				}
			});
		}
	} else {
		cb(err, null);
	}	
}

Token.statics.validateUserToken = function(token, cb){
	var self= this;
	if(token){
		var decoded = self.decode(token);
		if(decoded && decoded.email){
			user.findOne({'email': decoded.email, 'token.token': token}, function(err,usr){
				if(err || !usr){
					cb(true, false);
				} else {
                    if (TokenModel.hasExpired(usr.token.date_created)) {
                        cb(true, false)// token expired not found
                    } else {
                        cb(false, usr);
                    }
				}
			});
		}
	} else
		cb(true, false);
}

module.exports = mongoose.model('Token', Token);