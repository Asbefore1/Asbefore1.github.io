(function($){
	//验证的正则
	var passwordReg=/^\w{3,10}$/i;

	//用户注册处理
	$('#btn-sub').on('click',function(){
		//获取数据
		var password=$("[name='password']").val();
		var repassword=$("[name='repassword']").val();
		//验证
		var $errs=$('.err');
			
		//验证密码:3-10个字符
		if(!passwordReg.test(password)){
			$errs.eq(0).html('密码为3-10个字符');
			return false
		}else{
			$errs.html('')
		}

		if(password !=repassword){
			$errs.eq(1).html('两次密码不一致');
			return false
		}else{
			$errs.html('')
		}
	})
	
})(jQuery)