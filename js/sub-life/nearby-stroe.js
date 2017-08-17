/**
 * Created by Lihuan on 2017/2/21.
 */
$('body').on('tap','header>div',function(){
	$('header>div').removeClass('active');
    $(this).addClass('active');
    $('header>div').find('.arrow-icon').removeClass('icon-active');
    $(this).find('.arrow-icon').addClass('icon-active');
    if($($('aside').eq($(this).index())).css('display')=='block'){
    	$('aside').css('display','none');
    	$('header>div').removeClass('active');
		$('header>div').find('.arrow-icon').removeClass('icon-active');
    }else{
    	$('aside').css('display','none');
    	$('aside').eq($(this).index()).css('display','block');
    } 
});
$('body').on('tap','#pullrefresh',function(){
    $('aside').css('display','none');
});
$('body').on('tap','aside .mui-scroll>div',function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
});
$('body').on('tap','aside #channel-wrap>div',function(){
    var channelId=$(this).attr('id');
    $('#city-second-menu>div').css('display','none');
    if($(this).index()==0){
        $('#nearby').css('display','block')
    }else if ($(this).index()==1){
        $('#hot').css('display','block')
    }else{
        $('#city-second-menu').find('div[data-area-id='+channelId+']').css('display','block')
    }
   
});
$('body').on('tap','aside #type-wrap>div',function(){
    var channelId=$(this).attr('id');
    $('#type-menu>div').css('display','none');
//    $('header>div').removeClass('active');
//	$('header>div').find('.arrow-icon').removeClass('icon-active');
    if($(this).index()==0){
        $('#all-type').css('display','block')
    }else{
    	$('#type-menu').find('div[data-parent-id='+channelId+']').css('display','block')
    }
});

//排序
function sortNumber(a,b)
{
    return a.orderId-b.orderId
}
//请求商圈和地区列表
mui.get('/puhuihua/wechat/mall/areaAndCircle',
    function(data){
		$('#load').css('display','none')
        if(data.success){
            var dataJson=data.data.data;
            var arr=[];
            var areaList=dataJson.areaList.sort(-sortNumber);
            var shoppingList=dataJson.shoppingList.sort(sortNumber);
            $.each(areaList,function(i,val){
                if(val.pid==1){
                    $('#channel-wrap').append('<div class="mui-navigate-right" id="'+val.id+'">'+val.areaName+'<span></span></div>');
                    arr.push(val.id);
                }
            });
            $.each(arr,function(i,val){
                $('#city-second-menu').append('<div data-area-id="'+val+'">' +
                    '<div data-shopping-area-id="0" >全部<span></span></div>'+
                    '</div>');
                $.each(shoppingList,function(j,m){
                    if(m.areaId==val){
                        $('#city-second-menu>div').eq(i+2).append('<div data-shopping-area-id="'+m.shoppingAreaId+'">'+m.shoppingAreaName+'<span></span></div>');
                    }
                });
            });

            /*热门商圈*/
            $.each(shoppingList,function(j,m){
                if(m.hot==1&&$.inArray(parseInt(m.areaId),arr)!=-1){
                    $('#city-second-menu>#hot').append('<div data-shopping-area-id="'+m.shoppingAreaId+'">'+m.shoppingAreaName+'<span></span></div>');
                }
            });
        }
    },'json'
);
//请求类型列表
mui.get('/puhuihua/wechat/mall/merchantType',
    function(data){
        if(data.success){
            var dataJson=data.data.data;
            var typeList=dataJson.sort(sortNumber);
            var arr=[];
            $.each(typeList,function(i,val){
                if(val.parentId==0){
                    $('#type-wrap').append('<div class="mui-navigate-right" id="'+val.id+'">'+val.typeName+'<span></span></div>');
                    arr.push(val.id);
                }
            });
            $.each(arr,function(i,val){
            	 $('#type-menu').append('<div data-parent-id="'+val+'">' +
                         '<div data-type-id="'+val+'" >全部<span></span></div>'+
                         '</div>');
                $.each(typeList,function(j,m){
                    if(m.parentId==val){
                        $('#type-menu>div').eq(i+1).append('<div data-type-id="'+m.id+'">'+m.typeName+'<span></span></div>');
                    }
                });
            });

        }
    },'json'
);

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        down: {//下拉刷新
            auto:true,//可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        },
        up: {//上拉加载
            //auto:true,//可选,默认false.自动上拉加载一次
            contentrefresh: '正在加载...',
            contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: pullupRefresh
        }
    }
});

