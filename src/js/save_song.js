{
	let view = {
		el: '#add-song',
		$find(selector) {
			return $(this.el).find(selector);
		},
		template: `
		<label>歌名：<input type="text" id="songName" value="{{songName}}"></label>
    	<label>歌手：<input type="text" id="singer" value="{{singer}}"></label>
    	<label>链接：<input type="text" id="url" placeholder="请将外链地址复制到这"  value="{{url}}"></label>
    	<button type="button" id="btn-save">保存</button>
		`,
		render(data = {}) { //默认没有upload时，data是个空对象;不这样写的话，data.name就会报错，因为此时不存在data
			let needs = ['songName', 'singer', 'url']
			let html = this.template;
			needs.forEach((item) => {
				html = html.replace(`{{${item}}}`, data[item] || '');
			});
			$(this.el).html(html);
		},
		reset() {
			this.render({});
		}
	};

	let model = {
		data: {},
		updateData(data) {
			// 第一个参数是 className，第二个参数是 objectId
			let song = AV.Object.createWithoutData('Song', this.data.id);
			// 修改属性
			song.set('songName', data.songName);
			song.set('singer', data.singer);
			song.set('url', data.url);
			// 保存到云端
			return song.save().then((result) => {
				let {
					attributes: {
						songName,
						singer,
						url
					},
					id
				} = result;
				this.data = {
					id,
					songName,
					singer,
					url
				};
			});
		},
		save({
			songName,
			singer,
			url
		}) {
			//获取名为Song的Class库
			let Song = AV.Object.extend('Song');
			let song = new Song();
			return song.save({
				songName,
				singer,
				url
			}).then((result) => {
				let {
					attributes: {
						songName,
						singer,
						url
					},
					id
				} = result;
				this.data = {
					id,
					songName,
					singer,
					url
				};
			})
		}
	}

	let controller = {
		init(view, model) {
			this.view = view;
			this.$el = $(this.view.el);
			this.model = model;
			this.view.render(this.model.data);
			window.eventHub.listen('upload', (data) => {
				this.model.data = data;
				this.view.render(this.model.data)
			});
			window.eventHub.listen('editSong', (data) => {
				this.model.data = data;
				this.view.render(this.model.data);
			});
			this.bindEvents();
		},
		saveSong() {
			let needs = ['songName', 'singer', 'url'];
			let data = {};
			if (!$('#songName').val() || !$('#singer').val() || !$('#url').val()) {
				alert('请填写歌名、歌手、链接！');
				return;
			}
			needs.forEach((value, index) => { //要用箭头函数，不然this指向window
				data[value] = this.view.$find(`#${value}`).val();
			});
			//data={songName:'',singer:'',url:''}
			this.model.save(data)
				.then(() => {
					alert('歌曲保存成功!');
					this.view.reset();
					window.eventHub.publish('saveSong', JSON.parse(JSON.stringify(this.model.data)));
				});
		},
		updateSong() {
			let needs = ['songName', 'singer', 'url'];
			let data = {};
			if (!$('#songName').val() || !$('#singer').val() || !$('#url').val()) {
				alert('请填写歌名、歌手、链接！');
				return;
			}
			needs.forEach((value) => { //要用箭头函数，不然this指向window
				data[value] = this.view.$find(`#${value}`).val();
			});
			this.model.updateData(data).then(()=>{
				alert('修改歌曲信息成功');
				window.eventHub.publish('updateSong', JSON.parse(JSON.stringify(this.model.data)));
			});

		},
		bindEvents() {
			this.$el.on('click', '#btn-save', () => { //事件委托，不能直接给button绑定事件，因为渲染前不存在button，因此要将事件委托给已经存在的父级$el
				let id = this.model.data.id;
				if (id) {
					this.updateSong();
				} else {
					this.saveSong();
				}
			});

		}
	};

	controller.init(view, model);
}