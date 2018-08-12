const Router=require('express').Router;
const CommentModel=require('../models/comment.js');
const router=Router();

//添加评论
router.post('/add',(req,res)=>{
	let body=req.body;
	new CommentModel({
		article:body.id,
		user:req.userInfo.id,
		content:body.content
	})
	.save()
	.then(comment=>{
		res.json({
			code:0
		})
	})
})


module.exports=router;