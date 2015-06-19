var mongoose = require('mongoose');
var Token = require('./token');

module.exports = {
	authentication : function (req, res, next) {
		var path = req.originalUrl;	
		var token = req.signedCookies.token;
    	if(token){
        	Token.validateUserToken(token, function(err, usr){
        	    if(err){
                    res.cookie.redirect = path;
        	        res.redirect('/?redirect='+ path);
        	    } else {
            	    next();
            	}
        	});
    	} else {
            res.cookie.redirect = path;
        	res.redirect('/?redirect='+ path);
		}
	}
}