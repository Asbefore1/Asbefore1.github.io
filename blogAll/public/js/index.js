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
					password:password
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
					$login.hide();
					$userInfo.find('span').html(result.data.username);
					$userInfo.show();
				}else{
					$login.find('.err').html(result.errmessage);
				}
			})
			.fail(function(err){//失败
				console.log(err);
			})
		}
	})
	
})(jQuery)