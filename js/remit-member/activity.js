 sessionStorage.setItem('from', 'activity');
 getToken1(26);

 function getToken1(page) {
     token = local.getItem('token');
     sessionStorage.setItem('page', page);
     if (!token) {
         window.location.replace('login.html?enter=activity');
     } else {
         $.post('/puhuihua/wechat/userInfo/validateToken', {
             token: token + '_' + terminal
         }, function(data) {
             if (!data.success) {
                 local.removeItem('token');
                 sessionStorage.setItem('page', page);
                 window.location.replace('login.html?enter=activity');
             } else {
                 sessionStorage.setItem('close', 'yes');
                 var phone = local.getItem('phone');
                 var token = local.getItem('token');
                 window.location.replace(activityPage + '?phone=' + phone + '&token=' + token + '_wechat');
             }
         }, 'json');
     }
 }