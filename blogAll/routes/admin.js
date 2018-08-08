const Router=require('express').Router;
const UserModel=require('../models/user.js');
const router=Router();
//显示首页

//进入admin的中间件,写在router.get的前面
//权限控制,必须用管理员的身份登录后isAdmin变成了true
//才能进去管理员的后台,在地址栏中输入127.0.0.1:3000/admin时
//由于没有判断是不是管理员,所以不能进入
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){	
		next();
	}else{
		res.send('<h1>请用管理员身份登录</h1>')
	}
})


router.get('/',(req,res)=>{
	res.render('admin/index',{
		userInfo:req.userInfo
	})
})

router.get('/users',(req,res)=>{
	//获取所有用户信息,分配给模板

	UserModel.find()
	.then((users)=>{
		console.log(users);
	})
	res.render('admin/user_list',{
		userInfo:req.userInfo
	})
})

module.exports=router;