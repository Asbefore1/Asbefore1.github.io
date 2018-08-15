const Router = require('express').Router;
const hmac=require('../util/hmac.js');
const UserModel = require('../models/user.js');
const CommentModel = require('../models/comment.js');
const pagination = require('../util/pagination.js');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const fs = require('fs');
const path = require('path');

const router = Router();
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
	res.render('admin/index',{//render渲染页面
		userInfo:req.userInfo
	})
})


//显示用户列表
router.get('/users',(req,res)=>{

	//获取所有用户的信息,分配给模板

	let options = {
		page: req.query.page,//需要显示的页码
		model:UserModel, //操作的数据模型
		query:{}, //查询条件,查询所有
		projection:'_id username isAdmin', //投影，
		sort:{_id:-1} //排序
	}
	// console.log(req.query)//req上有query方法,拿到去掉?后面的对象{page:'2'}
	pagination(options)
	.then((data)=>{
		res.render('admin/user_list',{
			userInfo:req.userInfo,
			users:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/admin/users'
		});	
		console.log(data)
	})
})



//添加文章是处理图片上传
router.post('/uploadImages',upload.single('upload'),(req,res)=>{
	let path = "/uploads/"+req.file.filename;
	res.json({
		uploaded:true,
        url:path
	})
})


//显示用户评论列表
router.get('/comments',(req,res)=>{
	CommentModel.getPaginationComments(req)
	.then(data=>{
		res.render('admin/comment_list',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			pages:data.pages,
			list:data.list
		})
	})
})


//删除评论
router.get("/comment/delete/:id",(req,res)=>{
	let id = req.params.id;
	CommentModel.remove({_id:id},(err,raw)=>{
		if(!err){
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'删除评论成功',
				url:'/admin/comments'
			})				
		}else{
	 		res.render('admin/error',{
				userInfo:req.userInfo,
				message:'删除评论失败,数据库操作失败'
			})				
		}		
	})

});


//显示站点管理页面
router.get("/site",(req,res)=>{
	let filePath = path.normalize(__dirname + '/../site-info.json');
	fs.readFile(filePath,(err,data)=>{
		if(!err){
			let site = JSON.parse(data);
			res.render('admin/site',{
				userInfo:req.userInfo,
				site:site
			})
		}else{
			console.log(err)
		}
	})

})


//处理修改网站配置请求
router.post("/site",(req,res)=>{
	let body=req.body;
	let site={
		author:{
			name:body.author.name,
			intro:body.author.intro,
			image:body.author.image,
			wechat:body.author.wechat
		},
		ads:{
			url:body.url,
			paht:body.path
		},
		icp:body.icp
	};

	site.carouseles=[];

	if(body.carouselUrl.length>0 && typeof body.carouselUrl){
		for(let i=0;i<body.carouselUrl.length;i++){

		}
	}else{
		site.carouseles.push()
	}


	site.ads=[];

	if(body.adUrl.length>0 && typeof body.adUrl){
		for(let i=0;i<body.adUrl.length;i++){

		}
	}else{
		site.carouseles.push()
	}
	
})


//显示修改密码页面
router.get('/password',(req,res)=>{
	res.render('admin/password',{
		userInfo:req.userInfo
	})
})


//修改密码处理页面
router.post('/password',(req,res)=>{
	// console.log(req.body)
	UserModel.update({_id:req.userInfo._id},{
		password:hmac(req.body.password)
	})
	.then(raw=>{
		req.session.destroy();
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'修改密码成功',
			url:'/'
		})	
	})
})

module.exports = router;