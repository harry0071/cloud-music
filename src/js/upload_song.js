{
	let view = {
		el: '#form-container',
		$find(selector) { //在当前模块内找，而不是整个html中找
			return $(this.el).find(selector);
		},
		template: `
		<form action="https://catbox.moe/user/api.php" method="post" enctype="multipart/form-data" id="dropzoneUpload" target="frame1">
        <input type="hidden" name="reqtype" value="fileupload">
        <input type="hidden" name="userhash" value="9c0ab3d006f4d0d08f0c7ac95">
        <label>
            <p>上传文件</p>
            <input type="file" name="fileToUpload" id="files" onchange="showFileData(this)">
        </label>
    </form>
    <iframe id="frames1" name="frame1" frameborder="0" height="40"></iframe>
    <p class="show"></p>
		`,
		render(data) {
			$(this.el).html(this.template);
		}
	};

	let model = {};

	let controller = {
		init(view, model) {
			this.view = view;
			this.model = model;
			this.view.render(this.model.data);
		},
		uploadSong() {

		}
	};

	controller.init(view, model);
	///////////////////////////

	let fileName,
		fileSize,
		fileType,
		$form = $('#dropzoneUpload'),
		$iframe = $('#frames1'),
		$show = $('.show');

	function showFileData(source) {
		$form.hide();
		let data = {};
		let file = source.files[0];
		fileName = file.name;
		fileSize = file.size;
		fileType = file.type;
		data={
			songName:fileName,
			id:''
		};
		window.eventHub.publish('upload', data);

		$form.submit();
		$iframe.on('load');
	}
	$form.submit((ev) => {
		$iframe.hide();
		$show.empty();
		$show.html(`正在获取外链地址........<br><br>文件名：${fileName}<br><br>文件类型：${fileType}<br><br>文件大小：${(fileSize/1024/1024).toFixed(3)} MB`);
	});

	$iframe.on('load', (ev) => {
		event.preventDefault();
		$show.html('请将外链地址复制到下方输入框');
		$iframe.show();
		$form.show()
	});

	window.eventHub.listen('saveSong', () => {
		$iframe.hide();
		$show.empty();
	});

	window.eventHub.listen('editSong', () => {
		$iframe.hide();
		$show.empty();
	});

}