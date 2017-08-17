(function(a) {
	a.fn.imglazyLoad = function(c) {
		return new b(c)
	};
	var b = (function() {
		var c = function(d) {
			this.duration = d.duration ? d.duration: this.duration;
			this.container = d.container ? d.container: this.container;
			this._src = d._src ? d._src: this._src;
			this.rangeH = d.rangeH ? d.rangeH: this.rangeH;
			this.animationName = d.animationName ? d.animationName: this.animationName;
			this.showDelay = d.showDelay ? d.showDelay: this.showDelay;
			this.styleContianer = d.styleContianer ? d.styleContianer: this.styleContianer;
			this.scrollObj = d.scrollObj || this.scrollObj;
			this.imgcb = d.imgcb ? d.imgcb: this.imgcb;
			this.isChangeSize = d.isChangeSize ? d.isChangeSize: this.isChangeSize;
			this.init()
		};
		c.prototype = {
			scrollObj: window,
			refreshTimer: null,
			duration: 100,
			_src: "_src",
			container: "imgContainer",
			rangeH: 0,
			animationName: "fade",
			showDelay: "200",
			styleContianer: "styleID",
			imgcb: false,
			isChangeSize: "true",
			belowthefold: function(d) {
				return a(window).scrollTop() - this.rangeH <= a(d).offset().top
			},
			abovethetop: function(d) {
				return a(d).offset().top <= a(window).scrollTop() + document.documentElement.clientHeight + this.rangeH
			},
			inViewport: function(d) {
				return this.belowthefold(d) && this.abovethetop(d)
			},
			setStyle: function(f, e) {
				for (var d in e) {
					f.style[d] = e[d]
				}
			},
			checkIphone: function() {
				var d = window.navigator.userAgent.toLowerCase();
				if (/iphone|ipd|ipod/.test(d)) {
					return true
				} else {
					return false
				}
			},
			addStyle: function() {
				var d = document.getElementById(this.styleContianer) || document.getElementsByTagName("head")[0];
				var e = document.createElement("style");
				e.innerHTML += " @-webkit-keyframes fade { 0%   { opacity: 1; } 100%   { opacity: 0; }} @keyframes fade {  0%   { opacity: 1; }  100%   { opacity: 0; }}";
				d.appendChild(e)
			},
			loading: function() {
				var e = this;
				var f = [];
				var d = document.getElementById(e.container);
				if (d) {
					f = a(d).find("img[" + e._src + "]")
				} else {
					f = a("img[" + e._src + "]")
				}
				f.each(function(h) {
					var g = f.eq(h);
					if (e.inViewport(g)) {
						e.changSrc(g)
					}
				})
			},
			setImgURL: function(f) {
				var e = this;
				var h = f.attr("" + e._src + "");
				if (e.isChangeSize == "true") {
					var d = parseInt(f.width()) * 2;
					var g = parseInt(f.height()) * 2;
					h = h.replace(/(s[0-9]{0,4}x[0-9]{0,4}_)?jfs/, "s" + d + "x" + g + "_jfs")
				}
				if (h.indexOf(".webp") == -1 && !e.checkIphone()) {
					h = h + ".webp"
				}
				return h
			},
			changSrc: function(e) {
				var d = this;
				var h = e.attr("" + d._src + "");
				var g = new Image();
				var f = d.setImgURL(e);
				e.animate({
					opacity: 0
				},
				10);
				g.src = f;
				g.onload = function() {
					if (d.imgcb) {
						d.imgcb(this, e)
					}
					e.attr("src", f).removeAttr("" + d._src + "");
					e.animate({
						opacity: 1
					},
					d.showDelay)
				};
				g.onerror = function() {
					e.attr("src", h).removeAttr("" + d._src + "");
					e.animate({
						opacity: 1
					},
					d.showDelay)
				}
			},
			init: function() {
				var d = this;
				d.loading();
				a(this.scrollObj).on("scroll",
				function() {
					if (d.refreshTimer) {
						clearTimeout(d.refreshTimer);
						d.refreshTimer = null
					}
					d.refreshTimer = setTimeout(function() {
						d.loading()
					},
					d.duration)
				})
			}
		};
		return c
	})();
	a.loadImg = {
		lazyLoad: function(c) {
			return a(document.body).imglazyLoad(c)
		}
	}
})($);
function HeaderSlider(a) {
	this.p = a;
	this.oWrapper = document.getElementById("goods-img-box");
	this.oDiv = document.querySelector(a);
	this.oUl = document.querySelector(".header-slider-con");
	this.aLi = document.querySelectorAll(".header-slider-item");
	this.aTabTitle = document.querySelectorAll(".header-tab-title");
	this.aTabLi = document.querySelectorAll(".header-tab-item");
	this.oMCommonHeader = document.getElementById("m_common_header");
	this.oSiftTab = document.querySelector(".sift-tab");
	this.oTabs = document.getElementById("tabs");
	this.oTryme = document.querySelector(".tryme");
	this.oDownloadApp = document.querySelector(".download-pannel");
	this.oBox = {
		startX: 0,
		startY: 0,
		finalX: 0,
		finalY: 0,
		endX: 0,
		endY: 0,
		sliderX: 0,
		moveX: 0,
		tabIndex: 0,
		numTime: 0,
		isMove: false,
		startTime: 0,
		moveTime: 0,
		isBottomed: false,
		isBtmDetail: null
	}
}
HeaderSlider.prototype = {
	init: function(c) {
		var c = c || {},
		g = this.aLi,
		b = this.oDiv,
		f = this.oBox,
		a = this.oDownloadApp,
		e = this;
		this.setHeightTimer = null;
		this.clearHeightTimer = null;
		this.aLiLen = g.length;
		this.oDivWidth = b.offsetWidth;
		this.oUserAgent = window.navigator.userAgent;
		var d = document.querySelectorAll(".jd-header-new-bar")[0];
		if (d) {
			this.oHeaderBarH = d.offsetHeight
		} else {
			this.oHeaderBarH = 0
		}
		this.defaults = {
			maxBtmY: 57,
			loadProductFn: false,
			loadInfoFn: false,
			loadAssessFn: false,
			itemPullHtml: '<span class="btm-detail-icon btm-down"></span>下拉回到"商品详情"',
			itemReleaseHtml: '<span class="btm-detail-icon btm-down"></span>释放回到"商品详情"'
		};
		HeaderSlider.extend(this.defaults, c);
		this.liInit();
		this.bind();
		clearInterval(this.setHeightTimer);
		this.setHeightTimer = setInterval(function() {
			e.setHeight()
		},
		800);
		clearTimeout(this.clearHeightTimer);
		this.clearHeightTimer = setTimeout(function() {
			clearInterval(e.setHeightTimer)
		},
		10000);
		this.setHoldTopHeight()
	},
	liInit: function() {
		var f = this.aLi,
		c = this.oDiv,
		b = this.oUl,
		d = this.aLiLen,
		e = document.querySelector(".jd-header");
		clearTimeout(a);
		var a = setTimeout(function() {
			var k = document.documentElement.clientWidth;
			var g = document.documentElement.clientHeight;
			for (var j = 0; j < d; j++) {
				f[j].style.width = k + "px";
				f[j].style.height = g + "px"
			}
			this.aLiWidth = f[0].offsetWidth;
			var h = this.aLiWidth * d;
			b.style.width = h + "px";
			if (e != null) {
				e.style.width = k + "px"
			}
			c.style.width = k + "px"
		},
		300)
	},
	bind: function() {
		var c = this.oDiv,
		e = this,
		d = this.oMCommonHeader,
		g = this.oUserAgent,
		f = document.querySelector("#commentListId"),
		b = "onorientationchange" in window,
		a = b ? "orientationchange": "resize";
		if (g.indexOf("iPhone") != -1) {
			c.addEventListener("touchstart", this, false)
		}
		window.addEventListener(a, this, false);
		this.foldClick();
		this.toTop();
		this.btmToTopFn();
		setTimeout(function() {
			e.guessSwitch()
		},
		300);
		this.evaluateJump();
		if (f) {
			this.assessScroll()
		}
		if (d != null) {
			this.clickTab();
			this.windowScroll();
			this.aShortcutClick();
			this.clickAssessTab()
		}
	},
	setHeight: function(i) {
		var a = this.aLi,
		n = this.oUl,
		h = this.oBox,
		m = this.oWrapper,
		b = this.oHeaderBarH,
		f = 0,
		o = document.querySelector(".hold-div-top").offsetHeight,
		l = document.querySelector(".hold-div-bottom").offsetHeight,
		d = document.querySelector(".cart-concern-btm-fixed");
		if (d) {
			f = d.offsetHeight
		} else {
			f = 0
		}
		if (i) {
			var c = i.target,
			e = c.getAttribute("value"),
			g = document.getElementById(e)
		}
		var k = document.documentElement.clientHeight;
		var j = k - o - l - f;
		if (!HeaderSlider.hasClass(a[h.tabIndex], "reply-body")) {
			a[h.tabIndex].style.height = "auto";
			if (a[h.tabIndex].offsetHeight > j) {
				a[h.tabIndex].style.height = a[h.tabIndex].offsetHeight + "px"
			} else {
				a[h.tabIndex].style.height = j + "px";
				if (g) {
					g.style.height = j + "px"
				}
			}
		}
		if (a[h.tabIndex].offsetHeight > j) {
			n.style.height = a[h.tabIndex].offsetHeight + "px";
			m.style.height = "auto"
		} else {
			n.style.height = j + "px";
			m.style.height = "auto"
		}
	},
	setHoldTopHeight: function() {
		var a = document.querySelector(".hold-div-top"),
		c = document.querySelector(".m_common_new_top");
		if (c != null) {
			var b = c.offsetHeight;
			a.style.height = b + "px"
		}
	},
	handleEvent: function(a) {
		switch (a.type) {
		case "touchstart":
			this.startHandle(a);
			break;
		case "touchmove":
			this.moveHandle(a);
			break;
		case "touchend":
			this.endHandle(a);
			break;
		case "orientationchange":
			this.orientationchangeHandler(a);
			break;
		case "resize":
			this.orientationchangeHandler(a);
			break
		}
	},
	startHandle: function(d) {
		d.stopPropagation();
		var c = d.targetTouches[0],
		a = this.oUl,
		b = this.oDiv,
		f = this.oBox;
		f.numTime = 0;
		f.startX = c.pageX;
		f.startY = c.pageY;
		f.isMove = false;
		f.startTime = new Date().getTime();
		HeaderSlider.setStyle(a, {
			WebkitTransition: "",
			transition: ""
		});
		b.addEventListener("touchmove", this, false);
		b.addEventListener("touchend", this, false)
	},
	moveHandle: function(m) {
		m.stopPropagation();
		var q = m.targetTouches[0],
		k = this.oBox,
		r = this.oUl,
		f = this.oDiv,
		p = this.oWrapper,
		j,
		i,
		o = document.documentElement.clientHeight,
		n = this.defaults.maxBtmY;
		if (o + $(window).scrollTop() >= f.scrollHeight) {
			k.isBottomed = true
		} else {
			k.isBottomed = false
		}
		if (k.tabIndex == 0 && k.isBottomed) {
			var b = Math.abs(q.pageY - k.startY);
			var l = 0;
			var h = Math.min(b, n);
			var d = 0 - h / 2 + Math.max(0, b - n),
			a = d;
			if (d > 0) {
				a = HeaderSlider.damping(d);
				if (b > n) {
					l = n + a
				} else {
					l = b + a
				}
			} else {
				l = b
			}
			HeaderSlider.setStyle(p, {
				transform: "translateY(-" + l + "px) translateZ(0px)",
				WebkitTransform: "translateY(-" + l + "px) translateZ(0px)"
			})
		}
		k.moveTime = new Date().getTime();
		if ((k.moveTime - k.startTime) >= 50) {
			if (k.numTime === 0) {
				k.finalX = q.pageX;
				k.finalY = q.pageY;
				j = HeaderSlider.getAngle(k.startX, k.finalX, k.startY, k.finalY);
				i = HeaderSlider.getSpeed(k.startX, k.finalX, k.startY, k.finalY, 50)
			}
			k.numTime++;
			if (i >= 5) {
				if ((j >= 0 && j <= 10) || (j >= 170 && j <= 190) || (j >= 350 && j <= 360)) {
					k.isMove = true
				}
			} else {
				if ((j >= 0 && j <= 20) || (j >= 160 && j <= 200) || (j >= 340 && j <= 360)) {
					k.isMove = true
				}
			}
		}
		var c = document.documentElement.clientWidth,
		g = this.aLiLen;
		if (k.isMove) {
			m.preventDefault();
			k.moveX = k.sliderX + (q.pageX - k.startX);
			if (k.moveX > 0) {
				k.moveX = 0
			}
			if (k.moveX < -(c * (g - 1))) {
				k.moveX = -(c * (g - 1))
			}
			HeaderSlider.moving(r, k.moveX)
		}
	},
	endHandle: function(r) {
		r.stopPropagation();
		var s = r.changedTouches[0],
		f = this.oBox,
		j = this.oDiv,
		d = this.aTabTitle,
		t = this.oDivWidth,
		c = this.oSiftTab,
		m = this.oTabs,
		b = this.oUl,
		l = this.aLiLen,
		g = this.oTryme,
		o = this.oDownloadApp,
		a = this.oUserAgent,
		k = this.oMCommonHeader,
		n = document.documentElement.clientWidth,
		q = this.oWrapper,
		h = this;
		f.numTime = 0;
		f.endX = s.pageX;
		f.endY = s.pageY;
		if (f.tabIndex == 0 && f.isBottomed && f.endY - f.startY < -40) {
			h.btmDetailJump()
		} else {
			HeaderSlider.setStyle(q, {
				transform: "translateY(0px) translateZ(0px)",
				WebkitTransform: "translateY(0px) translateZ(0px)"
			})
		}
		if ((f.isMove) && (f.endX - f.startX < 0)) {
			if (Math.abs(f.endX - f.startX) > t / 3) {
				if (f.tabIndex < l - 1) {
					f.tabIndex++;
					document.documentElement.scrollTop = 0;
					document.body.scrollTop = 0;
					if (g && a.indexOf("Html5Plus") < 0) {
						if (!HeaderSlider.getSession("isPanelClose")) {
							g.style.display = "block"
						}
					}
					if (o && a.indexOf("Html5Plus") < 0) {
						if (!HeaderSlider.getSession("isPanelClose")) {
							o.style.display = "block"
						}
					}
				}
				if (h.defaults.loadProductFn && typeof h.defaults.loadProductFn == "function") {
					h.defaults.loadProductFn(f.tabIndex, 0)
				}
				if (h.defaults.loadInfoFn && typeof h.defaults.loadInfoFn == "function") {
					h.defaults.loadInfoFn(f.tabIndex, 1)
				}
				if (h.defaults.loadAssessFn && typeof h.defaults.loadAssessFn == "function") {
					h.defaults.loadAssessFn(f.tabIndex, 2)
				}
				f.sliderX = f.sliderX - n;
				if (f.sliderX < -(n * (l - 1))) {
					f.tabIndex = l - 1;
					f.sliderX = -(n * (l - 1))
				}
				HeaderSlider.sliding(b, f.sliderX);
				HeaderSlider.headSwitch(c, f.tabIndex, 1);
				HeaderSlider.headSwitch(m, f.tabIndex, 2);
				HeaderSlider.visible(c, f.tabIndex, 1);
				h.HeightTimer();
				h.setHoldTopHeight();
				h.slideMping(f.tabIndex, "商品")
			} else {
				HeaderSlider.sliding(b, f.sliderX)
			}
		} else {
			if ((f.isMove) && (f.endX - f.startX > 0)) {
				if (Math.abs(f.endX - f.startX) > t / 3) {
					if (f.tabIndex > 0) {
						f.tabIndex--;
						document.documentElement.scrollTop = 0;
						document.body.scrollTop = 0;
						if (g && a.indexOf("Html5Plus") < 0) {
							if (!HeaderSlider.getSession("isPanelClose")) {
								g.style.display = "block"
							}
						}
						if (o && a.indexOf("Html5Plus") < 0) {
							if (!HeaderSlider.getSession("isPanelClose")) {
								o.style.display = "block"
							}
						}
					}
					if (h.defaults.loadProductFn && typeof h.defaults.loadProductFn == "function") {
						h.defaults.loadProductFn(f.tabIndex, 0)
					}
					if (h.defaults.loadInfoFn && typeof h.defaults.loadInfoFn == "function") {
						h.defaults.loadInfoFn(f.tabIndex, 1)
					}
					if (h.defaults.loadAssessFn && typeof h.defaults.loadAssessFn == "function") {
						h.defaults.loadAssessFn(f.tabIndex, 2)
					}
					f.sliderX = f.sliderX + n;
					if (f.sliderX > 0) {
						f.sliderX = 0
					}
					HeaderSlider.sliding(b, f.sliderX);
					HeaderSlider.headSwitch(c, f.tabIndex, 1);
					HeaderSlider.headSwitch(m, f.tabIndex, 2);
					HeaderSlider.visible(c, f.tabIndex, 1);
					h.HeightTimer();
					h.setHoldTopHeight();
					h.slideMping(f.tabIndex, "评价")
				} else {
					HeaderSlider.sliding(b, f.sliderX)
				}
			}
		}
		if (k != null) {
			for (var p = 0; p < d.length; p++) {
				HeaderSlider.removeClass(d[p], "header-tab-selected")
			}
			HeaderSlider.addClass(d[f.tabIndex], "header-tab-selected")
		}
		j.removeEventListener("touchmove", this, false);
		j.removeEventListener("touchend", this, false);
		if (f.tabIndex == 2) {
			window.removeEventListener("scroll", this, false)
		} else {
			window.addEventListener("scroll", this, false)
		}
	},
	clickTab: function() {
		var a = this.aTabLi,
		d = this.oBox,
		c = this;
		for (var b = 0; b < a.length; b++) { (function(e) {
				if (a[e]) {
					a[e].onclick = function() {
						d.tabIndex = e;
						c.toTopMping(d.tabIndex);
						if (c.defaults.loadProductFn && typeof c.defaults.loadProductFn == "function") {
							c.defaults.loadProductFn(d.tabIndex, 0)
						}
						if (c.defaults.loadInfoFn && typeof c.defaults.loadInfoFn == "function") {
							c.defaults.loadInfoFn(d.tabIndex, 1)
						}
						if (c.defaults.loadAssessFn && typeof c.defaults.loadAssessFn == "function") {
							c.defaults.loadAssessFn(d.tabIndex, 2, 0)
						}
						c.tabSwitch(d.tabIndex)
					}
				}
			})(b)
		}
	},
	clickDetailTab: function() {
		var a = document.querySelectorAll(".detail"),
		c = document.querySelectorAll(".tab-lst-a");
		for (var b = 0; b < c.length; b++) { (function(d) {
				c[b].addEventListener("click",
				function() {
					for (var e = 0; e < a.length; e++) {
						a[e].style.display = "none"
					}
					for (var f = 0; f < c.length; f++) {
						if (c[f].classList.contains("on")) {
							c[f].classList.remove("on")
						}
					}
					c[d].classList.add("on");
					var g = c[d].getAttribute("value");
					document.getElementById(g).style.display = "block"
				},
				false)
			} (b))
		}
	},
	clickAssessTab: function() {
		var a = this,
		b = this.oTabs;
		if (b) {
			b.addEventListener("click",
			function(e) {
				var d = e || event,
				c = d.srcElemnt || d.target;
				if (c.nodeName.toLowerCase() == "p") {
					a.HeightTimer()
				}
			})
		}
	},
	tabSwitch: function(k) {
		var g = this.aTabLi,
		i = this.oBox,
		o = this.aTabTitle,
		d = this.oSiftTab,
		f = this.oTabs,
		m = this.oUl,
		a = this.aLi,
		n = this.oTryme,
		b = this.oDownloadApp,
		l = this.oMCommonHeader,
		c = document.documentElement.clientWidth,
		h = this.oUserAgent;
		i.tabIndex = k;
		if (l != null) {
			for (var e = 0; e < g.length; e++) {
				HeaderSlider.removeClass(o[e], "header-tab-selected")
			}
			HeaderSlider.addClass(o[i.tabIndex], "header-tab-selected")
		}
		i.sliderX = -(i.tabIndex * c);
		HeaderSlider.sliding(m, i.sliderX);
		HeaderSlider.headSwitch(d, i.tabIndex, 1);
		HeaderSlider.visible(d, i.tabIndex, 1);
		HeaderSlider.headSwitch(f, i.tabIndex, 2);
		this.HeightTimer();
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
		if (n && h.indexOf("Html5Plus") < 0) {
			if (!HeaderSlider.getSession("isPanelClose")) {
				n.style.display = "block"
			}
		}
		if (b && h.indexOf("Html5Plus") < 0) {
			if (!HeaderSlider.getSession("isPanelClose")) {
				b.style.display = "block"
			}
		}
		this.setHoldTopHeight();
		if (HeaderSlider.hasClass(a[i.tabIndex], "reply-body")) {
			window.removeEventListener("scroll", this, false)
		} else {
			window.addEventListener("scroll", this, false)
		}
	},
	windowScroll: function() {
		var d = this.oSiftTab,
		i = this.oBox,
		a = this.aLi,
		j = this,
		o = this.oTryme,
		b = this.oDownloadApp,
		g = this.oUserAgent,
		c = 10,
		e = 0,
		m = document.documentElement.clientHeight,
		n = document.querySelector(".hold-div-top").offsetHeight,
		l = document.querySelector(".hold-div-bottom").offsetHeight,
		f = $(".download-block-right")[0],
		h = document.getElementById("indexToTop");
		if (document.querySelector(".cart-concern-btm-fixed")) {
			e = document.querySelector(".cart-concern-btm-fixed").offsetHeight
		} else {
			e = 0
		}
		var k = m - n - l - e;
		window.addEventListener("scroll",
		function(p) {
			if (!HeaderSlider.hasClass(a[i.tabIndex], "reply-body")) {
				if (a[i.tabIndex].offsetHeight > k) {
					var q = document.documentElement.scrollTop || document.body.scrollTop;
					if (q >= 1) {
						if (o) {
							o.style.display = "none"
						}
						if (b) {
							b.style.display = "none"
						}
						if (q >= c) {
							c = q;
							if (d) {
								d.style.visibility = "hidden"
							}
						}
						if (q < c) {
							c = q;
							if (d) {
								d.style.visibility = "visible"
							}
						}
						j.setHoldTopHeight()
					} else {
						if (o && g.indexOf("Html5Plus") < 0) {
							if (!HeaderSlider.getSession("isPanelClose")) {
								o.style.display = "block"
							}
						}
						if (b && g.indexOf("Html5Plus") < 0) {
							if (!HeaderSlider.getSession("isPanelClose") && !i.isBtmDetail) {
								b.style.display = "block"
							}
						}
						if (d) {
							d.style.visibility = "visible"
						}
						j.setHoldTopHeight()
					}
				} else {
					if (d) {
						d.style.visibility = "visible"
					}
				}
			}
			var q = document.documentElement.scrollTop || document.body.scrollTop;
			if (!i.isBtmDetail) {
				if (q > m) {
					if (f) {
						f.style.bottom = "99px"
					}
					h.style.display = "block"
				} else {
					h.style.display = "none";
					if (f) {
						f.style.bottom = "57px"
					}
				}
			}
		},
		false)
	},
	assessScroll: function() {
		var d = this.oTabs,
		f = this.oBox,
		g = this,
		j = this.oTryme,
		b = this.oDownloadApp,
		e = this.oUserAgent,
		c = 10,
		i = document.querySelector(".jd-header-new-bar"),
		h = document.querySelector("#commentListId");
		if (i != null) {
			var a = i.offsetTop
		}
		if (h) {
			h.addEventListener("scroll",
			function() {
				var k = h.scrollTop;
				if (k > a) {
					if (j) {
						j.style.display = "none"
					}
					if (b) {
						b.style.display = "none"
					}
					if (k >= c) {
						c = k;
						if (d) {
							d.style.display = "none"
						}
					}
					if (k < c) {
						c = k;
						HeaderSlider.headSwitch(d, f.tabIndex, 2)
					}
					g.setHoldTopHeight()
				} else {
					if (j && e.indexOf("Html5Plus") < 0) {
						if (!HeaderSlider.getSession("isPanelClose")) {
							j.style.display = "block"
						}
					}
					if (b && e.indexOf("Html5Plus") < 0) {
						if (!HeaderSlider.getSession("isPanelClose")) {
							b.style.display = "block"
						}
					}
					g.setHoldTopHeight()
				}
			},
			false);
			window.removeEventListener("scroll", this, false)
		}
	},
	sliderJump: function() {
		var a = this.oBox;
		a.tabIndex++;
		if (this.defaults.loadInfoFn && typeof this.defaults.loadInfoFn == "function") {
			this.defaults.loadInfoFn(a.tabIndex, 1)
		}
		pingClickWithLevel("MProductdetail_PicSlideToDetail", "", "", "", "");
		this.tabSwitch(a.tabIndex);
		this.toTopMping(a.tabIndex)
	},
	btmDetailJump: function() {
		var p = this.oWrapper,
		a = this.oSiftTab,
		d = this.oBox,
		g = this.oDiv,
		r = this.oHeaderBarH,
		h = document.querySelector(".header-slider-con").offsetHeight,
		k = document.querySelector(".cart-concern-btm-fixed").offsetHeight,
		w = document.documentElement.clientHeight,
		x = document.getElementById("itemProductHead"),
		l = document.getElementById("itemDetailHead"),
		b = 0,
		n = document.querySelector(".hold-div-top").offsetHeight,
		m = document.querySelector(".hold-div-bottom").offsetHeight,
		t = document.getElementById("indexToTop"),
		v = document.getElementById("btmToTop"),
		q = document.querySelector(".new-wt"),
		j = "",
		e = this;
		d.isBtmDetail = true;
		g.removeEventListener("touchstart", this, false);
		pingClickWithLevel("MProductdetail_PullToDetail", "", "", "", "");
		HeaderSlider.setStyle(q, {
			backgroundColor: "#fff"
		});
		if (!itemInfoFlag) {
			productInfoLoad({
				containerID: "btmDetail",
				wareId: $("#currentWareId").val(),
				url: "/ware/detail.json?wareId=" + $("#currentWareId").val(),
				cbfn: function() {
					var i = document.getElementById("scale-parent2");
					scale("scale-parent", "scale-cont");
					if (i) {
						scale("scale-parent2", "scale-cont2")
					}
				},
				goProdBtnCbFn: function() {
					var z = document.querySelectorAll(".pro-button-box");
					if (z.length > 0) {
						for (var y = 0; y < z.length; y++) {
							z[y].removeEventListener("click", goViewDetail, false);
							z[y].addEventListener("click", e.btmDetailBackToTop.bind(e), false)
						}
					}
				}
			})
		} else {
			j = "";
			j = $("#goodDetail").html();
			setTimeout(function() {
				$("#btmDetail").html(j);
				$("#goodDetail").html("");
				e.clickDetailTab();
				var z = document.querySelectorAll(".pro-button-box");
				if (z.length > 0) {
					for (var y = 0; y < z.length; y++) {
						z[y].removeEventListener("click", goViewDetail, false);
						z[y].addEventListener("click", e.btmDetailBackToTop.bind(e), false)
					}
				}
			},
			200)
		}
		var c = document.querySelector(".jd-header-shortcut");
		if (c) {
			var u = c.offsetHeight
		} else {
			var u = 0
		}
		var s = w - k - m - r - u;
		HeaderSlider.setStyle(p, {
			transform: "translateY(-" + s + "px) translateZ(0px)",
			WebkitTransform: "translateY(-" + s + "px) translateZ(0px)",
			transition: "transform 1s cubic-bezier(0, 0, 0.25, 1) 0ms",
			WebkitTransition: "transform 1s cubic-bezier(0, 0, 0.25, 1) 0ms"
		});
		setTimeout(function() {
			HeaderSlider.setStyle(p, {
				transform: "translateY(-" + h + "px) translateZ(0px)",
				WebkitTransform: "translateY(-" + h + "px) translateZ(0px)",
				transition: "none",
				WebkitTransition: "none",
				height: w + "px"
			});
			window.scrollTo(0, 0);
			clearInterval(e.setHeightTimer);
			e.setHeightTimer = setInterval(function() {
				var B = document.getElementById("btmDetail").offsetHeight;
				if (a) {
					var A = a.offsetHeight
				} else {
					var A = 0
				}
				var z = document.querySelector(".jd-header-shortcut");
				if (z) {
					var i = z.offsetHeight
				} else {
					var i = 0
				}
				var y = B + r + A + m + i;
				HeaderSlider.setStyle(p, {
					height: y + "px"
				})
			},
			1000);
			clearTimeout(e.clearHeightTimer);
			e.clearHeightTimer = setTimeout(function() {
				clearInterval(e.setHeightTimer)
			},
			60000)
		},
		1200);
		if (x) {
			x.style.display = "none"
		}
		if (l) {
			l.style.display = "block"
		}
		if (a) {
			a.style.display = "block"
		}
		t.style.display = "none";
		v.style.display = "block";
		var f = document.querySelectorAll(".tab-lst-a");
		if (d.tabIndex == 0) {
			for (var o = 0; o < f.length; o++) { (function(i) {
					if (f[i]) {
						f[i].removeEventListener("click", clickRightDetailTab, false);
						f[i].addEventListener("click", e.clickBtmDetailTab.bind(e), false)
					}
				})(o)
			}
		}
		new PullLoad($("#btmLoading"), {
			trigger: $("#btmDetail"),
			elWindow: $(window),
			maxY: 73,
			lessText: e.defaults.itemPullHtml,
			greaterText: e.defaults.itemReleaseHtml,
			onReload: function() {
				this.origin();
				e.btmDetailBack();
				pingClickWithLevel("MProductdetail_DragToDetail", "", "", "", "")
			}
		})
	},
	btmDetailBack: function() {
		var e = this.oBox,
		b = this.oSiftTab,
		p = this.oWrapper,
		g = this.oDiv,
		r = this.oHeaderBarH,
		a = this.oUserAgent,
		j = document.getElementById("btmDetail"),
		h = document.querySelector(".header-slider-con").offsetHeight,
		k = document.querySelector(".cart-concern-btm-fixed").offsetHeight,
		v = document.documentElement.clientHeight,
		w = document.getElementById("itemProductHead"),
		l = document.getElementById("itemDetailHead"),
		u = document.getElementById("btmToTop"),
		m = document.querySelector(".hold-div-bottom").offsetHeight,
		c = document.querySelector(".jd-header-shortcut"),
		q = document.querySelector(".new-wt"),
		i = "",
		f = this;
		if (c) {
			var t = c.offsetHeight
		} else {
			var t = 0
		}
		j.style.height = "auto";
		clearInterval(this.setHeightTimer);
		e.isBtmDetail = false;
		if (a.indexOf("iPhone") != -1) {
			g.addEventListener("touchstart", this, false)
		}
		HeaderSlider.setStyle(q, {
			backgroundColor: "#f0f2f5"
		});
		var o = document.querySelector(".hold-div-top").offsetHeight;
		var d = h + r + m + t;
		var n = d + k - v;
		var s = h - v + k + m + o;
		HeaderSlider.setStyle(p, {
			transform: "translateY(-" + s + "px) translateZ(0px)",
			WebkitTransform: "translateY(-" + s + "px) translateZ(0px)",
			transition: "transform 1s cubic-bezier(0, 0, 0.25, 1) 0ms",
			WebkitTransition: "transform 1s cubic-bezier(0, 0, 0.25, 1) 0ms"
		});
		setTimeout(function() {
			HeaderSlider.setStyle(p, {
				transform: "translateY(0px) translateZ(0px)",
				WebkitTransform: "translateY(0px) translateZ(0px)",
				transition: "none",
				WebkitTransition: "none",
				height: d + "px"
			});
			window.scrollTo(0, n)
		},
		1200);
		if (b) {
			b.style.display = "none"
		}
		if (l) {
			l.style.display = "none"
		}
		u.style.display = "none";
		if (w) {
			w.style.display = "block"
		}
		i = $("#btmDetail").html();
		setTimeout(function() {
			$("#goodDetail").html(i);
			$("#btmDetail").html("");
			f.clickDetailTab();
			switchDetailTab();
			//goProdBtnFn()
		},
		200)
	},
	btmDetailBackToTop: function() {
		var e = this.oBox,
		b = this.oSiftTab,
		n = this.oWrapper,
		g = this.oDiv,
		p = this.oHeaderBarH,
		a = this.oUserAgent,
		l = this.oDownloadApp,
		j = document.getElementById("btmDetail"),
		h = document.querySelector(".header-slider-con").offsetHeight,
		s = document.getElementById("itemProductHead"),
		k = document.getElementById("itemDetailHead"),
		r = document.getElementById("btmToTop"),
		m = document.querySelector(".hold-div-bottom").offsetHeight,
		c = document.querySelector(".jd-header-shortcut"),
		o = document.querySelector(".new-wt"),
		i = "",
		f = this;
		if (c) {
			var q = c.offsetHeight
		} else {
			var q = 0
		}
		e.isBtmDetail = false;
		j.style.height = "auto";
		window.scrollTo(0, 0);
		clearInterval(this.setHeightTimer);
		if (a.indexOf("iPhone") != -1) {
			g.addEventListener("touchstart", this, false)
		}
		HeaderSlider.setStyle(o, {
			backgroundColor: "#f0f2f5"
		});
		var d = h + p + m + q;
		HeaderSlider.setStyle(n, {
			transform: "translateY(0px) translateZ(0px)",
			WebkitTransform: "translateY(0px) translateZ(0px)",
			transition: "transform 1s cubic-bezier(0, 0, 0.25, 1) 0ms",
			WebkitTransition: "transform 1s cubic-bezier(0, 0, 0.25, 1) 0ms",
			height: d + "px"
		});
		if (b) {
			b.style.display = "none"
		}
		if (k) {
			k.style.display = "none"
		}
		r.style.display = "none";
		if (s) {
			s.style.display = "block"
		}
		if (l && a.indexOf("Html5Plus") < 0) {
			if (!HeaderSlider.getSession("isPanelClose")) {
				l.style.display = "block"
			}
		}
		i = $("#btmDetail").html();
		setTimeout(function() {
			$("#goodDetail").html(i);
			$("#btmDetail").html("");
			f.clickDetailTab();
			switchDetailTab();
		},
		200)
	},
	clickBtmDetailTab: function(i) {
		var f = this.oSiftTab,
		a = this.oHeaderBarH,
		k = this.oWrapper,
		c = document.getElementById("btmDetail"),
		d = document.querySelector(".cart-concern-btm-fixed").offsetHeight,
		l = document.documentElement.clientHeight,
		m = document.querySelector(".hold-div-top").offsetHeight,
		j = document.querySelector(".hold-div-bottom").offsetHeight,
		b = i.target,
		g = b.getAttribute("value"),
		h = document.getElementById(g);
		clearInterval(this.setHeightTimer);
		c.style.height = "auto";
		window.scrollTo(0, 0);
		this.setHeightTimer = setInterval(function() {
			var r = c.offsetHeight;
			if (f) {
				var q = f.offsetHeight
			} else {
				var q = 0
			}
			var p = document.querySelector(".jd-header-shortcut");
			if (p) {
				var e = p.offsetHeight
			} else {
				var e = 0
			}
			var o = l - m - j - d;
			var n;
			if (r > o) {
				n = r + a + q + j + e;
				k.style.height = n + "px"
			} else {
				c.style.height = o + "px";
				h.style.height = o + "px";
				n = o + a + q + j + e;
				k.style.height = n + "px"
			}
		},
		800);
		clearTimeout(this.clearHeightTimer);
		this.clearHeightTimer = setTimeout(function() {
			clearInterval(this.setHeightTimer)
		},
		2500)
	},
	goBack: function() {
		var a = this.oBox;
		if (a.tabIndex && a.tabIndex !== 0) {
			a.tabIndex = 0;
			a.sliderX = 0;
			this.tabSwitch(a.tabIndex);
			this.toTopMping(a.tabIndex)
		} else {
			window.history.go( - 1)
		}
	},
	foldClick: function() {
		var c = document.querySelectorAll(".arrow-fold"),
		b = this;
		for (var a = 0; a < c.length; a++) {
			if (c[a]) {
				c[a].addEventListener("click",
				function() {
					b.HeightTimer()
				})
			}
		}
	},
	guessSwitch: function() {
		var a = document.querySelectorAll(".switch-title"),
		c = this;
		for (var b = 0; b < a.length; b++) {
			if (a[b]) {
				a[b].addEventListener("click",
				function() {
					c.HeightTimer()
				})
			}
		}
	},
	evaluateJump: function() {
		var f = this.oBox,
		d = this,
		c = document.getElementById("openAppFlagA").value,
		e = document.getElementById("downloadBM"),
		a,
		b;
		if (c) {
			a = 0;
			b = "caseA"
		} else {
			a = 4;
			b = ""
		}
		$(".detailInfoClick").on("click",
		function() {
			f.tabIndex = 1;
			if (d.defaults.loadInfoFn && typeof d.defaults.loadInfoFn == "function") {
				d.defaults.loadInfoFn(f.tabIndex, 1)
			}
			d.tabSwitch(f.tabIndex);
			d.toTopMping(f.tabIndex)
		});
		$("#bottomTipFloor").on("click",
		function() {
			d.btmDetailJump()
		})
	},
	aShortcutClick: function() {
		var e = this.oBox,
		g = this.oWrapper,
		b = document.querySelectorAll(".jd-header-icon-shortcut"),
		h = document.querySelector(".jd-header-shortcut"),
		j = 0,
		a,
		d,
		f = this;
		for (var c = 0; c < b.length; c++) {
			if (b[c]) {
				b[c].addEventListener("click",
				function() {
					$("#m_common_header_shortcut").toggleClass("hide");
					f.setHoldTopHeight();
					a = g.offsetHeight;
					if (e.tabIndex == 0 && typeof e.isBtmDetail == "boolean") {
						if ($("#m_common_header_shortcut").hasClass("hide")) {
							d = a - j;
							g.style.height = d + "px"
						} else {
							j = h.offsetHeight;
							d = a + j;
							g.style.height = d + "px"
						}
					}
				})
			}
		}
	},
	orientationchangeHandler: function() {
		var b = this.oUl,
		f = this.oBox;
		this.liInit();
		clearTimeout(e);
		var e = setTimeout(function() {
			var g = document.documentElement.clientWidth;
			f.sliderX = -(g * f.tabIndex);
			HeaderSlider.sliding(b, f.sliderX)
		},
		300);
		this.HeightTimer();
		if (f.isBtmDetail || f.tabIndex == 1) {
			var d = document.querySelectorAll(".tab-lst-a");
			for (var c = 0; c < d.length; c++) {
				if (HeaderSlider.hasClass(d[c], "on")) {
					if (d[c].getAttribute("value") == "wareInfo" || d[c].getAttribute("value") == "bookContent") {
						var a = document.getElementById("scale-parent2");
						scale("scale-parent", "scale-cont");
						if (a) {
							scale("scale-parent2", "scale-cont2")
						}
					}
				}
			}
		}
	},
	HeightTimer: function(c) {
		var d = this.oBox,
		a, b = this;
		if (c) {
			a = c
		} else {
			a = false
		}
		if (d.tabIndex == 1) {
			clearInterval(this.setHeightTimer);
			this.setHeightTimer = setInterval(function() {
				b.setHeight(a)
			},
			1000);
			clearTimeout(this.clearHeightTimer);
			this.clearHeightTimer = setTimeout(function() {
				clearInterval(b.setHeightTimer)
			},
			60000)
		} else {
			clearInterval(this.setHeightTimer);
			this.setHeightTimer = setInterval(function() {
				b.setHeight()
			},
			800);
			clearTimeout(this.clearHeightTimer);
			this.clearHeightTimer = setTimeout(function() {
				clearInterval(b.setHeightTimer)
			},
			2500)
		}
	},
	toTop: function() {
		var a = document.getElementById("indexToTop"),
		b = this.oSiftTab,
		d = this.oTabs,
		f = this.oBox,
		c = this.oMCommonHeader,
		e = $(".download-block-right")[0];
		if (a) {
			a.addEventListener("click",
			function() {
				if (c != null) {
					HeaderSlider.visible(b, f.tabIndex, 1);
					HeaderSlider.headSwitch(d, f.tabIndex, 2)
				}
				scroll(0, 0);
				a.style.display = "none";
				if (e) {
					e.style.bottom = "57px"
				}
			},
			false)
		}
	},
	toTopMping: function(b) {
		var a = $("#indexToTop");
		switch (b) {
		case 0:
			a.attr("report-eventid", "MProductdetail_BackToTop");
			break;
		case 1:
			a.attr("report-eventid", "MProductdetail_DetailBackToTop");
			break;
		case 2:
			a.attr("report-eventid", "MProductdetail_CommentBackToTop");
			break
		}
	},
	btmToTopFn: function() {
		var b = document.getElementById("btmToTop"),
		a = this;
		if (b) {
			b.addEventListener("click",
			function() {
				pingClickWithLevel("MProductdetail_TestBBackToTop", "", "", "", "");
				a.btmDetailBackToTop();
				b.style.display = "none";
				a.setHoldTopHeight()
			},
			false)
		}
	},
	slideMping: function(b, a) {
		var c = this.oBox;
		if (b == 0) {
			pingClickWithLevel("MProductdetail_ProductTabSlide", "", "", $("#currentWareId").val(), "5")
		} else {
			if (b == 1) {
				pingClickWithLevel("MProductdetail_DetailTabSlide", a, "", $("#currentWareId").val(), "5")
			} else {
				if (b == 2) {
					pingClickWithLevel("MProductdetail_CommentTabSlide", "", "", $("#currentWareId").val(), "5")
				}
			}
		}
		this.toTopMping(c.tabIndex)
	}
};
HeaderSlider.extend = function(c, b) {
	for (var a in b) {
		if (b[a] !== undefined) {
			c[a] = b[a]
		}
	}
};
HeaderSlider.extend(HeaderSlider, {
	setStyle: function(c, b) {
		for (var a in b) {
			c.style[a] = b[a]
		}
	},
	getStyle: function(b, a) {
		return (b.currentStyle || getComputedStyle(b, false))[a]
	},
	hasClass: function(b, a) {
		if (b) {
			return b.className.match(new RegExp("(\\s|^)" + a + "(\\s|$)"))
		}
	},
	addClass: function(b, a) {
		if (!HeaderSlider.hasClass(b, a)) {
			b.className += " " + a
		}
	},
	removeClass: function(c, a) {
		if (HeaderSlider.hasClass(c, a)) {
			var b = new RegExp("(\\s|^)" + a + "(\\s|$)");
			c.className = c.className.replace(b, " ")
		}
	},
	sliding: function(b, a) {
		HeaderSlider.setStyle(b, {
			WebkitTransition: "500ms ease",
			transition: "500ms ease"
		});
		HeaderSlider.setStyle(b, {
			WebkitTransform: "translate3d(" + a + "px,0,0)",
			transform: "translate3d(" + a + "px,0,0)"
		})
	},
	moving: function(b, a) {
		HeaderSlider.setStyle(b, {
			transform: "translate3d(" + a + "px,0,0)",
			WebkitTransform: "translate3d(" + a + "px,0,0)"
		})
	},
	headSwitch: function(c, a, b) {
		if (c != null) {
			if (a == b) {
				c.style.display = "block"
			} else {
				c.style.display = "none"
			}
		}
	},
	visible: function(c, a, b) {
		if (c != null) {
			if (a == b) {
				c.style.visibility = "visible"
			} else {
				c.style.visibility = "hidden"
			}
		}
	},
	getAngle: function(c, b, e, d) {
		var a = Math.abs(c - b);
		var h = Math.abs(e - d);
		var g = Math.sqrt(a * a + h * h);
		var f = Math.round((Math.asin(h / g) / Math.PI * 180));
		if (b >= c && d <= e) {
			f = f
		} else {
			if (b <= c && d <= e) {
				f = 180 - f
			} else {
				if (b <= c && d >= e) {
					f = 180 + f
				} else {
					if (b >= c && d >= e) {
						f = 360 - f
					}
				}
			}
		}
		return f
	},
	getSpeed: function(b, a, h, g, d) {
		var i = Math.abs(b - a);
		var f = Math.abs(h - g);
		var e = Math.sqrt(i * i + f * f);
		var c = e / d;
		return c
	},
	pingClick: function(g, d, c, a) {
		try {
			if ($("#pingUse").val()) {
				var f = new MPing.inputs.Click(g);
				f.event_param = d;
				f.page_param = a;
				var b = new MPing();
				b.send(f)
			}
		} catch(h) {}
	},
	pingClickWithLevel: function(h, d, c, a, g) {
		try {
			if ($("#pingUse").val()) {
				var f = new MPing.inputs.Click(h);
				f.event_param = d;
				f.page_param = a;
				f.event_level = g;
				var b = new MPing();
				b.send(f)
			}
		} catch(i) {}
	},
	getSession: function(a) {
		var c = window.sessionStorage;
		if (c) {
			var b = c.getItem(a);
			if (b) {
				if (b == "true") {
					return true
				}
			}
		}
		return false
	},
	setHash: function(a) {
		if (a == 0) {
			window.location.hash = ""
		} else {
			if (a == 1) {
				window.location.hash = "#detail"
			} else {
				if (a == 2) {
					window.location.hash = "#access"
				}
			}
		}
	},
	damping: function(f) {
		var e = [20, 40, 60, 80, 100];
		var d = [0.5, 0.4, 0.3, 0.2, 0.1];
		var b = f;
		var a = e.length;
		while (a--) {
			if (f > e[a]) {
				b = (f - e[a]) * d[a];
				for (var c = a; c > 0; c--) {
					b += (e[c] - e[c - 1]) * d[c - 1]
				}
				b += e[0] * 1;
				break
			}
		}
		return b
	}
});
var slide = (function() {
	var a = function(c) {
		return new b(c)
	};
	function b(c) {
		this.elem = c;
		this.oBox = document.querySelector(c);
		this.aLi = document.querySelectorAll(c + " [data-ul-child=child]");
		this.oUl = document.querySelector(c + " [data-slide-ul=firstUl]");
		this.now = 0;
		this.on0ff = false
	}
	b.prototype = {
		init: function(c) {
			var e = this;
			var c = c || {},
			d = this.aLi;
			this.defaults = {
				imgSrc: "imgsrc",
				startIndex: 0,
				loop: false,
				smallBtn: false,
				number: false,
				laseMoveFn: false,
				location: false,
				preDef: "lnr",
				autoPlay: false,
				autoHeight: false,
				preFn: null,
				lastImgSlider: false,
				playTime: 6000,
				mpingEvent: "",
				wareId: "",
				callback: null,
				verticalCenter: false,
				fullScreen: true,
				total: 0,
				isBanOneImg: true,
				whRatio: 1,
				numberWrapId: null
			};
			b.extend(this.defaults, c);
			e.imgSrc = e.defaults.imgSrc;
			this.now = this.defaults.startIndex;
			if (d.length > 0) {
				this.initBtn();
				this.liInit();
				this.bind()
			}
			if (this.defaults.autoPlay) {
				this.pause();
				this.play()
			}
		},
		initBtn: function() {
			this.aLi = document.querySelectorAll(this.elem + " [data-ul-child=child]");
			var d = this.aLi;
			if (this.defaults.callback) {
				this.defaults.callback(1)
			}
			if (this.defaults.smallBtn) {
				this.oSmallBtn = document.querySelector(this.elem + ' [data-small-btn="smallbtn"]');
				this.oSmallBtn.innerHTML = this.addSmallBtn();
				this.btns = document.querySelectorAll(this.elem + ' [data-ol-btn="btn"]');
				for (var c = 0; c < this.btns.length; c++) {
					this.btns[c].className = ""
				}
				this.btns[b.getNow(this.now, d.length)].className = "active"
			}
			if (this.defaults.number) {
				this.slideNub = document.querySelector(this.defaults.numberWrapId + ' [data-slide-num="slideNub"]');
				this.slideSum = document.querySelector(this.defaults.numberWrapId + ' [data-slide-num="slideSum"]');
				if (this.aLi.length == 1) {
					this.slideNub.innerHTML = 1
				} else {
					this.slideNub.innerHTML = (this.now + 1) % (this.aLi.length)
				}
				this.slideSum.innerHTML = this.aLi.length
			}
			this.defaults.total = this.aLi.length;
			if (this.aLi.length == 2 || this.aLi.length == 3) {
				if (this.defaults.loop) {
					this.oUl.innerHTML += this.oUl.innerHTML;
					this.need = true
				}
				this.aLi = document.querySelectorAll(this.elem + " [data-ul-child=child]")
			}
		},
		bind: function() {
			var f = this.oBox,
			e = b._device();
			if (!e.hasTouch) {
				f.style.cursor = "pointer";
				f.ondragstart = function(g) {
					if (g) {
						return false
					}
					return true
				}
			}
			var d = "onorientationchange" in window;
			var c = d ? "orientationchange": "resize";
			window.addEventListener(c, this);
			if (this.aLi.length < 2) {
				if (this.defaults.smallBtn) {
					this.oSmallBtn.style.display = "none"
				}
				if (this.defaults.isBanOneImg) {
					return
				}
			}
			f.addEventListener(e.startEvt, this);
			window.addEventListener("touchcancel", this);
			if (navigator.userAgent.indexOf("baidubrowser") != -1) {
				window.addEventListener("focusin", this);
				window.addEventListener("focusout", this)
			} else {
				window.addEventListener("blur", this);
				window.addEventListener("focus", this)
			}
		},
		liInit: function() {
			var d = this.aLi,
			g = d.length,
			o = this.oUl,
			m = this.oBox,
			c = 320,
			e = this.now,
			f = document.documentElement.clientWidth,
			n = this.defaults.whRatio,
			l = this;
			if (this.defaults.preFn) {
				this.defaults.preFn()
			}
			for (var j = 0; j < g; j++) {
				b.setStyle(d[j], {
					WebkitTransition: "all 0ms ease",
					transition: "all 0ms ease",
					height: "auto"
				})
			}
			if (this.defaults.fullScreen) {
				c = f
			} else {
				c = this.oBox.offsetWidth
			}
			if (c >= 640) {
				c = 640
			}
			if (this.defaults.autoHeight) {
				d[0].style.width = c + "px";
				if (d[0]) {
					var k = d[0].getElementsByTagName("img")[0];
					if (k) {
						var h = new Image();
						h.onload = function() {
							n = d[0].offsetWidth / d[0].offsetHeight;
							l.setWhFn(c, n)
						};
						h.src = k.src
					}
				}
			} else {
				this.setWhFn(c, n)
			}
			if (this.defaults.loop) {
				for (var j = 0; j < g; j++) {
					b.setStyle(d[j], {
						position: "absolute",
						left: 0,
						top: 0
					});
					if (j == b.getNow(e, g)) {
						l.loadImg(d[j]);
						b.setStyle(d[j], {
							WebkitTransform: "translate3d(" + 0 + "px, 0px, 0px)",
							transform: "translate3d(" + 0 + "px, 0px, 0px)",
							zIndex: 10
						})
					} else {
						if (j == b.getPre(e, g)) {
							b.setStyle(d[j], {
								WebkitTransform: "translate3d(" + -c + "px, 0px, 0px)",
								transform: "translate3d(" + -c + "px, 0px, 0px)",
								zIndex: 10
							})
						} else {
							if (j == b.getNext(e, g)) {
								b.setStyle(d[j], {
									WebkitTransform: "translate3d(" + c + "px, 0px, 0px)",
									transform: "translate3d(" + c + "px, 0px, 0px)",
									zIndex: 10
								})
							} else {
								if (j == b.getNextNew(e, g)) {
									b.setStyle(d[j], {
										WebkitTransform: "translate3d(" + c * 2 + "px, 0px, 0px)",
										transform: "translate3d(" + c * 2 + "px, 0px, 0px)",
										zIndex: 10
									})
								} else {
									b.setStyle(d[j], {
										WebkitTransform: "translate3d(" + -c + "px, 0px, 0px)",
										transform: "translate3d(" + -c + "px, 0px, 0px)",
										zIndex: 9
									})
								}
							}
						}
					}
				}
			} else {
				for (var j = 0; j < g; j++) {
					b.setStyle(d[j], {
						WebkitTransform: "translate3d(" + e * -c + "px, 0px, 0px)",
						transform: "translate3d(" + e * -c + "px, 0px, 0px)"
					})
				}
			}
		},
		setWhFn: function(c, g) {
			var j = this.aLi,
			f = j.length,
			d = this.oUl,
			h = this.oBox;
			h.style.width = c + "px";
			h.style.height = (c / g) + "px";
			d.style.width = c * f + "px";
			d.style.height = (c / g) + "px";
			for (var e = 0; e < f; e++) {
				j[e].style.width = c + "px";
				j[e].style.height = (c / g) + "px"
			}
		},
		handleEvent: function(d) {
			var c = b._device(),
			e = this.oBox;
			switch (d.type) {
			case c.startEvt:
				if (this.defaults.autoPlay) {
					this.pause()
				}
				this.startHandler(d);
				break;
			case c.moveEvt:
				if (this.defaults.autoPlay) {
					this.pause()
				}
				this.moveHandler(d);
				break;
			case c.endEvt:
				if (this.defaults.autoPlay) {
					this.pause();
					this.play()
				}
				this.endHandler(d);
				break;
			case "touchcancel":
				if (this.defaults.autoPlay) {
					this.pause();
					this.play()
				}
				this.endHandler(d);
				break;
			case "orientationchange":
				this.orientationchangeHandler();
				break;
			case "resize":
				this.orientationchangeHandler();
				break;
			case "focus":
				if (this.defaults.autoPlay) {
					this.pause();
					this.play()
				}
				break;
			case "blur":
				if (this.defaults.autoPlay) {
					this.pause()
				}
				break;
			case "focusin":
				if (this.defaults.autoPlay) {
					this.pause();
					this.play()
				}
				break;
			case "focusout":
				if (this.defaults.autoPlay) {
					this.pause()
				}
				break
			}
		},
		startHandler: function(e) {
			this.on0ff = true;
			var d = b._device(),
			f = d.hasTouch,
			h = this.oBox,
			c = this.now,
			g = this.aLi;
			h.addEventListener(d.moveEvt, this);
			h.addEventListener(d.endEvt, this);
			this.downTime = Date.now();
			this.downX = f ? e.targetTouches[0].pageX: e.clientX - h.offsetLeft;
			this.downY = f ? e.targetTouches[0].pageY: e.clientY - h.offsetTop;
			this.startT = b.getTranX(g[b.getNow(c, g.length)]);
			this.startNowT = b.getTranX(g[b.getNow(c, g.length)]);
			this.startPreT = b.getTranX(g[b.getPre(c, g.length)]);
			this.startNextT = b.getTranX(g[b.getNext(c, g.length)]);
			this.startNextN = b.getTranX(g[b.getNextNew(c, g.length)]);
			b.stopPropagation(e)
		},
		moveHandler: function(q) {
			var n = this.oBox,
			e = b._device();
			if (this.on0ff) {
				var o = e.hasTouch;
				var j = o ? q.targetTouches[0].pageX: q.clientX - n.offsetLeft;
				var h = o ? q.targetTouches[0].pageY: q.clientY - n.offsetTop;
				var c = this.aLi,
				g = c.length,
				d = this.now,
				t = c[0].offsetWidth;
				if (this.defaults.preDef == "all") {
					b.stopDefault(q)
				}
				for (var m = 0; m < g; m++) {
					b.setStyle(c[m], {
						WebkitTransition: "all 0ms ease",
						transition: "all 0ms ease"
					})
				}
				if (Math.abs(j - this.downX) < Math.abs(h - this.downY)) {
					if (this.defaults.preDef == "tnd" && this.defaults.preDef != "all") {
						b.stopDefault(q)
					}
				} else {
					if (Math.abs(j - this.downX) > 10) {
						if (this.defaults.preDef == "lnr" && this.defaults.preDef != "all") {
							b.stopDefault(q)
						}
						if (this.defaults.loop) {
							k = (this.startNowT + j - this.downX).toFixed(4);
							var s = (this.startPreT + j - this.downX).toFixed(4);
							var f = (this.startNextT + j - this.downX).toFixed(4);
							var l = (this.startNextN + j - this.downX).toFixed(4);
							b.move(c[b.getNow(d, g)], k, 10, this.defaults.fullScreen);
							b.move(c[b.getPre(d, g)], s, 10, this.defaults.fullScreen);
							b.move(c[b.getNext(d, g)], f, 10, this.defaults.fullScreen);
							b.move(c[b.getNextNew(d, g)], l, 10, this.defaults.fullScreen)
						} else {
							var k = b.getTranX(c[d]);
							if (k > 0) {
								var p = ((this.startT + j - this.downX) / 3).toFixed(4);
								for (var m = 0; m < g; m++) {
									b.move(c[m], p, 10, this.defaults.fullScreen)
								}
							} else {
								if (Math.abs(k) >= Math.abs((g - 1) * t)) {
									var p = (this.startT + (j - this.downX) / 3).toFixed(4);
									for (var m = 0; m < g; m++) {
										b.move(c[m], p, 10, this.defaults.fullScreen)
									}
									if (this.defaults.laseMoveFn && typeof this.defaults.laseMoveFn == "function") {
										var r = (p - this.startT).toFixed(4);
										this.defaults.laseMoveFn(r)
									}
								} else {
									var p = (this.startT + j - this.downX).toFixed(4);
									for (var m = 0; m < g; m++) {
										b.move(c[m], p, 10, this.defaults.fullScreen)
									}
								}
							}
						}
					}
				}
			} else {
				n.removeEventListener(e.moveEvt, this);
				n.removeEventListener(e.endEvt, this)
			}
			b.stopPropagation(q)
		},
		endHandler: function(i) {
			i.stopPropagation();
			this.on0ff = false;
			var f = Date.now(),
			e = b._device(),
			h = e.hasTouch,
			g = this.oBox,
			l = h ? i.changedTouches[0].pageX: i.clientX - g.offsetLeft,
			k = h ? i.changedTouches[0].pageY: i.clientY - g.offsetTop,
			c = this.aLi,
			j = c[0].offsetWidth,
			d = b.getTranX(c[b.getNow(this.now, c.length)]);
			if (l - this.downX < 30 && l - this.downX >= 0 && Math.abs(k - this.downY) < 30) {
				this.tab(d, "+=");
				return "click"
			} else {
				if (l - this.downX > -30 && l - this.downX <= 0 && Math.abs(k - this.downY) < 30) {
					this.tab(d, "-=");
					return "click"
				} else {
					if (Math.abs(k - this.downY) - Math.abs(l - this.downX) > 30 && l - this.downX < 0) {
						this.tab(d, "-=");
						return
					}
					if (Math.abs(k - this.downY) - Math.abs(l - this.downX) > 30 && l - this.downX > 0) {
						this.tab(d, "+=");
						return
					}
					if (l < this.downX) {
						if (this.downX - l > j / 3 || f - this.downTime < 200) {
							this.now++;
							this.tab(d, "++");
							pingClickWithLevel(this.defaults.mpingEvent, "", "", this.defaults.wareId, "");
							return "left"
						} else {
							this.tab(d, "+=");
							return "stay"
						}
					} else {
						if (l - this.downX > j / 3 || f - this.downTime < 200) {
							this.now--;
							this.tab(d, "--");
							pingClickWithLevel(this.defaults.mpingEvent, "", "", this.defaults.wareId, "");
							return "right"
						} else {
							this.tab(d, "-=");
							return "stay"
						}
					}
				}
			}
			b.stopPropagation(i);
			g.removeEventListener(e.moveEvt, this);
			g.removeEventListener(e.endEvt, this)
		},
		tab: function(e, l, f) {
			var c = this.aLi,
			k = c.length,
			r = c[0].offsetWidth,
			q = this.oBox,
			g = b._device(),
			p = this,
			d = this.now;
			if (this.defaults.callback && (l == "++" || l == "--")) {
				this.defaults.callback((b.getNow(d, k) + 1) % this.defaults.total == 0 ? this.defaults.total: (b.getNow(d, k) + 1) % this.defaults.total)
			}
			$(c[b.getNow(p.now, k)]).addClass("active").siblings().removeClass("active");
			p.loadImg(c[b.getNow(p.now, k)]);
			p.loadImg(c[b.getNow(p.now + 1, k)]);
			if (this.defaults.loop) {
				if (d < 0) {
					d = k - 1;
					this.now = k - 1
				}
				for (var o = 0; o < k; o++) {
					if (o == b.getPre(d, k)) {
						var h;
						switch (l) {
						case "++":
							h = 300;
							break;
						case "--":
							h = 0;
							break;
						case "+=":
							h = 0;
							break;
						case "-=":
							h = 300;
							break;
						default:
							break
						}
						b.setStyle(c[b.getPre(d, k)], {
							WebkitTransform: "translate3d(" + -r + "px, 0px, 0px)",
							transform: "translate3d(" + -r + "px, 0px, 0px)",
							zIndex: 10,
							WebkitTransition: "all " + h + "ms ease",
							transition: "all " + h + "ms ease"
						})
					} else {
						if (o == b.getNow(d, k)) {
							b.setStyle(c[b.getNow(d, k)], {
								WebkitTransform: "translate3d(" + 0 + "px, 0px, 0px)",
								transform: "translate3d(" + 0 + "px, 0px, 0px)",
								zIndex: 10,
								WebkitTransition: "all " + 300 + "ms ease",
								transition: "all " + 300 + "ms ease"
							})
						} else {
							if (o == b.getNext(d, k)) {
								var h = 300;
								switch (l) {
								case "++":
									h = 0;
									break;
								case "--":
									h = 300;
									break;
								case "+=":
									h = 300;
									break;
								case "-=":
									h = 0;
									break;
								default:
									break
								}
								b.setStyle(c[b.getNext(d, k)], {
									WebkitTransform: "translate3d(" + r + "px, 0px, 0px)",
									transform: "translate3d(" + r + "px, 0px, 0px)",
									zIndex: 10,
									WebkitTransition: "all " + h + "ms ease",
									transition: "all " + h + "ms ease"
								})
							} else {
								if (o == b.getNextNew(d, k)) {
									var h;
									switch (l) {
									case "++":
										h = 0;
										break;
									case "--":
										h = 300;
										break;
									case "+=":
										h = 300;
										break;
									case "-=":
										h = 0;
										break;
									default:
										break
									}
									b.setStyle(c[b.getNextNew(d, k)], {
										WebkitTransform: "translate3d(" + r * 2 + "px, 0px, 0px)",
										transform: "translate3d(" + r * 2 + "px, 0px, 0px)",
										zIndex: 10,
										WebkitTransition: "all " + h + "ms ease",
										transition: "all " + h + "ms ease"
									})
								} else {
									b.setStyle(c[o], {
										WebkitTransform: "translate3d(" + r * 2 + "px, 0px, 0px)",
										transform: "translate3d(" + r * 2 + "px, 0px, 0px)",
										zIndex: 9,
										WebkitTransition: "all " + 0 + "ms ease",
										transition: "all " + 0 + "ms ease"
									})
								}
							}
						}
					}
				}
			} else {
				for (var o = 0; o < k; o++) {
					b.setStyle(c[o], {
						WebkitTransition: "all " + 300 + "ms ease",
						transition: "all " + 300 + "ms ease"
					})
				}
				if (d <= 0) {
					d = 0;
					this.now = 0
				}
				if (d > k - 1) {
					if (f) {
						d = 0;
						this.now = 0
					} else {
						d = k - 1;
						this.now = k - 1
					}
				}
				for (var n = 0; n < k; n++) {
					b.setStyle(c[n], {
						WebkitTransform: "translate3d(" + ( - d * r) + "px, 0px, 0px)",
						transform: "translate3d(" + ( - d * r) + "px, 0px, 0px)"
					})
				}
			}
			if (this.defaults.smallBtn) {
				for (var o = 0; o < this.btns.length; o++) {
					this.btns[o].className = ""
				}
				if (this.need) {
					this.btns[b.getNow(d, k / 2)].className = "active"
				} else {
					this.btns[b.getNow(d, k)].className = "active"
				}
			}
			if (this.defaults.number) {
				this.slideNub.innerHTML = ((b.getNow(d, k) + 1) % this.defaults.total == 0 ? this.defaults.total: (b.getNow(d, k) + 1) % this.defaults.total)
			}
			c[b.getNow(d, k)].addEventListener("webkitTransitionEnd", m, false);
			c[b.getNow(d, k)].addEventListener("transitionend", m, false);
			function m() {
				if (p.defaults.location) {
					if (e < -(k - 1) * r - r / 5) {
						if (p.defaults.lastImgSlider && typeof p.defaults.lastImgSlider == "function") {
							p.defaults.laseMoveFn(0);
							p.defaults.lastImgSlider()
						}
					}
				}
				c[b.getNow(p.now, k)].removeEventListener("webkitTransitionEnd", m, false);
				c[b.getNow(p.now, k)].removeEventListener("transitionend", m, false)
			}
		},
		play: function() {
			var c = this;
			c.timer = setInterval(function() {
				c.now++;
				c.tab(null, "++", true)
			},
			this.defaults.playTime)
		},
		pause: function() {
			var c = this;
			clearInterval(c.timer)
		},
		orientationchangeHandler: function() {
			var c = this;
			setTimeout(function() {
				c.liInit()
			},
			300)
		},
		addSmallBtn: function() {
			var d = "",
			e = this.aLi;
			for (var c = 0; c < e.length; c++) {
				if (c == this.defaults.startIndex) {
					d += '<span class="active" data-ol-btn="btn"></span>'
				} else {
					d += '<span data-ol-btn="btn"></span>'
				}
			}
			return d
		},
		checkIphone: function() {
			var c = window.navigator.userAgent.toLowerCase();
			if (/iphone|ipd|ipod/.test(c)) {
				return true
			} else {
				return false
			}
		},
		setImgURL: function(d) {
			var g = this;
			var f = d.attr("" + g.imgSrc + "");
			var c = parseInt(d.width()) * 2;
			var e = parseInt(d.height()) * 2;
			f = f.replace(/(s[0-9]{0,4}x[0-9]{0,4}_)?jfs/, "s" + c + "x" + e + "_jfs");
			if (f.indexOf(".webp") == -1 && !g.checkIphone()) {
				f = f + ".webp"
			}
			return f
		},
		changSrc: function(c) {
			var g = this;
			var f = c.attr("" + g.imgSrc + "");
			var e = new Image();
			var d = g.setImgURL(c);
			c.css("opacity", 0);
			e.src = d;
			e.onload = function() {
				c.attr("src", d).removeAttr("" + g.imgSrc + "").css("opacity", 1)
			};
			e.onerror = function() {
				c.attr("src", f).removeAttr("" + g.imgSrc + "").css("opacity", 1)
			}
		},
		loadImg: function(e) {
			var f = this;
			var c = $(e).find("img");
			var d = $(e).find("img").attr("" + f.imgSrc + "");
			if (d) {
				f.changSrc(c)
			}
		},
		show: function() {
			this.oBox.style.display = "inline-block"
		},
		hide: function() {
			this.oBox.style.display = "none"
		}
	};
	b.extend = function(d, c) {
		for (name in c) {
			if (c[name] !== undefined) {
				d[name] = c[name]
			}
		}
	};
	b.extend(b, {
		setStyle: function(d, c) {
			for (name in c) {
				d.style[name] = c[name]
			}
		},
		getTranX: function(e) {
			var d = e.style.WebkitTransform || e.style.transform;
			var f = d.indexOf("translate3d(");
			var c = parseInt(d.substring(f + 12, d.length - 13));
			return c
		},
		_device: function() {
			var f = !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch);
			var d = "touchstart";
			var e = "touchmove";
			var c = "touchend";
			return {
				hasTouch: f,
				startEvt: d,
				moveEvt: e,
				endEvt: c
			}
		},
		getNow: function(d, c) {
			return d % c
		},
		getPre: function(e, c) {
			if (e % c - 1 < 0) {
				var d = c - 1
			} else {
				var d = e % c - 1
			}
			return d
		},
		getNext: function(e, d) {
			var c = (e + 1) % d;
			return c
		},
		getNextNew: function(e, d) {
			var c = (e + 2) % d;
			return c
		},
		move: function(f, d, e, c) {
			var g = e || null;
			if (g) {
				f.style.zIndex = g
			}
			b.setStyle(f, {
				WebkitTransform: "translate3d(" + d + "px, 0px, 0px)",
				transform: "translate3d(" + d + "px, 0px, 0px)"
			})
		},
		stopDefault: function(c) {
			if (c && c.preventDefault) {
				c.preventDefault()
			} else {
				window.event.returnValue = false
			}
			return false
		},
		stopPropagation: function(c) {
			if (c && c.stopPropagation) {
				c.stopPropagation()
			} else {
				c.cancelBubble = true
			}
		}
	});
	return a
})();
var slideshow = (function() {
	var b = function(c) {
		return new a(c)
	};
	function a(c) {
		this.p = c;
		this.oDiv = document.querySelector(c);
		this.oUl = document.querySelector(c + " .jd-slider-container");
		this.aLi = document.querySelectorAll(c + " .jd-slider-item");
		this.oBox = {
			startX: 0,
			startY: 0,
			finalX: 0,
			finalY: 0,
			endX: 0,
			endY: 0,
			sliderX: 0,
			sliderDirection: 1,
			moveX: 0,
			abortSlider: false,
			numTime: 0,
			isMove: false,
			oneWidthNum: 0
		}
	}
	a.prototype = {
		init: function(d) {
			var d = d || {};
			this.defaults = {
				lineNum: 1,
				marginValue: 0,
				fullScreen: false,
				multiMove: false,
				singleMove: false,
				isRight: false,
				isMove: false,
				isSymmetry: false,
				wrapperLeft: 0,
				smallBtn: false,
				startIndex: 0,
				UlMarRight: 0,
				mpingEvent: null,
				mpingFn: null
			};
			a.extend(this.defaults, d);
			if (this.defaults.lineNum != 1 && this.aLi.length < 8) {
				this.defaults.lineNum = 2
			}
			this.setItems();
			this.bind();
			if (this.defaults.smallBtn) {
				var c = this.oDiv.querySelector(".jd-slider-btnDiv");
				if (c != null) {
					c.innerHTML = this.addSmallBtn()
				}
			}
			a.sliding(this.oUl, 0)
		},
		bind: function() {
			var e = this.oDiv,
			d = "onorientationchange" in window,
			c = d ? "orientationchange": "resize";
			e.addEventListener("touchstart", this, false);
			window.addEventListener(c, this, false)
		},
		setItems: function() {
			var d = this.oDiv,
			h = this.aLi,
			c = this.oUl,
			g = this.oBox;
			this.oDivWidth = d.offsetWidth;
			this.oLiWidth = h[0].offsetWidth;
			this.oLiItemWidth = this.oLiWidth + this.defaults.marginValue;
			if (this.defaults.lineNum == 1) {
				var f = 0;
				for (var e = 0; e < h.length; e++) {
					f += h[e].offsetWidth + this.defaults.marginValue
				}
				this.oUlWidth = f + this.defaults.UlMarRight;
				g.oneWidthNum = h.length
			} else {
				if (h.length % this.defaults.lineNum !== 0) {
					g.oneWidthNum = parseInt(h.length / this.defaults.lineNum) + 1
				} else {
					g.oneWidthNum = h.length / this.defaults.lineNum
				}
				this.oUlWidth = this.oLiItemWidth * g.oneWidthNum + this.defaults.UlMarRight
			}
			if (this.defaults.isSymmetry) {
				this.eachScreenNum = parseInt((this.oDivWidth - 2 * this.defaults.wrapperLeft + this.defaults.marginValue) / this.oLiItemWidth)
			} else {
				this.eachScreenNum = parseInt(this.oDivWidth / this.oLiItemWidth)
			}
			this.eachScreenWidth = this.eachScreenNum * this.oLiItemWidth;
			c.style.width = this.oUlWidth + "px";
			if (this.oUlWidth <= this.oDivWidth) {
				g.abortSlider = true
			}
		},
		handleEvent: function(c) {
			switch (c.type) {
			case "touchstart":
				this.startHandler(c);
				break;
			case "touchmove":
				this.moveHandler(c);
				break;
			case "touchend":
				this.endHandler(c);
				break;
			case "orientationchange":
				this.orientationchangeHandler(c);
				break;
			case "resize":
				this.orientationchangeHandler(c);
				break
			}
		},
		startHandler: function(g) {
			g.stopPropagation();
			var f = g.targetTouches[0],
			d = this.oDiv,
			c = this.oUl,
			h = this.oBox;
			h.startX = f.pageX;
			h.startY = f.pageY;
			h.numTime = 0;
			h.isMove = false;
			if (h.abortSlider) {
				return
			}
			a.setStyle(c, {
				WebkitTransition: "",
				transition: ""
			});
			d.addEventListener("touchmove", this, false);
			d.addEventListener("touchend", this, false)
		},
		moveHandler: function(j) {
			j.stopPropagation();
			var k = j.touches[0],
			i = this.oBox,
			m = this.oUl,
			c = this.aLi,
			f = this.oUlWidth,
			l = this.oDivWidth,
			d = document.documentElement.clientWidth,
			h = this,
			g;
			if (i.abortSlider) {
				return
			}
			if (i.numTime === 0) {
				i.finalX = k.pageX;
				i.finalY = k.pageY;
				g = a.getAngle(i.startX, i.finalX, i.startY, i.finalY)
			}
			i.numTime++;
			if ((g >= 0 && g <= 45) || (g >= 135 && g <= 225) || (g >= 315 && g <= 360)) {
				i.isMove = true
			}
			if (i.isMove) {
				j.preventDefault();
				if (h.defaults.isMove) {
					i.moveX = i.sliderX + (i.finalX - i.startX);
					if (i.moveX > 0) {
						i.moveX = 0
					}
					if (i.moveX < -(f - l)) {
						i.moveX = -(f - l)
					}
					a.moving(m, i.moveX)
				}
			}
		},
		endHandler: function(l) {
			l.stopPropagation();
			var m = l.changedTouches[0],
			f = this.oDiv,
			n = this.oDivWidth,
			d = this.oUlWidth,
			i = this.eachScreenWidth,
			k = this.oBox,
			o = this.oUl,
			g = this.oLiWidth,
			h = this.oLiItemWidth,
			j = this,
			q = 0,
			c = 0,
			p;
			k.endX = m.pageX;
			k.endY = m.pageY;
			if (k.abortSlider) {
				return
			}
			if (k.isMove) {
				k.sliderDirection = (k.endX - k.startX < 0) ? "LEFT": "RIGHT";
				if (Math.abs(k.endX - k.startX) < g / 3) {
					a.sliding(o, k.sliderX)
				}
				if (k.sliderX > 0) {
					k.sliderX = 0;
					a.sliding(o, k.sliderX)
				} else {
					if (k.sliderX < -(d - n)) {
						k.sliderX = -(d - n);
						a.sliding(o, k.sliderX)
					} else {
						if (j.defaults.fullScreen) {
							if (k.sliderDirection == "LEFT") {
								p = d - n;
								k.sliderX = (p - Math.abs(k.sliderX) < n) ? -p: (k.sliderX - n)
							} else {
								k.sliderX = (k.sliderX + n > 0) ? 0 : k.sliderX + n
							}
						} else {
							if (j.defaults.multiMove) {
								if (k.sliderDirection == "LEFT") {
									p = d - i;
									if (p - Math.abs(k.sliderX) != 0 && p - Math.abs(k.sliderX) < n) {
										j.defaults.isRight = true
									}
									if (j.defaults.isSymmetry) {
										if (p - Math.abs(k.sliderX) != 0) {
											k.sliderX = (p - Math.abs(k.sliderX) < n) ? -(d - j.defaults.UlMarRight - n - j.defaults.marginValue) : (k.sliderX - i)
										} else {
											return
										}
									} else {
										k.sliderX = (p - Math.abs(k.sliderX) < n) ? -(d - j.defaults.UlMarRight - n) : (k.sliderX - i)
									}
								} else {
									if (j.defaults.isRight) {
										j.defaults.isRight = false;
										if (j.defaults.isSymmetry) {
											k.sliderX = (k.sliderX + n > 0) ? 0 : k.sliderX + i * 2 - n - j.defaults.marginValue
										} else {
											k.sliderX = (k.sliderX + n > 0) ? 0 : k.sliderX + i * 2 - n
										}
									} else {
										k.sliderX = (k.sliderX + n > 0) ? 0 : k.sliderX + i
									}
								}
							} else {
								if (j.defaults.singleMove) {
									if (k.sliderDirection == "LEFT") {
										q = Math.abs(k.endX - k.startX);
										c = parseInt(q / h);
										if ((q - c * h) >= (g / 3)) {
											c = c + 1
										}
										p = d - c * h;
										if (p - Math.abs(k.sliderX) < n) {
											j.defaults.isRight = true
										}
										k.sliderX = (p - Math.abs(k.sliderX) < n) ? -(d - n) : (k.sliderX - c * h)
									} else {
										q = Math.abs(k.endX - k.startX);
										c = parseInt(q / h);
										if ((q - c * h) >= (g / 3)) {
											c = c + 1
										}
										if (j.defaults.isRight) {
											j.defaults.isRight = false;
											k.sliderX = (k.sliderX + n > 0) ? 0 : (k.sliderX + c * h + i - n)
										} else {
											k.sliderX = (k.sliderX + n > 0) ? 0 : (k.sliderX + c * h)
										}
									}
								}
							}
						}
						if (this.defaults.smallBtn) {
							this.smallBtnSwitch()
						}
						a.sliding(o, k.sliderX);
						if (this.defaults.mpingFn && typeof this.defaults.mpingFn == "function") {
							this.defaults.mpingFn()
						}
						if (this.defaults.mpingEvent) {
							this.pingClick()
						}
					}
				}
			}
			f.removeEventListener("touchmove", this, false);
			f.removeEventListener("touchend", this, false)
		},
		orientationchangeHandler: function() {
			var g = this.oBox,
			c = this.oUl,
			d = this,
			f = window.navigator.userAgent;
			g.sliderX = 0;
			a.sliding(c, g.sliderX);
			clearTimeout(e);
			var e = setTimeout(function() {
				if (f.indexOf("OS 8") != -1 && f.indexOf("Safari") != -1) {
					var j = document.documentElement.clientWidth,
					i = document.querySelector(".cart-menu-content");
					if (i) {
						i.style.width = j + "px"
					}
				}
				d.setItems();
				if (d.defaults.smallBtn) {
					var h = d.oDiv.querySelector(".jd-slider-btnDiv");
					h.innerHTML = d.addSmallBtn()
				}
			},
			500)
		},
		addSmallBtn: function() {
			var h = "",
			c = 0,
			k = this.aLi,
			j = this.oBox,
			g = this.eachScreenNum,
			d = this.oDivWidth,
			f = this.oUlWidth;
			if (this.defaults.fullScreen) {
				c = Math.ceil(f / d)
			} else {
				if (this.defaults.multiMove) {
					if (g !== 0) {
						c = j.oneWidthNum / g
					}
				}
			}
			if (c && c > 1) {
				for (var e = 0; e < c; e++) {
					if (e == this.defaults.startIndex) {
						h += '<span class="active"></span>'
					} else {
						h += "<span></span>"
					}
				}
			}
			return h
		},
		smallBtnSwitch: function() {
			var f = this.oDiv,
			e = f.querySelectorAll(".jd-slider-btnDiv span"),
			k = this.oBox,
			c = this.oLiItemWidth,
			d = this.oDivWidth,
			h = this.eachScreenNum,
			j = 0;
			if (e.length !== 0) {
				if (this.defaults.fullScreen) {
					j = Math.ceil(Math.abs(k.sliderX / d))
				} else {
					if (this.defaults.multiMove) {
						j = Math.ceil(Math.abs(k.sliderX / c) / h)
					}
				}
				for (var g = 0; g < e.length; g++) {
					a.removeClass(e[g], "active")
				}
				a.addClass(e[j], "active")
			}
		},
		pingClick: function() {
			try {
				if ($("#pingUse").val()) {
					var d = new MPing.inputs.Click(this.defaults.mpingEvent);
					if (this.defaults.mpingEvent && this.defaults.mpingEvent == "MProductdetail_CouponSlide") {
						d.event_level = "5"
					}
					d.page_param = $("#currentWareId").val();
					var c = new MPing();
					c.send(d)
				}
			} catch(f) {
				console.log(f)
			}
		}
	};
	a.extend = function(e, d) {
		for (var c in d) {
			if (d[c] !== undefined) {
				e[c] = d[c]
			}
		}
	};
	a.extend(a, {
		setStyle: function(e, d) {
			for (var c in d) {
				e.style[c] = d[c]
			}
		},
		hasClass: function(d, c) {
			return d.className.match(new RegExp("(\\s|^)" + c + "(\\s|$)"))
		},
		addClass: function(d, c) {
			if (!a.hasClass(d, c)) {
				d.className += " " + c
			}
		},
		removeClass: function(e, c) {
			if (a.hasClass(e, c)) {
				var d = new RegExp("(\\s|^)" + c + "(\\s|$)");
				e.className = e.className.replace(d, " ")
			}
		},
		sliding: function(d, c) {
			a.setStyle(d, {
				WebkitTransition: "500ms ease",
				transition: "500ms ease"
			});
			a.setStyle(d, {
				WebkitTransform: "translate3d(" + c + "px,0,0)",
				transform: "translate3d(" + c + "px,0,0)"
			})
		},
		moving: function(d, c) {
			a.setStyle(d, {
				transform: "translate3d(" + c + "px,0,0)",
				WebkitTransform: "translate3d(" + c + "px,0,0)"
			})
		},
		getAngle: function(e, d, g, f) {
			var c = Math.abs(e - d);
			var j = Math.abs(g - f);
			var i = Math.sqrt(c * c + j * j);
			var h = Math.round((Math.asin(j / i) / Math.PI * 180));
			if (d >= e && f <= g) {
				h = h
			} else {
				if (d <= e && f <= g) {
					h = 180 - h
				} else {
					if (d <= e && f >= g) {
						h = 180 + h
					} else {
						if (d >= e && f >= g) {
							h = 360 - h
						}
					}
				}
			}
			return h
		}
	});
	return b
})(); (function(b) {
	b.fn.toast = function(c) {
		return new a(this[0], c)
	};
	var a = (function() {
		var c = function(e, d) {
			if (typeof e === "string" || e instanceof String) {
				this.container = document.getElementById(e)
			} else {
				this.container = e
			}
			if (!this.container) {
				window.alert("error finding container for toast " + e);
				return
			}
			if (typeof(d) === "string" || typeof(d) === "number") {
				d = {
					message: d
				}
			}
			if (d.autoClose === false) {
				d.autoClose = false
			} else {
				d.autoClose = true
			}
			this.styleType = d.styleType || 1;
			this.width = d.width ? d.width: this.width;
			this.height = d.height ? d.height: this.height;
			this.cls = d.cls ? d.cls: "";
			this.titleName = d.titleName || "";
			this.message = d.message || "";
			this.delay = d.delay || this.delay;
			this.autoClose = d.autoClose;
			this.isMaskClose = d.isMaskClose;
			this.maxHeight = d.maxHeight ? d.maxHeight: this.maxHeight;
			this.islimitHeight = d.islimitHeight ? d.islimitHeight: this.islimitHeight;
			this.okCallback = d.okCallback ? d.okCallback: this.okCallback;
			this.closeCallback = d.closeCallback ? d.closeCallback: this.closeCallback;
			this.btns = d.btns ? d.btns: this.btns;
			this.listContainer = d.listContainer ? d.listContainer: this.listContainer;
			this.container = b(this.container);
			if (this.container.find(".mjdToastContainer").length === 0) {
				this.container.append("<div class='mjdToastContainer'></div>")
			}
			this.container = this.container.find(".mjdToastContainer");
			this.container.removeClass("tr tb br tl tc bc");
			this.show()
		};
		c.prototype = {
			cls: null,
			titleName: null,
			message: null,
			delay: 2000,
			styleType: 1,
			el: null,
			container: null,
			listContainer: null,
			timer: null,
			width: 0,
			height: 0,
			autoClose: true,
			isMaskClose: true,
			scrollH: "",
			bodyH: "",
			maxHeight: 0,
			islimitHeight: true,
			btns: {
				cancelTxt: "取消",
				okTxt: "提交"
			},
			okCallback: function() {},
			closeCallback: function() {},
			show: function() {
				var d = this;
				var g = this.addHtml();
				this.el = b(g).get(0);
				this.container.append(this.el);
				var f = b(d.el);
				if (d.listContainer != null) {
					var e = b(d.listContainer);
					d.bodyH = e.height();
					d.scrollH = document.body.scrollTop
				}
				d.setPosition(f);
				d.setEvent(f);
				if (d.styleType == 1) {
					d.islimitHeight = false
				}
				if (d.islimitHeight) {
					d.setBody(1)
				}
				if (d.autoClose) {
					d.timer = setTimeout(function() {
						d.hide()
					},
					this.delay)
				}
			},
			setEvent: function(e) {
				var d = this;
				switch (d.styleType) {
				case 1:
					if (d.isMaskClose) {
						e.bind("click",
						function() {
							d.hide()
						})
					}
					break;
				case 2:
					b(".btn-close").bind("click",
					function() {
						d.closeCallback();
						d.hide()
					});
					b(".btn-sure").bind("click",
					function() {
						d.okCallback();
						d.hide()
					});
					break;
				case 3:
					if (d.isMaskClose) {
						b(".cover-floor").bind("click",
						function() {
							d.hide()
						})
					}
					b(".btn-cancel").bind("click",
					function() {
						d.closeCallback();
						d.hide()
					});
					b(".btn-ok").bind("click",
					function() {
						d.okCallback();
						d.hide()
					});
					break;
				case 4:
					b(".one-btn-tip-btn").bind("click",
					function() {
						d.hide()
					});
					break;
				default:
					break
				}
			},
			setPosition: function(e) {
				var d = this;
				var f = e.find(".content-box");
				if (d.width > 0) {
					f.css("width", d.width)
				} else {
					d.width = f.css("width").replace("px", "")
				}
				if (d.height <= 0) {
					d.height = f.css("height").replace("px", "")
				}
				f.css("marginLeft", -d.width / 2);
				f.css("marginTop", -d.height / 2);
				var g = e.find(".txt-max-height");
				g.css({
					maxHeight: d.maxHeight,
					overflowX: "hidden",
					overflowY: "auto"
				})
			},
			setBody: function(g) {
				var e = this;
				var d = document.documentElement.clientHeight;
				var f = b(e.listContainer);
				if (g == 1) {
					f.css({
						height: d,
						overflow: "hidden"
					})
				} else {
					if (g == 2) {
						f.css({
							height: e.bodyH,
							overflow: ""
						});
						document.body.scrollTop = e.scrollH
					}
				}
			},
			hide: function() {
				var d = this;
				if (d.islimitHeight) {
					d.setBody(2)
				}
				if (d.timer != null) {
					clearTimeout(d.timer)
				}
				d.remove()
			},
			remove: function() {
				var d = b(this.el);
				d.remove()
			},
			addHtml: function() {
				var e = this;
				var d = "";
				switch (e.styleType) {
				case 1:
					d = '<div class="shade-floor">';
					d += '<div class="message-box content-box">';
					d += '<div class="message-box-icon"><i class="message-icon ' + e.cls + '"></i></div>';
					d += '<div class="message-box-content txt-align">' + e.message + "</div>";
					d += "</div>";
					d += "</div>";
					break;
				case 2:
					d = '<div class="shade-floor">';
					d += '<div class="cover-floor"></div>';
					d += '<div class="choose-box content-box">';
					d += '<div class="choose-box-title">' + e.titleName + "</div>";
					d += '<div class="message-div">';
					d += '<div class="message-txt">' + e.message + "</div>";
					d += '</div><div class="choose-box-btn">';
					d += '<a class="btn-close">' + e.btns.cancelTxt + "</a>";
					d += '<a class="btn-sure">' + e.btns.okTxt + "</a>";
					d += "</div></div></div>";
					break;
				case 3:
					d += '<div class="shade-floor" id="pop-modal">';
					d += '<div class="cover-floor"></div>';
					d += ' <div class="info-box content-box">';
					d += ' <div class="info-box-content bdb-1px">';
					d += ' <span class="info-box-text">' + e.message + "</span>";
					d += ' </div><div class="box-container"><div class="btn-box">';
					d += ' <a class="btn-box-item"><i class="btn-cancel">' + e.btns.cancelTxt + "</i></a>";
					d += ' <a  class="btn-box-item"><i class="btn-ok">' + e.btns.okTxt + "</i></a>";
					d += " </div></div></div></div>";
					break;
				case 4:
					d += '<div class="shade-floor" id="popModalOneBtn" style="visibility:visible;">';
					d += '<div class="cover-floor"></div>';
					d += ' <div class="content-box one-btn-tip-box-tip">';
					d += '   <div class="one-btn-tip-info">';
					d += '     <span class="txt-max-height">' + e.message + "</span>";
					d += "   </div>";
					d += '   <div class="one-btn-tip-btn">' + e.btns.closeTxt + "</div>";
					d += " </div></div>";
					break;
				default:
					break
				}
				return d
			}
		};
		return c
	})();
	b.toast = function(c) {
		b(document.body).toast(c)
	}
})($); (function(d) {
	var c = d.jdM = d.jdM || {};
	localStorageUtil = function() {
		var h = window.localStorage ? true: false;
		function f(k) {
			var j = null;
			if (h && k) {
				rss = window.localStorage.getItem(k)
			}
			return rss
		}
		function i(j, k) {
			if (h && j) {
				try {
					window.localStorage[j] = k
				} catch(l) {
					console.log("error");
					h = false
				}
			}
		}
		function e(j) {
			if (h && j) {
				window.localStorage.removeItem(j)
			}
		}
		function g() {
			if (h) {
				b.each(window.localStorage,
				function(l, m, k, j) {
					window.localStorage.removeItem(k)
				})
			}
		}
		return {
			get: f,
			set: i,
			remove: e,
			removeAll: g
		}
	};
	sessionStorageUtil = function() {
		var h = window.sessionStorage ? true: false;
		function f(k) {
			var j = null;
			if (h && k) {
				rss = window.sessionStorage.getItem(k)
			}
			return rss
		}
		function i(j, k) {
			if (h && j) {
				try {
					window.sessionStorage[j] = k
				} catch(l) {
					console.log("error");
					h = false
				}
			}
		}
		function e(j) {
			if (h && j) {
				window.sessionStorage.removeItem(j)
			}
		}
		function g() {
			if (h) {
				b.each(window.sessionStorage,
				function(l, m, k, j) {
					window.sessionStorage.removeItem(k)
				})
			}
		}
		return {
			get: f,
			set: i,
			remove: e,
			removeAll: g
		}
	};
	var a = {
		toString: function(e, m) {
			var l = undefined;
			var j = e.getFullYear();
			var i = e.getMonth() + 1;
			var k = e.getDate();
			var f = e.getHours();
			var g = e.getMinutes();
			var h = e.getSeconds();
			i = (parseInt(i) < 10) ? ("0" + i) : (i);
			k = (parseInt(k) < 10) ? ("0" + k) : (k);
			f = (parseInt(f) < 10) ? ("0" + f) : (f);
			g = (parseInt(g) < 10) ? ("0" + g) : (g);
			h = (parseInt(h) < 10) ? ("0" + h) : (h);
			if ("yyyy-MM-dd HH:mm:ss" == m) {
				l = j + "-" + i + "-" + k + " " + f + ":" + g + ":" + h
			} else {
				if ("yyyy-MM-dd" == m) {
					l = j + "-" + i + "-" + k
				} else {
					if ("yyyy-MM" == m) {
						l = j + "-" + i
					} else {
						if ("yyyy" == m) {
							l = j
						}
					}
				}
			}
			return l
		},
		toDate: function(j) {
			if (j.length == 19) {
				var i = j.substring(0, 4);
				var k = j.substring(5, 7);
				var f = j.substring(8, 10);
				var e = j.substring(11, 13);
				var g = j.substring(14, 16);
				var h = j.substring(17, 19);
				return new Date(i, k - 1, f, e, g, h)
			} else {
				if (j.length == 10) {
					var i = j.substring(0, 4);
					var k = j.substring(5, 7);
					var f = j.substring(8, 10);
					return new Date(i, k - 1, f)
				} else {
					if (j.length == 7) {
						var i = j.substring(0, 4);
						var k = j.substring(5, 7);
						return new Date(i, k - 1)
					} else {
						if (j.length == 4) {
							var i = j.substring(0, 4);
							return new Date(i)
						} else {
							return undefined
						}
					}
				}
			}
		},
		getMonthDays: function(e, h) {
			var f = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
			var g = e.getFullYear();
			if (typeof h == "undefined") {
				h = e.getMonth()
			}
			if (((0 == (g % 4)) && ((0 != (g % 100)) || (0 == (g % 400)))) && h == 1) {
				return 29
			} else {
				return f[h]
			}
		},
		addDays: function(e, g) {
			var f = (arguments.length == 1) ? a.toDate(a.today()) : a.toDate(g);
			f = new Date(f.getTime() + parseInt(e) * 24 * 3600 * 1000);
			return a.toString(new Date(f), "yyyy-MM-dd HH:mm:ss")
		},
		addMonths: function(i, h) {
			var e = (arguments.length == 1) ? a.toDate(a.today()) : a.toDate(h);
			var f = e.getMonth();
			var g = e.getDate();
			var j = a.getMonthDays(e, e.getMonth() + parseInt(i));
			if (g > j) {
				e.setDate(j)
			}
			e.setMonth(e.getMonth() + parseInt(i));
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		addMonthsForStart: function(g, f) {
			var e = (arguments.length == 1) ? a.today() : f;
			e = a.addMonths(g, e);
			return a.firstDayOfMonth(e)
		},
		addMonthsForEnd: function(g, f) {
			var e = (arguments.length == 1) ? a.today() : f;
			e = a.addMonths(g, e);
			return a.addDays( - 1, a.firstDayOfMonth(e))
		},
		addYears: function(f, g) {
			var e = (arguments.length == 1) ? a.toDate(a.today()) : a.toDate(g);
			e.setYear(e.getYear() + parseInt(f));
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		addYearsForStart: function(e, g) {
			var f = (arguments.length == 1) ? a.today() : g;
			f = a.addYears(e, f);
			return a.firstDayOfYear(f)
		},
		addYearsForEnd: function(e, g) {
			var f = (arguments.length == 1) ? a.today() : g;
			f = a.addYears(e, f);
			return a.firstDayOfYear(f)
		},
		sunOfWeek: function(f) {
			var e = (arguments.length == 0) ? a.toDate(a.today()) : a.toDate(f);
			e = new Date(e - (e.getDay()) * (24 * 3600 * 1000));
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		monOfWeek: function(f) {
			var e = (arguments.length == 0) ? a.toDate(a.today()) : a.toDate(f);
			e = new Date(e - (e.getDay() - 1) * (24 * 3600 * 1000));
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		tueOfWeek: function(f) {
			var e = (arguments.length == 0) ? a.toDate(a.today()) : a.toDate(f);
			e = new Date(e - (e.getDay() - 2) * (24 * 3600 * 1000));
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		wedOfWeek: function(f) {
			var e = (arguments.length == 0) ? a.toDate(a.today()) : a.toDate(f);
			e = new Date(e - (e.getDay() - 3) * (24 * 3600 * 1000));
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		turOfWeek: function(f) {
			var e = (arguments.length == 0) ? a.toDate(a.today()) : a.toDate(f);
			e = new Date(e - (e.getDay() - 4) * (24 * 3600 * 1000));
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		friOfWeek: function(f) {
			var e = (arguments.length == 0) ? a.toDate(a.today()) : a.toDate(f);
			e = new Date(e - (e.getDay() - 5) * (24 * 3600 * 1000));
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		satOfWeek: function(f) {
			var e = (arguments.length == 0) ? a.toDate(a.today()) : a.toDate(f);
			e = new Date(e - (e.getDay() - 6) * (24 * 3600 * 1000));
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		firstDayOfMonth: function(f) {
			var e = (arguments.length == 0) ? a.toDate(a.today()) : a.toDate(f);
			e.setDate(1);
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		lastDayOfMonth: function(e) {
			e = (arguments.length == 0) ? a.today() : (e);
			e = a.addMonths(1, e);
			e = a.firstDayOfMonth(e);
			e = a.addDays( - 1, e);
			return e
		},
		firstDayOfYear: function(f) {
			var e = (arguments.length == 0) ? a.toDate(a.today()) : a.toDate(f);
			e.setMonth(0);
			e.setDate(1);
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		lastDayOfYear: function(f) {
			var e = (arguments.length == 0) ? a.toDate(a.today()) : a.toDate(f);
			e.setMonth(11);
			e.setDate(31);
			return a.toString(e, "yyyy-MM-dd HH:mm:ss")
		},
		today: function(e) {
			if (arguments.length == 0) {
				return a.toString(new Date(), "yyyy-MM-dd")
			} else {
				return a.toString(new Date(), e)
			}
		}
	};
	var b = {
		$mObj: {},
		merge: function(g, f, e) {
			if (!g || !f || typeof f != "object") {
				return g
			}
			if (!e) {
				for (var j in f) {
					g[j] = f[j]
				}
			} else {
				var i, h;
				for (i in f) {
					if (f.hasOwnProperty(i)) {
						h = f[i];
						if (h && h.constructor === Object) {
							if (g[i] && g[i].constructor === Object) {
								b.merge(g[i], h)
							} else {
								g[i] = h
							}
						} else {
							g[i] = h
						}
					}
				}
			}
			return g
		},
		clone: function(f, e) {
			return b.merge({},
			f, e)
		},
		namespace: function() {
			var f = d,
			m, h, k, g, l, n;
			for (k = 0, l = arguments.length; k < l; k++) {
				var e = arguments[k];
				if (b.$mObj.namespace[e]) {
					continue
				}
				m = e.split(".");
				for (g = 0, n = m.length; g < n; g++) {
					h = m[g];
					if (!f[h]) {
						f[h] = {}
					}
					f = f[h]
				}
				b.$mObj.namespace[e] = true
			}
		},
		extend: function() {
			var e = function(g) {
				for (var f in g) {
					if (!g.hasOwnProperty(f)) {
						continue
					}
					this[f] = g[f]
				}
			};
			return function(i, h) { (typeof i == "function") || (i = function() {});
				var f = function() {
					i.apply(this, arguments)
				};
				var g = function() {};
				g.prototype = i.prototype;
				f.prototype = new g();
				f.prototype.constructor = f;
				f.superclass = i.prototype;
				if (i.prototype.constructor === Object.prototype.constructor) {
					i.prototype.constructor = i
				}
				f.override = function(k) {
					if (f.prototype && k && typeof k == "object") {
						for (var j in k) {
							f.prototype[j] = k[j]
						}
					}
				};
				f.prototype.override = e;
				f.override(h);
				return f
			}
		} (),
		each: function(g, m, k) {
			if (b.isEmpty(g) || !m) {
				return
			}
			if (b.isArray(g)) {
				for (var j = 0,
				f = g.length; j < f; j++) {
					try {
						if (m.call(k, g[j], j, g) === false) {
							return
						}
					} catch(n) {
						M.log(n, "error")
					}
				}
			} else {
				for (var h in g) {
					if (!g.hasOwnProperty(h)) {
						continue
					}
					try {
						if (m.call(k, g[h], h, g) === false) {
							return
						}
					} catch(n) {
						M.log(n, "error")
					}
				}
			}
		},
		contains: function(h, g) {
			if (b.isArray(h)) {
				if ("indexOf" in Array.prototype) {
					return h.indexOf(g) !== -1
				}
				var e, f;
				for (e = 0, f = h.length; e < f; e++) {
					if (h[e] === g) {
						return true
					}
				}
				return false
			} else {
				return ! b.isEmpty(h) && g in h
			}
		},
		isEmpty: function(e, g) {
			if ((typeof e === "undefined") || (e === null) || (!g ? e === "": false) || (b.isArray(e) && e.length === 0)) {
				return true
			} else {
				if (b.isObject(e)) {
					for (var f in e) {
						if (Object.prototype.hasOwnProperty.call(e, f)) {
							return false
						}
					}
					return true
				}
			}
			return false
		},
		isBlank: function(e) {
			return b.isEmpty(e) ? true: b.isEmpty(String(e).replace(/^\s+|\s+$/g, ""))
		},
		isDefined: function(e) {
			return typeof e === "undefined"
		},
		isObject: function(e) {
			if (Object.prototype.toString.call(null) === "[object Object]") {
				return e !== null && e !== undefined && Object.prototype.toString.call(e) === "[object Object]" && e.ownerDocument === undefined
			} else {
				return Object.prototype.toString.call(e) === "[object Object]"
			}
		},
		isFunction: function(e) {
			return Object.prototype.toString.apply(e) === "[object Function]"
		},
		isArray: function(e) {
			return Object.prototype.toString.apply(e) === "[object Array]"
		},
		isDate: function(e) {
			return Object.prototype.toString.apply(e) === "[object Date]"
		},
		isNumber: function(e) {
			return typeof e === "number" && isFinite(e)
		},
		isString: function(e) {
			return typeof e === "string"
		},
		isBoolean: function(e) {
			return typeof e === "boolean"
		}
	};
	c.localstorage = new localStorageUtil();
	c.sessionstorage = new sessionStorageUtil();
	c.date = a;
	c.object = b
})(window);
var regionLevels = {
	region: [{
		addressList: [{
			id: "1",
			name: "北京"
		},
		{
			id: "2",
			name: "上海"
		},
		{
			id: "3",
			name: "天津"
		},
		{
			id: "4",
			name: "重庆"
		},
		{
			id: "5",
			name: "河北"
		},
		{
			id: "6",
			name: "山西"
		},
		{
			id: "7",
			name: "河南"
		},
		{
			id: "8",
			name: "辽宁"
		},
		{
			id: "9",
			name: "吉林"
		},
		{
			id: "10",
			name: "黑龙江"
		},
		{
			id: "11",
			name: "内蒙古"
		},
		{
			id: "12",
			name: "江苏"
		},
		{
			id: "13",
			name: "山东"
		},
		{
			id: "14",
			name: "安徽"
		},
		{
			id: "15",
			name: "浙江"
		},
		{
			id: "16",
			name: "福建"
		},
		{
			id: "17",
			name: "湖北"
		},
		{
			id: "18",
			name: "湖南"
		},
		{
			id: "19",
			name: "广东"
		},
		{
			id: "20",
			name: "广西"
		},
		{
			id: "21",
			name: "江西"
		},
		{
			id: "22",
			name: "四川"
		},
		{
			id: "23",
			name: "海南"
		},
		{
			id: "24",
			name: "贵州"
		},
		{
			id: "25",
			name: "云南"
		},
		{
			id: "26",
			name: "西藏"
		},
		{
			id: "27",
			name: "陕西"
		},
		{
			id: "28",
			name: "甘肃"
		},
		{
			id: "29",
			name: "青海"
		},
		{
			id: "30",
			name: "宁夏"
		},
		{
			id: "31",
			name: "新疆"
		},
		{
			id: "32",
			name: "台湾"
		},
		{
			id: "52993",
			name: "港澳"
		},
		{
			id: "84",
			name: "钓鱼岛"
		}]
	},
	{
		addressList: [{
			id: "72",
			name: "朝阳区"
		},
		{
			id: "2800",
			name: "海淀区"
		},
		{
			id: "2801",
			name: "西城区"
		},
		{
			id: "2802",
			name: "东城区"
		},
		{
			id: "2803",
			name: "崇文区"
		},
		{
			id: "2804",
			name: "宣武区"
		},
		{
			id: "2805",
			name: "丰台区"
		},
		{
			id: "2806",
			name: "石景山区"
		},
		{
			id: "2807",
			name: "门头沟"
		},
		{
			id: "2808",
			name: "房山区"
		},
		{
			id: "2809",
			name: "通州区"
		},
		{
			id: "2810",
			name: "大兴区"
		},
		{
			id: "2812",
			name: "顺义区"
		},
		{
			id: "2814",
			name: "怀柔区"
		},
		{
			id: "2816",
			name: "密云区"
		},
		{
			id: "2901",
			name: "昌平区"
		},
		{
			id: "2953",
			name: "平谷区"
		},
		{
			id: "3065",
			name: "延庆县"
		}]
	},
	{
		addressList: [{
			id: "78",
			name: "黄浦区"
		},
		{
			id: "2813",
			name: "徐汇区"
		},
		{
			id: "2815",
			name: "长宁区"
		},
		{
			id: "2817",
			name: "静安区"
		},
		{
			id: "2820",
			name: "闸北区"
		},
		{
			id: "2822",
			name: "虹口区"
		},
		{
			id: "2823",
			name: "杨浦区"
		},
		{
			id: "2824",
			name: "宝山区"
		},
		{
			id: "2825",
			name: "闵行区"
		},
		{
			id: "2826",
			name: "嘉定区"
		},
		{
			id: "2830",
			name: "浦东新区"
		},
		{
			id: "2833",
			name: "青浦区"
		},
		{
			id: "2834",
			name: "松江区"
		},
		{
			id: "2835",
			name: "金山区"
		},
		{
			id: "2837",
			name: "奉贤区"
		},
		{
			id: "2841",
			name: "普陀区"
		},
		{
			id: "2919",
			name: "崇明县"
		}]
	},
	{
		addressList: [{
			id: "51035",
			name: "东丽区"
		},
		{
			id: "51036",
			name: "和平区"
		},
		{
			id: "51037",
			name: "河北区"
		},
		{
			id: "51038",
			name: "河东区"
		},
		{
			id: "51039",
			name: "河西区"
		},
		{
			id: "51040",
			name: "红桥区"
		},
		{
			id: "51041",
			name: "蓟县"
		},
		{
			id: "51042",
			name: "静海县"
		},
		{
			id: "51043",
			name: "南开区"
		},
		{
			id: "51044",
			name: "塘沽区"
		},
		{
			id: "51045",
			name: "西青区"
		},
		{
			id: "51046",
			name: "武清区"
		},
		{
			id: "51047",
			name: "津南区"
		},
		{
			id: "51048",
			name: "汉沽区"
		},
		{
			id: "51049",
			name: "大港区"
		},
		{
			id: "51050",
			name: "北辰区"
		},
		{
			id: "51051",
			name: "宝坻区"
		},
		{
			id: "51052",
			name: "宁河县"
		}]
	},
	{
		addressList: [{
			id: "113",
			name: "万州区"
		},
		{
			id: "114",
			name: "涪陵区"
		},
		{
			id: "115",
			name: "梁平县"
		},
		{
			id: "119",
			name: "南川区"
		},
		{
			id: "123",
			name: "潼南县"
		},
		{
			id: "126",
			name: "大足区"
		},
		{
			id: "128",
			name: "黔江区"
		},
		{
			id: "129",
			name: "武隆县"
		},
		{
			id: "130",
			name: "丰都县"
		},
		{
			id: "131",
			name: "奉节县"
		},
		{
			id: "132",
			name: "开县"
		},
		{
			id: "133",
			name: "云阳县"
		},
		{
			id: "134",
			name: "忠县"
		},
		{
			id: "135",
			name: "巫溪县"
		},
		{
			id: "136",
			name: "巫山县"
		},
		{
			id: "137",
			name: "石柱县"
		},
		{
			id: "138",
			name: "彭水县"
		},
		{
			id: "139",
			name: "垫江县"
		},
		{
			id: "140",
			name: "酉阳县"
		},
		{
			id: "141",
			name: "秀山县"
		},
		{
			id: "4164",
			name: "城口县"
		},
		{
			id: "48131",
			name: "璧山县"
		},
		{
			id: "48132",
			name: "荣昌县"
		},
		{
			id: "48133",
			name: "铜梁县"
		},
		{
			id: "48201",
			name: "合川区"
		},
		{
			id: "48202",
			name: "巴南区"
		},
		{
			id: "48203",
			name: "北碚区"
		},
		{
			id: "48204",
			name: "江津区"
		},
		{
			id: "48205",
			name: "渝北区"
		},
		{
			id: "48206",
			name: "长寿区"
		},
		{
			id: "48207",
			name: "永川区"
		},
		{
			id: "50950",
			name: "江北区"
		},
		{
			id: "50951",
			name: "南岸区"
		},
		{
			id: "50952",
			name: "九龙坡区"
		},
		{
			id: "50953",
			name: "沙坪坝区"
		},
		{
			id: "50954",
			name: "大渡口区"
		},
		{
			id: "50995",
			name: "綦江区"
		},
		{
			id: "51026",
			name: "渝中区"
		},
		{
			id: "51027",
			name: "高新区"
		},
		{
			id: "51028",
			name: "北部新区"
		}]
	},
	{
		addressList: [{
			id: "142",
			name: "石家庄市"
		},
		{
			id: "148",
			name: "邯郸市"
		},
		{
			id: "164",
			name: "邢台市"
		},
		{
			id: "199",
			name: "保定市"
		},
		{
			id: "224",
			name: "张家口市"
		},
		{
			id: "239",
			name: "承德市"
		},
		{
			id: "248",
			name: "秦皇岛市"
		},
		{
			id: "258",
			name: "唐山市"
		},
		{
			id: "264",
			name: "沧州市"
		},
		{
			id: "274",
			name: "廊坊市"
		},
		{
			id: "275",
			name: "衡水市"
		}]
	},
	{
		addressList: [{
			id: "303",
			name: "太原市"
		},
		{
			id: "309",
			name: "大同市"
		},
		{
			id: "318",
			name: "阳泉市"
		},
		{
			id: "325",
			name: "晋城市"
		},
		{
			id: "330",
			name: "朔州市"
		},
		{
			id: "336",
			name: "晋中市"
		},
		{
			id: "350",
			name: "忻州市"
		},
		{
			id: "368",
			name: "吕梁市"
		},
		{
			id: "379",
			name: "临汾市"
		},
		{
			id: "398",
			name: "运城市"
		},
		{
			id: "3074",
			name: "长治市"
		}]
	},
	{
		addressList: [{
			id: "412",
			name: "郑州市"
		},
		{
			id: "420",
			name: "开封市"
		},
		{
			id: "427",
			name: "洛阳市"
		},
		{
			id: "438",
			name: "平顶山市"
		},
		{
			id: "446",
			name: "焦作市"
		},
		{
			id: "454",
			name: "鹤壁市"
		},
		{
			id: "458",
			name: "新乡市"
		},
		{
			id: "468",
			name: "安阳市"
		},
		{
			id: "475",
			name: "濮阳市"
		},
		{
			id: "482",
			name: "许昌市"
		},
		{
			id: "489",
			name: "漯河市"
		},
		{
			id: "495",
			name: "三门峡市"
		},
		{
			id: "502",
			name: "南阳市"
		},
		{
			id: "517",
			name: "商丘市"
		},
		{
			id: "527",
			name: "周口市"
		},
		{
			id: "538",
			name: "驻马店市"
		},
		{
			id: "549",
			name: "信阳市"
		},
		{
			id: "2780",
			name: "济源市"
		}]
	},
	{
		addressList: [{
			id: "560",
			name: "沈阳市"
		},
		{
			id: "573",
			name: "大连市"
		},
		{
			id: "579",
			name: "鞍山市"
		},
		{
			id: "584",
			name: "抚顺市"
		},
		{
			id: "589",
			name: "本溪市"
		},
		{
			id: "593",
			name: "丹东市"
		},
		{
			id: "598",
			name: "锦州市"
		},
		{
			id: "604",
			name: "葫芦岛市"
		},
		{
			id: "609",
			name: "营口市"
		},
		{
			id: "613",
			name: "盘锦市"
		},
		{
			id: "617",
			name: "阜新市"
		},
		{
			id: "621",
			name: "辽阳市"
		},
		{
			id: "632",
			name: "朝阳市"
		},
		{
			id: "6858",
			name: "铁岭市"
		}]
	},
	{
		addressList: [{
			id: "639",
			name: "长春市"
		},
		{
			id: "644",
			name: "吉林市"
		},
		{
			id: "651",
			name: "四平市"
		},
		{
			id: "657",
			name: "通化市"
		},
		{
			id: "664",
			name: "白山市"
		},
		{
			id: "674",
			name: "松原市"
		},
		{
			id: "681",
			name: "白城市"
		},
		{
			id: "687",
			name: "延边州"
		},
		{
			id: "2992",
			name: "辽源市"
		}]
	},
	{
		addressList: [{
			id: "698",
			name: "哈尔滨市"
		},
		{
			id: "712",
			name: "齐齐哈尔市"
		},
		{
			id: "727",
			name: "鹤岗市"
		},
		{
			id: "731",
			name: "双鸭山市"
		},
		{
			id: "737",
			name: "鸡西市"
		},
		{
			id: "742",
			name: "大庆市"
		},
		{
			id: "753",
			name: "伊春市"
		},
		{
			id: "757",
			name: "牡丹江市"
		},
		{
			id: "765",
			name: "佳木斯市"
		},
		{
			id: "773",
			name: "七台河市"
		},
		{
			id: "776",
			name: "黑河市"
		},
		{
			id: "782",
			name: "绥化市"
		},
		{
			id: "793",
			name: "大兴安岭地区"
		}]
	},
	{
		addressList: [{
			id: "799",
			name: "呼和浩特市"
		},
		{
			id: "805",
			name: "包头市"
		},
		{
			id: "810",
			name: "乌海市"
		},
		{
			id: "812",
			name: "赤峰市"
		},
		{
			id: "823",
			name: "乌兰察布市"
		},
		{
			id: "835",
			name: "锡林郭勒盟"
		},
		{
			id: "848",
			name: "呼伦贝尔市"
		},
		{
			id: "870",
			name: "鄂尔多斯市"
		},
		{
			id: "880",
			name: "巴彦淖尔市"
		},
		{
			id: "891",
			name: "阿拉善盟"
		},
		{
			id: "895",
			name: "兴安盟"
		},
		{
			id: "902",
			name: "通辽市"
		}]
	},
	{
		addressList: [{
			id: "904",
			name: "南京市"
		},
		{
			id: "911",
			name: "徐州市"
		},
		{
			id: "919",
			name: "连云港市"
		},
		{
			id: "925",
			name: "淮安市"
		},
		{
			id: "933",
			name: "宿迁市"
		},
		{
			id: "939",
			name: "盐城市"
		},
		{
			id: "951",
			name: "扬州市"
		},
		{
			id: "959",
			name: "泰州市"
		},
		{
			id: "965",
			name: "南通市"
		},
		{
			id: "972",
			name: "镇江市"
		},
		{
			id: "978",
			name: "常州市"
		},
		{
			id: "984",
			name: "无锡市"
		},
		{
			id: "988",
			name: "苏州市"
		}]
	},
	{
		addressList: [{
			id: "1000",
			name: "济南市"
		},
		{
			id: "1007",
			name: "青岛市"
		},
		{
			id: "1016",
			name: "淄博市"
		},
		{
			id: "1022",
			name: "枣庄市"
		},
		{
			id: "1025",
			name: "东营市"
		},
		{
			id: "1032",
			name: "潍坊市"
		},
		{
			id: "1042",
			name: "烟台市"
		},
		{
			id: "1053",
			name: "威海市"
		},
		{
			id: "1058",
			name: "莱芜市"
		},
		{
			id: "1060",
			name: "德州市"
		},
		{
			id: "1072",
			name: "临沂市"
		},
		{
			id: "1081",
			name: "聊城市"
		},
		{
			id: "1090",
			name: "滨州市"
		},
		{
			id: "1099",
			name: "菏泽市"
		},
		{
			id: "1108",
			name: "日照市"
		},
		{
			id: "1112",
			name: "泰安市"
		},
		{
			id: "2900",
			name: "济宁市"
		}]
	},
	{
		addressList: [{
			id: "1114",
			name: "铜陵市"
		},
		{
			id: "1116",
			name: "合肥市"
		},
		{
			id: "1121",
			name: "淮南市"
		},
		{
			id: "1124",
			name: "淮北市"
		},
		{
			id: "1127",
			name: "芜湖市"
		},
		{
			id: "1132",
			name: "蚌埠市"
		},
		{
			id: "1137",
			name: "马鞍山市"
		},
		{
			id: "1140",
			name: "安庆市"
		},
		{
			id: "1151",
			name: "黄山市"
		},
		{
			id: "1159",
			name: "滁州市"
		},
		{
			id: "1167",
			name: "阜阳市"
		},
		{
			id: "1174",
			name: "亳州市"
		},
		{
			id: "1180",
			name: "宿州市"
		},
		{
			id: "1201",
			name: "池州市"
		},
		{
			id: "1206",
			name: "六安市"
		},
		{
			id: "2971",
			name: "宣城市"
		}]
	},
	{
		addressList: [{
			id: "1158",
			name: "宁波市"
		},
		{
			id: "1213",
			name: "杭州市"
		},
		{
			id: "1233",
			name: "温州市"
		},
		{
			id: "1243",
			name: "嘉兴市"
		},
		{
			id: "1250",
			name: "湖州市"
		},
		{
			id: "1255",
			name: "绍兴市"
		},
		{
			id: "1262",
			name: "金华市"
		},
		{
			id: "1273",
			name: "衢州市"
		},
		{
			id: "1280",
			name: "丽水市"
		},
		{
			id: "1290",
			name: "台州市"
		},
		{
			id: "1298",
			name: "舟山市"
		}]
	},
	{
		addressList: [{
			id: "1303",
			name: "福州市"
		},
		{
			id: "1315",
			name: "厦门市"
		},
		{
			id: "1317",
			name: "三明市"
		},
		{
			id: "1329",
			name: "莆田市"
		},
		{
			id: "1332",
			name: "泉州市"
		},
		{
			id: "1341",
			name: "漳州市"
		},
		{
			id: "1352",
			name: "南平市"
		},
		{
			id: "1362",
			name: "龙岩市"
		},
		{
			id: "1370",
			name: "宁德市"
		}]
	},
	{
		addressList: [{
			id: "1381",
			name: "武汉市"
		},
		{
			id: "1387",
			name: "黄石市"
		},
		{
			id: "1396",
			name: "襄阳市"
		},
		{
			id: "1405",
			name: "十堰市"
		},
		{
			id: "1413",
			name: "荆州市"
		},
		{
			id: "1421",
			name: "宜昌市"
		},
		{
			id: "1432",
			name: "孝感市"
		},
		{
			id: "1441",
			name: "黄冈市"
		},
		{
			id: "1458",
			name: "咸宁市"
		},
		{
			id: "1466",
			name: "恩施州"
		},
		{
			id: "1475",
			name: "鄂州市"
		},
		{
			id: "1477",
			name: "荆门市"
		},
		{
			id: "1479",
			name: "随州市"
		},
		{
			id: "2922",
			name: "潜江市"
		},
		{
			id: "2980",
			name: "天门市"
		},
		{
			id: "2983",
			name: "仙桃市"
		},
		{
			id: "3154",
			name: "神农架林区"
		}]
	},
	{
		addressList: [{
			id: "1482",
			name: "长沙市"
		},
		{
			id: "1488",
			name: "株洲市"
		},
		{
			id: "1495",
			name: "湘潭市"
		},
		{
			id: "1499",
			name: "韶山市"
		},
		{
			id: "1501",
			name: "衡阳市"
		},
		{
			id: "1511",
			name: "邵阳市"
		},
		{
			id: "1522",
			name: "岳阳市"
		},
		{
			id: "1530",
			name: "常德市"
		},
		{
			id: "1540",
			name: "张家界市"
		},
		{
			id: "1544",
			name: "郴州市"
		},
		{
			id: "1555",
			name: "益阳市"
		},
		{
			id: "1560",
			name: "永州市"
		},
		{
			id: "1574",
			name: "怀化市"
		},
		{
			id: "1586",
			name: "娄底市"
		},
		{
			id: "1592",
			name: "湘西州"
		}]
	},
	{
		addressList: [{
			id: "1601",
			name: "广州市"
		},
		{
			id: "1607",
			name: "深圳市"
		},
		{
			id: "1609",
			name: "珠海市"
		},
		{
			id: "1611",
			name: "汕头市"
		},
		{
			id: "1617",
			name: "韶关市"
		},
		{
			id: "1627",
			name: "河源市"
		},
		{
			id: "1634",
			name: "梅州市"
		},
		{
			id: "1643",
			name: "惠州市"
		},
		{
			id: "1650",
			name: "汕尾市"
		},
		{
			id: "1655",
			name: "东莞市"
		},
		{
			id: "1657",
			name: "中山市"
		},
		{
			id: "1659",
			name: "江门市"
		},
		{
			id: "1666",
			name: "佛山市"
		},
		{
			id: "1672",
			name: "阳江市"
		},
		{
			id: "1677",
			name: "湛江市"
		},
		{
			id: "1684",
			name: "茂名市"
		},
		{
			id: "1690",
			name: "肇庆市"
		},
		{
			id: "1698",
			name: "云浮市"
		},
		{
			id: "1704",
			name: "清远市"
		},
		{
			id: "1705",
			name: "潮州市"
		},
		{
			id: "1709",
			name: "揭阳市"
		}]
	},
	{
		addressList: [{
			id: "1715",
			name: "南宁市"
		},
		{
			id: "1720",
			name: "柳州市"
		},
		{
			id: "1726",
			name: "桂林市"
		},
		{
			id: "1740",
			name: "梧州市"
		},
		{
			id: "1746",
			name: "北海市"
		},
		{
			id: "1749",
			name: "防城港市"
		},
		{
			id: "1753",
			name: "钦州市"
		},
		{
			id: "1757",
			name: "贵港市"
		},
		{
			id: "1761",
			name: "玉林市"
		},
		{
			id: "1792",
			name: "贺州市"
		},
		{
			id: "1806",
			name: "百色市"
		},
		{
			id: "1818",
			name: "河池市"
		},
		{
			id: "3044",
			name: "来宾市"
		},
		{
			id: "3168",
			name: "崇左市"
		}]
	},
	{
		addressList: [{
			id: "1827",
			name: "南昌市"
		},
		{
			id: "1832",
			name: "景德镇市"
		},
		{
			id: "1836",
			name: "萍乡市"
		},
		{
			id: "1842",
			name: "新余市"
		},
		{
			id: "1845",
			name: "九江市"
		},
		{
			id: "1857",
			name: "鹰潭市"
		},
		{
			id: "1861",
			name: "上饶市"
		},
		{
			id: "1874",
			name: "宜春市"
		},
		{
			id: "1885",
			name: "抚州市"
		},
		{
			id: "1898",
			name: "吉安市"
		},
		{
			id: "1911",
			name: "赣州市"
		}]
	},
	{
		addressList: [{
			id: "1930",
			name: "成都市"
		},
		{
			id: "1946",
			name: "自贡市"
		},
		{
			id: "1950",
			name: "攀枝花市"
		},
		{
			id: "1954",
			name: "泸州市"
		},
		{
			id: "1960",
			name: "绵阳市"
		},
		{
			id: "1962",
			name: "德阳市"
		},
		{
			id: "1977",
			name: "广元市"
		},
		{
			id: "1983",
			name: "遂宁市"
		},
		{
			id: "1988",
			name: "内江市"
		},
		{
			id: "1993",
			name: "乐山市"
		},
		{
			id: "2005",
			name: "宜宾市"
		},
		{
			id: "2016",
			name: "广安市"
		},
		{
			id: "2022",
			name: "南充市"
		},
		{
			id: "2033",
			name: "达州市"
		},
		{
			id: "2042",
			name: "巴中市"
		},
		{
			id: "2047",
			name: "雅安市"
		},
		{
			id: "2058",
			name: "眉山市"
		},
		{
			id: "2065",
			name: "资阳市"
		},
		{
			id: "2070",
			name: "阿坝州"
		},
		{
			id: "2084",
			name: "甘孜州"
		},
		{
			id: "2103",
			name: "凉山州"
		}]
	},
	{
		addressList: [{
			id: "2121",
			name: "海口市"
		},
		{
			id: "3034",
			name: "儋州市"
		},
		{
			id: "3115",
			name: "琼海市"
		},
		{
			id: "3137",
			name: "万宁市"
		},
		{
			id: "3173",
			name: "东方市"
		},
		{
			id: "3690",
			name: "三亚市"
		},
		{
			id: "3698",
			name: "文昌市"
		},
		{
			id: "3699",
			name: "五指山市"
		},
		{
			id: "3701",
			name: "临高县"
		},
		{
			id: "3702",
			name: "澄迈县"
		},
		{
			id: "3703",
			name: "定安县"
		},
		{
			id: "3704",
			name: "屯昌县"
		},
		{
			id: "3705",
			name: "昌江县"
		},
		{
			id: "3706",
			name: "白沙县"
		},
		{
			id: "3707",
			name: "琼中县"
		},
		{
			id: "3708",
			name: "陵水县"
		},
		{
			id: "3709",
			name: "保亭县"
		},
		{
			id: "3710",
			name: "乐东县"
		},
		{
			id: "3711",
			name: "三沙市"
		}]
	},
	{
		addressList: [{
			id: "2144",
			name: "贵阳市"
		},
		{
			id: "2150",
			name: "六盘水市"
		},
		{
			id: "2155",
			name: "遵义市"
		},
		{
			id: "2169",
			name: "铜仁市"
		},
		{
			id: "2180",
			name: "毕节市"
		},
		{
			id: "2189",
			name: "安顺市"
		},
		{
			id: "2196",
			name: "黔西南州"
		},
		{
			id: "2205",
			name: "黔东南州"
		},
		{
			id: "2222",
			name: "黔南州"
		}]
	},
	{
		addressList: [{
			id: "2235",
			name: "昆明市"
		},
		{
			id: "2247",
			name: "曲靖市"
		},
		{
			id: "2258",
			name: "玉溪市"
		},
		{
			id: "2270",
			name: "昭通市"
		},
		{
			id: "2281",
			name: "普洱市"
		},
		{
			id: "2291",
			name: "临沧市"
		},
		{
			id: "2298",
			name: "保山市"
		},
		{
			id: "2304",
			name: "丽江市"
		},
		{
			id: "2309",
			name: "文山州"
		},
		{
			id: "2318",
			name: "红河州"
		},
		{
			id: "2332",
			name: "西双版纳州"
		},
		{
			id: "2336",
			name: "楚雄州"
		},
		{
			id: "2347",
			name: "大理州"
		},
		{
			id: "2360",
			name: "德宏州"
		},
		{
			id: "2366",
			name: "怒江州"
		},
		{
			id: "4108",
			name: "迪庆州"
		}]
	},
	{
		addressList: [{
			id: "2951",
			name: "拉萨市"
		},
		{
			id: "3107",
			name: "那曲地区"
		},
		{
			id: "3129",
			name: "山南地区"
		},
		{
			id: "3138",
			name: "昌都地区"
		},
		{
			id: "3144",
			name: "日喀则地区"
		},
		{
			id: "3970",
			name: "阿里地区"
		},
		{
			id: "3971",
			name: "林芝地区"
		}]
	},
	{
		addressList: [{
			id: "2376",
			name: "西安市"
		},
		{
			id: "2386",
			name: "铜川市"
		},
		{
			id: "2390",
			name: "宝鸡市"
		},
		{
			id: "2402",
			name: "咸阳市"
		},
		{
			id: "2416",
			name: "渭南市"
		},
		{
			id: "2428",
			name: "延安市"
		},
		{
			id: "2442",
			name: "汉中市"
		},
		{
			id: "2454",
			name: "榆林市"
		},
		{
			id: "2468",
			name: "商洛市"
		},
		{
			id: "2476",
			name: "安康市"
		}]
	},
	{
		addressList: [{
			id: "2487",
			name: "兰州市"
		},
		{
			id: "2492",
			name: "金昌市"
		},
		{
			id: "2495",
			name: "白银市"
		},
		{
			id: "2501",
			name: "天水市"
		},
		{
			id: "2509",
			name: "嘉峪关市"
		},
		{
			id: "2518",
			name: "平凉市"
		},
		{
			id: "2525",
			name: "庆阳市"
		},
		{
			id: "2534",
			name: "陇南市"
		},
		{
			id: "2544",
			name: "武威市"
		},
		{
			id: "2549",
			name: "张掖市"
		},
		{
			id: "2556",
			name: "酒泉市"
		},
		{
			id: "2564",
			name: "甘南州"
		},
		{
			id: "2573",
			name: "临夏州"
		},
		{
			id: "3080",
			name: "定西市"
		}]
	},
	{
		addressList: [{
			id: "2580",
			name: "西宁市"
		},
		{
			id: "2585",
			name: "海东地区"
		},
		{
			id: "2592",
			name: "海北州"
		},
		{
			id: "2597",
			name: "黄南州"
		},
		{
			id: "2603",
			name: "海南州"
		},
		{
			id: "2605",
			name: "果洛州"
		},
		{
			id: "2612",
			name: "玉树州"
		},
		{
			id: "2620",
			name: "海西州"
		}]
	},
	{
		addressList: [{
			id: "2628",
			name: "银川市"
		},
		{
			id: "2632",
			name: "石嘴山市"
		},
		{
			id: "2637",
			name: "吴忠市"
		},
		{
			id: "2644",
			name: "固原市"
		},
		{
			id: "3071",
			name: "中卫市"
		}]
	},
	{
		addressList: [{
			id: "2652",
			name: "乌鲁木齐市"
		},
		{
			id: "2654",
			name: "克拉玛依市"
		},
		{
			id: "2656",
			name: "石河子市"
		},
		{
			id: "2658",
			name: "吐鲁番地区"
		},
		{
			id: "2662",
			name: "哈密地区"
		},
		{
			id: "2666",
			name: "和田地区"
		},
		{
			id: "2675",
			name: "阿克苏地区"
		},
		{
			id: "2686",
			name: "喀什地区"
		},
		{
			id: "2699",
			name: "克孜勒苏州"
		},
		{
			id: "2704",
			name: "巴音郭楞州"
		},
		{
			id: "2714",
			name: "昌吉州"
		},
		{
			id: "2723",
			name: "博尔塔拉州"
		},
		{
			id: "2727",
			name: "伊犁州"
		},
		{
			id: "2736",
			name: "塔城地区"
		},
		{
			id: "2744",
			name: "阿勒泰地区"
		},
		{
			id: "4110",
			name: "五家渠市"
		},
		{
			id: "15945",
			name: "阿拉尔市"
		},
		{
			id: "15946",
			name: "图木舒克市"
		}]
	},
	{
		addressList: [{
			id: "2768",
			name: "台湾"
		}]
	},
	{
		addressList: [{
			id: "52994",
			name: "香港特别行政区"
		},
		{
			id: "52995",
			name: "澳门特别行政区"
		}]
	}]
};
var mitemAddrName = ""; (function(a) {
	a.fn.generateRegionList = function(e) {
		var c, j;
		var b = a("#btn-select-region");
		var i = a("#region-back-arrow");
		var f = false;
		var h = "click";
		var d = false;
		var g = {
			init: function() {
				c = 1;
				a(".list_content_mask").on(h,
				function() {
					g.closeMsk()
				});
				g.setBtnTrigger();
				g.setEventToLists(1);
				g.setEventToBack()
			},
			setBtnTrigger: function() {
				b.on(h,
				function() {
					j = document.body.scrollTop;
					f = false;
					g.showMsk();
					var l = a(this).attr("region-data");
					l = l.split(",")[c - 1];
					g.getRegionInfo(c, l);
					var k = a(".region-wrapper")
				})
			},
			showLoading: function() {
				a(".loading-mask").show()
			},
			hideLoading: function() {
				a(".loading-mask").hide()
			},
			regionUrl: function(l) {
				var k = e.actionURL;
				k += "&wareId=" + e.wareID;
				k += "&provinceId=" + a("#jdDeliverList1 li.checked").attr("id");
				if (l == 3) {
					k += "&cityId=" + a("#jdDeliverList2 li.checked").attr("id")
				} else {
					if (l == 4) {
						k += "&cityId=" + a("#jdDeliverList2 li.checked").attr("id");
						k += "&countryId=" + a("#jdDeliverList3 li.checked").attr("id")
					} else {
						if (l == 5) {
							k += "&cityId=" + a("#jdDeliverList2 li.checked").attr("id");
							k += "&countryId=" + a("#jdDeliverList3 li.checked").attr("id");
							k += "&townId=" + a("#jdDeliverList4 li.checked").attr("id")
						}
					}
				}
				k += "&action=" + a("#jdDeliverList" + (l - 1) + " li.checked").attr("action");
				if (a("#thirdCategoryId").length > 0 && a("#thirdCategoryId").val()) {
					k += "&thirdCategoryId=" + a("#thirdCategoryId").val()
				}
				if (a("#addCartBizName").length > 0 && a("#addCartBizName").val()) {
					k += "&addCartNodeBizName=" + a("#addCartBizName").val()
				}
				return k
			},
			getRegionInfo: function(m, l) {
				if (m > 2) {
					a.ajax({
						dataType: "json",
						url: g.regionUrl(m),
						cache: false,
						beforeSend: function() {
							g.showLoading()
						},
						success: function(o) {
							var n = o;
							setTimeout(function() {
								g.hideLoading();
								if (o && o.addressList) {
									g.delEventToLists(m);
									g.drawRegionList(m, o.addressList)
								} else {
									if (Number(m) == 3) {
										g.cleanUL(Number(m) + 1)
									}
									g.getResult(n)
								}
								d = false
							},
							300)
						},
						error: function() {
							d = false;
							g.hideLoading()
						}
					})
				} else {
					if (m == 1) {
						g.drawRegionList(m, regionLevels.region[0].addressList)
					} else {
						if (m == 2) {
							if (l <= 32) {
								g.drawRegionList(m, regionLevels.region[l].addressList)
							} else {
								if (l == 84) {
									return
								}
								var k = 33;
								if (l == 42) {
									k = 33
								} else {
									if (l == 43) {
										k = 34
									}
								}
								g.drawRegionList(m, regionLevels.region[k].addressList)
							}
						}
					}
				}
			},
			drawRegionList: function(q, o) {
				var l = a("#jdDeliverList" + q);
				var n = "";
				l.html("");
				var p = a("#btn-select-region").attr("region-data");
				p = p.split(",")[q - 1];
				var k = a("#btn-select-region").attr("usualAddress-data");
				if (k && "true" == k && q == 1 && e.initFlag && a("#pin") && a("#pin").val()) {
					g.getLiHTML(q, n, o, p, l);
					var m = e.actionURL;
					m += "&wareId=" + e.wareID + "&action=usualAddress";
					a.ajax({
						dataType: "json",
						url: m,
						timeout: 5000,
						cache: false,
						success: function(y) {
							var x = "";
							var w = a("#btn-select-region").attr("common-data");
							var u = -1;
							var v = false;
							if (y && y.usualAddressList && y.usualAddressList.length > 0) {
								for (var t = 0; t < y.usualAddressList.length; t++) {
									var r = y.usualAddressList;
									if (r[t].fullAddress && r[t].fullAddress != "null") {
										if (!v) {
											x += '<li class="address-kind"><span>常用地址</span></li>';
											v = true
										}
										if (w && r[t].id && w == r[t].id) {
											u = t;
											x += '<li class="common-address checked J_ping"   report-eventid="MProductdetail_ShippingAddress"  report-pageparam="' + a("#currentWareId").val() + '"  common_id="' + r[t].id + '" data="' + r[t].provinceId + "," + r[t].cityId + "," + r[t].countyId + "," + r[t].townId + '"><i class="tick"></i><span>' + r[t].fullAddress + "</span></li>"
										} else {
											x += '<li class="common-address J_ping"  report-eventid="MProductdetail_ShippingAddress"  report-pageparam="' + a("#currentWareId").val() + '"  common_id="' + r[t].id + '" data="' + r[t].provinceId + "," + r[t].cityId + "," + r[t].countyId + "," + r[t].townId + '"><i class="tick"></i><span>' + r[t].fullAddress + "</span></li>"
										}
									}
								}
								if (v) {
									x += '<li class="address-kind"><span>选择其他地址</span></li>'
								}
							}
							if (u != -1) {
								var s = a("#jdDeliverList" + q).find(".choice-address");
								for (var t = 0; t < s.length; t++) {
									s.eq(t).removeClass("checked")
								}
							}
							a("#jdDeliverList1").prepend(x);
							g.setEventToLists(q);
							g.switchTo(q)
						},
						error: function() {}
					})
				} else {
					g.getLiHTML(q, n, o, p, l)
				}
				e.initFlag = true
			},
			cleanUL: function(k) {
				a("#jdDeliverList" + k).empty()
			},
			showMsk: function() {
				var k = a(window).height();
				a("html").removeClass("sidebar-back");
				a("html").addClass("sidebar-move");
				a(".list_content_mask").css("display", "block");
				a(".sidebar-content").css("display", "block");
				a(".region-wrapper ul").height(k - 45)
			},
			closeMsk: function() {
				a("html").addClass("sidebar-back");
				setTimeout(function() {
					a("html").removeClass("sidebar-back");
					a("html").removeClass("sidebar-move")
				},
				300);
				a(".list_content_mask").css("display", "none");
				a(".sidebar-content").css("display", "none");
				c = 1;
				f = false;
				setTimeout(function() {
					window.scrollTo(0, j)
				},
				300)
			},
			delEventToLists: function(k) {
				a("#jdDeliverList" + k).find(".choice-address").off(h)
			},
			setEventToLists: function(p) {
				var k = a("#jdDeliverList" + p).find(".choice-address");
				var o = a("#jdDeliverList" + p);
				var m = a(".common-address");
				var n = p + 1;
				var l = function() {
					for (var q = 0; q < k.length; q++) {
						k.eq(q).removeClass("checked")
					}
				};
				k.on(h,
				function() {
					d = (p == 2) ? true: false;
					if (p == 1) {
						var s = a("#jdDeliverList" + p).find(".common-address");
						for (var r = 0; r < s.length; r++) {
							s.eq(r).removeClass("checked")
						}
					}
					l();
					a(this).addClass("checked");
					var t = a("#btn-select-region").attr("region-data");
					t = t.split(",")[p - 1];
					var q = this.id;
					if (q != t) {
						f = true
					}
					g.getRegionInfo(n, q)
				});
				m.on(h,
				function() {
					var s = a(this).attr("data");
					var u = a(this).attr("common_id");
					l();
					var t = a("#jdDeliverList" + p).find(".common-address");
					for (var r = 0; r < t.length; r++) {
						t.eq(r).removeClass("checked")
					}
					a(this).addClass("checked");
					mitemAddrName = a(this).text();
					var q = e.actionURL + "&wareId=" + e.wareID;
					if (s && s.indexOf(",") > 0 && s.split(",").length > 3) {
						if (s.split(",")[3] && s.split(",")[3] == "0") {
							q += "&action=getTowns&provinceId=" + s.split(",")[0] + "&cityId=" + s.split(",")[1] + "&countryId=" + s.split(",")[2] + "&townId=" + s.split(",")[3]
						} else {
							q += "&action=directStock&provinceId=" + s.split(",")[0] + "&cityId=" + s.split(",")[1] + "&countryId=" + s.split(",")[2] + "&townId=" + s.split(",")[3]
						}
					}
					a.ajax({
						dataType: "json",
						url: q,
						cache: false,
						beforeSend: function() {
							g.showLoading()
						},
						success: function(w) {
							g.hideLoading();
							d = false;
							addDateToLocal(s);
							g.commonAdGetResult();
							a("#btn-select-region").attr("region-data", s);
							a("#btn-select-region").attr("common-data", u);
							stockRender(w);
							infoRender(w);
							if (headerslider) {
								headerslider.HeightTimer()
							}
							g.closeMsk();
							var v = 30;
							var x = new Date();
							x.setTime(x.getTime() + v * 24 * 60 * 60 * 1000);
							document.cookie = "commonAddress=" + u + ";expires=" + x.toGMTString() + ";path=/;domain=.m.jd.com"
						},
						error: function() {
							d = false;
							g.hideLoading();
							var w = a("#jdDeliverList1").find(".common-address");
							for (var v = 0; v < w.length; v++) {
								w.eq(v).removeClass("checked")
							}
							a(this).addClass("checked")
						}
					})
				})
			},
			setEventToBack: function() {
				i.on(h,
				function() {
					if (c == 1) {
						g.closeMsk()
					} else {
						var k = c - 1;
						g.switchTo(k)
					}
				})
			},
			switchTo: function(l) {
				for (var k = 1; k < 5; k++) {
					if (k == l) {
						a("#jdDeliverList" + k).addClass("cur")
					} else {
						a("#jdDeliverList" + k).removeClass("cur")
					}
				}
				c = l
			},
			getResult: function(m) {
				var k = "";
				var o = "";
				for (var l = 1; l < c + 1; l++) {
					k += a("#jdDeliverList" + l + " .checked").attr("id");
					k += (l == 4) ? "": ",";
					o += (a("#jdDeliverList" + l + " .checked").length == 0) ? "": a("#jdDeliverList" + l + " .checked").html()
				}
				o += '<i class="icon icon-location"></i>';
				b.attr("region-data", k);
				b.find(".address").html(o);
				try {
					if (b.find(".address span").length >= 3) {
						mitemAddrName += b.find(".address span")[0].innerHTML + "_" + b.find(".address span")[1].innerHTML + "_" + b.find(".address span")[2].innerHTML
					}
				} catch(n) {}
				a("#btn-select-region").attr("common-data", "");
				addDateToLocal(k);
				stockRender(m);
				infoRender(m);
				if (headerslider) {
					headerslider.HeightTimer()
				}
				g.closeMsk()
			},
			commonAdGetResult: function() {
				var k = "";
				k += a("#jdDeliverList1").find(".checked").html();
				k += '<i class="icon icon-location"></i>';
				b.find(".address").html(k)
			},
			getLiHTML: function(p, n, m, o, k) {
				for (var l = 0; l < m.length; l++) {
					n += "<li";
					if (o && o == m[l].id) {
						if (!f) {
							n += ' class="choice-address checked"'
						}
					}
					if (f && l == 0) {
						n += ' class="choice-address checked"'
					}
					n += ' class="choice-address" id="' + m[l].id + '" ';
					if (p == 2) {
						n += ' action="getCountys"'
					} else {
						if (p > 2) {
							n += ' action="' + m[l].action + '"'
						}
					}
					n += '><i class="tick"></i><a name="region' + m[l].id + '"></a><span>' + m[l].name + "</span></li>"
				}
				k.append(n);
				g.setEventToLists(p);
				g.switchTo(p)
			}
		};
		return g.init()
	}
})(Zepto);
function addDateToLocal(a) {
	try {
		var b = $("#regionData").val();
		if (b != "" && "true" == b) {
			var c = 30;
			var f = new Date();
			f.setTime(f.getTime() + c * 24 * 60 * 60 * 1000);
			document.cookie = "regionAddress=" + escape(a) + ";expires=" + f.toGMTString() + ";path=/;domain=.m.jd.com";
			addJdAddress(a)
		}
	} catch(d) {}
}
function addJdAddress(b) {
	try {
		if (b) {
			var f = 30;
			var h = new Date();
			h.setTime(h.getTime() + f * 24 * 60 * 60 * 1000);
			var c = b.split(",");
			var a = "";
			if (c && c.length >= 3) {
				a += c[0] + "_" + c[1] + "_" + c[2] + "_0"
			}
			var d = "";
			if (mitemAddrName && mitemAddrName != "") {
				d = mitemAddrName;
				mitemAddrName = ""
			} else {
				if ($("#provinceName").val() && $("#cityName").val() && $("#countyName").val()) {
					d = $("#provinceName").val() + "_" + $("#cityName").val() + "_" + $("#countyName").val()
				}
			}
			if (a != "") {
				document.cookie = "mitemAddrId=" + a + ";expires=" + h.toGMTString() + ";path=/;domain=.jd.com"
			}
			if (d != "") {
				document.cookie = "mitemAddrName=" + encodeURIComponent(d) + ";expires=" + h.toGMTString() + ";path=/;domain=.jd.com"
			}
		}
	} catch(g) {}
}
function addPresentTime(a) {
	var b = new Date();
	b = b.getTime();
	if (a.indexOf("newtime=") != -1) {
		a = a.replace(/(\?|\&)newtime=\d*/, "")
	}
	var c = (a.indexOf("?") == -1) ? "?": "&";
	a = a + c + "newtime=" + b;
	return a
} (function() {
	var b = function(d, c) {
		return new a().init(d, c)
	};
	function a() {
		this.timer = null;
		this.lastTime = 1000 * 1.5;
		this.endTime = 1000 * 60
	}
	a.prototype = {
		init: function(d, c) {
			this.oParent = document.getElementById(d);
			this.oDiv = document.getElementById(c);
			this.scale();
			if (this.scale() && Math.ceil(16 / this.scale()) > 10) {
				this.oDiv.style.fontSize = Math.ceil(16 / this.scale()) + "px"
			}
			this.duration()
		},
		scale: function() {
			var i = this.oParent;
			var g = this.oDiv;
			var d = g.offsetWidth;
			var c = g.offsetHeight;
			var h = document.documentElement.clientWidth - 20;
			if (d != 0) {
				var e = h / d;
				var f = g.innerHTML;
				g.innerHTML = "";
				g.style.WebkitTransformOrigin = 0 + "px " + 0 + "px";
				g.style.transformOrigin = 0 + "px " + 0 + "px";
				g.style.WebkitTransform = "scale(" + e + ")";
				g.style.transform = "scale(" + e + ")";
				i.style.width = d * e + "px";
				i.style.height = c * e + "px";
				i.style.margin = 0 + "px " + 10 + "px " + 5 + "px";
				g.innerHTML = f;
				i.style.overflow = "hidden"
			}
			return e
		},
		SecScale: function() {
			var h = this.oParent;
			var f = this.oDiv;
			var d = f.offsetWidth;
			var c = f.offsetHeight;
			var g = document.documentElement.clientWidth - 20;
			if (d != 0) {
				var e = g / d;
				f.style.WebkitTransformOrigin = 0 + "px " + 0 + "px";
				f.style.transformOrigin = 0 + "px " + 0 + "px";
				f.style.WebkitTransform = "scale(" + e + ")";
				f.style.transform = "scale(" + e + ")";
				h.style.width = d * e + "px";
				h.style.height = c * e + "px";
				h.style.margin = 0 + "px " + 10 + "px ";
				h.style.overflow = "hidden"
			}
		},
		duration: function() {
			var c = this;
			c.timer = setInterval(function() {
				c.SecScale()
			},
			c.lastTime);
			setTimeout(function() {
				clearInterval(c.timer)
			},
			c.endTime)
		}
	};
	a.extend = function(d, c) {
		for (name in c) {
			if (c[name] !== undefined) {
				d[name] = c[name]
			}
		}
	};
	a.extend(b, {
		ready: function(d) {
			var c = /complete|loaded|interactive/;
			if (c.test(document.readyState) && document.body) {
				d()
			} else {
				document.addEventListener("DOMContentLoaded",
				function() {
					d()
				},
				false)
			}
		}
	});
	window.scale = b
})();
"use strict";
function LoadPage() {}
LoadPage.prototype = {
	init: function(a) {
		var b = {
			containId: "body",
			pointHeight: "600",
			currentP: 1,
			baseUrl: "",
			reqPara: "",
			beforeFn: null,
			successFn: null,
			errorFn: null,
			reLoad: true,
			isRepeatReq: false,
			pageNo: "offset",
			isInit: true,
			maxHeightFlag: 0,
			checkParam: ""
		};
		this.settings = $.extend(b, a);
		this.currentP = b.currentP;
		this.containId = b.containId;
		this.objContain = document.querySelector(this.containId);
		this.objContain.style.height = this.settings.pointHeight + "px";
		this.objContain.style.overflow = "scroll";
		this.objContain.style.WebkitOverflowScrolling = "touch";
		if (this.settings.isInit) {
			this.getData(this.currentP++)
		}
		this.events()
	},
	orientationchangeCb: function(a) {
		this.settings.pointHeight = a;
		this.objContain.style.height = this.settings.pointHeight + "px"
	},
	bindScrollEvts: function() {
		var a = this;
		a.objContain.onscroll = function() {
			var b = $("#loadMoreFlag").val();
			if ((a.settings.maxHeightFlag == this.scrollHeight) || "false" == b) {
				return false
			}
			if ((parseInt(a.settings.pointHeight) + parseInt(this.scrollTop) + 1) >= this.scrollHeight && !a.settings.isRepeatReq) {
				a.settings.maxHeightFlag = this.scrollHeight;
				a.getData(a.currentP++)
			}
			return false
		}
	},
	events: function() {
		this.bindScrollEvts();
		this.goBack2TopSelf()
	},
	goBack2Top: function() {
		var d = document.querySelector("#indexToTop");
		var c = "click",
		b = window.navigator.userAgent;
		var a = {
			init: function() {
				a.scrollEvt();
				a.toTopEvt()
			},
			toTopEvt: function() {
				d.addEventListener(c,
				function() {
					scroll(0, 0);
					d.style.display = "none"
				},
				false)
			},
			scrollEvt: function() {
				window.addEventListener("scroll",
				function() {
					var e = document.documentElement.clientHeight || document.body.clientHeight;
					var f = document.documentElement.scrollTop || document.body.scrollTop;
					if (f > e) {
						d.style.display = "block"
					} else {
						d.style.display = "none"
					}
				},
				false)
			}
		};
		return a.init()
	},
	goBack2TopSelf: function() {
		var d = document.querySelector("#indexToTop");
		var e = $(".download-block-right")[0];
		var c = "click",
		b = window.navigator.userAgent,
		f = this;
		var a = {
			init: function() {
				a.scrollEvt();
				a.toTopEvt()
			},
			toTopEvt: function() {
				d.addEventListener(c,
				function() {
					f.objContain.scrollTop = 0;
					d.style.display = "none";
					if (e) {
						e.style.bottom = "57px"
					}
				},
				false)
			},
			scrollEvt: function() {
				f.objContain.addEventListener("scroll",
				function() {
					if (this.scrollTop > this.clientHeight) {
						if (e) {
							e.style.bottom = "99px"
						}
						d.style.display = "block"
					} else {
						d.style.display = "none";
						if (e) {
							e.style.bottom = "57px"
						}
					}
				},
				false)
			}
		};
		return a.init()
	},
	getData: function(b, a) {
		if (!this.settings.isRepeatReq) {
			this.settings.isRepeatReq = true
		}
		this.getSomeData(b)
	},
	EncodeUtf8: function(d) {
		var e = escape(d);
		var a = e.split("%");
		var c = "";
		if (a[0] != "") {
			c = a[0]
		}
		for (var b = 1; b < a.length; b++) {
			if (a[b].substring(0, 1) == "u") {
				c += Hex2Utf8(Str2Hex(a[b].substring(1, 5)))
			} else {
				c += "%" + a[b]
			}
		}
		return c
	},
	getSomeData: function(b) {
		var d = this;
		var a;
		var c = d.settings.reqPara;
		c[d.settings.pageNo] = b;
		a = d.settings.baseUrl;
		$.ajax({
			url: a,
			type: d.settings.reqType,
			dataType: "json",
			data: c,
			beforeSend: d.settings.beforeFn,
			success: function(e) {
				d.settings.successFn(e);
				d.settings.reLoad = false;
				d.settings.isRepeatReq = false
			},
			error: function(f, e) {
				d.settings.errorFn();
				d.settings.isRepeatReq = false
			}
		})
	}
};
var PullLoad = function(c, b) {
	var g = {
		trigger: $("body"),
		elWindow: $(window),
		maxY: 40,
		lessText: "下拉回到上一页",
		greaterText: "释放回到上一页",
		onReload: function() {}
	};
	var h = $.extend({},
	g, b || {});
	if (!c || !c.length) {
		return this
	}
	var a = this;
	a.el = c.css("border-bottom", "0 solid transparent");
	a.callback = {
		reload: h.onReload
	};
	var f = h.elWindow;
	var e = h.maxY;
	var d = {};
	h.trigger.on({
		touchstart: function(j) {
			var i = j.touches[0] || j;
			d.posY = i.pageY;
			d.nowY = d.posY;
			d.distanceY = 0;
			d.scrollY = f.scrollTop();
			d.touching = true;
			d.markY = -1
		},
		touchmove: function(o) {
			if (d.touching !== true) {
				return
			}
			var l = o.touches[0] || o;
			d.nowY = l.pageY;
			var n = d.nowY - d.posY;
			d.distanceY = n;
			var m;
			var i;
			if (f.scrollTop() == 0) {
				if (n > 0 || d.markY > 0) {
					o.preventDefault()
				}
				if (n > 0 && d.markY == -1) {
					d.markY = n
				}
			}
			m = n - d.markY;
			if (d.markY > 0 && c.data("loading") != true) {
				if (m < 0) {
					i = 0
				} else {
					i = Math.min(m, e)
				}
				var j = 0 - i / 2 + Math.max(0, m - e),
				k = j;
				if (j > 0) {
					k = a.damping(j);
					c.html(h.greaterText)
				} else {
					c.html(h.lessText)
				}
				c.css({
					height: i,
					borderBottomWidth: k,
					transition: "none"
				})
			}
			d.rectY = m
		},
		touchend: function() {
			if (d.touching !== true) {
				return
			}
			if (d.markY > 0 && d.rectY > 0) {
				if (d.rectY >= e) {
					c.data("loading", true).css({
						transition: "",
						borderBottomWidth: 0
					});
					h.onReload.call(a)
				} else {
					a.origin()
				}
			}
			d.touching = false
		}
	})
};
PullLoad.prototype.origin = function() {
	var a = this;
	var b = a.el;
	b.css({
		transition: "",
		borderBottomWidth: 0,
		height: 0
	}).data("loading", false);
	return a
};
PullLoad.prototype.damping = function(f) {
	var e = [20, 40, 60, 80, 100];
	var d = [0.5, 0.4, 0.3, 0.2, 0.1];
	var b = f;
	var a = e.length;
	while (a--) {
		if (f > e[a]) {
			b = (f - e[a]) * d[a];
			for (var c = a; c > 0; c--) {
				b += (e[c] - e[c - 1]) * d[c - 1]
			}
			b += e[0] * 1;
			break
		}
	}
	return b
};