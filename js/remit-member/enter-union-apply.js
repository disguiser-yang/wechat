/**
 * Created by Administrator on 2017/2/21.
 */
var errorArr = [];
var body = document.getElementsByTagName('body')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = port + '/html/lib/union.js';
body.appendChild(script);
//获取身份令牌
getToken(9);

$('.input-wrap input').focus(function() {
    $(this).css('textAlign', 'left')
});
$('.input-wrap input').blur(function() {
    if (!$(this).val().trim()) {
        $(this).css('textAlign', 'center')
    }
});
$('input').not('#department').click(function() {
    $('#hasUnit').css('bottom', '-20rem');
})
var width = $(window).height();
$(window).resize(function() {
    if (width > $(window).height()) {
        $('#footer').css('position', 'static');
    } else {
        $('#footer').css({ 'position': 'fixed', 'bottom': '0' });
    }
    width = $(window).height();
});

//身份证号禁止输入汉字
$('body').on('input', '.id-num', function() {
    var $this = $(this).val();
    if (isNaN($this) && !(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|[Xx])$/.test($this))) {
        if (!isNaN(parseInt($(this).val()))) {
            $(this).val(parseInt($(this).val()))
        } else {
            $(this).val('')
        }
    }
    if ($this.length > 18) {
        $(this).val(("" + $this).substring(0, 18));
    }
});
//手机号禁止输入汉字
$('body').on('input', '.phone-num', function() {
    var $this = $(this).val();
    if (isNaN($this)) {
        if (!isNaN(parseInt($(this).val()))) {
            $(this).val(parseInt($(this).val()))
        } else {
            $(this).val('')
        }
    }
    if ($this.length > 11) {
        $(this).val(("" + $this).substring(0, 11));
    }
});

// 在键盘按下并释放及提交后验证提交表单
$("#form-submit").validate({
    onsubmit: true,
    onfocusout: false,
    onkeyup: false,
    onclick: false,
    rules: {
        name: {
            required: true,
            isNullStr: true
        },
        nationality: {
            required: true
        },
        IDcard: {
            required: true,
            isIdCardNo: true,
            isNullStr: true
        },
        mobile: {
            required: true,
            isMobile: true,
            isNullStr: true
        },
        department: {
            required: true,
            isNullStr: true
        },
        politicsId: {
            required: true,
            isNullStr: true
        },
        districtId: {
            required: true,
            isNullStr: true
        },
        streetId: {
            required: true,
            isNullStr: true
        },
        address: {
            required: true,
            isNullStr: true
        }
    },
    messages: {
        name: {
            required: "请输入姓名",
            isNullStr: "请输入姓名"
        },
        nationality: "请选择民族",
        IDcard: {
            required: "请输入18位身份证号",
            isIdCardNo: "请输入18位身份证号",
            isNullStr: "请输入18位身份证号"
        },
        mobile: {
            required: "请输入11位手机号",
            isMobile: "请输入11位手机号",
            isNullStr: "请输入11位手机号"
        },
        department: {
            required: "请输入所在单位",
            isNullStr: "请输入所在单位"
        },
        politicsId: {
            required: "请选择政治面貌",
            isNullStr: "请选择政治面貌"
        },
        districtId: {
            required: "请选择所在区县",
            isNullStr: "请选择所在区县"
        },
        streetId: {
            required: "请选择所在街道",
            isNullStr: "请选择所在街道"
        },
        address: {
            required: "请输入地址",
            isNullStr: "请输入地址"
        }
    },
    errorPlacement: function(error, element) {
        errorArr.push(error.text());
    }
});

var unionId = 0,
    district = 0,
    street = 0;
