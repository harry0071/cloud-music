//最新音乐
{
	let view = {
		el: '#new-song',
		render(songs) {
			songs.forEach((song) => {
				$li = $(`<li data-id="${song.id}">
                            <div class="song-info">
                                <p class="song-name">${song.songName}</p>
                                <p class="singer">${song.singer}</p>
                            </div>
                            <div class="playicon">播放按钮</div>
                        </li>`);
				$li.appendTo($(this.el));
			});
		},
	};
	let model = {
		data: {
			songs: []
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
			this.model.find().then(() => {
				this.view.render(this.model.data.songs);
			})

		},
	};
	controller.init(view, model);
}