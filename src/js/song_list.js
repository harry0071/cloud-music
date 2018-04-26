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
	};

	let controller = {
		init(view,model){
			this.view = view;
			this.model = model;
			this.view.render(this.model.data);
			window.eventHub.listen('saveSong',(songData)=>{
				this.model.data.songs.push(songData);
				this.view.render(this.model.data);
			})
		}
		
	};

	controller.init(view,model);
}