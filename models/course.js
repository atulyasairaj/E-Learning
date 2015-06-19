var mongoose = require('mongoose');
// define the schema for our course model
var courseSchema = mongoose.Schema({
          Title : String,
          Trainer_Id: String,
          Details:{
            Description: String,
            Category: String,
            StartDate : Date,
            EndDate : Date,
            Intro : String,
            Prerequisites: String,
            Agenda: String,
            Certificate: Boolean,
            Level: String,
            RoomId: String,
            Percentage: String,
            Video_Path: String,
            Image_Path: String,
            Session:[{
              Start: String,
              End: String
            }],
          },

          Content:[{
          Notes_url: String,
          note_name: String,
        }],
        Free: Boolean,
        Approved: {type: Boolean, default: false}
      });
// create the model for course and expose it to our app
module.exports = mongoose.model('Course', courseSchema);
