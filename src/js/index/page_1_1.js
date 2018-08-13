//推荐歌单
{
	let view={
		el:'#playlist',
		template:'',
		render(playlists){
			playlists.forEach((playlist) => {
				var {id,name,picUrl,playCount} = playlist;
				this.template += `<li><a href="playlist?id=${id}" class="playlist-link">
                            <div class="cover">
                                <img width=105 src="${picUrl}?imageView&thumbnail=246x0&quality=75&tostatic=0&type=jpg" alt="封面">
                                <span class="playcount ear">${playCount>100000?(playCount/10000).toFixed(1)+'万':playCount.toFixed(0)}</span>
                            </div>
                            <p>${name}</p></a>
                        </li>`;
			});
			$(this.el).html(this.template);
		},
	};
	let model={
		data:{
			playlists:[]
		},
		find(){
			//http://120.79.162.149:3000/
			return $.get('https://cloud-music.leanapp.cn/personalized', ({result}) => {
				$(result).each((index, el) =>{
					if (index>5) {
						return;
					}
					let {id,name,picUrl,playCount} = el;
					this.data.playlists.push({
						id,
						name,
						picUrl,
						playCount
					});
				});
			});
		},
	};
	let controller={
		init(view,model){
			this.view=view;
			this.model=model;
			this.model.find().then(()=>{
				this.view.render(this.model.data.playlists);
			});

		},
	};
	controller.init(view,model);
}