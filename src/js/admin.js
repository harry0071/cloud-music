var fileName,
	fileSize,
	fileType,
	$form = $('#dropzoneUpload'),
	$iframe = $('#frames1');

function showFileData(source) {
	$form.hide()
	var file = source.files[0];
	fileName = file.name;
	fileSize = file.size;
	fileType = file.type;

	$form.submit();
	$iframe.on('load');
}
$form.submit(function(ev) {
	$('.show').html('loading........')
});

$iframe.on('load', function(ev) {
	event.preventDefault();
	$('.show').html(fileName + '外链地址:')
	$form.show()
});