mui('body').on('tap', '.my-btn', function() {
    $('input').blur();
    errorArr = [];
    if ($("#form-submit").valid()) {
        $('#tip').css('display', 'block');
        var dataId = $('#department').attr('data-id');
        if (dataId) {
            unionId = dataId;
        } else {
            unionId = 0
        }
        if ($('#district').attr('data-id')) {
            district = $('#district').attr('data-id');
        } else {
            district = 0
        }
        if ($('#street').attr('data-id')) {
            street = $('#street').attr('data-id');
        } else {
            street = 0
        }
        var politics = $('.politics').attr('data-type');
        var ajaxFormOption = {
            type: "post", //提交方式
            data: {
                token: token + '_' + terminal,
                unionId: unionId,
                district: district,
                street: street,
                politics: politics
            },
            dataType: "json",
            url: "/puhuihua/wechat/userInfo/joinUnion", //请求url
            success: function(data) { //提交成功的回调函数
                $('#tip').css('display', 'none');
                if (data.success) {
                    window.location.href = 'enter-union-success.html?unionPage=3'
                } else if (data.errorCode == 21) {
                    mui.toast('网络开小差了，请重试')
                } else if (data.errorCode == 24) {
                    mui.toast('信息审核中，请勿重复提交')
                } else if (data.errorCode == 23) {
                    mui.toast('您已是工会会员')
                } else if (data.errorCode == 0) {
                    mui.toast('网络开小差了')
                }
            }
        };
        $("form").ajaxSubmit(ajaxFormOption);
    } else {
        $.each(errorArr, function(i, val) {
            if (i == 0) {
                mui.toast(errorArr[0])
            }
        });
    }
});
//空格
jQuery.validator.addMethod("isNullStr", function(value, element) {
    var length = value.replace(/\s/g, "").length;
    return this.optional(element) || (length != 0);
}, "请输入有效字符。");
// 身份证号码验证
jQuery.validator.addMethod("isIdCardNo", function(value, element) {
    var idCard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
    var i = 0;
    var check = false;
    var arr = [];
    for (i; i < value.length; i++) {
        var num = value.substr(i, 1);
        if (num == 'x' || num == 'X') {
            num = 10;
        }
        arr.push(parseInt(num));
    }
    var coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var contrast = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    var total = 0;
    for (var j = 0; j < arr.length - 1; j++) {
        total = total + arr[j] * coefficient[j]
    }
    var remainder = total % 11;
    if (contrast[remainder] == arr[17]) {
        check = true;
    }
    return this.optional(element) || (idCard.test(value) && check);
}, "请输入正确的身份证号码。");
//手机号码验证
jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    return this.optional(element) || (length == 11 && /^1[3|4|5|7|8][0-9]\d{8}$/.test(value));
}, "请正确填写您的手机号码。");

//mui.ready(function() {
//56个名族选择器
var userPicker = new mui.PopPicker();
userPicker.setData([{ text: '汉族' }, { text: '蒙古族' }, { text: '回族' },
    { text: '藏族' }, { text: '维吾尔族' }, { text: '苗族' }, { text: '彝族' },
    { text: '壮族' }, { text: '布依族' }, { text: '朝鲜族' }, { text: '满族' },
    { text: '侗族' }, { text: '瑶族' }, { text: '白族' }, { text: '土家族' },
    { text: '哈尼族' }, { text: '哈萨克族' }, { text: '傣族' }, { text: '黎族' },
    { text: '僳僳族' }, { text: '佤族' }, { text: '畲族' }, { text: '高山族' },
    { text: '拉祜族' }, { text: '水族' }, { text: '东乡族' }, { text: '纳西族' },
    { text: '景颇族' }, { text: '柯尔克孜族' }, { text: '土族' }, { text: '达斡尔族' },
    { text: '仫佬族' }, { text: '羌族' }, { text: '布朗族' }, { text: '撒拉族' },
    { text: '毛南族' }, { text: '仡佬族' }, { text: '锡伯族' }, { text: '阿昌族' },
    { text: '普米族' }, { text: '塔吉克族' }, { text: '怒族' }, { text: '乌孜别克族' },
    { text: '俄罗斯族' }, { text: '鄂温克族' }, { text: '德昂族' }, { text: '保安族' },
    { text: '裕固族' }, { text: '京族' }, { text: '塔塔尔族' }, { text: '独龙族' },
    { text: '鄂伦春族' }, { text: '赫哲族' }, { text: '门巴族' }, { text: '珞巴族' },
    { text: '基诺族' }
]);
var showUserPickerButton = document.getElementById('showUserPicker');
showUserPickerButton.addEventListener('tap', function(event) {
    setTimeout(function() {
        userPicker.show(function(items) {
            showUserPickerButton.value = items[0].text;
        }, false);
    }, 300)
});

//政治面貌
var politicsPicker = new mui.PopPicker();
politicsPicker.setData([{ text: '中共党员', type: 'REPUBLICANS' }, { text: '团员', type: 'LEAGUE' }, { text: '民族党派', type: 'OTHER' }, { text: '群众', type: 'NONE' }]);
var politicsPickerButton = document.getElementById('politicsPicker');
politicsPickerButton.addEventListener('tap', function(event) {
    setTimeout(function() {
        politicsPicker.show(function(items) {
            politicsPickerButton.value = items[0].text;
            politicsPickerButton.setAttribute('data-type', items[0].type);
        }, false);
    }, 300)
});

