var mongoose = require('mongoose');

function mongoConnect()
{
    mongoose.connect('https://elearning-sawantinfotech.rhcloud.com/elearning');
    var db = mongoose.connection;

    db.on('error',function(){
      console.log('DB Connection Error')
    })

    db.once('open',function(){
      console.log('DB Connection Successful')
    })
}

module.exports.mongoConnect = mongoConnect;
