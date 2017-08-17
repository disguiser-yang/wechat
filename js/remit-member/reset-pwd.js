/*
* Created by Lihuan on 2017/1/10.
*/

//重置密码变量
var check=false;//验证密码格式是否通过变量
var check2=false;//验证两次密码是否相同变量

//验证密码格式
$('.once-pwd').blur(function(){
	if(!$(this).val().match(/^[a-zA-Z0-9_]{6,12}$/)){
        mui.toast('请输入6-12位密码，英文、数字或下划线');
		check=false;
	}else{
		check=true;
		$('.my-btn-login').css({
	        'border-color':"#EC2719",
	        'background-color':'#EC2719'
	    });
	}
});

//验证两次密码是否相同
$('.again-pwd').blur(function(){
    if($('.again-pwd').val().trim()!=''){
        if($('.again-pwd').val().trim()!=$('.once-pwd').val().trim()){
            mui.toast('密码不一致');
            check2=false;
        }
        else{
            check2=true;
        }
    }
});

//确定重置密码
$('#reset-pwd').click(function(){
	$('input').blur();
    if(check&&check2){
        var pwd=$('.again-pwd').val();
        var searchKey=window.location.search;
        var strs=searchKey.split("=");
        var token=strs[1];
        $('#tip').css('display','block');
        mui.post('/puhuihua/wechat/userInfo/resetPassword',
            {
                password:pwd,
                token:token+'_'+terminal
            }, function(data){
                $('#tip').css('display','none');
                if(data.success){
                    mui.toast('密码修改成功');
                    setTimeout(function(){
                        window.location.href='login.html'
                    },1000);
                }
                else if(data.errorCode==8){
                	mui.alert('身份验证出错'+'<br/>'+'前去登录', '提示', '是', function(e) {   
                        window.location.href='login.html'
                    })
                }
                else if(data.errorCode==0){
                    mui.toast('网络开小差了')
                }
            },'json'
        );
    }else if(!check){
        mui.toast('请输入6-12位密码，英文、数字或下划线');
    }else if(!check2){
    	mui.toast('密码不一致');
    }
});