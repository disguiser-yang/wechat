/**
 * Created by Lihuan on 2017/1/10.
 */
mui("body").on('tap','.consume',function(){
    $("#recharge").css('display','none');
    $("#consume").css('display','block')
});
mui("body").on('tap','.recharge',function(){
    $("#consume").css('display','none');
    $("#recharge").css('display','block')
});
mui("body").on('tap','.pay',function(){
    mui.openWindow({
        url:'puhui-pay.html'
    });
});
mui("body").on('tap','.balance',function(){
    mui.openWindow({
        url:'balance.html'
    });
});
//切换tab公用方法
function changeTab(selecter,selecter2){
    $(selecter).removeClass("active");
    $(selecter2).addClass("active");
}

//普法宣传切换tab
mui("header").on('tap','.li-header',function(){
    changeTab(".li-header",this);
});