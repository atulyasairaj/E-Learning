var mongoose = require('mongoose');

function mongoConnect()
{
    mongoose.connect('mongodb://admin:SggWJKCD4rTb@elearning-sawantinfotech.rhcloud.com:27017');

    var db = mongoose.connection;



    db.on('error',function(){
      console.log('DB Connection Error')
    })

    db.once('open',function(){
      console.log('DB Connection Successful')
    })
}

module.exports.mongoConnect = mongoConnect;
