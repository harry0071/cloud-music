{
	let view = {
		el: '#add-song',
		$find(selector){
			return $(this.el).find(selector);
		},
		template: `
		<label>歌名：<input type="text" id="songName" value="{{song_name}}"></label>
    	<label>歌手：<input type="text" id="singer"></label>
    	<label>链接：<input type="text" id="url" placeholder="请将外链地址复制到这"></label>
    	<button type="button" id="save">保存</button>
		`,
		render(data={}){//默认没有upload时，data是个空对象;不这样写的话，data.name就会报错，因为此时不存在data
			let html = this.template.replace(/{{song_name}}/,data.name || '');
			$(this.el).html(html);
		}
	};

	let model = {};

	let controller = {
		init(view, model){
			this.view = view;
			this.$el = $(this.view.el);
			this.model = model;
			this.view.render(this.model.data);
			window.eventHub.when('upload', (data) => {
				this.view.render(data)
			});
			this.bindEvents();
		}
		,bindEvents(){
			this.view.$find('#save').on('click', () => {
				let needs = ['songName','singer','url'];
				let data = {};
				needs.forEach((value,index) =>{//要用箭头函数，不然this指向window
					data[value] = this.view.$find(`#${value}`).val();
				});
				console.log(data)
			});
		}
	};

	controller.init(view,model);
}