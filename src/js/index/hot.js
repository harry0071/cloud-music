{
	let view={
		el:'.page-2',
		template:'',
		render(data){
			let updateTime = new Date(data.time);
			updateTime = updateTime.toLocaleDateString();
			     $(data.songs).each((i, song) =>{
                	this.template += `
                     <a class="m-sgitem" href="play?id=${song.id}">
                                <div class="sgfl">${i>8?i+1:'0'+(i+1)}</div>
                                <div class="sgfr f-bd f-bd-btm">
                                    <div class="sgchfl">
                                        <div class="f-thide sgtl">
                                            ${song.songName}${song.alia}
                                        </div>
                                        <div class="f-thide sginfo">
                                            ${song.singer} - ${song.album}
                                        </div>
                                    </div>
                                    <div class="sgchfr">
                                        <span class="u-hmsprt sgchply"></span>
                                    </div>
                                </div>
                            </a>`;
                });
			     
			     $(this.el).find('.m-sglst').html(this.template);
			     $(this.el).find('.hottime').html(`更新日期：${updateTime}`);
		},
	};

	let model={
		data:{
			time:0,
			songs:[],
		},
		find() {
			return $.get('https://www.easy-mock.com/mock/5aeda895c7cbfb7872a17616/music/hot', ({playlist}) => {
				this.data.time = playlist.trackNumberUpdateTime;
				
				let tracks = playlist.tracks;
				$(tracks).each((index, el) =>{
					let {id,name,ar,al}=el;
					let alia = '';

					if(el.alia.length>0){
						alia = `(${el.alia[0]})`;
					}
					this.data.songs.push({
						id,
						songName:name,
						singer:ar[0].name,
						album:al.name,
						alia:alia,

					});
				});
			});
		},
	};

	let controller={
		init(view,model){
			this.view=view;
			this.$el=$(this.view.el);
			this.model=model;
			this.bindEventHub();
		},
		bindEventHub(){
			window.eventHub.listen('clickTab',(tabName)=>{
				if (tabName === 'page-2') {
					this.$el.show();
					this.model.find().then(()=>{
					this.view.render(this.model.data);
					this.model.data={};
			});
				}else{
					this.$el.hide();
				}
			});
		},
	};

	controller.init(view,model);
}