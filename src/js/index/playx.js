{
	let view = {
		el: '#app',
		template: ``,
		render(data) {
			template = `<div id="bg" style="background-image:url(${data.bg})"></div>
    <div id="play">
    <audio src="${data.url}"></audio>
      <div class="disc-container">
      <img class="pointer" src="//s3.music.126.net/m/s/img/needle-ip6.png?be4ebbeb6befadfcae75ce174e7db862 " alt="">
      <div class="disc">
          <span class="icon"></span>
        <img class="ring" src="//s3.music.126.net/m/s/img/disc-ip6.png?69796123ad7cfe95781ea38aac8f2d48" alt="">
        <img class="light" src="//s3.music.126.net/m/s/img/disc_light-ip6.png?996fc8a2bc62e1ab3f51f135fc459577" alt="">
        <img src="${data.pic}" alt="" class="cover">
      </div>
    </div>
    <div class="song-description">
      <h1>${data.songName}-${data.singer}</h1>
      <div class="lyric">
        <div class="lines">
          
        </div>
      </div>
    </div>
    <div class="links">
      <a href="#">打开</a>
      <a class="main" href="#">下载</a>
    </div>
    </div>`;
			$(this.el).html(template);
		},

	};
	let model = {
		data: {
			id: '',
			songName: '',
			singer: '',
			url: '',
			pic: '',
			lrc:'',
			bg:''
		},
		getSongbyId(id) {
			return $.get(`http://musicapi.leanapp.cn/lyric?id=${id}`, datas=> {
				this.data.lrc= datas.lrc.lyric;
			}).then(()=>{
				return $.get(`http://musicapi.leanapp.cn/song/detail?ids=${id}`, datas => {
					var singer='';
					if (datas.songs[0].ar[1]) {
						singer=datas.songs[0].ar[0].name + ' / ' + datas.songs[0].ar[1].name
					}else{
						singer = datas.songs[0].ar[0].name;
					}
				Object.assign(this.data,{
					id:id,
					songName: datas.songs[0].name,
					singer: singer,
					url:`http://music.163.com/song/media/outer/url?id=${id}.mp3`,
					pic:datas.songs[0].al.picUrl+'?imageView&thumbnail=170y170&quality=75&tostatic=0',
					bg:datas.songs[0].al.picUrl+'?imageView&thumbnail=20y20&quality=75&tostatic=0'
				});
			});
			})
		}
	};
	let controller = {
		init(view, model) {
			this.view = view;
			this.model = model;
			let id = this.getSongId() || '';
			this.model.getSongbyId(id).then(() => {
				console.log(this.model.data)
				this.view.render(this.model.data);
			});
			this.bindEvets();
		},
		bindEvets(){
			let toPlaying = false;
			$(this.view.el).on('click', '.disc', ()=> {
				let $audio = $('audio');
				let $icon = $('.icon');
				let $disc = $('.disc-container');
				toPlaying=!toPlaying;
				if (toPlaying) {
					$audio[0].play();
					$icon.hide();
					$disc.addClass('playing');
					$audio.on('ended',() => {
						toPlaying=false;
						$icon.show();
						$disc.removeClass('playing');
					});
				}else{
					$audio[0].pause();
					$icon.show();
					$disc.removeClass('playing');

				}
			});
		},
		getSongId() {
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

	controller.init(view, model);
}