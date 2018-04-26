//先订阅，然后才能发布
window.eventHub = {
	events: {
		//eventName1： [fn1,fn2,fn3]
	},
	//发布↓ 找到对应的数组，把里面的函数都call一遍
	publish(eventName, data) {
		if (!this.events[eventName]) return;

		let fnList = this.events[eventName];
		fnList.forEach(function(fn, index) {
			fn.call(null, data);
		});


	},
	//订阅↓ 把函数放到数组里 订阅的js文件要放在发布之前
	listen(eventName, fn) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(fn);
	}
}