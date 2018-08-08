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

//显示管理员首页
router.get('/',(req,res)=>{
	res.render('admin/index',{
		userInfo:req.userInfo
	})
})


router.get('/users',(req,res)=>{
	//需要限制的页数
	let limit=2;

	//需要显示的页码	
	let page=req.query.page || 1;

	if(page<=1){
		page=1
	}

	UserModel.estimatedDocumentCount({})
	.then((count)=>{
		// console.log(count);
		//总页数=总信息条数/每页显示几条
		let pages=Math.ceil(count/limit);//向上取整,即剩下1条也显示
		if(page>pages){
			page=pages
		}

		let list=[];
		for(var i=1;i<=pages;i++){//i是第几页
			list.push(i)
		}


		//需要跳过的页数
		let skip=(page-1)*limit;
		//第一页显示2条  跳过0条
		//第二页显示2条  跳过2条
		//第三页显示2条  跳过4条
		//综上  发现规律：skip=(page-1)*limit

		//获取所有用户信息,分配给模板	
		UserModel.find({},'_id username isAdmin')//'_id username isAdmin'只显示这么多
		.skip(skip)
		.limit(limit)
		.then((users)=>{
			// console.log(page);
			res.render('admin/user_list',{
				userInfo:req.userInfo,
				users:users,
				page:page*1, //默认page是字符串,做了字符串拼接,*1变成数字
				list:list

			})
			// console.log(page)
			// console.log(req.userInfo)
		})
	})	
})
module.exports=router;