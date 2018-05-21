{
	let view={
		el:'#tabs'
	};
	let model={};
	let controller={
		init(view,model){
			this.view=view;
			this.$el=$(this.view.el);
			this.model=model;
			this.bindEvents();
		},
		bindEvents(){
			this.$el.on('click', '.tabs-nav>li', (ev) => {
				let $li = $(ev.currentTarget);
				let tabName = $li.data('tabname');
				window.eventHub.publish('clickTab',tabName);
				console.log(1)
				$li.addClass('active').siblings('li').removeClass('active');
			});
		},
	};

	controller.init(view,model);
}