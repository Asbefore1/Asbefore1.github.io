/*
	options={
		page://需要显示的页码
		model://操作的数据模型
		projection://投影,就是id,name,isAdmin
		query://查询条件
		sort://排序
	}
*/
let pagination=(options)=>{
	return new Promise((resolve,reject)=>{
		//需要限制的页数
		let limit=2;

		//需要显示的页码	
		// req.query.page是指不传的情况下会走1,传非数字的话不能走
		let page=1;

		//不是数字的情况下
		if(!isNaN(parseInt(options.page))){
			page=parseInt(options.page)
		}
		
		if(page<=1){
			page=1
		}

		options.model.estimatedDocumentCount(options.query)
		.then((count)=>{//count总信息条数
			// console.log(count);
			//总页数=总信息条数/每页显示几条
			let pages=Math.ceil(count/limit);//向上取整,即剩下1条也显示
			if(page>pages){
				page=pages;
			}
			
			if(page==0){
				page=1;
			}

			let list=[];

			for(var i=1;i<=pages;i++){//i是第几页
				list.push(i)
			}


			//需要跳过的页数
			let skip=(page-1)*limit;
			//第一页显示2条  跳过0条
			//第二页显示2条  跳过2条
			//第三页显示2条  跳过4条
			//综上  发现规律：skip=(page-1)*limit

			//获取所有用户信息,分配给模板	
			options.model.find(options.query,options.projection)//'_id username isAdmin'只显示这么多
			.sort(options.sort)
			.skip(skip)
			.limit(limit)
			.then((docs)=>{
				resolve({
					docs:docs,
					page:page*1, //默认page是字符串,做了字符串拼接,*1变成数字
					list:list,
					pages:pages
				})
				// console.log(page)
				// console.log(req.userInfo)
			})
		})	
	})
}
module.exports=pagination;