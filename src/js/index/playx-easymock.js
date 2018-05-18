{
	let view = {
		el: '#app',
		template: ``,
		render(data) {
			this.template = `<div id="bg" style="background-image:url(${data.bg})"></div>
    <div id="play">
    <audio src="${data.url}"></audio>
    <div class="logo-container">
    <img src="../src/imgs/favicon.png" width=24 height=24><p class="logo">STAGE轻音乐</p></div>
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
      <h1>${data.songName} - ${data.singer}</h1>
      <div class="lyric">
        <div class="lines">
          
        </div>
      </div>
    </div>
    <!-- <div class="links">
      <a href="#">打开</a>
      <a class="main" href="#">下载</a>
    </div> -->
    </div>`;
			$(this.el).html(this.template);
			let title = $('.song-description>h1').html();
			$('title').html('STAGE轻音乐 - '+title);
		},
		parseLyric(text) {
			//将文本分隔成一行一行，存入数组
			let lines = text.split('\n'),
				//用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
				pattern = /\[\d+:\d+.\d+\]/g,
				//保存最终结果的数组
				result = [];
			//去掉不含时间的行
			while (!pattern.test(lines[0])) {
				lines = lines.slice(1);
			};
			//上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
			lines[lines.length - 1].length === 0 && lines.pop();
			lines.forEach((v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) => {
				//提取出时间[xx:xx.xx]
				let time = v.match(pattern),
					//提取歌词
					value = v.replace(pattern, '');
				//因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
				time.forEach((v1, i1, a1) => {
					//去掉时间里的中括号得到xx:xx.xx
					let t = v1.slice(1, -1).split(':');
					//将结果压入最终数组
					result.push([parseInt(t[0]) * 60 + parseFloat(t[1]), value]);
				});
			});
			//最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
			result.sort((a, b) => {
				return a[0] - b[0];
			});
			return result;
		}

	};
	let model = {
		data: {
			id: '',
			songName: '',
			singer: '',
			url: '',
			pic: '',
			lrc: '',
			bg: ''
		},
		getSongbyId(id) {
			return $.get(`https://www.easy-mock.com/mock/5aeda895c7cbfb7872a17616/music/lyric?id=${id}`, ({datas}) => {
				if (datas.lrc) {
					this.data.lrc = datas.lrc.lyric;
				} else {
					this.data.lrc = '';
				}

			}).then(() => {
				return $.get(`https://www.easy-mock.com/mock/5aeda895c7cbfb7872a17616/music/song/detail?ids=${id}`, ({datas}) => {
					var singer = '';
					if (datas.songs[0].ar[1]) {
						singer = datas.songs[0].ar[0].name + ' / ' + datas.songs[0].ar[1].name
					} else {
						singer = datas.songs[0].ar[0].name;
					}
					Object.assign(this.data, {
						id: id,
						songName: datas.songs[0].name,
						singer: singer,
						url: `http://music.163.com/song/media/outer/url?id=${id}.mp3`,
						pic: datas.songs[0].al.picUrl + '?imageView&thumbnail=170y170&quality=75&tostatic=0',
						bg: datas.songs[0].al.picUrl + '?imageView&thumbnail=20y20&quality=75&tostatic=0'
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
				this.view.render(this.model.data);
				let result = this.view.parseLyric(this.model.data.lrc);
				for (var i = 0; i < result.length; i++) {
					$(`<p data-time=${result[i][0]}>${result[i][1]}</p>`).appendTo('.lines')
				}
			});
			this.bindEvets();
		},
		bindEvets() {
			let toPlaying = false;
			$(this.view.el).on('click', '.disc', () => {
				let $audio = $('audio');
				let $icon = $('.icon');
				let $disc = $('.disc-container');
				let $pointer = $('.pointer');
				toPlaying = !toPlaying;
				if (toPlaying) {
					$audio[0].play();
					$icon.hide();
					$disc.add($pointer).addClass('active');
					$audio.on('ended', () => {
						toPlaying = false;
						$icon.show();
						$disc.add($pointer).removeClass('active');
					});
					$audio.on('timeupdate', ev=> {
						this.showLrc($audio[0].currentTime);
					});
				} else {
					$audio[0].pause();
					$icon.show();
					$disc.add($pointer).removeClass('active');

				}
			});
		},
		showLrc(songTime){
			let $allP = $(this.view.el).find('.lines>p');
			let $lines = $(this.view.el).find('.lines');
			$allP.each((i,item) =>{
				let currentTime = $allP.eq(i).data('time');
				let nextTime = $allP.eq(i+1).data('time');
				let move = 0;
				if (songTime>currentTime && songTime <nextTime) {
					//move = -$allP.eq(i).position().top+32;
					move = -$allP[i].offsetTop+32;
					if (move>0 || i==0) {
						move=0;
					}
					$allP.removeClass('active').eq(i).addClass('active');
					$lines.css({
						'-webkit-transform': `translateY(${move}px)`,
						'-ms-transform': `translateY(${move}px)`,
						'transform': `translateY(${move}px)`
					});
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
		}
	};

	controller.init(view, model);
}