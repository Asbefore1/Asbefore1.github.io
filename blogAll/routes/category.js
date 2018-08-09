const Router=require('express').Router;
const UserModel=require('../models/user.js');
const CategoryModel=require('../models/category.js');
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

//显示分类管理首页
router.get('/',(req,res)=>{
	/*
	CategoryModel.find({})//找到所有的
	//categories作为一个参数代替所有的数据,即是一个数组,里面有很多对象
	//eg:[ { _id: 5b6bbaa39f59021480141f90, name: 'lll', order: 0, __v: 0 },{ _id: 5b6bbab7b798fd2554416d02, name: 'HTML', order: 0, __v: 0 },]
	.then((categories)=>{
		res.render('admin/category_list',{
			userInfo:req.userInfo,//{ _id: '5b6927573609880f989224f6',username: 'admin',isAdmin: true }
			categories:categories
		})
		// console.log(req.categories)
		// console.log(req.userInfo)
	})
	*/
	let options={
		page:req.query.page,//需要显示的页码
		model:CategoryModel,//操作的数据模型
		query:{},//查询条件
		projection:'_id name order',//投影,就是id,name,isAdmin
		sort:{order:1}//升序
	}

	pagination(options)//promise对象
	.then((data)=>{//成功
		res.render('admin/category_list',{
			userInfo:req.userInfo,
			categories:data.docs,//每页有两个对象[{qwy,admin}],[{test1,test2}]
			page:data.page,//当前是第几页
			list:data.list,//[1,2,3,4]
			pages:data.pages,
			url:'/category'
		})
		// console.log(data.docs)
		// console.log(data.page)
		// console.log(data.list)
	})
})


//显示新增页面
router.get('/add',(req,res)=>{
	res.render('admin/category_add_edit',{
		userInfo:req.userInfo
	})
})


//处理新增请求
router.post('/add',(req,res)=>{	
	// console.log(req.body)
	let body=req.body;//使用了app.js里面的post请求的中间件
	CategoryModel.findOne({name:body.name})
	.then((cate)=>{//查询成功
		if(cate){//已经存在渲染错误页面
			res.render('admin/fail',{
				userInfo:req.userInfo,
				message:'新增失败,已有同名分类,请重新输入',
			})
		}else{//不存在就插入
			new CategoryModel({
				name:body.name,
				order:body.order
			})
			.save()
			.then((newCate)=>{//插入成功,渲染页面成功
				if(newCate){
					res.render('admin/success',{
						userInfo:req.userInfo,
						message:'新增成功',
						url:'/category',
					})
				}
			})
			.catch((e)=>{//插入失败,渲染错误页面
				res.render('admin/fail',{
					userInfo:req.userInfo,
					message:'新增失败,数据库插入失败',
				})
			})
		}
	})
})



//显示编辑页面
router.get('/edit/:id',(req,res)=>{
	let id=req.params.id;//字符串
	// console.log(id);	
	CategoryModel.findById(id)
	.then((category)=>{
		res.render('admin/category_add_edit',{
			userInfo:req.userInfo,
			category:category//{ _id: 5b6bd8c663f2f001f4203def, name: 'HTML', order: 0, __v: 0 }
		})
	})
})

//处理编辑请求
router.post('/edit',(req,res)=>{
	let body=req.body;	//body是一个对象
	
	// <input type="hidden" name="id" value="{{ category._id.toString() }}">
	// console.log(body)body里面的id是从这个里面获取出来的,不会在页面上显示
	//但会自动加一个id
	CategoryModel.findOne({name:body.name})//body.name新写入的name去数据库里找
	.then((category)=>{//是从数据库里找到的对象
		//顺序不一样也可以更新成功,不一样的必须是name
		//if(category)的意思是,如果有外面传进来一样的对象的话就失败
		if(category && category.order==body.order){//在数据库里找到说明数据库里已经有了,不能再写一个,则失败
			res.render('admin/fail',{
				userInfo:req.userInfo,
				message:'编辑失败,已有同名分类,请重新输入',
			})
			// console.log(category)
		}else{//在数据库没里找到,说明数据库里没有,可以重新写进去一个
			//eg:5b6bd8c663f2f001f4203def就是body.id找到这个id去更新它
			CategoryModel.update({_id:body.id},{name:body.name,order:body.order},(err,raw)=>{
				//回调函数
				if(!err){
					res.render('admin/success',{
						userInfo:req.userInfo,
						message:'修改分类成功',
						url:'/category',
					})
					// console.log(body.name)
					// console.log(body.id)
				}else{
					res.render('admin/fail',{
						userInfo:req.userInfo,
						message:'修改分类失败,数据库操作失败',
					})
				}
			})			
		}
	})
})



//处理删除页面
router.get('/delete/:id',(req,res)=>{
	let id=req.params.id;//字符串
	// console.log(id);	
	CategoryModel.remove({_id:id},(err,raw)=>{
		if(!err){
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'删除分类成功',
				url:'/category',
			})
		}else{
			res.render('admin/fail',{
				userInfo:req.userInfo,
				message:'删除分类失败,数据库删除失败',
			})
		}
	})	
})

module.exports=router;