$(function() {
    mui.init();
    // $('.address-list').height($(window).height() - 64 + 'px');
    mui('body').on('tap', '#addressAddBtn', function() {
        location.href = 'addressEdit.html?sku=' + getQueryString('sku');
    });
    requestAddressList();
});

function requestAddressList() {
    appui.showHUD();
    window.IO({
        url: 'getUserAddress',
        data: ts({
            'phone': getPhone()
        }),
        success: function(data) {
            console.log(data);
            if (data.success == 1) {
                generateUIBindingEvents(data.results);
                appui.removeHUD();
            } else {
                appui.removeHUD(2, '加载失败，请稍后再试');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            appui.removeHUD(2, '网络开小差咯');
        }
    });
}

function addressSetDefault(obj) {
    var index = obj.parentElement.getAttribute('index');
    appui.showHUD('正在设置');
    window.IO({
        url: 'setMainAddress',
        data: ts({
            'phone': getPhone(),
            'addressId': parseInt(index)
        }),
        success: function(data) {
            console.log(data);
            if (data.success == 1) {
                appui.removeHUD(1, '设置成功');
            } else {
                appui.removeHUD(2, '设置失败，请稍后再试');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            appui.removeHUD(2, '网络开小差咯');
        }
    });
}

function generateUIBindingEvents(data) {
    _templatePage('.address-list', 'addressList', { list: data }, true);

    mui('.address-list').on('tap', '.address-list-item-check', function() {
        if ($(this).hasClass('appui-icon-hud-select')) {
            return;
        }
        $('.address-list').find('.appui-icon-hud-select').each(function() {
            $(this).removeClass('appui-icon-hud-select');
            $(this).addClass('appui-icon-hud-unselect');
        });
        $(this).removeClass('appui-icon-hud-unselect');
        $(this).addClass('appui-icon-hud-select');

        addressSetDefault(this);
    });
    mui('.address-list').on('tap', '.address-list-cell-operation-default', function() {
        mui.trigger($(this).prev().get(0), 'tap');
    });

    mui('.address-list').on('tap', '.address-list-cell-operation-edit', function() {
        var index = this.parentElement.getAttribute('index');
        location.href = 'addressEdit.html?id=' + index + '&sku=' + getQueryString('sku') + '&norder=' + getQueryString('norder');
    });

    mui('.address-list').on('tap', '.address-list-cell-operation-delete', function() {
        var index = this.parentElement.getAttribute('index');
        var parentItem = $(this).parent().parent();
        mui.confirm('确定删除该地址吗？', '提示', ['取消', '确定'], function(result) {
            if (result.index == 1) {
                appui.showHUD();
                window.IO({
                    url: 'logistics',
                    data: ts({
                        'typeId': 3,
                        'userAddressInfo': {
                            'id': parseInt(index)
                        }
                    }),
                    success: function(data) {
                        // debugger;
                        if (data.success == 1) {
                            appui.removeHUD(1, '删除成功');
                            parentItem.remove();
                        } else {
                            appui.removeHUD(2, '删除失败，请稍后再试');
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        appui.removeHUD(2, '网络开小差咯');
                    }
                });
            }
        })
    });

    mui('.address-list').on('tap', '.address-list-cell', function(e) {
        // debugger;
        if (e.target.parentElement == this && e.target.className != 'address-list-cell-operation' && getQueryString('norder') != '1') {
            var addressId = this.querySelector('.address-list-cell-operation').getAttribute('index');
            location.replace('submitOrder.html?sku=' + getQueryString('sku') + '&addressid=' + addressId);
        }
    });
}