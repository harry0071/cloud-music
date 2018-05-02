//最新音乐
{
	let view = {
		el: '#songs',
		template:'',
		render(songs) {
			songs.forEach((song) => {
				this.template += `<li>
                            <a href="play?id=${song.id}">
                                <h3>${song.songName}${song.alias}</h3>
                                <p>${song.singer1}${song.singer2} - ${song.albumName}</p>
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
			return $.get('http://musicapi.leanapp.cn/personalized/newsong', datas => {
				$(datas.result).each((index,item) => {
					if(item.song.alias[0]){
						alias = `(${item.song.alias[0]})`;
					}else {
						alias = ''
					}

					if (item.song.artists[1]) {
						singer2 = ` / ${item.song.artists[1].name}`;
					}else{
						singer2= '';
					}
					this.data.songs.push({
						id:item.id,
						songName:item.name,
						alias: alias,
						singer1:item.song.artists[0].name,
						singer2:singer2,
						albumName:item.song.album.name


					});
				});
				return datas;
			});
		},
	};
	let controller = {
		init(view, model) {
			this.view = view;
			this.model = model;
			this.model.find().then(data => {
				this.view.render(this.model.data.songs);
			})

		},
	};
	controller.init(view, model);
}