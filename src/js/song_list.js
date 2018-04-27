{
	let view = {
		el: '.song-list',
		template: `
		`,
		render(data) {
			let {
				songs,
				selectedSongId
			} = data;
			let $liList = songs.map((item) => {
				let $li = $(`<li data-id="${item.id}"><p class="song-name">${item.songName}</p><p class="singer">${item.singer}</p><p style="display:hidden" data-url="${item.url}"></p></li>`);
				if(item.id===selectedSongId){
					$li.addClass('li-active');
				}
				return $li;
			});
			$(this.el).empty();
			$liList.forEach((item, index) => {
				$(this.el).append(item)
			});
		},
		removeActiveLi(){
			let $li = $('li');
			$li.removeClass('li-active');
		}
	};

	let model = {
		data: {
			//songs:[{id:1,songName:'1'},{id:2,songName:'2'}]
			songs: [],
			selectedSongId:''
		},
		find() {

			var query = new AV.Query('Song'); //对应数据库中的Class名称
			return query.find().then((datas) => { //将这个promise给return出去
				//console.log(datas);获取全部数据
				datas.forEach((item, index) => {
					this.data.songs.unshift({
						id: item.id,
						...item.attributes
					})
				});
			});
		},
	};

	let controller = {
		init(view, model) {
			this.view = view;
			this.model = model;
			this.view.render(this.model.data);
			this.bindEvents();
			this.getAllSongs();
			this.bindEventHub();


		},
		bindEvents() {
			$(this.view.el).on('click', 'li',(ev) =>{
				let id = $(ev.currentTarget).data('id');
				this.model.data.selectedSongId = id;
				this.view.render(this.model.data);
				let data={};
				let songs = this.model.data.songs;
				for (var i = 0; i < songs.length; i++) {
					if (id===songs[i].id) {
						data = songs[i];
						break;
					}
				}
				window.eventHub.publish('editSong',JSON.parse(JSON.stringify(data)));
			});
		},
		bindEventHub() {
			window.eventHub.listen('saveSong', (songData) => {
				this.model.data.songs.unshift(songData);
				this.view.render(this.model.data);
			});

			window.eventHub.listen('upload',()=>{
				this.view.removeActiveLi();
			});

			window.eventHub.listen('updateSong', (songData) => {
				let songs = this.model.data.songs;
				for (let i = 0; i < songs.length; i++) {
					if(songs[i].id===songData.id){
						songs[i]=songData;
					}
				}
				this.view.render(this.model.data);
			});
		},
		getAllSongs(){
						this.model.find().then(() => {
				this.view.render(this.model.data)
			});
		},

	};

	controller.init(view, model);
}