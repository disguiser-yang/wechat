/**
 * Created by lihuan on 2017/1/9.
 */
$('.content-detail *').css('backgroundColor','transparent');

function getDetail(url){
    var searchKey=window.location.search;
    var strs=searchKey.split("=");
    $.get(url,{issueId:strs[1]},function(data){
            $('#load').css('display','none');
            var dataJson=data.data;
            dataJson.createTime=dataJson.createTime.substr(0,10);
            if(!dataJson.isOut){
                $('#template').tmpl(dataJson).appendTo('.hot-content');
                //懒加载图片
                mui('.hot-content').imageLazyload({
                    placeholder: '../../images/public/default2.png'
                });
            }else{
            	$('body').html('<iframe src="'+dataJson.targetUrl+'" style="width:100%;height:100%;border:none;"></iframe>')
            }
        },'json'
    );
}
function getDetail2(url){
    var searchKey=Id=window.location.search;
    var strs=searchKey.split("=");
    var issueType=strs[2];
    var issueId=strs[1].split("&")[0];
    $.get(url,{
            issueId:issueId,
            issueType:issueType
        },function(data){
            $('#load').css('display','none');
            var dataJson=data.data;
            dataJson.createTime=dataJson.createTime.substr(0,10);
            if(!dataJson.isOut){
                $('#template').tmpl(dataJson).appendTo('.hot-content');
                //懒加载图片
                mui('.hot-content').imageLazyload({
                    placeholder: '../../images/public/default2.png'
                });
            }else{
            	$('body').html('<iframe src="'+dataJson.targetUrl+'" style="width:100%;height:100%;border:none;"></iframe>')
            }
        },'json'
    );
}

