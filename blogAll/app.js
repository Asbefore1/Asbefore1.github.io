const express=require('express');
const swig=require('swig');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const Cookies=require('cookies');


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


//设置cookies中间件
app.use((req,res,next)=>{

	req.cookies=new Cookies(req,res);
	console.log(req.cookies.get('userinfo'));
	next()
})


//4.添加处理post请求的中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//5.处理路由
app.use('/',require('./routes/index.js'))
app.use('/user',require('./routes/user.js'))




app.listen(3000,()=>{
	console.log('server is running at 127.0.0.1');
})