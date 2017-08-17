
$(function(){
	appui.showHUD();
	window.IO({ 
		url:'getProductDetail', 
		data:ts({
			'phone':getPhone(),
			'sku':parseInt(getQueryString('sku'))
		}),
		success: function(data){
			var d = JSON.parse(data);
			console.log(d);
			if (d.success == 1) {
				generateUI(d.results.detail);
				$('#cartBagedId').html(d.results.shoppingCartNum);
				appui.removeHUD();
			} else {
				appui.removeHUD(2, '请求失败，请稍后再试');	
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
});

var detailData = null;
function generateUI(data) {
	detailData = data;
	if (window.app && app.setHtmlTitle) {
		window.app.setHtmlTitle(data.name);
	} else {
		document.title = data.name;
	}
	_templatePage('#content', 'contentTemplateId', {detail:data, imgbase:imgbase}, true);
	
	newDetailInit();
	generateUI_2();
}

function getCookie(b) {
	var a, c = new RegExp("(^| )" + b + "=([^;]*)(;|$)");
	if (a = document.cookie.match(c)) {
		return unescape(a[2])
	} else {
		return null
	}
}

function goProdBtnFn() {
	var b = document.querySelectorAll(".pro-button-box");
	if (b.length > 0) {
		for (var a = 0; a < b.length; a++) {
			b[a].removeEventListener("click", headerslider.btmDetailBackToTop, false);
			b[a].addEventListener("click", goViewDetail, false)
		}
	}
}

function goViewDetail() {
//	if ($("#detailView").length > 0) {
//		$("#detailView").click()
//	} else {
//		var a = window.location.href;
//		if (a) {
//			a = a.split("#")[0]
//		}
//		window.location.href = a
//	}
}

function slideExposureFn(c, d, a) {
	var b = 0;
	if (!c || !c.length || c.css("display") == "none") {
		return
	}
	$(window).on("scroll",
	function() {
		if (d == "top") {
			if ($(window).scrollTop() + $(window).height() > c.offset().top && b == 0) {
				a();
				b++
			}
		} else {
			if (d == "all") {
				if ($(window).scrollTop() + $(window).height() > (c.offset().top + c.height()) && b == 0) {
					a();
					b++
				}
			}
		}
	})
}
slideExposureFn($("#download-floor"), "all",
function() {
	try {
		var b = new MPing.inputs.Click("MProductdetail_BannerShow");
		var a = new MPing();
		a.send(b)
	} catch(c) {}
});
try {
	var headerslider = new HeaderSlider(".header-slider");
	headerslider.init({
		loadInfoFn: loadInfo,
		loadAssessFn: null,
		loadProductFn: null
	})
} catch(e) {
	console.log("headerslider 文件未加载")
}
var oUserAgent = window.navigator.userAgent;
var oBtmTip = document.querySelector(".bottom-tip");
if (oUserAgent.indexOf("iPhone") != -1) {
	oBtmTip.innerHTML = oBtmTip.innerHTML.replace("点击", "上拉")
}
var aGoBack = document.querySelectorAll(".jd-header-icon-back");
for (var i = 0; i < aGoBack.length; i++) {
	if (aGoBack[i]) {
		aGoBack[i].addEventListener("click",
		function() {
			headerslider.goBack()
		})
	}
}
if ($("#m_common_header").length < 1) {
	$(".hold-div-top").attr("style", "display:none;")
}
function switchDetailTab() {
	var b = document.querySelectorAll(".tab-lst-a");
	for (var a = 0; a < b.length; a++) { (function(c) {
			b[a].removeEventListener("click", headerslider.clickBtmDetailTab, false);
			b[a].addEventListener("click", clickRightDetailTab, false)
		} (a))
	}
}
function clickRightDetailTab(a) {
	headerslider.HeightTimer(a);
	window.scrollTo(0, 0)
}

function loadInfo(a, b) {
	productInfoLoad({
		containerID: "goodDetail",
		wareId: $("#currentWareId").val(),
		url: "/ware/detail.json?wareId=" + $("#currentWareId").val(),
		cbfn: function() {
			var h = document.getElementById("scale-parent2");
			scale("scale-parent", "scale-cont");
			if (h) {
				scale("scale-parent2", "scale-cont2")
			}
		},
		switchTabCbFn: function() {
			switchDetailTab()
		},
		goProdBtnCbFn: function() {
			
		}
	});
}


function initDetail(a) {
	var d = {
		seckillContainer: "seckill_time",
		isStart: false,
		timer: null,
		seckillCallback: function() {},
		argObj: null
	};
	var b = $.extend(d, a) || $.fn.extend(d, a);
	var g = {
		seckillContainer: b.seckillContainer,
		isStart: b.isStart,
		timer: b.timer,
		callback: b.seckillCallback,
		drawSeckill: function() {
			var h = document.getElementById(this.seckillContainer);
			if (h != null) {
				var j = '<span class="seckill-time-num">00</span>';
				j += '<span class="seckill-time-colon">:</span>';
				j += '<span class="seckill-time-num">00</span>';
				j += '<span class="seckill-time-colon">:</span>';
				j += '<span class="seckill-time-num">00</span>';
				h.innerHTML = j
			}
		},
		seckillInit: function(j) {
			var h = this;
			h.drawSeckill();
			if (j.seckill) {
				if (j.seckill.seckillTime && j.seckill.timeRemain) {
					h.endTime = j.seckill.seckillTime;
					h.timeRemain = j.seckill.timeRemain;
					h.seckillTime = 1000;
					h.seckillTimer()
				} else {
					$("#seckill_time").hide()
				}
			}
		},
		seckillTimer: function() {
			var h = this;
			var j = jdM.localstorage.get("index_seckill");
			var r = 0;
			if (j) {
				j = j.split("_");
				var q = j[0];
				var t = parseInt(j[1], 10);
				var s = jdM.date.toDate(j[2]);
				var v = parseInt(j[3], 10);
				if (h.endTime == q && h.timeRemain == t) {
					var k = new Date();
					var p = parseInt((k.getTime() - s.getTime()) / 1000, 10);
					r = v - p;
					jdM.localstorage.set("index_seckill", h.endTime + "_" + h.timeRemain + "_" + jdM.date.toString(k, "yyyy-MM-dd HH:mm:ss") + "_" + r)
				} else {
					var k = new Date();
					r = h.timeRemain;
					jdM.localstorage.set("index_seckill", h.endTime + "_" + h.timeRemain + "_" + jdM.date.toString(k, "yyyy-MM-dd HH:mm:ss") + "_" + r)
				}
			} else {
				var k = new Date();
				r = h.timeRemain = h.timeRemain - 1;
				jdM.localstorage.set("index_seckill", h.endTime + "_" + h.timeRemain + "_" + jdM.date.toString(k, "yyyy-MM-dd HH:mm:ss") + "_" + r)
			}
			if (r > 0) {
				var w = r % 60;
				var l = parseInt(r / 60, 10);
				var o = l % 60;
				var n = parseInt(l / 60, 10);
				if (n <= 0) {
					$("#" + h.seckillContainer).find("span").eq(0).text("00")
				} else {
					if (n > 99) {
						$("#" + h.seckillContainer).find("span").eq(0).text("99")
					} else {
						if (n > 9 && n < 99) {
							var n = n + "";
							$("#" + h.seckillContainer).find("span").eq(0).text(n)
						} else {
							var n = n + "";
							$("#" + h.seckillContainer).find("span").eq(0).text("0" + n)
						}
					}
				}
				if (o <= 0) {
					$("#" + h.seckillContainer).find("span").eq(2).text("00")
				} else {
					if (o > 9) {
						o = o + "";
						$("#" + h.seckillContainer).find("span").eq(2).text(o)
					} else {
						$("#" + h.seckillContainer).find("span").eq(2).text("0" + o)
					}
				}
				if (w <= 0) {
					$("#" + h.seckillContainer).find("span").eq(4).text("00")
				} else {
					if (w > 9) {
						w = w + "";
						$("#" + h.seckillContainer).find("span").eq(4).text(w)
					} else {
						$("#" + h.seckillContainer).find("span").eq(4).text("0" + w)
					}
				}
			} else {
				$("#" + h.seckillContainer).find("span").eq(0).text("00");
				$("#" + h.seckillContainer).find("span").eq(2).text("00");
				$("#" + h.seckillContainer).find("span").eq(4).text("00");
				h.seckillStop();
				h.callback()
			}
		},
		seckillRun: function(j) {
			var h = this;
			h.seckillTime = h.seckillTime - j;
			if (h.seckillTime == 0) {
				h.seckillTime = 1000;
				h.seckillTimer()
			}
		},
		seckillStart: function() {
			var h = this;
			if (!h.isStart) {
				h.timer = setInterval(function() {
					h.seckillRun(1000);
					h.isStart = true
				},
				1000)
			}
		},
		seckillStop: function() {
			var h = this;
			if (h.isStart) {
				clearTimeout(h.timer);
				jdM.localstorage.remove("index_seckill")
			}
		}
	};
	var c = {
		regristerEvent: function() {
			var h = $("#prodPromotion");
			h.bind("click",
			function(m) {
				var l = m || event;
				var k = l.srcElement || l.target;
				var n = this;
				var j = n.className;
				if (j.indexOf("down") != -1) {
					l.preventDefault();
					$(".promotion-item").unbind("click").bind("click",
					function(o) {
						o.stopPropagation()
					});
					$(".promotion-item").first().unbind("click");
					$(".promotion-item").find("a").unbind("click").bind("click",
					function(o) {
						o.stopPropagation()
					});
					$("#suitContainer").css("display", "block");
					n.className = n.className.replace("down", "up");
					h.attr("report-eventparam", "open");
					if ($("#suitContainer").length > 0) {
						slideshow("#suitContainer").init({
							lineNum: 1,
							marginValue: 40,
							fullScreen: true,
							mpingEvent: "MProductdetail_SlideDiscount"
						})
					}
					$(".promotion-item a").each(function(o, p) {
						if ($(this).attr("report-eventid") == "MProductdetail_Promotion") {
							$(this).attr("onclick", 'pingClickWithLevel("' + $(this).attr("report-eventid") + '","' + $(this).attr("report-eventparam") + '","","' + $(this).attr("report-pageparam") + '","5")')
						}
					})
				} else {
					$(".promotion-item").unbind("click");
					$(".promotion-item").find("a").unbind("click").bind("click",
					function(o) {
						o.preventDefault()
					});
					$("#suitContainer").css("display", "none");
					n.className = n.className.replace("up", "down");
					h.attr("report-eventparam", "close")
				}
			})
		}
	};
	var f = function() {
		if (b.argObj != null) {
			g.seckillInit(b.argObj);
			g.seckillStart();
			c.regristerEvent()
		}
	};
	return f()
}

var aAactionListA = document.querySelectorAll(".action-list a");
for (var i = 0; i < aAactionListA.length; i++) {
	aAactionListA[i].innerHTML = aAactionListA[i].innerHTML.replace(/(^\s*)|(\s*$)/g, "")
}

function newDetailInit() {
	try {
		slide("#slide").init({
			startIndex: 0,
			number: true,
			laseMoveFn: jump,
			lastImgSlider: sliderJump,
			preDef: "lnr",
			location: true,
			autoPlay: false,
			autoHeight: false,
			mpingEvent: "MProductdetail_SlideFocusPic",
			wareId: $("#currentWareId").val(),
			isBanOneImg: false,
			numberWrapId: "#slidePageNub"
		})
	} catch(g) {}
	initDetail({
		argObj: {
			seckill: {
				seckillTime: "2015-08-03 20:00:02",
				timeRemain: $("#miaoshaRemainTime").val()
			}
		},
		seckillCallback: function() {
			try {
				var h = parseInt($("#refresh").val());
				if (h > 0 && h < 3) {
					location.href = "/product/" + $("#currentWareId").val() + ".html?refresh=" + $("#refresh").val();
					return false
				}
			} catch(j) {}
			return false
		}
	});
}

function jump(a) {
	var c = document.getElementById("tittup");
	var d = document.getElementById("slide");
	var b = d.offsetWidth;
	if (a < -b / 5) {
		c.children[0].classList.add("rotate");
		c.children[1].innerHTML = "\u91ca\u653e\u67e5\u770b\u8be6\u60c5"
	}
	if (a > -b / 5) {
		c.children[0].classList.remove("rotate");
		c.children[1].innerHTML = "\u6ed1\u52a8\u67e5\u770b\u8be6\u60c5"
	}
	c.style.WebkitTransform = "translateX(" + a + "px)";
	c.style.transform = "translateX(" + a + "px)"
}
function sliderJump() {
	headerslider.sliderJump()
}


var itemInfoFlag = false;
var itemScaleFlag = true;
function productInfoLoad(n) {
	var c = {
		containerID: "goodDetail",
		wareId: "",
		url: "",
		cbfn: null,
		switchTabCbFn: function() {},
		goProdBtnCbFn: function() {}
	};
	var m = $.extend(c, n);
	var a = document.getElementById(m.containerID);
	var f = document.querySelector(".tab-lst");
	var d = "";
	var b = "";
	var j = {
		addInfo: function(s) {
			var r = this;
			d += '<div class="detail" id="wareInfo" style="display:block;">';
			if (s.OP && s.overseaNotices && s.overseaNotices.length > 0) {
				d += '    <div id="scale-parent2">';
				d += '        <div class="scale-box" id="scale-cont2">';
				for (var q = 0,
				o = s.overseaNotices.length; q < o; q++) {
					if (s.OP && s.overseaNotices[q] && $("#httpsConfig") && "true" == $("#httpsConfig").val() && s.overseaNotices[q].indexOf('src="http://') > -1) {
						d += s.overseaNotices[q].replace(/src="http:\/\//g, 'src="//')
					} else {
						d += s.overseaNotices[q]
					}
				}
				d += "</div></div>"
			}
			d += '    <div id="scale-parent">';
			if (s && s.wdis && s.wdis != "null" && s.wdis != "暂无") {
				d += '        <div class="scale-box" id="scale-cont">';
				d += "            <p>";
				d += "                <span>";
				if (s.wdis && $("#httpsConfig") && "true" == $("#httpsConfig").val() && s.wdis.indexOf('src="http://') > -1) {
					d += s.wdis.replace(/src="http:\/\//g, 'src="//')
				} else {
					d += s.wdis
				}
				d += "</span></p>"
			} else {
				itemScaleFlag = false;
				d += '        <div   id="scale-cont">';
				d += '<div class="errPic"><img src="../../common/images/fullNull.png"/><span class="errPic-content">暂无商品介绍</span><div class="pro-button-box"><span class="pro-button J_ping" report-eventid="MProductdetail_DetailViewGoods" report-eventlevel="5"';
				if (s.wareId) {
					d += 'report-eventparam="' + s.wareId + '"'
				}
				d += ">查看商品信息</span></div></div>";	
				var v = document.querySelector('#btmDetail');
				if (v) {
					v.style.height = $(window).height()-55-81+'px';
				}
			}
			d += "</div></div>";
			d += '<div id="recommendWrap" class="recommend-wrap"></div>';
			d += '<div id="scanWrap" class="recommend-wrap"></div>';
			d += "</div>";
			d += '<div class="detail" id="wareStandard" style="display:none;">';
			if (s && s.wi && s.wi.code && s.wi.code != "null" && s.wi.code != "暂无") {
				if (s.wi.type == 1 || s.wi.type == 4) {
					d += "<p><span>";
					d += s.wi.code;
					d += "</span></p>"
				} else {
					if (s.wi.type == 2 || s.wi.type == 3) {
						d += "<table class='table-border' width='100%'><tbody>";
						d = this.doJson(JSON.parse(s.wi.code), d, s.wi.type);
						d += "</tbody></table>"
					}
				}
			} else {
				d += '<div class="errPic"><img src="../../common/images/fullNull.png"/><span class="errPic-content">暂无规格参数</span><div class="pro-button-box"><span class="pro-button J_ping"  report-eventid="MProductdetail_DetailViewGoods" report-eventlevel="5"';
				if (s.wareId) {
					d += 'report-eventparam="' + s.wareId + '"'
				}
				d += ">查看商品信息</span></div></div>"
			}
			if (s && s.wi && s.wi.serviceType == "0") {
				d += '</div><div class="detail" id="warePack" style="display:none;">';
				if ((s && s.wi && s.wi.wareQD && s.wi.wareQD != "null" && s.wi.wareQD != "暂无") || (s && s.wi && s.wi.ybInfo && s.wi.ybInfo != "null" && s.wi.ybInfo != "暂无") || (s && s.wi && s.wi.priceDescription && s.wi.priceDescription != "null" && s.wi.priceDescription != "暂无")) {
					d += "<p>";
					if (s && s.wi && s.wi.wareQD && s.wi.wareQD != "null" && s.wi.wareQD != "暂无") {
						d += "<p>包装清单：</p>";
						d += "<p>";
						d += s.wi.wareQD;
						d += "</p><br/>"
					} else {
						d += ""
					}
					if (s && s.wi && s.wi.ybInfo && s.wi.ybInfo != "null" && s.wi.ybInfo != "暂无") {
						d += "<p>售后服务：</p>";
						d += "<p>";
						d += s.wi.ybInfo;
						d += "</p><br/>"
					} else {
						d += ""
					}
					if (s && s.wi && s.wi.priceDescription && s.wi.priceDescription != "null" && s.wi.priceDescription != "暂无") {
						d += "<p>价格说明：</p>";
						d += "<p>";
						d += s.wi.priceDescription;
						d += "</p>"
					} else {
						d += ""
					}
					d += "</p>"
				} else {
					d += '<div class="errPic"><img src="../../common/images/fullNull.png"/><span class="errPic-content">暂无包装售后</span><div class="pro-button-box"><span class="pro-button J_ping"  report-eventid="MProductdetail_DetailViewGoods" report-eventlevel="5"';
					if (s.wareId) {
						d += 'report-eventparam="' + s.wareId + '"'
					}
					d += ">查看商品信息</span></div></div>"
				}
			} else {
				if (s && s.wi && s.wi.serviceType == "1") {
					d += '</div><div class="detail sale-service-wrap" id="warePack" style="display:none;">';
					if ((s && s.wi && s.wi.wareQD && s.wi.wareQD != "null" && s.wi.wareQD != "暂无") || (s && s.wi && s.wi.afterServiceList && s.wi.afterServiceList != "null" && s.wi.afterServiceList.length > 0)) {
						if (s && s.wi && s.wi.wareQD && s.wi.wareQD != "null" && s.wi.wareQD != "暂无") {
							d += '<div class="sale-service-grey bdr-t"></div>';
							d += '<div class="sale-service-floor bdr-t">';
							d += '<div class="sale-service-title"><span class="title-text">包装清单<span></div>';
							d += '<div class="sale-service-content">';
							d += s.wi.wareQD;
							d += "</div>";
							d += "</div>"
						} else {
							d += ""
						}
						if (s && s.wi && s.wi.afterServiceList && s.wi.afterServiceList != "null" && s.wi.afterServiceList.length > 0) {
							for (var p in s.wi.afterServiceList) {
								d += '<div class="sale-service-grey bdr-t"></div>';
								d += '<div class="sale-service-floor bdr-t">';
								d += '<div class="sale-service-title"><span class="title-text">' + s.wi.afterServiceList[p].label + "<span></div>";
								d += '<div class="sale-service-content">';
								d += s.wi.afterServiceList[p].value;
								d += "</div>";
								d += "</div>"
							}
						} else {
							d += ""
						}
					} else {
						d += '<div class="errPic"><img src="../../common/images/fullNull.png"/><span class="errPic-content">暂无包装售后</span><div class="pro-button-box"><span class="pro-button J_ping"  report-eventid="MProductdetail_DetailViewGoods" report-eventlevel="5"';
						if (s.wareId) {
							d += 'report-eventparam="' + s.wareId + '"'
						}
						d += ">查看商品信息</span></div></div>"
					}
				}
			}
			d += '</div><div class="detail" id="wareService" style="display:none;">';
			d += "    <p>";
			d += "        <span>";
			if (s && s.wi && s.wi.ybInfo && s.wi.ybInfo != "null") {
				d += s.wi.ybInfo
			} else {
				d += ""
			}
			d += "</span></p></div>"
		},
		loopArray: function(q, s) {
			var r;
			for (var p = 0,
			o = q.length; p !== o; ++p) {
				if ((r = s(q[p], p)) !== undefined) {
					return r
				}
			}
		},
		loopObj: function(p, q) {
			for (var o in p) {
				q(o, p[o])
			}
		},
		doJson: function(o, r, p) {
			var q = this;
			if (p == 2) {
				this.loopArray(o,
				function(t, s) {
					q.loopObj(t,
					function(x, w) {
						r += "<tr><td colspan='2'><strong>" + x + "</strong></td></tr>";
						q.loopArray(w,
						function(y, v) {
							q.loopObj(y,
							function(A, z) {
								A = A.replace(/[\（|(]/, "<br/> (");
								r += "<tr><td>" + A + "</td><td>" + z + "</td></tr>"
							})
						})
					})
				})
			} else {
				if (p == 3) {
					this.loopArray(o,
					function(t, s) {
						q.loopObj(t,
						function(x, w) {
							x = x.replace(/[\（|(]/, "<br/> (");
							r += "<tr><td>" + x + "</td><td>" + w + "</td></tr>"
						})
					})
				}
			}
			return r
		},
		addBook: function(q) {
			d += '<div class="detail" id="bookContent" style="display:block;">';
			d += '    <div id="scale-parent">';
			if (q && q.ware && q.ware.bookAttrs && q.ware.bookAttrs != "null") {
				d += '        <div class="scale-box-ebook" id="scale-cont">';
				d += "            <p>";
				d += "                <span></span></p>";
				d += '            <div class="book-container">';
				for (var p = 0; p < q.ware.bookAttrs.length; p++) {
					d += '                <div class="book-container-item">';
					d += '                    <span class="book-item-title">\u3010';
					if (q.ware.bookAttrs[p].label && q.ware.bookAttrs[p].label != "null") {
						d += q.ware.bookAttrs[p].label
					} else {
						d += ""
					}
					d += "\u3011</span>";
					d += '<p class="book-item-content">';
					if (q.ware.bookAttrs[p].value && q.ware.bookAttrs[p].value != "null") {
						if ($("#httpsConfig") && "true" == $("#httpsConfig").val() && q.ware.bookAttrs[p].value.indexOf('src="http://') > -1) {
							d += q.ware.bookAttrs[p].value.replace(/src="http:\/\//g, 'src="//')
						} else {
							d += q.ware.bookAttrs[p].value
						}
					} else {
						d += ""
					}
					d += "</p></div>"
				}
			} else {
				itemScaleFlag = false;
				d += '<div class="errPic"><img src="../../common/images/fullNull.png"/><span class="errPic-content">暂无商品介绍</span><div class="pro-button-box"><span class="pro-button J_ping"  report-eventid="MProductdetail_DetailViewGoods" report-eventlevel="5"';
				if (q.wareId) {
					d += 'report-eventparam="' + q.wareId + '"'
				}
				d += ">查看商品信息</span></div></div></div>"
			}
			d += "</div><p></p></div></div>";
			d += '<div id="recommendWrap" class="recommend-wrap"></div>';
			d += '<div id="scanWrap" class="recommend-wrap"></div>';
			d += "</div>";
			d += '<div class="detail" id="bookInfo" style="display:none;">';
			d += "<p><span></span></p>";
			if (q && q.ware && q.ware.attrs && q.ware.attrs != "null") {
				for (var o = 0; o < q.ware.attrs.length; o++) {
					d += '<div class="book-container">';
					d += '    <div class="book-info-line">';
					d += '         <span class="info-title">';
					if (q.ware.attrs[o].label && q.ware.attrs[o].label != "null") {
						d += q.ware.attrs[o].label
					} else {
						d += ""
					}
					d += "</span>";
					d += '         <span class="info-content">';
					if (q.ware.attrs[o].value == "undefined") {
						d += ""
					} else {
						d += q.ware.attrs[o].value
					}
					d += "</span></div></div>"
				}
			} else {
				d += ""
			}
			d += "<p></p></div>";
			d += '<div class="detail" id="bookCata" style="display:none;">';
			d += "    <p>";
			d += '        <span style="margin-left:5px">';
			if (q && q.ware && q.ware.catalogue && q.ware.catalogue != "null") {
				d += q.ware.catalogue
			} else {
				d += ""
			}
			d += "</span></p></div>"
		},
		zhuangbaFn: function(o) {
			
		},
		clickDetailTab: function() {
			var o = document.querySelectorAll(".detail"),
			q = document.querySelectorAll(".tab-lst-a");
			for (var p = 0; p < q.length; p++) { (function(r) {
					q[p].addEventListener("click",
					function() {
						for (var s = 0; s < o.length; s++) {
							o[s].style.display = "none"
						}
						for (var t = 0; t < q.length; t++) {
							if (q[t].classList.contains("on")) {
								q[t].classList.remove("on")
							}
						}
						q[r].classList.add("on");
						var v = q[r].getAttribute("value")
						document.getElementById(v).style.display = "block"
					},
					false)
				} (p))
			}
		}
	};
	var l = function() {
		if (!itemInfoFlag) {
			g()
		}
	};
	var h = function(o) {
		var p = "";
		if ($("#uniformShopId").val()) {
			p = p + "&shopId=" + $("#uniformShopId").val()
		}
		if ($("#uniformFlt").val()) {
			p = p + "&flt=" + $("#uniformFlt").val()
		}
		j.zhuangbaFn(o);
		j.addInfo(o);
		a.innerHTML = d;
		j.clickDetailTab();
		m.switchTabCbFn();
		m.goProdBtnCbFn();
		if (itemScaleFlag) {
			m.cbfn()
		}
	};
	var k = function(o) {
		var p = "";
		if ($("#uniformShopId").val()) {
			p = p + "&shopId=" + $("#uniformShopId").val()
		}
		if ($("#uniformFlt").val()) {
			p = p + "&flt=" + $("#uniformFlt").val()
		}
		j.zhuangbaFn(o);
		j.addBook(o);
		a.innerHTML = d;
		j.clickDetailTab();
		m.switchTabCbFn();
		m.goProdBtnCbFn();
		if (itemScaleFlag) {
			m.cbfn()
		}
	};
	var g = function() {
		var div = document.createElement('div');
		div.innerHTML = detailData.param;
		var codeArr = new Array();
		$(div).find('th.tdTitle').each(function(index, element){
			var subArray = new Array();
			var currentTRNode = $(this).parent().next();
			var currentTitle = $(this).html();
			while(currentTRNode.find('th.tdTitle').length == 0) {
				var currentTDNode = currentTRNode.find('td.tdTitle');
				if (currentTDNode.length != 0) {
					var keyStr = currentTDNode.html();
					var valStr = currentTDNode.next().html();
					var dic = new Object();
					dic[keyStr] = valStr;
					subArray.push(dic);
				}
				currentTRNode = currentTRNode.next();
				if (currentTRNode.length == 0)break;
			}
			var dic = new Object();
			dic[currentTitle] = subArray;
			codeArr.push(dic);
		});
		
		var wdis = detailData.appintroduce;
		if (!wdis || wdis == null || wdis == '' || wdis == '暂无') {
			wdis = detailData.introduction;
		} 
		var ware = {
			wdis:wdis,
			wi:{
				afterServiceList:[
					{
						label:'售后说明',
						operator:null,
						value:detailData.shouhou
					}
				],
				serviceType:detailData.shouhou == '' ? 0:1,
				wareQD:detailData.wareQD,
				code:JSON.stringify(codeArr),
				type:2
			}
		};
		if (!m.itemInfoFlag) {
			h(ware);
			itemInfoFlag = true;
		}
	};
	return l()
}

var pingClick = function(g, d, c, a) {
	try {
		var f = new MPing.inputs.Click(g);
		f.event_param = d;
		f.page_param = a;
		var b = new MPing();
		b.send(f)
	} catch(h) {}
};
var pingClickWithLevel = function(h, d, c, a, g) {
	try {
		var f = new MPing.inputs.Click(h);
		f.event_param = d;
		f.page_param = a;
		f.event_level = g;
		var b = new MPing();
		b.send(f)
	} catch(j) {}
};
