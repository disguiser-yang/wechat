$(function(){
	var jdOrderId = getQueryString('order');
	var time = getQueryString('time');
	if (!jdOrderId) return;
	
	appui.showHUD();
	window.IO({ 
		url:'getOrderTrack',
		data:ts({
			'phone': getPhone(),
			'id':jdOrderId
		}),
		success: function(data){
			console.log(data);
			if (data.success == 1) {
				var timeStr = new Date(parseInt(time)*1000).pattern("yyyy-MM-dd HH:mm:ss");
				var trackArr = data.results.orderTrack;
				if (trackArr != null) trackArr = trackArr.reverse();
				_templatePage('#content', 'contentTemplateId', {list:trackArr, order:jdOrderId, time:timeStr}, true);
				$('.track-list-item-circle').each(function(index, ele){
					var h = $(this).parent().parent().parent().height();
					this.style.marginTop = (h - 10)/2+'px';
					if (index == 0) {
						$(this).parent().next().css('top', h/2+15+'px');
					}
				});
				appui.removeHUD();
			} else {
				appui.removeHUD(2, '请求失败，请稍后再试');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
});	