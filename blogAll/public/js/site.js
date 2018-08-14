(function($){
	  
	$('.btn-remove').on('click',function(){
		// console.log(this)
		// console.log(this.parentNode)
		$(this.parentNode).remove()
	})
	$('.btn-add').on('click',function(){
		// console.log(this)//dom元素
		var $this=$(this);//jquery对象
		// console.log($this)
		// console.log($this.siblings())
		var $dom=$this.siblings().eq(0).clone(true);
		$dom.find('[type="text"]').val('');
		$(this.parentNode).append($dom)
	})

})(jQuery);