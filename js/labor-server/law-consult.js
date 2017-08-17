/**
 * Created by Lihuan on 2017/4/5.
 */
//获取身份令牌
var token=local.getItem('token');
if(!token){
    window.location.href='../remit-member/login.html';
    sessionStorage.setItem('page',24);
} else {
    $.post('/puhuihua/wechat/userInfo/validateToken',
        {
            token:token+'_'+terminal
        }, function(data){
            if(!data.success){
                local.removeItem('token');
                window.location.href='../remit-member/login.html';
                sessionStorage.setItem('page',24);
            }
        },'json'
    );
}
//获取留言表
function pullRefresh(url,prama,type) {
    //获取留言表
    mui.post(url,prama, function(data){
        if(data.success){
            var dataJson=data.data;
            $.each(dataJson,function(i,val){
                if(!val.headImage){
                    val.headImage='static/wechat/images/public/headImg.png';
                }
                if(!val.feedback){
                    val.className='remove'
                }
                else{
                    val.className=''
                }
            });
            //上拉刷新
            if(type==1){
                /*下面这句很关键！*/
                mui('#pullrefresh').pullRefresh().refresh(true);//有重新触发上拉加载的需求（比如当前类别已无更多数据，但切换到另外一个类别后，应支持继续上拉加载）
                $('#content-list').html('');
                $('#list').tmpl(dataJson).appendTo('#content-list');
            }
            //下拉加载
            if(type==2){
                $('#list').tmpl(dataJson).appendTo('#content-list')
            }
            document.querySelector('#pullrefresh').removeAttribute('data-imagelazyload');
            //懒加载图片
            mui('#pullrefresh').imageLazyload({
                placeholder: '../../images/public/headImg.png'
            });
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(!data.success);
        }
        else if(data.errorCode==1){
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        } else if(data.errorCode==0){
            mui.toast('网络开小差了');
        } else {
            mui.toast('网络开小差了');
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        }
        if(!$('#content-list').children().length){
        	$('.interaction-content').css('padding','0')
        	//$('.interaction-content').text('暂无数据')
        }else{
        	$('.interaction-content').css('padding','.75rem .75rem 0')
        }
        },'json'
    );
}
/*初始化上拉加载*/
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        //下拉刷新
        down: {
            auto:true,//可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        },
        //上拉加载
        up: {
            contentrefresh: '正在加载...',
            contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: pullupRefresh
        }
    }
});
function pulldownRefresh() {
    setTimeout(function() {
        count = 1;//刷新并显示第一页
        data={
            token:token+'_'+terminal,
            pageNo:count
        };
        type=1;//代表下拉刷新
        pullRefresh('/puhuihua/wechat/legal/consultationList',data,type);//具体取数据的方法
    }, 100);
}

function pullupRefresh() {
    setTimeout(function() {
        count++;//翻下一页
        data={
            token:token+'_'+terminal,
            pageNo:count
        };
        type=2;//代表上拉加载
        pullRefresh('/puhuihua/wechat/legal/consultationList',data,type);//具体取数据的方法
    }, 100);
}


//让留言域如果没有内容时失去焦点时显示提示字符
$(document).on('input','.words-textarea',function(){
    $('.residue-word').text($(this).val().trim().length);
    if($(this).val().trim()==''){
        $('.my-btn').removeClass('btn-success').addClass('btn-fail');
    }
    else{
        $('.my-btn').removeClass('btn-fail').addClass('btn-success');
        if($(this).val().trim().length>=300){
            var wordsSubstr=$(this).val().trim().substring(0,300);
            $(this).val(wordsSubstr);
            $('.residue-word').text(wordsSubstr.length);
        }
    }
});

//提交留言
$(document).on('click','.btn-success',function(){
    var content=$('.words-textarea').val().trim();
    if(content.length<=300){
        $('#tip').css('display','block');
        $.post('/puhuihua//wechat/legal/addConsultation',
            {
                content:content,
                token:token+'_'+terminal
            }, function(data){
                $('#tip').css('display','none');
                if(data.success){
                    mui.toast('提交成功');
                    setTimeout(function(){
                        $('.words-textarea').val('');
                        $('.my-btn').removeClass('btn-success').addClass('btn-fail');
                       /* $('.interaction-content-box').html('');*/
                        pulldownRefresh()
                        /*mui('#pullrefresh').pullRefresh().refresh(true);*/
                    },1000)
                }
                else if(data.errorCode==8){
                    mui.alert('身份验证出错'+'<br/>'+'前去登录', '提示', '是', function(e) {
                        window.location.href='login.html';
                        sessionStorage.setItem('page',24);
                    })
                }
                else if(data.errorCode==0){
                    mui.toast('网络开小差了')
                }
                else{
                    mui.toast('提交失败');
                }
            },'json'
        );
    }
});