//最新音乐
{
	let view = {
		el: '#songs',
		template:'',
		render(songs) {
			songs.forEach((song) => {
				this.template += `<li>
                            <a href="play?id=${song.id}">
                                <h3>${song.songName}</h3>
                                <p>${song.singer}</p>
                                <svg class="icon icon-play">
                                    <use xlink:href="#icon-play"></use>
                                </svg>
                            </a>
                        </li>`;
			});
			$(this.el).html(this.template);

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