/**
 * Created by Administrator on 2017/2/22.
 */
var searchKey=window.location.search;
var strs=searchKey.split("=");
var hasReview=false;
$.get('/puhuihua/wechat/promotion/promotionIssueDetails',{issueId:strs[1]},function(data){
        var dataJson=data.data;
        if(!dataJson.isArticle){
        	$('#footer').css('display','block');
            $('#footer button').attr('id',dataJson.statusCode);
            if(dataJson.statusCode!=2&&dataJson.statusCode!=5){
                $('#footer button').text(dataJson.statusDesc).css({
                    'border':'1px solid #999',
                    'backgroundColor':'#999'
                });
            } else if (dataJson.statusCode==5){
            	$.get('/puhuihua/wechat/promotion/toPromotionReview',
            		    {
            		        issueId:strs[1]
            		    }, function(data){
            		        if(data.success){
            		        	$('#footer button').text('精彩回顾');
            		        	$('#footer button').addClass('btn-success');
            		        	hasReview=true;
            		        }
            		        else if(data.errorCode==26){
            		        	$('#footer button').text('活动已结束').css({
            	                    'border':'1px solid #999',
            	                    'backgroundColor':'#999'
            	                });
            		        	hasReview=false;
            		        }
            		        else if(data.errorCode==0){
            		            mui.toast('网络开小差了');
            		        }
            		    },'json'
            		);
            }else if (dataJson.statusCode==2){
            	$('#footer button').addClass('btn-success')
            }
        }
        $('#template').tmpl(dataJson).appendTo('.hot-content');
        //懒加载图片
        mui('.hot-content').imageLazyload({
            placeholder: '../../images/public/default2.png'
        });
    },'json'
);
/*我要报名*/
$(document).on('click', 'button',function() {
    var statusCode=$('#footer button').attr('id');
    var issueId=$('.hot-content h3').attr('id');
    if(statusCode==2){
        //获取身份令牌
        //var token=local.getItem('token');
        if(!token){
            mui.confirm('您尚未登录'+'<br/>'+'前去登录', '提示', ['取消','确认'], function(e) {
                if (e.index == 1) {
                    window.location.href='../remit-member/login.html';
                    sessionStorage.setItem('page',12);
                }
            });
        }else{
            //素质提升活动报名页面
            $.get('/puhuihua/wechat/promotion/toPromotionApplication',
                {
                    token:token+'_'+terminal,
                    issueId:issueId
                }, function(data){
                    if(data.success){
                        var infor=data.data;
                        window.location.href='quality-promotion-activity-apply.html?issueId='+issueId+'&infor='+infor;
                    }
                    else if(data.errorCode==14){
                        mui.toast('该活动仅面向会员参与');
                    } else if (data.errorCode==15){
                        mui.toast('您已报名');
                    } else if(data.errorCode==8){
                        mui.confirm('身份验证出错'+'<br/>'+'前去登录', '提示', ['取消','确认'], function(e) {
                            if (e.index == 1) {
                                window.location.href='../remit-member/login.html';
                                sessionStorage.setItem('page',12);
                            }
                        })
                    } else if(data.errorCode==0){
                        mui.toast('网络开小差了')
                    }
                },'json'
            );
        }
    } else if (statusCode==5&&hasReview==true){
        //跳到精彩回顾页面
        window.location.href='activity-review.html?issueId='+issueId;
    }

});