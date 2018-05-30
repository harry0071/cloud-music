{
	let view={
		el:'.page-1'
	};

	let model={};

	let controller={
		init(view,model){
			this.view=view;
			this.$el=$(this.view.el);
			this.model=model;
			this.bindEventHub();
			this.loadModule1();
			this.loadModule2();
		},
		bindEventHub(){
			window.eventHub.listen('clickTab',(tabName)=>{
				if (tabName === 'page-1') {
					this.$el.show();
				}else{
					this.$el.hide();
				}
			});
		},
		loadModule1(){
			$('<script src="src/js/index/page_1_1.js"></script>').appendTo('body');
		},
		loadModule2(){
			$('<script src="src/js/index/page_1_2.js"></script>').appendTo('body');
		},
	};

	controller.init(view,model);
}