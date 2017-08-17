
$(function(){
	mui.init();
	
	mui('body').on('tap', '.af-list-item', function(e){
		var orderId = parseInt(this.getAttribute('order'));
		if (e.target.className == 'af-list-item-operate-cancel') {
			cancelService(orderId);
		} else {
			location.href = 'afServiceDetail.html?order='+orderId;
		}
	});
	
	$(window).scroll(function(){
		var scrollHeight = Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
		var offSet = scrollHeight - $(this).scrollTop() - $(this).height();
        if (offSet <= 64){
        		if (loading.state != 1 && loading.state != 2) {
        			requestList();
        		}
        }
    });
	
	requestList();
});

var pageIndex = 1;
var loading = new loadingComponent(0);
function requestList() {
	loading.setState(1).appendToParent('#serviceList');
	window.IO({ 
		url:'getUserCustomerService',
		data:ts({
			'phone': getPhone(),
			'pageIndex':pageIndex++,
			'pageSize':5
		}),
		success: function(data){
			console.log(data); 
			if (data.success == 1) {
				loading.setState(0).removeDeriveParent('#serviceList');
				_templatePage('#serviceList', 'templateServiceList', {list:data.results, imgbase:imgbase}, pageIndex==2);
				if (data.results == null || data.results.length < 5) {
					loading.setState(2).appendToParent('#serviceList');
				} else {
					loading.setState(10).appendToParent('#serviceList');
				}
			} else { 
				appui.toast('请求失败，请稍后再试');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.toast('网络开小差咯');
		}
	});
}

function cancelService(orderId) {
	mui.confirm('确定取消该售后服务？', '提示', ['取消', '确定'], function(ret){
		if (ret.index == 1) {
			appui.showHUD();
			window.IO({ 
				url:'cancelCustomerService',
				data:ts({
					'serviceIdList': [orderId],
					'approveNotes': '测试'
				}),
				success: function(data){
					console.log(data); 
					if (data.success == 1) {
						appui.removeHUD(1, '取消成功');
						setTimeout(function(){
							location.reload();
						}, 2000);
					} else { 
						appui.removeHUD(2, '请求失败，请稍后再试');
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					appui.removeHUD(2, '网络开小差咯');
				}
			});
		}
	});
}
