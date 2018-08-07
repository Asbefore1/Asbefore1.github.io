const Router=require('express').Router;
const router=Router();
//显示首页


router.use((req,res,next)=>{
	if(req.session.userinfo.isAdmin){	
		next();
	}else{
		res.send('<h1>请用管理员身份登录</h1>')
	}
})

router.get('/',(req,res)=>{
	res.render('admin/index',{
		userinfo:req.userinfo
	})
})


router.get('/users',(req,res)=>{
	res.render('admin/user_list',{
		userinfo:req.userinfo,
		isAdmin:req.isAdmin
	})
})

module.exports=router;