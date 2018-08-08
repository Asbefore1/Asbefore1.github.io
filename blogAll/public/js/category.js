
(function($){
	$('.btn').on('click',function(){
		//验证
		let cateName=$('[name="name"]').val();
		if(cateName.trim()==''){
			$('.err').html('分类名称不能为空');
			return false;
		}else{
			$('.err').html('');
		}
	})
})(jQuery);