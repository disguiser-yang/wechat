 var searchKey = window.location.search;
 var randomAmount = searchKey.split("=")[1];
 if (randomAmount && randomAmount != 0) {
     $('.pocket-value').text(randomAmount);
     $('.random-red-pocket').show();
 } else {
     $('.random-red-pocket').hide();
 }

 var from = localStorage.getItem('from')


 // //跳转到银行卡详情页
 mui("body").on('tap', '#btn-convenient-pay', function() {
     if (from == 'pack') {
         window.location.replace(redPocket);
     } else {
         window.location.replace("bank-card.html");
     }
     localStorage.removeItem('from');
 });
 pushHistory();
 window.addEventListener("popstate", function(e) {
     //监听到了浏览器的返回按钮事件
     window.location.replace("bank-card.html");
 }, false);

 function pushHistory() {
     window.history.pushState('', "title", " ");
 }


 mui("body").on('tap', '#a-btn', function() {
     mui.toast($('input:radio:checked').val());
 });