//区县
var streetPicker = null;
var districtPicker = null;

function districtPic(departmentId) {
    districtPicker = null;
    streetPicker = null;
    if (!departmentId) {
        districtPicker = new mui.PopPicker();
        $('#address').removeAttr('readonly');
        var districtArr = [];
        var districtId = [];
        $.each(union.district, function(i, val) {
            districtId.push(val.id);
            districtArr.push(val.name);
        });
        districtPicker.setData(districtArr);
        var showDistrictPicker = document.getElementsByClassName('districtPicker')[0];
        showDistrictPicker.addEventListener('tap', function(event) {
            districtPicker.show(function(items) {
                showDistrictPicker.value = items[0];
                var index = districtArr.indexOf(items[0]);
                showDistrictPicker.setAttribute('data-id', districtId[index]);
            }, false);
        });
        //街道
        mui('body').on('tap', '.mui-poppicker-btn-ok', function() {
            if ($('#district').val().trim()) {
                streetPicker = new mui.PopPicker();
                var streetArr = [];
                var streetId = [];
                var dataId = $('#district').attr('data-id');
                $.each(union.district, function(i, val) {
                    if (val.id == dataId && val.list.length > 0) {
                        $.each(val.list, function(i, val) {
                            streetArr.push(val.name);
                            streetId.push(val.id)
                        });
                    }
                });
                streetPicker.setData(streetArr);
                var showStreetPicker = document.getElementsByClassName('streetPicker')[0];
                showStreetPicker.addEventListener('tap', function(event) {
                    streetPicker.show(function(items) {
                        console.log(items[0].length)
                        if (items[0].length) {
                            showStreetPicker.value = items[0];
                            var index = streetArr.indexOf(items[0]);
                            showStreetPicker.setAttribute('data-id', streetId[index]);
                        } else {
                            showStreetPicker.value = '无';
                        }
                    }, false);
                })
            }
        });

    }
}
//});

/*单位选择*/
mui('body').on('tap', '.list', function() {
    $('#address').attr('readonly', true);
    var unit = $(this).find('.unit');
    var department = unit.text();
    var departmentId = unit.attr('data-id');
    $('#district').removeAttr('data-id');
    $('#street').removeAttr('data-id');
    //判断有没有id
    districtPic(departmentId);

    var district = unit.attr('data-district');
    var address = unit.attr('data-address');
    var street = unit.attr('data-street');
    $('#department').val(department);
    $('#department').attr('data-id', departmentId);
    if (district != 'null' || district != 'undefined') {
        $('#district').val(district);
    }
    if (address != 'null' || address != 'undefined') {
        $('#address').val(address);
    }
    if (street != 'null' || street != 'undefined') {
        $('#street').val(street);
    }
    $('#import,#unit').css('right', '-20rem');
    $('.input-wrap input').blur();
    //$('#list-wrap').html('');
    $('#detail').css('display', 'block');
});
mui('body').on('tap', '#cancel', function() {
    $('#import').addClass('cancel-import');
    $('#list-wrap').removeClass('list-wrap-none');
});
mui('body').on('tap', '.union-list-none', function() {
    $('#import').removeClass('cancel-import');
    $('.input-wrap input').blur();
});
//手动输入
mui('body').on('tap', '#submit', function() {
    if ($('#handleSearch').val().trim()) {
        $('#address').removeAttr('readonly');
        $('#import,#unit').css('right', '-20rem');
        $('#department').val($('#handleSearch').val());
        $('#import').addClass('cancel-import');
        $('#handleSearch').val('');
        $('#search-input').val('');
        $('#district').val('');
        $('#department').removeAttr('data-id');
        $('#address').val('');
        $('#street').val('');
        $('#list-wrap').html('');
        districtPic();
        $('#detail').css('display', 'block');
    } else {
        mui.toast('请输入所在单位')
    }
});

/**
 * 上拉加载具体业务实现
 */

