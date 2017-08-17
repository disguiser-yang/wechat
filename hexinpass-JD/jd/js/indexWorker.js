
onmessage = function(e) {
	if (e.data.type == 1) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', e.data.ebase+'getOpenPlatformToken');
		xhr.onload = function() {
			console.log(xhr.responseText);
			var obj = JSON.parse(xhr.responseText);
			var token = null;
			if (obj.success == 1) {
				token = obj.results;
			} 
			postMessage({'type':1, 'token':token});
		}
		xhr.send();
	} else if (e.data.type == 2) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', e.data.ebase+'getUserShoppingCartNum');
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
		xhr.onload = function() {
			var obj = JSON.parse(xhr.responseText);
			var num = 0;
			if (obj.success == 1) {
				num = obj.results;
			}
			postMessage({'type':2, 'number': num});
		}
		xhr.send(JSON.stringify({'phone':e.data.phone}));
	}
}