//获取列表
var toList = function(dataObj,type) {
    mui.post('/puhuihua/wechat/mall/nearbyMerchantList', dataObj,function(data){
        if(data.success){
            var shoppingAreas="";
            if(type==1){//上拉刷新
                /*下面这句很关键！*/
                mui('#pullrefresh').pullRefresh().refresh(true);//有重新触发上拉加载的需求（比如当前类别已无更多数据，但切换到另外一个类别后，应支持继续上拉加载）
                $('#content-list').html('');
                $.each(data.data.data.merchantList,function(i,val){
                    if(val.shoppingAreas.indexOf(',')!=-1||val.shoppingAreas.indexOf('/')!=-1){
                        var areasArry=val.shoppingAreas.split(/[,/]/);
                        shoppingAreas=areasArry[0]+'/'+areasArry[1];
                    }else{
                        shoppingAreas=val.shoppingAreas;
                    }
                    $('#content-list').append('<div class="line-box" data-merchantId="'+val.merchantId+'">'
                        +'<div class="mui-row">'
                        +'<div class="mui-col-xs-4 pic">'
                        +'<img class="mui-pull-left" data-lazyload="'+data.data.imagePrefix+val.img+'" />'
                        +'</div>'
                        +'<div class="mui-col-xs-8 infor">'
                        +'<div class="mui-ellipsis">'+val.merchantName+'</div>'
                        +'<p>'
                        +'<span  class="mr-1">'+val.typeName+'</span><span  class="mr-1">'+shoppingAreas+'</span><span>'+val.distance+'m</span>'
                        +'</p>'
                        +'</div>'
                        +'</div>'
                        +'</div>');
                });
            }
            if(type==2){//下拉加载
                $.each(data.data.data.merchantList,function(i,val){
                    if(val.shoppingAreas.indexOf(',')!=-1||val.shoppingAreas.indexOf('/')!=-1){
                        var areasArry=val.shoppingAreas.split(/[,/]/);
                        shoppingAreas=areasArry[0]+'/'+areasArry[1];
                    }else{
                        shoppingAreas=val.shoppingAreas;
                    }
                    $('#content-list').append('<div class="line-box" data-merchantId="'+val.merchantId+'">'
                        +'<div class="mui-row">'
                        +'<div class="mui-col-xs-4 pic">'
                        +'<img class="mui-pull-left" data-lazyload="'+data.data.imagePrefix+val.img+'" />'
                        +'</div>'
                        +'<div class="mui-col-xs-8 infor">'
                        +'<div class="mui-ellipsis">'+val.merchantName+'</div>'
                        +'<p>'
                        +'<span  class="mr-1">'+val.typeName+'</span><span  class="mr-1">'+shoppingAreas+'</span><span>'+val.distance+'m</span>'
                        +'</p>'
                        +'</div>'
                        +'</div>'
                        +'</div>');
                });
            }
            document.querySelector('#content-list').removeAttribute('data-imagelazyload');
            //懒加载图片
            mui('#content-list').imageLazyload({
                placeholder: '../../images/public/default2.png'
            });
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(!data.success);
        } else if(data.errorCode==1){
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        } else if(data.errorCode==0){
                mui.toast('网络开小差了')
        } else {
            mui.toast('网络开小差了');
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        }
    },'json')
};

var data={};
var geolocation = new BMap.Geolocation();
/*下拉刷新*/
function pulldownRefresh() {
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            count = 1;//刷新并显示第一页
            data.lng=r.point.lng;
            data.lat=r.point.lat;
            data.page=count;
            type=1;//代表下拉刷新
            toList(data,type);//具体取数据的方法
        }
        else {
            mui.toast('定位失败');
        }
    },{enableHighAccuracy: true});
}
/*上拉加载*/
function pullupRefresh() {
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            count++;//翻下一页
            data.lng=r.point.lng;
            data.lat=r.point.lat;
            data.page=count;
            type=2;//代表上拉加载 
            toList(data,type);//具体取数据的方法
        }
        else {
            mui.toast('定位失败');
        }
    },{enableHighAccuracy: true});
}
if(mui.os.plus) {
    mui.plusReady(function() {
        setTimeout(function() {
            mui('#pullrefresh').pullRefresh().pulldownLoading();
        }, 1000);
    });
} else {
    mui.ready(function() {
        mui('#pullrefresh').pullRefresh().pulldownLoading();
    });
}

/*按全城筛选*/
$('body').on('tap','aside #city-second-menu>div>div',function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    $('aside').css('display','none');
    $('header>div').removeClass('active');
	$('header>div').find('.arrow-icon').removeClass('icon-active');
    $('#content-list').html('');
    var shoppingAreaId=$(this).attr('data-shopping-area-id');
    var areaId=$(this).parent().attr('data-area-id');
    count = 0;
    if($(this).parent().index()==0){
        data.distance=$(this).attr('data-distance');
        delete data.shoppingAreaId;
        delete data.areaId;
    }else if ($(this).parent().index()==1){
        delete data.areaId;
        data.shoppingAreaId=shoppingAreaId;
    }else{
        data.shoppingAreaId=shoppingAreaId;
        data.areaId=areaId;
    }
    mui('#pullrefresh').pullRefresh().refresh(true);
    mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    mui('#pullrefresh').pullRefresh().pullupLoading();
});

/*按全部类型筛选*/
$('body').on('tap','aside #type-menu>div>div',function(){
	$(this).siblings().removeClass('active');
    $(this).addClass('active');
    $('aside').css('display','none');
    $('header>div').removeClass('active');
	$('header>div').find('.arrow-icon').removeClass('icon-active');
    $('#content-list').html('');
    count = 0;
    data.typeId=$(this).attr('data-type-id');
    mui('#pullrefresh').pullRefresh().refresh(true);
    mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    mui('#pullrefresh').pullRefresh().pullupLoading();
});

/*点击列表进入详情页*/
mui("#pullrefresh").on('tap', ".line-box",function() {
	if($('.type-option').css('display')=='block'||$('.time-option').css('display')=='block'){
		$('aside').css('display','none');
		$('header>div').removeClass('active');
		$('header>div').find('.arrow-icon').removeClass('icon-active');
	}else{
		var merchantId=$(this).attr('data-merchantId');
	    window.location.href='nearby-stroe-detail.html?merchantId='+merchantId
	}
});

