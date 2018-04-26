{
	let view = {
		el: '.song-list',
		template:`
		<li>xxx</li>
		<li>xxx</li>
		<li>xxx</li>
		<li>xxx</li>
		<li>xxx</li>
		<li>xxx</li>
		<li>xxx</li>
		<li>xxx</li>
		<li>xxx</li>
		<li>xxx</li>
		<li>xxx</li>
		<li>xxx</li>
		`,
		render(data){
			$(this.el).html(this.template);
		}
	};

	let model = {};

	let controller = {
		init(view,model){
			this.view = view;
			this.model = model;
			this.view.render(this.model.data);
		}
	};

	controller.init(view,model);
}