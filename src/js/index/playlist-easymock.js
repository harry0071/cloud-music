//推荐歌单
{
	let view={
		el:'#j-app',
		template:'',
		render(data){
			this.template += `<div class="m-playlist u-paddlr u-paddbm">
            <section class="u-plhead pylst_header">
                <div class="plhead_bg" style="background-image:url(${data.coverImgUrl}?param=170y170);"></div>
                <div class="plhead_wrap">
                    <div class="plhead_fl lsthd_fl">
                        <img class="u-img" src="${data.coverImgUrl}?imageView&amp;thumbnail=252x0&amp;quality=75&amp;tostatic=0&amp;type=jpg">
                        <span class="lsthd_icon">歌单</span>
                        <i class="u-earp lsthd_num" data-reactid="9">${data.playCount>100000?(data.playCount/10000).toFixed(1)+'万':data.playCount.toFixed(0)}</i>
                    </div>
                    <div class="plhead_fr">
                        <h2 class="f-thide2 f-brk lsthd_title">${data.name}</h2>
                    </div>
                </div>
            </section>
            <section class="pylst_intro">
                <div class="lstit_tags">
                	标签：
                    <em class="f-bd f-bd-full lstit_tag">${data.tags[0]}</em>
                    <em class="f-bd f-bd-full lstit_tag">${data.tags[1]}</em>
                    <em class="f-bd f-bd-full lstit_tag">${data.tags[2]}</em>
                </div>
                <div class="u-intro">
                    <div class="f-brk">简介：`;
            data.description.split('\n').forEach(value=>{
            	this.template += `
                        <span>
                            <i>${value}</i>
                            <br>
                        </span>`;
            });
            
            this.template += `</div>
                </div>
            </section>
            <div class="pylst_list">
                <h3 class="u-smtitle">歌曲列表</h3>
                <ol class="u-songs">`;

                $(data.songs).each((i, songs) =>{
                	this.template += `
                    <li class="u-song">
                    	<a href="play?id=${songs.id}" class="playsong">
                        <div class="sgi_fl">${i+1}</div>
                        <div class="sgi_fr f-bd f-bd-btm">
                            <div class="sgich_fl">
                                <div class="f-thide sgich_tl">
                                	${songs.songName}
                                </div>
                                <div class="f-thide sgich_info">
                                    ${songs.singer} - ${songs.album}
                                </div>
                            </div>
                            <div class="sgich_fr">
                                <span class="u-hmsprt sgich_ply"></span>
                            </div>
                        </div></a>
                    </li>`;
                });
                

            this.template += `</ol>
            </div>
            <div class="bottom-line"><span class="line"></span> 我是有底线的 <span class="line"></span></div>
           <div class="bottom-line">本程序由孙大吉独立制作</div> 
        </div>
        `;
        $(this.el).html(this.template);
		},
	};
	let model={
		data:{
			tags:[],
			coverImgUrl:'',
			description:'',
			name:'',
			playCount:0,
			songs:[],
		},

		getByid(id){
			return $.get(`https://www.easy-mock.com/mock/5aeda895c7cbfb7872a17616/music/playlist/detail?id=${id}`, ({datas:{playlist}}) => {
				Object.assign(this.data,{
					tags:playlist.tags,
					coverImgUrl:playlist.coverImgUrl,
					description:playlist.description,
					name:playlist.name,
					playCount:playlist.playCount,
				});
				
				let tracks = playlist.tracks;
				$(tracks).each((index, el) =>{
					let {id,name,ar,al}=el;
					this.data.songs.push({
						id,
						songName:name,
						singer:ar[0].name,
						album:al.name

					});
				});
			});
		},
	};
	let controller={
		init(view,model){
			this.view=view;
			this.model=model;
			let id = this.getId() || '';
			this.model.getByid(id).then(()=>{
				this.view.render(this.model.data);
				console.log(1)
			});

		},
		getId() {
			let search = location.search.slice(1); //a=xxxx&b=yyyy
			let arr = search.split('&'); //['a=xxx', 'b=yyy'];
			arr = arr.filter(v => v); //过滤falsy值
			let id = '';
			for (let i = 0; i < arr.length; i++) {
				let key_value = arr[i].split('=');
				let key = key_value[0];
				let value = key_value[1];
				if (key === 'id') {
					id = value;
					break;
				}

			}
			return id;
		},
	};
	controller.init(view,model);
}