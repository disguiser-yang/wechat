 var token = local.getItem('token');
 var REDIRECT_URI = encodeURIComponent(url + '/puhuihua/wechat/userInfo/getOpenId');

 //  getToken(25);
 sessionStorage.setItem('page', 25);
 if (!!token) {
     if (isWX) {
         window.sessionStorage.setItem('enter', '3');
         window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + REDIRECT_URI + '&response_type=code&scope=snsapi_base&state=' + token + '_' + terminal + '#wechat_redirect'
     } else {
         hasPayPassword('puhui-pay.html?enter=2', 4, 'set-pay-pwd')
     }
 } else {
     window.location.href = 'login.html';
 }