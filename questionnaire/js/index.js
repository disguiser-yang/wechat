 getToken1(27);
 var phone = local.getItem('phone');
 var token = local.getItem('token');

 function getToken1(page) {
     token = local.getItem('token');
     sessionStorage.setItem('page', page);
     if (!token) {
         window.location.replace('../../template/remit-member/login.html?enter=questionnaire');
     } else {
         $.post('/puhuihua/wechat/userInfo/validateToken', {
             token: token + '_' + terminal
         }, function(data) {
             if (!data.success) {
                 local.removeItem('token');
                 sessionStorage.setItem('page', page);
                 window.location.replace('../../template/remit-member/login.html?enter=questionnaire');
             } else {
                 //  sessionStorage.setItem('close', 'yes');
                 //  var phone = local.getItem('phone');
                 //  var token = local.getItem('token');
                 //  window.location.replace(activityPage + '?phone=' + phone + '&token=' + token + '_wechat');
             }
         }, 'json');
     }
 }


 //  mui('body').on('tap', '.item-span', function() {

 //  });

 var answerList = [];
 $('body').on('tap', '.item-span', function() {

     var isRepeat = false;
     for (i = 0; i < answerList.length; i++) {
         if (JSON.parse(answerList[i].id) == $(this).attr('id')) {
             isRepeat = true;
         }
     }
     if (!isRepeat) { //如果id不重复
         answerList.push({
             "id": parseInt($(this).attr('id')),
             "answerQuestion": [
                 //  $(this).attr('text')
                 $(this).find('span').html()
             ]
         })
     } else { //如果id重复
         if ($(this).attr('isSingle') == 1) { //多选

             if ($(this).hasClass('item-span-checked')) {
                 for (i = 0; i < answerList.length; i++) {
                     if (JSON.parse(answerList[i].id) == $(this).attr('id')) {
                         //  answerList[i].answerQuestion.push($(this).attr('text'));
                         removeByValue(answerList[i].answerQuestion, $(this).find('span').html());
                     }
                 }
             } else {
                 for (i = 0; i < answerList.length; i++) {

                     if (JSON.parse(answerList[i].id) == $(this).attr('id')) {
                         //  debugger;
                         answerList[i].answerQuestion.push($(this).find('span').html());
                     }
                 }
             }
         } else {
             //  debugger;
             for (i = 0; i < answerList.length; i++) {
                 if (JSON.parse(answerList[i].id) == $(this).attr('id')) {
                     answerList[i].answerQuestion = [$(this).find('span').html()];
                 }
             }
         }
     }


     //单选
     if ($(this).attr('isSingle') == 0) {
         $(this).siblings().removeClass('item-span-checked');
         $(this).addClass('item-span-checked');
         //  mui.toast($(this).text());
         //  mui.toast($(this).attr('id'));
         //  mui.toast($(this).attr('isSingle'));
         //  console.log(($(this).attr('text')));

     } else { //多选
         if ($(this).hasClass('item-span-checked')) {
             $(this).removeClass('item-span-checked');
         } else {
             $(this).addClass('item-span-checked');
         }

     }
     //  mui.toast('12
     console.log(answerList)
 });

 var allItemsNumber = '';
 getQuestionnaire();
 // 获取题目
 function getQuestionnaire() {
     $.post(questionBaseUrl + '/getQuestionnaire', JSON.stringify({ "token": token + '_' + terminal, "phone": phone }), function(data) {
         if (data.success == 0) {
             if (data.code == 400) {
                 $('.submit-btn').hide();
                 $('.main-content').addClass('already')
             } else {
                 mui.alert(data.msg, '', '确定', function() {});
                 $('.submit-btn').hide();
             }

         } else {
             //  data = JSON.parse(data);
             console.log(data.results)
             allItemsNumber = data.results.length;
             console.log(allItemsNumber)
             _templatePage('.main-content', 'itemList', { list: data.results }, true);
         }

         //  window.location.replace(activityPage + '?phone=' + phone + '&token=' + token + '_wechat');

     }, 'json');
 }


 mui('body').on('tap', '.submit-btn-a', function() {



     var isAllSelected = true;
     for (i = 0; i < answerList.length; i++) {
         if (answerList[i].answerQuestion.length == 0) {
             isAllSelected = false
         }
     }
     if (answerList.length == allItemsNumber) {
         if (isAllSelected) {
             //  mui.toast('做完')
             commitQuestionnaire();
         } else {
             mui.toast('请做完再提交')
         }
     } else {
         mui.toast('请做完再提交')
     }
 });


 //  commitQuestionnaire();
 // 提交答案
 var answers = {
     "token": token + '_' + terminal,
     "phone": phone,
     "answers": answerList
 }

 function commitQuestionnaire() {
     $('#tip').css('display', 'block');
     console.log(JSON.stringify(answers));
     //  debugger;
     $.ajax({
         type: 'POST',
         url: questionBaseUrl + '/commitQuestionnaire',
         data: JSON.stringify(answers),
         success: function(data, status, xhr) {
             debugger;
             data = JSON.parse(data);
             //  console.log(data.results)
             if (data.success == 1) {
                 localStorage.setItem('couponimage', data.results.image);
                 window.location.replace('./submit-success.html')
             } else {
                 mui.toast(data.msg);
             }
         },
         error: function(xhr, type) {
             console.log('出错了')
         }
     })
     setTimeout(function() {
         $('#tip').css('display', 'none');
         mui.alert('网络开小差了', '', '确定', function() {});
     }, 20000);
     //  $.post(questionBaseUrl + '/commitQuestionnaire', JSON.stringify({ answers }), function(data) {

     //      if (data.success == 1) {
     //          //  localStorage.setItem('couponimage', data.image);
     //          window.location.replace('./submit-success.html?img=' + data.image)
     //      } else {
     //          mui.toast(data.msg);
     //      }
     //      //  window.location.replace(activityPage + '?phone=' + phone + '&token=' + token + '_wechat');

     //  }, 'json');

 }

 function removeByValue(arr, val) {
     for (var i = 0; i < arr.length; i++) {
         if (arr[i] == val) {
             arr.splice(i, 1);
             break;
         }
     }
 }