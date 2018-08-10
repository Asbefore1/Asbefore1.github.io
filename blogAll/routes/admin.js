const Router=require('express').Router;
const UserModel=require('../models/user.js');
const pagination=require('../util/pagination.js');
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
	//获取所有用户的信息,分配给模板

	let options={
		page:req.query.page,//需要显示的页码
		model:UserModel,//操作的数据模型
		query:{},//查询条件
		projection:'_id username isAdmin',//投影,就是id,name,isAdmin
		sort:{_id:-1}//排序
	}

	pagination(options)//promise对象
	.then((data)=>{//成功
		res.render('admin/user_list',{
			userInfo:req.userInfo,
			users:data.docs,//每页有两个对象[{qwy,admin}],[{test1,test2}]
			page:data.page,//当前是第几页
			list:data.list,//[1,2,3,4]
			pages:data.pages,
			url:'/admin/users'
		})
		// console.log(data.docs)
		// console.log(data.page)
		// console.log(data.list)
	})
})

// router.post('/uploadImages',upload.single('upload'),(req,res)=>{
// 	let path = "/uploads/"+req.file.filename;
// 	res.json({
// 		uploaded:true,
//         url:path
// 	})
// })

module.exports=router;