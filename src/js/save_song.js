{
	let view = {
		el: '#add-song',
		$find(selector) {
			return $(this.el).find(selector);
		},
		template: `
		<label>歌名：<input type="text" id="songName" value="{{song_name}}"></label>
    	<label>歌手：<input type="text" id="singer"></label>
    	<label>链接：<input type="text" id="url" placeholder="请将外链地址复制到这"></label>
    	<button type="button" id="btn-save">保存</button>
		`,
		render(data = {}) { //默认没有upload时，data是个空对象;不这样写的话，data.name就会报错，因为此时不存在data
			let html = this.template.replace(/{{song_name}}/, data.name || '');
			$(this.el).html(html);
		}
		,reset(){
			this.render({});
		}
	};

	let model = {
		newData: {},
		save({songName,singer,url}) {
			//获取名为Song的Class库
			let Song = AV.Object.extend('Song');
			let song = new Song();
			return song.save({songName,singer,url}).then((result) => {
				alert('歌曲保存成功!');
				let {attributes:{songName,singer,url},id} = result;
				this.newData = {id,songName,singer,url};
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
				this.view.render(data)
			});
			this.bindEvents();
		},
		bindEvents() {
			this.$el.on('click', '#btn-save',() => {//事件委托，不能直接给button绑定事件，因为渲染前不存在button，因此要将事件委托给已经存在的父级$el
				let needs = ['songName', 'singer', 'url'];
				let data = {};
				if(!$('#songName').val() || !$('#singer').val() || !$('#url').val()){
					alert('请填写歌名、歌手、链接！');
					return;
				}
				needs.forEach((value, index) => { //要用箭头函数，不然this指向window
					data[value] = this.view.$find(`#${value}`).val();
				}); 
				//data={songName:'',singer:'',url:''}
				this.model.save(data)
				.then(()=>{
					this.view.reset();
					window.eventHub.publish('saveSong',this.model.newData);
				});
			});
		}
	};

	controller.init(view, model);
}