 $(function() {
     pushHistory();

     window.addEventListener("popstate", function(e) {
         pushHistory();
         var searchKey = window.location.search;
         var isEnter = searchKey.split("=")[1];
         if (isEnter == 'setpaypwd') {
             window.location.href = 'set-pay-pwd.html'
         } else if (isEnter == 'wallet') {
             window.location.href = 'set-pay-pwd.html?enter=puhuiwallet'
         } else if (isEnter == 'userhelp') {
             window.location.href = 'user-help.html'
         } else {
             window.location.href = 'puhui-pay.html'
         }

     }, false);

     function pushHistory() {
         var state = {
             title: "title",
             url: "#"
         };
         window.history.pushState(state, "title", "#");
     }

 });