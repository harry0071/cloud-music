{
	let view = {
		el: '#play',
		template: ``,
		render(data) {
			this.template = `<audio src="${data.url}"></audio>
				<div>
           			<button>播放</button>
       			</div>
			`;
			$(this.el).html(this.template);
		}
	};
	let model = {
		data: {
			id: '',
			songName: '',
			singer: '',
			url: ''
		},
		getSongbyId(id) {
			var query = new AV.Query('Song');
			return query.get(id).then(({
				id,
				attributes
			}) => {
				this.data = {
					id,
					...attributes
				};
				return {
					id,
					...attributes
				};
			});
		}
	};
	let controller = {
		init(view, model) {
			this.view = view;
			this.model = model;
			let id = this.getSongId() || '';
			this.model.getSongbyId(id).then(() => {
				this.view.render(this.model.data);
			});
			this.bindEvets();
		},
		bindEvets(){
			let toPlaying = false;
			$(this.view.el).on('click', 'button', ()=> {
				toPlaying=!toPlaying;
				if (toPlaying) {
					$('audio')[0].play();
					$('button').html('暂停');
					$('audio').on('ended',() => {
						toPlaying=false;
						$('button').html('播放');
					});
				}else{
					$('audio')[0].pause();
					$('button').html('播放');

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