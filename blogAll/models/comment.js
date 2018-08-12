const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  article:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'Article'
  },
  content:{
  	type:String
  },
  user:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'User'
  },
  createdAt:{
  	type:Date,
  	default:Date.now
  }


});


const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;