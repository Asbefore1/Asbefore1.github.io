
(function($){
	ClassicEditor
    .create( document.querySelector( '#editor' ),{
    	language:'zh-cn',
    	ckfinder: {
			uploadUrl : '/admin/uploadImages'
		}
    } )
    .then(editor=>{
    	// console.log(editor)
    	window.editor=editor
    })
    .catch( error => {
        console.error( error );
    } );


    $('.btn').on('click',function(){
		//验证
		let AtricleName=$('[name="title"]').val();
		if(AtricleName.trim()==''){
			$('.err').eq(0).html('分类名称不能为空');
			return false;
		}else{
			$('.err').eq(0).html('');
		}

		let AtricleIntro=$('[name="intro"]').val();
		console.log(AtricleIntro)
		if(AtricleIntro.trim()==''){
			$('.err').eq(1).html('简介不能为空');
			return false;
		}else{
			$('.err').eq(1).html('');
		}

		let AtricleContent=window.editor.getData();
		if(AtricleContent.trim()=='<p>&nbsp;</p>'){
			$('.err').eq(2).html('内容不能为空');
			return false;
		}else{
			$('.err').eq(2).html('');
		}
	})
})(jQuery);