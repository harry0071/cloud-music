{
	let view={
		el:'.page-3'
	};

	let model={};

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
		},
	};

	controller.init(view,model);
}