//项目入口文件
const express=require('express');
const swig=require('swig');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const Cookies=require('cookies');
const session=require('express-session');
const MongoStore = require("connect-mongo")(session);

//1.启动数据库
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true });
const db=mongoose.connection;
db.on('error',(err)=>{
	throw err;
})
db.once('open',()=>{
	console.log('DB collected...');
})

const app=express();


//2.配置模板
swig.setDefaults({//cache缓存
	cache:false
});
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');


//3.配置静态资源
app.use(express.static('public'));


//设置cookies的中间件,后面所有的中间件都有cookies
/*
app.use((req,res,next)=>{

	req.cookies=new Cookies(req,res);
	// console.log(req.cookies.get('userinfo'));
	req.userinfo={};
	let userinfo=req.cookies.get('userinfo');
	if(userinfo){
		try{
			req.userinfo=JSON.parse(userinfo);
		}catch(e){
		}	
	}
	next();
})
*/

//cookie+session  cookies是从前台发过来,session存到后台
//发过来之后session从后台去取,找匹配的id
app.use(session({
	//设置cookie名称
	name:'pig',
	//用它来对session cookie加盐,防止篡改
	secret:'ssahfgsdfuaefjwyef',
	//强制保存session即使它并没有变化
	resave:true,
	//强制将未初始化的session存储
	saveUninitialized: true,
	//如果为true,则每次请求都更新cookie的过期时间
	rolling:true,
    //cookie过期时间 1天
    cookie:{maxAge:1000*60*60*24},    
    //设置session存储在数据库中
    store:new MongoStore({ mongooseConnection: mongoose.connection })   
}))

//取出userInfno用户信息,应该先存,在登录的时候存下来用户的信息
app.use((req,res,next)=>{
	// console.log(req.session);
	//使用session
	req.userInfo=req.session.userInfo || {};
	next();
})

//4.添加处理post请求的中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//5.处理路由
app.use('/',require('./routes/index.js'))
app.use('/user',require('./routes/user.js'))
app.use('/admin',require('./routes/admin.js'))



app.listen(3000,()=>{
	console.log('server is running at 127.0.0.1');
})