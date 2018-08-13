{
	let view={
		el:'.page-3',
		template:`<h2 class="sectionTitle">搜索结果</h2>`,
		render(data){
			$(data.songs).each((i,song) => {
				this.template += `
				<a class="m-sgitem" href="play?id=${song.id}">
                                <div class="sgfr f-bd f-bd-btm">
                                    <div class="sgchfl">
                                        <div class="f-thide sgtl">
                                            ${song.songName}
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
			this.template += `
                    <div class="hotdn bottom-line" style="line-height:55px">
                        <span class="line"></span> 我是有底线的
                        <span class="line"></span>
                    </div>
                    <div class="bottom-line">本程序由孙大吉独立制作</div>`;
			$('#search-result').html(this.template);
		},
	};

	let model={
		data:{
			songs:[],
		},
		find(keywords){
			return $.get(`http://120.79.162.149:3000/search?keywords=${keywords}`,({result})=>{
				let {songs} = result;
				this.data.songs = [];
				$(songs).each((i,song) => {
					this.data.songs.push({
						id:song.id,
						songName:song.name,
						singer:song.artists[0].name,
						album:song.album.name
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
				if (tabName === 'page-3') {
					this.$el.show();
				}else{
					this.$el.hide();
				}
			});
			this.search();
		},
		search(){
			let timer = null;
			let keywords = '';
			$('#search-btn').on('keyup', () => {
				clearTimeout(timer);
				timer = setTimeout(()=>{
					$('.search-loading').css('display', 'block');
					$('#search-result').html('');
					keywords = $('#search-btn').val();
					this.model.find(keywords).then(data=>{
						$('.search-loading').css('display', 'none');
						this.view.template = `<h2 class="sectionTitle">搜索结果</h2>`;
						this.view.render(this.model.data);
					})
				},1000);
			});
		},
	};

	controller.init(view,model);
}