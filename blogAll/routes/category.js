const Router=require('express').Router;
const UserModel=require('../models/user.js');
const CategoryModel=require('../models/category.js');
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

//显示管理员首页
router.get('/',(req,res)=>{
	res.render('admin/category_list',{
		userInfo:req.userInfo
	})
})


//显示新增页面
router.get('/add',(req,res)=>{
	res.render('admin/category_add',{
		userInfo:req.userInfo
	})
})


//导航栏排序post添加页面
router.post('/add',(req,res)=>{	
	// console.log(req.body)
	let body=req.body;
	CategoryModel.findOne({name:body.name})
	.then((cate)=>{
		if(cate){//已经存在渲染错误页面
			res.send('err');
		}else{//
			new CategoryModel({
				name:body.name,
				order:body.order
			})
			.save()
			.then((newCate)=>{//新增成功,渲染页面成功
				if(newCate){
					res.send('ok');
				}
			})
			.catch((e)=>{//新增失败,渲染错误页面
				res.send('err');
			})
		}
	})
})

module.exports=router;