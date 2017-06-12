;(function($, exports, ctx) {
	var musicPlayer = {
		/**
		 * 渲染播放器
		 * @param url 音乐地址
		 * @param elementId 要渲染到元素的id
		 */
		playAudio : function (url, elementId) {        	
			var html='<embed src="' + ctx + '/audio-player.swf"  flashvars="audioUrl='+url+'"   width="400" height="27" quality="best" wmode="transparent" type="application/x-shockwave-flash"  pluginspage="http://www.macromedia.com/go/getflashplayer"> </embed>';
			$("#" + elementId).html(html);    	
		}
	};

	exports.musicPlayer = musicPlayer;
})(jQuery, window, window.ctx || window.parent.ctx);