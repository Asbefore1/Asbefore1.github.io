(function($){
	$register=$('#register');
	$login=$('#login');
	$userInfo=$('#userinfo');
	$('.go-login').on('click',function(){
		$login.hide();
		$register.show();
	})
	$('.go-register').on('click',function(){
		$register.hide();
		$login.show();
	})

	//验证的正则
	var usernameReg=/^[a-z][a-z|0-9|_]{2,9}$/i;
	var passwordReg=/^\w{3,10}$/i;

	//用户注册处理
	$('#sub-register').on('click',function(){
		//获取数据
		var username=$register.find("[name='username']").val();
		var password=$register.find("[name='password']").val();
		var repassword=$register.find("[name='repassword']").val();
		//验证
		var errMsg='';
		

		//验证用户名：以字母开头包含字母数字和下划线,3-10个字符
		if(!usernameReg.test(username)){
			errMsg='用户名以字母开头包含字母数字和下划线,3-10个字符';	
		//验证密码:3-10个字符
		}else if(!passwordReg.test(password)){
			errMsg='密码为3-10个字符';
		}else if(password !=repassword){
			errMsg='两次密码不一致';
		}
		//验证错误
		if(errMsg){
			//显示错误信息
			$register.find('.err').html(errMsg);
			return;
		}else{//验证通过发送ajax请求到后台
			$register.find('.err').html('');
			$.ajax({
				url:'/user/register',
				type:'post',
				dataType:'json',
				data:{
					username:username,
					password:password,										
				}
			})
			.done(function(result){//成功
				if(result.code===0){
					$('.go-login').trigger('click');
				}else{
					$register.find('.err').html(result.errmessage);
				}
			})
			.fail(function(err){//失败
				console.log(err);
			})
		}
	})



	//用户登录处理
	$('#sub-login').on('click',function(){
		//获取数据
		var username=$login.find("[name='username']").val();
		var password=$login.find("[name='password']").val();
		//验证
		var errMsg='';

		//验证用户名：以字母开头包含字母数字和下划线,3-10个字符
		if(!usernameReg.test(username)){
			errMsg='用户名以字母开头包含字母数字和下划线,3-10个字符';	
		//验证密码:3-10个字符
		}else if(!passwordReg.test(password)){
			errMsg='密码为3-10个字符';
		}

		//验证提交错误(输入的用户名密码格式错误)
		if(errMsg){
			//显示错误信息
			$login.find('.err').html(errMsg);
			return;
		}else{//验证通过发送ajax请求到后台
			$login.find('.err').html('');
			//发送数据到后端
			$.ajax({
				url:'/user/login',
				type:'post',
				dataType:'json',
				data:{
					username:username,
					password:password
				}
			})
			.done(function(result){//登录成功
				if(result.code===0){
					//第一次进来的时候userInfo是一个空对象,也就是没有cookies数据
					//$login.hide()隐藏,userInfo是空,相当于下面两行代码失效了
					//所以一点提交会消失,用重新刷新页面
					/*
					$login.hide();
					$userInfo.find('span').html(req.data.username);
					$userInfo.show();
					*/
					window.location.reload();
				}else{
					$login.find('.err').html(result.errmessage);
				}
			})
			.fail(function(err){//失败
				console.log(err);
			})
		}
	})
	

	//退出处理
	$('.logout').on('click',function(){//退出时销毁cookies
		$.ajax({
			url:'/user/logout',
			type:'get',
			dataType:'json'
		})
		.done(function(result){
			if(result.code===0){//退出成功
				window.location.reload();
			}
		})
		.fail(function(err){
			console.log(err);
		})
	})



	//发送文章列表的请求
	var $articlePage = $('#article-page');
	$articlePage.on('get-data',function(e,result){
	 	buildArticleList(result.data.docs);
	 	buildPage($articlePage,result.data.list,result.data.page)
	})
	$articlePage.pagination();

	function buildArticleList(articles){
	 	var html = '';
	 	for(var i = 0;i<articles.length;i++){
	 	var createdAt = moment(articles[i].createdAt).format('YYYY年MM月DD日 HH:mm:ss ');
	 	html +=`<div class="panel panel-default content-item">
			  <div class="panel-heading">
			    <h3 class="panel-title">
			    	<a href="/view/${articles[i]._id}" class="link" target="_blank">${ articles[i].title }</a>
				</h3>
			  </div>
			  <div class="panel-body">
				${ articles[i].intro }
			  </div>
			  <div class="panel-footer">
				<span class="glyphicon glyphicon-user"></span>
				<span class="panel-footer-text text-muted">
					${ articles[i].user.username }
				</span>
				<span class="glyphicon glyphicon-th-list"></span>
				<span class="panel-footer-text text-muted">
					${ articles[i].category.name }
				</span>
				<span class="glyphicon glyphicon-time"></span>
				<span class="panel-footer-text text-muted">
					${ createdAt }
				</span>
				<span class="glyphicon glyphicon-eye-open"></span>
				<span class="panel-footer-text text-muted">
					<em>${ articles[i].click }</em>已阅读
				</span>
			  </div>
			</div>`
		}
		$('#article-list').html(html);
	}

	 function buildPage($page,list,page){
	 	var html = `<li>
				      <a href="javascript:;" aria-label="Previous">
				        <span aria-hidden="true">&laquo;</span>
				      </a>
				    </li>`
	    for(i in list){
	    	if(list[i] == page){
	    		html += `<li class="active"><a href="javascript:;">${list[i]}</a></li>`;
	    	}else{
	    		html += `<li><a href="javascript:;">${list[i]}</a></li>`
	    	}
	    }

	 	html += `<li>
			      <a href="javascript:;" aria-label="Next">
			        <span aria-hidden="true">&raquo;</span>
			      </a>
			    </li>`
		
		$page.find('.pagination').html(html)	    
	}



	//发布评论
	var $commentPage = $('#comment-page');

	$('#comment-btn').on('click',function(){
		var articleId = $('#article-id').val();
		var commentContent = $('#comment-content').val();

		if(commentContent.trim() == ''){
			$('.err').html('评论内容不能为空');
			return false;
		}else{
			$('.err').html('')
		}

		$.ajax({
			url:'/comment/add',
			type:'post',
			dataType:'json',
			data:{id:articleId,content:commentContent}
		})
		.done(function(result){
			// console.log(result);
			if(result.code == 0){
				//1.渲染评论列表
				buildCommentList(result.data.docs)
				//2.渲染分页
				buildPage($commentPage,result.data.list,result.data.page)

				$('#comment-content').val('')
				// console.log(result.data.page)
			}
		})
		.fail(function(err){
			console.log(err)
		})
	});


	//构建评论列表
	function buildCommentList(comments){
		var html = '';
		for(var i = 0;i<comments.length;i++){
			var createdAt = moment(comments[i].createdAt).format('YYYY年MM月DD日 HH:mm:ss ');
			html += `
				<div class="panel panel-default">
				  <div class="panel-heading">
				  	${ comments[i].user.username } 发表于 ${createdAt}
				  </div>
				  <div class="panel-body">
				    ${ comments[i].content }
				  </div>
				</div>`
		}
		$('#comment-list').html(html);
	}

	
	$commentPage.on('get-data',function(e,result){
		buildCommentList(result.data.docs)
	 	buildPage($commentPage,result.data.list,result.data.page)
	 	// console.log(result)
	})
	
	$commentPage.pagination();


	
})(jQuery)