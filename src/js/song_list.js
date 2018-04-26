{
	let view = {
		el: '.song-list',
		template:`
		`,
		render(data){
			let {songs} = data;
			let $liList = songs.map((item, index) => {
				return $(`<li>${item.songName}</li>`);
			});
			$(this.el).empty();
			$liList.forEach((item, index) => {
				$(this.el).append(item)
			});
		}
	};

	let model = {
		data:{
			//songs:[{id:1,songName:'1'},{id:2,songName:'2'}]
			songs:[]
		},
		find(){

			var query = new AV.Query('Song');//对应数据库中的Class名称
		return query.find().then((datas) => {//将这个promise给return出去
    		//console.log(datas);获取全部数据
    		datas.forEach( (item, index) => {
    			this.data.songs.unshift({id:item.id,...item.attributes})
    		});
		});
		},
	};

	let controller = {
		init(view,model){
			this.view = view;
			this.model = model;
			this.view.render(this.model.data);
			window.eventHub.listen('saveSong',(songData)=>{
				this.model.data.songs.unshift(songData);
				this.view.render(this.model.data);
			});
			this.model.find().then(()=>{this.view.render(this.model.data)});
		}
		
	};

	controller.init(view,model);
}