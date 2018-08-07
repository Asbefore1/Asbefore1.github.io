const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:{
  	type:String
  },
  password:{
  	type:String
  },
  repassword:{
  	type:String
  },
  isAdmin:{//判断是不是管理员
  	type:Boolean,
  	default:true
  }
});


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;