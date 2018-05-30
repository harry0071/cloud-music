//最新音乐
{
	let view = {
		el: '#songs',
		template:'',
		render(songs) {
			songs.forEach((song) => {
				this.template += `<li>
                            <a href="play?id=${song.id}">
                            <div class="song-info">
                                <h3>${song.songName}${song.alias}</h3>
                                <p>${song.singer1}${song.singer2} - ${song.albumName}</p></div>
                                <div class="playsvg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="#AAAAAA">
                    <path d="M512 0C229.376 0 0 229.376 0 512S229.376 1024 512 1024c282.616633 0 512-229.376 512-512S794.616633 0 512 0z m0 984.528115c-247.292317 0-472.528115-225.228432-472.528115-472.528115S264.707683 39.471885 512 39.471885s472.528115 225.228432 472.528115 472.528115-225.235799 472.528115-472.528115 472.528115z"></path>
                    <path d="M408.524432 311.185496l302.757755 201.838504-302.757755 201.838504z"></path>
                    <path d="M408.524432 725.912863a11.065094 11.065094 0 0 1-11.05036-11.050359V311.185496a11.05036 11.05036 0 0 1 17.179626-9.193899L717.411453 503.822734a11.057727 11.057727 0 0 1 0 18.387798L414.653698 724.056403a11.065094 11.065094 0 0 1-6.129266 1.85646z m11.050359-394.077928v362.37813l271.787281-181.196432-271.787281-181.181698z"></path>
                </svg>
            </div>
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
			return $.get('http://120.79.162.149:3000/personalized/newsong', datas => {
				$(datas.result).each((index,item) => {
					let alias,singer2;
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