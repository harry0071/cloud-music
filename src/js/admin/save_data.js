
//获取名为Song的Class库
/*var Song = AV.Object.extend('Song');
var song = new Song();
song.save({
songName: '小幸运',
singer: '田馥甄',
url: 'htpp://xxx.mp3'
}).then(function(object) {
alert('歌曲保存成功!');
});*/

function xxx(xxxx) {
	var Playlist = AV.Object.extend('Playlist');
var playList = new Playlist();
playList.save({
	listName: 'xx的专辑',
	cover: '封面图',
	createrID: '管理员',
	desc: '简介',
	songs: ['歌曲1', '歌曲2', '歌曲3']
}).then(function(object) {
	alert('歌单保存成功!');
})
}
