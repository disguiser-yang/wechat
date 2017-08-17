/**
 * Created by Lihuan on 2017/2/24.
 */
//获取精彩回顾详情信息
var searchKey=window.location.search;
var strs=searchKey.split("=");
$.get('/puhuihua/wechat/promotion/toPromotionReview',
    {
        issueId:strs[1]
    }, function(data){
        if(data.success){
            $('#template').tmpl(data.data).appendTo('.hot-content');
            //懒加载图片
            mui('.hot-content').imageLazyload({
                placeholder: '../../images/public/default2.png'
            });
        }
        else if(data.errorCode==0){
            mui.toast('网络开小差了');
        }
    },'json'
);