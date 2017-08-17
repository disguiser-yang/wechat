/**
 * Created by Lihuan on 2017/3/31.
 */
//身份证号禁止输入汉字
$('body').on('input','.idNo',function(){
    var $this=$(this).val();
    if(isNaN($this)&&!(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|[Xx])$/.test($this))){
        if(!isNaN(parseInt($(this).val()))){
            $(this).val(parseInt($(this).val()))
        }else{
            $(this).val('')
        }
    }
    if($this.length>18){
        $(this).val((""+$this).substring(0,18));
    }
});
//表单输入完整时变红
var check=[false,false];
$('body').on('input','input',function(){
    $('input').each(function(i,val){
        var length=$(this).val().trim();
        if(length!=0){
            check[i]=true;
        } else {
            check[i]=false;
        }
    });
    if(check.indexOf(false)<0){
        $('.my-btn').addClass('btn-success')
    }else{
        $('.my-btn').removeClass('btn-success')
    }
});
//表单验证
mui('body').on('tap','.btn-success',function(){
    var idNo=$('.idNo').val().trim();
    var i=0,arr=[];
    var checkNum=false;
    for(i;i<idNo.length;i++){
        var num=idNo.substr(i,1);
        if(num=='x'||num=='X'){
            num=10;
        }
        arr.push(parseInt(num));
    }
    var coefficient=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
    var contrast=[1,0,10,9,8,7,6,5,4,3,2];
    var total=0;
    for(var j=0;j<arr.length-1;j++){
        total=total+arr[j]*coefficient[j]
    }
    var remainder=total%11;
    if(contrast[remainder]==arr[17]){
        checkNum=true;
    }
    if(checkNum){
       /* $('form').css('display','none');
        $('#insurance-wrap').css('display','block')*/
    	mui.toast('为了您个人的信息安全，该功能将在通过相关安全信息认证后开通')
    }else{
        mui.toast('请输入18位正确的身份证号')
    }
});