var toList = function(dataObj, type) {
    mui.post('/puhuihua/wechat/userInfo/unionList', dataObj, function(data) {
        if (data.success) {
            var dataJson = data.data.list;
            var district = "无";
            var street = "无";
            //下拉刷新
            if (type == 1) {
                /*下面这句很关键！*/
                //mui('#pullrefresh').pullRefresh().refresh(true);//有重新触发上拉加载的需求（比如当前类别已无更多数据，但切换到另外一个类别后，应支持继续上拉加载）
                $('#list-wrap').html('');
                $.each(dataJson, function(i, val) {
                    if (null != val.one) {
                        district = val.one.name;
                    }
                    if (null != val.two) {
                        street = val.two.name;
                    }
                    $('#list-wrap').append('<div class="union-list list">' +
                        '<div class="border-btm unit" data-district="' + district +
                        '" data-address="' + val.address + '" data-street="' + street +
                        '" data-id="' + val.id + '">' + val.name + '</div>' +
                        '</div>');

                });
            }
            //上拉加载
            if (type == 2) {
                $.each(dataJson, function(i, val) {
                    if (null != val.one) {
                        district = val.one.name;
                    }
                    if (null != val.two) {
                        street = val.two.name;
                    }
                    $('#list-wrap').append('<div class="union-list list">' +
                        '<div class="border-btm unit" data-district="' + district +
                        '" data-address="' + val.address + '" data-street="' + street +
                        '" data-id="' + val.id + '">' + val.name + '</div>' +
                        '</div>');
                });
            }
            if (data.data.pageNo == data.data.totalPage) {
                $('#list-wrap').append('<div class="union-list union-list-none">' +
                    '<div class="search" >没有找到我的单位，手动输入</div>' +
                    '</div>');
            }
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(!(data.data.pageNo <= data.data.totalPage));
        } else if (data.errorCode == 1) {
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

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        //下拉刷新
        down: {
            auto: true, //可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        },
        //上拉加载
        up: {
            contentrefresh: '正在加载...',
            contentnomore: '', //可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: pullupRefresh
        }
    }
});
var count = 0;

function pulldownRefresh() {
    setTimeout(function() {
        count = 1; //刷新并显示第一页
        data = {
            pageNo: count,
            name: $('#search-input').val().trim()
        };
        type = 1; //代表下拉刷新
        toList(data, type); //具体取数据的方法
    }, 100);
}

function pullupRefresh() {
    setTimeout(function() {
        count++; //翻下一页
        data = {
            pageNo: count,
            name: $('#search-input').val().trim()
        };
        type = 2; //代表上拉加载
        toList(data, type); //具体取数据的方法
    }, 100);
}
$('body').on('tap', '#department', function() {
    $('#hasUnit').css('bottom', '0');
});
$('body').on('tap', '#has', function() {
    $('input').blur();
    $('.search').removeClass('text-c').addClass('text-l');
    $('#search-input').css('textAlign', 'center').val('');
    $('#import,#unit').css('right', '0');
    $('.mui-scroll').css('transform', 'translateY(0px)');
    $('#hasUnit').css('bottom', '-20rem');
    $('#list-wrap').html('');
    count = 0;
    mui('#pullrefresh').pullRefresh().refresh(true);
    mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    mui('#pullrefresh').pullRefresh().pullupLoading();

});
$('body').on('tap', '#none', function() {
    $('input').blur();
    $('#department').val('无单位');
    $('#hasUnit').css('bottom', '-20rem');
    $('#detail').css('display', 'block');
    $('#department').removeAttr('data-id')
    $('#district').val('');
    $('#street').val('');
    $('#address').val('');
    //判断有没有id
    districtPic();
});
$('body').on('tap', '#district', function() {
    var r = $('#department').attr('data-id');
    if (!r) {
        $('#street').val('');
        $('#street').removeAttr('data-id')
    }
});
$('body').on('tap', '.close-icon', function() {
    $('#import,#unit').css('right', '-20rem');
    //$('#list-wrap').html('')
});


//输入框的enter事件
$('#search-input').bind('keyup', function(event) {
    if (event.keyCode == "13") {
        name = $(this).val().trim();
        pulldownRefresh();
        $('.mui-scroll').css({
            'transform': 'translate3d(0px, 0px, 0px) translateZ(0px)',
            'transition-timing-function': 'cubic-bezier(0.075, 0.82, 0.165, 1)'

        })
        $('#pullrefresh').removeClass('list-wrap-none');
    }
});
$('body').on('tap', '.sure', function() {
    name = $(this).val().trim();
    pulldownRefresh();
    $('.mui-scroll').css({
        'transform': 'translate3d(0px, 0px, 0px) translateZ(0px)',
        'transition-timing-function': 'cubic-bezier(0.075, 0.82, 0.165, 1)'

    })
    $('#pullrefresh').removeClass('list-wrap-none');
})

//操作回退的历史记录
// back('enter-union-apply');


$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {

        // alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能  

        window.location.href = 'enter-union-applied.html'


    }, false);

    function pushHistory() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState(state, "title", "#");
    }

});