const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  category:{
  	type:mongoose.Schema.Types.ObjectId,//必须是objectId才能关联
  	ref:'Category'
  },
  user:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'User'
  },
  title:{
  	type:String
  },
  intro:{
  	type:String
  },
  content:{
  	type:String
  },
  createdAt:{
  	type:Date,
  	default:Date.now
  },
  click:{
  	type:Number,
  	default:0
  }

});


const ArticleModel = mongoose.model('Article', ArticleSchema);

module.exports = ArticleModel;
