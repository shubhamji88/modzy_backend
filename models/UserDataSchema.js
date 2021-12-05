const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserData = new Schema({
  meetlink: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  data:{
    type:String,
    required: false
  },
  summarizedText:{
    type:String,
    required: false
  },
  topics:{
    type:String,
    required: false
  },
  sentiment:{
    type:String,
    required: false
  },
  status:{
    type:Number,
    required:true
  }
});

module.exports = mongoose.model("userdata", UserData);