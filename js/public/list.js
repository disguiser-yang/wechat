/**
 * Created by lihuan on 2017/1/9.
 */

/*获取轮播图*/
function carouseList(url) {
    mui.get(url, function(data) {
        var dataJson = data.data;
        if (dataJson.length > 1) {
            var obj1 = $.extend(true, {}, dataJson[0]);
            var obj2 = $.extend(true, {}, dataJson[dataJson.length - 1]);
            dataJson.unshift(obj2);
            dataJson.push(obj1);
            for (var i = 0; i < dataJson.length; i++) {
                if (i == 0 || i == dataJson.length - 1) {
                    dataJson[i].className = 'mui-slider-item-duplicate';
                } else {
                    dataJson[i].className = '';
                }
            }
            for (var j = 0; j < dataJson.length - 2; j++) {
                if (j == 0) {
                    $('#slider-indicator').append('<div class="mui-indicator  mui-active"></div>')
                } else {
                    $('#slider-indicator').append('<div class="mui-indicator"></div>')
                }
            }
        }

        $('#carousel-loop').tmpl(dataJson).appendTo('#slider-loop');
        document.querySelector('#slider').removeAttribute('data-imagelazyload');
        //懒加载图片
        mui('#slider').imageLazyload({
            placeholder: '../../images/public/default.png'
        });

        /*自动轮播设置*/
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 3000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    }, 'json');
}

/**
 * 上拉加载具体业务实现
 */

var toList = function(url, dataObj, type) {
    mui.get(url, dataObj, function(data) {
        //$('#load').css('display','none');

        if (data.success) {
            $.each(data.data, function(i, val) {
                val.createTime = val.createTime.substr(0, 10);
            });
            //上拉刷新
            if (type == 1) {
                $('#content-list').html('');
                /*下面这句很关键！*/
                mui('#pullrefresh').pullRefresh().refresh(true); //有重新触发上拉加载的需求（比如当前类别已无更多数据，但切换到另外一个类别后，应支持继续上拉加载）
                $('#list').tmpl(data.data).appendTo('#content-list');

            }
            //下拉加载
            if (type == 2) {
                $('#list').tmpl(data.data).appendTo('#content-list');
            }
            document.querySelector('#pullrefresh').removeAttribute('data-imagelazyload');
            //懒加载图片
            mui('#pullrefresh').imageLazyload({
                placeholder: '../../images/public/default2.png'
            });
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(!data.success);
        } else if (data.errorCode == 1) {
            if ($('#content-list').html().trim() == '') {
                setTimeout(function() {
                    $('#content-list').append('<div class="mui-text-center none">没有更多数据了</div>')
                }, 1000)
            }
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        } else if (data.errorCode == 0) {
            mui.toast('网络开小差了');
        } else {
            mui.toast('网络开小差了');
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        }
    }, 'json')
};

function pullupRefresh(url, prama) {

    /*获取列表*/
    mui.get(url, prama,
        function(data) {
            //$('#load').css('display','none');

            if (data.success) {
                var dataJson = data.data;
                $.each(dataJson, function(i, val) {
                    val.createTime = val.createTime.substr(0, 10);
                });
                $('#list').tmpl(dataJson).appendTo('#content-list');
                //懒加载图片
                mui('#pullrefresh').imageLazyload({
                    placeholder: '../../images/public/default2.png'
                });
            }
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(!data.success);
        }, 'json'
    );
}


/*点击列表数据进入详情页*/
function tabList(htmlName) {
    mui("#pullrefresh").on('tap', ".list", function() {
        var issueId = $(this).attr('id');
        window.location.href = htmlName + '.html?issueId=' + issueId
    });
}