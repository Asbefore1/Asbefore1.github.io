const Router=require('express').Router;
const CategoryModel=require('../models/category.js');
const router=Router();
//显示首页
router.get('/',(req,res)=>{
	// console.log(req.cookies.get('userInfo'));
	// console.log(req.userinfo);
	CategoryModel.find({},'_id name')
	.sort({order:1})
	.then((categories)=>{
		res.render('main/index',{
			userInfo:req.userInfo,
			categories:categories
		});
	})
	
	//在浏览器地址栏里输入127.0.0.1:3000
	//请求到app.js里面的app.use('/',require('./routes/index.js'))
	//接着走到routes/index.js,看到是get请求和/
	//对应前面的模板swig即去找./views里面的main里面的index
	//把index继承layout的内容和自己的内容解析成html代码一块返回给前端
	//浏览器从上到下解析代码
	//解析到href='lib/bootstrap/css/bootstrap.min.css'时
	//去找127.0.0.1:3000/lib/bootstrap/css/bootstrap.min.css即请求静态页面css
	//后台走到app.use(express.static('public'))
	//去找public下面的lib/bootstrap/css/bootstrap.min.css找到css
	//下面所有的href和src都是这样的解析方法请求到页面
})

module.exports=router;