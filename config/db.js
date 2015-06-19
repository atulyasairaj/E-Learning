var mongoose = require('mongoose');

function mongoConnect()
{
    mongoose.connect('mongodb://localhost:27017/Elearning');
    var db = mongoose.connection;

    db.on('error',function(){
      console.log('DB Connection Error')
    })

    db.once('open',function(){
      console.log('DB Connection Successful')
    })
}

module.exports.mongoConnect = mongoConnect;
