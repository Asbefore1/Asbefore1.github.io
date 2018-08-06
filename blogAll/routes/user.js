const Router=require('express').Router;
const router=Router();
const UserModel=require('../models/user.js');
const hmac=require('../util/hmac.js');

//注册用户
router.post('/register',(req,res)=>{
	// console.log(req.body);
	let body=req.body;
	//定义返回数据
	let	 result={
		code:0,//0代表成功
		errmessage:''
	}
	UserModel
	.findOne({username:body.username})//返回一个promise对象
	.then((user)=>{
		if(user){//已经有该用户
			result.code=10;
			result.errmessage='该用户已存在,请重新注册用户';
			res.json(result);
		}else{//没有注册过就插入存到数据库
			new UserModel({
				username:body.username,
				password:hmac(body.password)
			})
			.save((err,newUser)=>{
				if(!err){//插入数据库成功
					result.code=0;
					errmessage='';
					res.json(result);
				}else{//插入数据库失败
					result.code=10;
					result.errmessage='注册失败';
					res.json(result);
				}
			})
		}
	})
})


//登录用户
router.post('/login',(req,res)=>{
	console.log('1:::aa');
	// console.log(req.body);
	let body=req.body;
	//定义返回数据
	let result={
		code:0,//0代表成功
		errmessage:''
	}
	console.log('2:::aa');
	UserModel  //数据库里查找用户名和密码
	.findOne({username:body.username,password:hmac(body.password)})//返回一个promise对象
	.then((user)=>{//user就是查出来的用户名和密码这个对象
		if(user){//登陆成功
			console.log('3:::aa');
			result.data={//获取到数据库里的数据
				_id:user._id,
				username:user.username,
				isAdmin:user.isAdmin
			}
			req.cookies.set('userInfo',JSON.stringify(result.data));
			console.log('4:::aa');
			res.json(result);  //result.code  result.errmessage  result.data
			console.log('5:::aa');
		}else{
			console.log('6:::aa');
			result.code=10,
			result.errmessage='用户名或密码错误',
			res.json(result);
		}
	})
})

module.exports=router;