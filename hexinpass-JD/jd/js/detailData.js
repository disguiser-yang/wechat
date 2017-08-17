/*! m_home 2016-10-28 */
!function(a) {
	String.prototype.trim === a && (String.prototype.trim = function() {
		return this.replace(/^\s+/, "").replace(/\s+$/, "")
	}),
	Array.prototype.reduce === a && (Array.prototype.reduce = function(b) {
		if (void 0 === this || null === this) throw new TypeError;
		var c, d = Object(this),
		e = d.length >>> 0,
		f = 0;
		if ("function" != typeof b) throw new TypeError;
		if (0 == e && 1 == arguments.length) throw new TypeError;
		if (arguments.length >= 2) c = arguments[1];
		else for (;;) {
			if (f in d) {
				c = d[f++];
				break
			}
			if (++f >= e) throw new TypeError
		}
		for (; f < e;) f in d && (c = b.call(a, c, d[f], f, d)),
		f++;
		return c
	})
} ();
var Zepto = function() {
	function a(a) {
		return null == a ? String(a) : W[X.call(a)] || "object"
	}
	function b(b) {
		return "function" == a(b)
	}
	function c(a) {
		return null != a && a == a.window
	}
	function d(a) {
		return null != a && a.nodeType == a.DOCUMENT_NODE
	}
	function e(b) {
		return "object" == a(b)
	}
	function f(a) {
		return e(a) && !c(a) && a.__proto__ == Object.prototype
	}
	function g(a) {
		return a instanceof Array
	}
	function h(a) {
		return "number" == typeof a.length
	}
	function i(a) {
		return E.call(a,
		function(a) {
			return null != a
		})
	}
	function j(a) {
		return a.length > 0 ? y.fn.concat.apply([], a) : a
	}
	function k(a) {
		return a.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
	}
	function l(a) {
		return a in H ? H[a] : H[a] = new RegExp("(^|\\s)" + a + "(\\s|$)")
	}
	function m(a, b) {
		return "number" != typeof b || J[k(a)] ? b: b + "px"
	}
	function n(a) {
		var b, c;
		return G[a] || (b = F.createElement(a), F.body.appendChild(b), c = I(b, "").getPropertyValue("display"), b.parentNode.removeChild(b), "none" == c && (c = "block"), G[a] = c),
		G[a]
	}
	function o(a) {
		return "children" in a ? D.call(a.children) : y.map(a.childNodes,
		function(a) {
			if (1 == a.nodeType) return a
		})
	}
	function p(a, b, c) {
		for (x in b) c && f(b[x]) ? (f(a[x]) || (a[x] = {}), p(a[x], b[x], c)) : b[x] !== w && (a[x] = b[x])
	}
	function q(a, b) {
		return b === w ? y(a) : y(a).filter(b)
	}
	function r(a, c, d, e) {
		return b(c) ? c.call(a, d, e) : c
	}
	function s(a, b, c) {
		null == c ? a.removeAttribute(b) : a.setAttribute(b, c)
	}
	function t(a, b) {
		var c = a.className,
		d = c && c.baseVal !== w;
		return b === w ? d ? c.baseVal: c: void(d ? c.baseVal = b: a.className = b)
	}
	function u(a) {
		var b;
		try {
			return a ? "true" == a || "false" != a && ("null" == a ? null: isNaN(b = Number(a)) ? /^[\[\{]/.test(a) ? y.parseJSON(a) : a: b) : a
		} catch(c) {
			return a
		}
	}
	function v(a, b) {
		b(a);
		for (var c in a.childNodes) v(a.childNodes[c], b)
	}
	var w, x, y, z, A, B, C = [],
	D = C.slice,
	E = C.filter,
	F = window.document,
	G = {},
	H = {},
	I = F.defaultView.getComputedStyle,
	J = {
		"column-count": 1,
		columns: 1,
		"font-weight": 1,
		"line-height": 1,
		opacity: 1,
		"z-index": 1,
		zoom: 1
	},
	K = /^\s*<(\w+|!)[^>]*>/,
	L = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	M = /^(?:body|html)$/i,
	N = ["val", "css", "html", "text", "data", "width", "height", "offset"],
	O = ["after", "prepend", "before", "append"],
	P = F.createElement("table"),
	Q = F.createElement("tr"),
	R = {
		tr: F.createElement("tbody"),
		tbody: P,
		thead: P,
		tfoot: P,
		td: Q,
		th: Q,
		"*": F.createElement("div")
	},
	S = /complete|loaded|interactive/,
	T = /^\.([\w-]+)$/,
	U = /^#([\w-]*)$/,
	V = /^[\w-]+$/,
	W = {},
	X = W.toString,
	Y = {},
	Z = F.createElement("div");
	return Y.matches = function(a, b) {
		if (!a || 1 !== a.nodeType) return ! 1;
		var c = a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.matchesSelector;
		if (c) return c.call(a, b);
		var d, e = a.parentNode,
		f = !e;
		return f && (e = Z).appendChild(a),
		d = ~Y.qsa(e, b).indexOf(a),
		f && Z.removeChild(a),
		d
	},
	A = function(a) {
		return a.replace(/-+(.)?/g,
		function(a, b) {
			return b ? b.toUpperCase() : ""
		})
	},
	B = function(a) {
		return E.call(a,
		function(b, c) {
			return a.indexOf(b) == c
		})
	},
	Y.fragment = function(a, b, c) {
		a.replace && (a = a.replace(L, "<$1></$2>")),
		b === w && (b = K.test(a) && RegExp.$1),
		b in R || (b = "*");
		var d, e, g = R[b];
		return g.innerHTML = "" + a,
		e = y.each(D.call(g.childNodes),
		function() {
			g.removeChild(this)
		}),
		f(c) && (d = y(e), y.each(c,
		function(a, b) {
			N.indexOf(a) > -1 ? d[a](b) : d.attr(a, b)
		})),
		e
	},
	Y.Z = function(a, b) {
		return a = a || [],
		a.__proto__ = y.fn,
		a.selector = b || "",
		a
	},
	Y.isZ = function(a) {
		return a instanceof Y.Z
	},
	Y.init = function(a, c) {
		if (!a) return Y.Z();
		if (b(a)) return y(F).ready(a);
		if (Y.isZ(a)) return a;
		var d;
		if (g(a)) d = i(a);
		else if (e(a)) d = [f(a) ? y.extend({},
		a) : a],
		a = null;
		else if (K.test(a)) d = Y.fragment(a.trim(), RegExp.$1, c),
		a = null;
		else {
			if (c !== w) return y(c).find(a);
			d = Y.qsa(F, a)
		}
		return Y.Z(d, a)
	},
	y = function(a, b) {
		return Y.init(a, b)
	},
	y.extend = function(a) {
		var b, c = D.call(arguments, 1);
		return "boolean" == typeof a && (b = a, a = c.shift()),
		c.forEach(function(c) {
			p(a, c, b)
		}),
		a
	},
	Y.qsa = function(a, b) {
		var c;
		return d(a) && U.test(b) ? (c = a.getElementById(RegExp.$1)) ? [c] : [] : 1 !== a.nodeType && 9 !== a.nodeType ? [] : D.call(T.test(b) ? a.getElementsByClassName(RegExp.$1) : V.test(b) ? a.getElementsByTagName(b) : a.querySelectorAll(b))
	},
	y.contains = function(a, b) {
		return a !== b && a.contains(b)
	},
	y.type = a,
	y.isFunction = b,
	y.isWindow = c,
	y.isArray = g,
	y.isPlainObject = f,
	y.isEmptyObject = function(a) {
		var b;
		for (b in a) return ! 1;
		return ! 0
	},
	y.inArray = function(a, b, c) {
		return C.indexOf.call(b, a, c)
	},
	y.camelCase = A,
	y.trim = function(a) {
		return a.trim()
	},
	y.uuid = 0,
	y.support = {},
	y.expr = {},
	y.map = function(a, b) {
		var c, d, e, f = [];
		if (h(a)) for (d = 0; d < a.length; d++) c = b(a[d], d),
		null != c && f.push(c);
		else for (e in a) c = b(a[e], e),
		null != c && f.push(c);
		return j(f)
	},
	y.each = function(a, b) {
		var c, d;
		if (h(a)) {
			for (c = 0; c < a.length; c++) if (b.call(a[c], c, a[c]) === !1) return a
		} else for (d in a) if (b.call(a[d], d, a[d]) === !1) return a;
		return a
	},
	y.grep = function(a, b) {
		return E.call(a, b)
	},
	window.JSON && (y.parseJSON = JSON.parse),
	y.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),
	function(a, b) {
		W["[object " + b + "]"] = b.toLowerCase()
	}),
	y.fn = {
		forEach: C.forEach,
		reduce: C.reduce,
		push: C.push,
		sort: C.sort,
		indexOf: C.indexOf,
		concat: C.concat,
		map: function(a) {
			return y(y.map(this,
			function(b, c) {
				return a.call(b, c, b)
			}))
		},
		slice: function() {
			return y(D.apply(this, arguments))
		},
		ready: function(a) {
			return S.test(F.readyState) ? a(y) : F.addEventListener("DOMContentLoaded",
			function() {
				a(y)
			},
			!1),
			this
		},
		get: function(a) {
			return a === w ? D.call(this) : this[a >= 0 ? a: a + this.length]
		},
		toArray: function() {
			return this.get()
		},
		size: function() {
			return this.length
		},
		remove: function() {
			return this.each(function() {
				null != this.parentNode && this.parentNode.removeChild(this)
			})
		},
		each: function(a) {
			return C.every.call(this,
			function(b, c) {
				return a.call(b, c, b) !== !1
			}),
			this
		},
		filter: function(a) {
			return b(a) ? this.not(this.not(a)) : y(E.call(this,
			function(b) {
				return Y.matches(b, a)
			}))
		},
		add: function(a, b) {
			return y(B(this.concat(y(a, b))))
		},
		is: function(a) {
			return this.length > 0 && Y.matches(this[0], a)
		},
		not: function(a) {
			var c = [];
			if (b(a) && a.call !== w) this.each(function(b) {
				a.call(this, b) || c.push(this)
			});
			else {
				var d = "string" == typeof a ? this.filter(a) : h(a) && b(a.item) ? D.call(a) : y(a);
				this.forEach(function(a) {
					d.indexOf(a) < 0 && c.push(a)
				})
			}
			return y(c)
		},
		has: function(a) {
			return this.filter(function() {
				return e(a) ? y.contains(this, a) : y(this).find(a).size()
			})
		},
		eq: function(a) {
			return a === -1 ? this.slice(a) : this.slice(a, +a + 1)
		},
		first: function() {
			var a = this[0];
			return a && !e(a) ? a: y(a)
		},
		last: function() {
			var a = this[this.length - 1];
			return a && !e(a) ? a: y(a)
		},
		find: function(a) {
			var b;
			return b = 1 == this.length ? y(Y.qsa(this[0], a)) : this.map(function() {
				return Y.qsa(this, a)
			})
		},
		closest: function(a, b) {
			for (var c = this[0]; c && !Y.matches(c, a);) c = c !== b && !d(c) && c.parentNode;
			return y(c)
		},
		parents: function(a) {
			for (var b = [], c = this; c.length > 0;) c = y.map(c,
			function(a) {
				if ((a = a.parentNode) && !d(a) && b.indexOf(a) < 0) return b.push(a),
				a
			});
			return q(b, a)
		},
		parent: function(a) {
			return q(B(this.pluck("parentNode")), a)
		},
		children: function(a) {
			return q(this.map(function() {
				return o(this)
			}), a)
		},
		contents: function() {
			return this.map(function() {
				return D.call(this.childNodes)
			})
		},
		siblings: function(a) {
			return q(this.map(function(a, b) {
				return E.call(o(b.parentNode),
				function(a) {
					return a !== b
				})
			}), a)
		},
		empty: function() {
			return this.each(function() {
				this.innerHTML = ""
			})
		},
		pluck: function(a) {
			return y.map(this,
			function(b) {
				return b[a]
			})
		},
		show: function() {
			return this.each(function() {
				"none" == this.style.display && (this.style.display = null),
				"none" == I(this, "").getPropertyValue("display") && (this.style.display = n(this.nodeName))
			})
		},
		replaceWith: function(a) {
			return this.before(a).remove()
		},
		wrap: function(a) {
			var c = b(a);
			if (this[0] && !c) var d = y(a).get(0),
			e = d.parentNode || this.length > 1;
			return this.each(function(b) {
				y(this).wrapAll(c ? a.call(this, b) : e ? d.cloneNode(!0) : d)
			})
		},
		wrapAll: function(a) {
			if (this[0]) {
				y(this[0]).before(a = y(a));
				for (var b; (b = a.children()).length;) a = b.first();
				y(a).append(this)
			}
			return this
		},
		wrapInner: function(a) {
			var c = b(a);
			return this.each(function(b) {
				var d = y(this),
				e = d.contents(),
				f = c ? a.call(this, b) : a;
				e.length ? e.wrapAll(f) : d.append(f)
			})
		},
		unwrap: function() {
			return this.parent().each(function() {
				y(this).replaceWith(y(this).children())
			}),
			this
		},
		clone: function() {
			return this.map(function() {
				return this.cloneNode(!0)
			})
		},
		hide: function() {
			return this.css("display", "none")
		},
		toggle: function(a) {
			return this.each(function() {
				var b = y(this); (a === w ? "none" == b.css("display") : a) ? b.show() : b.hide()
			})
		},
		prev: function(a) {
			return y(this.pluck("previousElementSibling")).filter(a || "*")
		},
		next: function(a) {
			return y(this.pluck("nextElementSibling")).filter(a || "*")
		},
		html: function(a) {
			return a === w ? this.length > 0 ? this[0].innerHTML: null: this.each(function(b) {
				var c = this.innerHTML;
				y(this).empty().append(r(this, a, b, c))
			})
		},
		text: function(a) {
			return a === w ? this.length > 0 ? this[0].textContent: null: this.each(function() {
				this.textContent = a
			})
		},
		attr: function(a, b) {
			var c;
			return "string" == typeof a && b === w ? 0 == this.length || 1 !== this[0].nodeType ? w: "value" == a && "INPUT" == this[0].nodeName ? this.val() : !(c = this[0].getAttribute(a)) && a in this[0] ? this[0][a] : c: this.each(function(c) {
				if (1 === this.nodeType) if (e(a)) for (x in a) s(this, x, a[x]);
				else s(this, a, r(this, b, c, this.getAttribute(a)))
			})
		},
		removeAttr: function(a) {
			return this.each(function() {
				1 === this.nodeType && s(this, a)
			})
		},
		prop: function(a, b) {
			return b === w ? this[0] && this[0][a] : this.each(function(c) {
				this[a] = r(this, b, c, this[a])
			})
		},
		data: function(a, b) {
			var c = this.attr("data-" + k(a), b);
			return null !== c ? u(c) : w
		},
		val: function(a) {
			return a === w ? this[0] && (this[0].multiple ? y(this[0]).find("option").filter(function(a) {
				return this.selected
			}).pluck("value") : this[0].value) : this.each(function(b) {
				this.value = r(this, a, b, this.value)
			})
		},
		offset: function(a) {
			if (a) return this.each(function(b) {
				var c = y(this),
				d = r(this, a, b, c.offset()),
				e = c.offsetParent().offset(),
				f = {
					top: d.top - e.top,
					left: d.left - e.left
				};
				"static" == c.css("position") && (f.position = "relative"),
				c.css(f)
			});
			if (0 == this.length) return null;
			var b = this[0].getBoundingClientRect();
			return {
				left: b.left + window.pageXOffset,
				top: b.top + window.pageYOffset,
				width: b.width,
				height: b.height
			}
		},
		css: function(a, b) {
			if (arguments.length < 2 && "string" == typeof a) return this[0] && (this[0].style[A(a)] || I(this[0], "").getPropertyValue(a));
			var c = "";
			for (x in a) a[x] || 0 === a[x] ? c += k(x) + ":" + m(x, a[x]) + ";": this.each(function() {
				this.style.removeProperty(k(x))
			});
			return "string" == typeof a && (b || 0 === b ? c = k(a) + ":" + m(a, b) : this.each(function() {
				this.style.removeProperty(k(a))
			})),
			this.each(function() {
				this.style.cssText += ";" + c
			})
		},
		index: function(a) {
			return a ? this.indexOf(y(a)[0]) : this.parent().children().indexOf(this[0])
		},
		hasClass: function(a) {
			return C.some.call(this,
			function(a) {
				return this.test(t(a))
			},
			l(a))
		},
		addClass: function(a) {
			return this.each(function(b) {
				z = [];
				var c = t(this),
				d = r(this, a, b, c);
				d.split(/\s+/g).forEach(function(a) {
					y(this).hasClass(a) || z.push(a)
				},
				this),
				z.length && t(this, c + (c ? " ": "") + z.join(" "))
			})
		},
		removeClass: function(a) {
			return this.each(function(b) {
				return a === w ? t(this, "") : (z = t(this), r(this, a, b, z).split(/\s+/g).forEach(function(a) {
					z = z.replace(l(a), " ")
				}), t(this, z.trim()), void 0)
			})
		},
		toggleClass: function(a, b) {
			return this.each(function(c) {
				var d = y(this),
				e = r(this, a, c, t(this));
				e.split(/\s+/g).forEach(function(a) { (b === w ? !d.hasClass(a) : b) ? d.addClass(a) : d.removeClass(a)
				})
			})
		},
		scrollTop: function() {
			if (this.length) return "scrollTop" in this[0] ? this[0].scrollTop: this[0].scrollY
		},
		scrollLeft: function() {
			if (this.length) return "scrollLeft" in this[0] ? this[0].scrollLeft: this[0].scrollX
		},
		position: function() {
			if (this.length) {
				var a = this[0],
				b = this.offsetParent(),
				c = this.offset(),
				d = M.test(b[0].nodeName) ? {
					top: 0,
					left: 0
				}: b.offset();
				return c.top -= parseFloat(y(a).css("margin-top")) || 0,
				c.left -= parseFloat(y(a).css("margin-left")) || 0,
				d.top += parseFloat(y(b[0]).css("border-top-width")) || 0,
				d.left += parseFloat(y(b[0]).css("border-left-width")) || 0,
				{
					top: c.top - d.top,
					left: c.left - d.left
				}
			}
		},
		offsetParent: function() {
			return this.map(function() {
				for (var a = this.offsetParent || F.body; a && !M.test(a.nodeName) && "static" == y(a).css("position");) a = a.offsetParent;
				return a
			})
		}
	},
	y.fn.detach = y.fn.remove,
	["width", "height"].forEach(function(a) {
		y.fn[a] = function(b) {
			var e, f = this[0],
			g = a.replace(/./,
			function(a) {
				return a[0].toUpperCase()
			});
			return b === w ? c(f) ? f["inner" + g] : d(f) ? f.documentElement["offset" + g] : (e = this.offset()) && e[a] : this.each(function(c) {
				f = y(this),
				f.css(a, r(this, b, c, f[a]()))
			})
		}
	}),
	O.forEach(function(b, c) {
		var d = c % 2;
		y.fn[b] = function() {
			var b, e, f = y.map(arguments,
			function(c) {
				return b = a(c),
				"object" == b || "array" == b ? c: Y.fragment(c)
			}),
			g = this.length > 1;
			return f.length < 1 ? this: this.each(function(a, b) {
				e = d ? b: b.parentNode,
				b = 0 == c ? b.nextSibling: 1 == c ? b.firstChild: 2 == c ? b: null,
				f.forEach(function(a) {
					if (g) a = a.cloneNode(!0);
					else if (!e) return y(a).remove();
					v(e.insertBefore(a, b),
					function(a) {
						null != a.nodeName && "SCRIPT" === a.nodeName.toUpperCase() && (!a.type || "text/javascript" === a.type) && !a.src && window.eval.call(window, a.innerHTML)
					})
				})
			})
		},
		y.fn[d ? b + "To": "insert" + (c ? "Before": "After")] = function(a) {
			return y(a)[b](this),
			this
		}
	}),
	Y.Z.prototype = y.fn,
	Y.uniq = B,
	Y.deserializeValue = u,
	y.zepto = Y,
	y
} ();
window.Zepto = Zepto,
"$" in window || (window.$ = Zepto),
function(a) {
	function b(a) {
		return a._zid || (a._zid = n++)
	}
	function c(a, c, f, g) {
		if (c = d(c), c.ns) var h = e(c.ns);
		return (m[b(a)] || []).filter(function(a) {
			return a && (!c.e || a.e == c.e) && (!c.ns || h.test(a.ns)) && (!f || b(a.fn) === b(f)) && (!g || a.sel == g)
		})
	}
	function d(a) {
		var b = ("" + a).split(".");
		return {
			e: b[0],
			ns: b.slice(1).sort().join(" ")
		}
	}
	function e(a) {
		return new RegExp("(?:^| )" + a.replace(" ", " .* ?") + "(?: |$)")
	}
	function f(b, c, d) {
		"string" != a.type(b) ? a.each(b, d) : b.split(/\s/).forEach(function(a) {
			d(a, c)
		})
	}
	function g(a, b) {
		return a.del && ("focus" == a.e || "blur" == a.e) || !!b
	}
	function h(a) {
		return p[a] || a
	}
	function i(c, e, i, j, k, l) {
		var n = b(c),
		o = m[n] || (m[n] = []);
		f(e, i,
		function(b, e) {
			var f = d(b);
			f.fn = e,
			f.sel = j,
			f.e in p && (e = function(b) {
				var c = b.relatedTarget;
				if (!c || c !== this && !a.contains(this, c)) return f.fn.apply(this, arguments)
			}),
			f.del = k && k(e, b);
			var i = f.del || e;
			f.proxy = function(a) {
				var b = i.apply(c, [a].concat(a.data));
				return b === !1 && (a.preventDefault(), a.stopPropagation()),
				b
			},
			f.i = o.length,
			o.push(f),
			c.addEventListener(h(f.e), f.proxy, g(f, l))
		})
	}
	function j(a, d, e, i, j) {
		var k = b(a);
		f(d || "", e,
		function(b, d) {
			c(a, b, d, i).forEach(function(b) {
				delete m[k][b.i],
				a.removeEventListener(h(b.e), b.proxy, g(b, j))
			})
		})
	}
	function k(b) {
		var c, d = {
			originalEvent: b
		};
		for (c in b) ! s.test(c) && void 0 !== b[c] && (d[c] = b[c]);
		return a.each(t,
		function(a, c) {
			d[a] = function() {
				return this[c] = q,
				b[a].apply(b, arguments)
			},
			d[c] = r
		}),
		d
	}
	function l(a) {
		if (! ("defaultPrevented" in a)) {
			a.defaultPrevented = !1;
			var b = a.preventDefault;
			a.preventDefault = function() {
				this.defaultPrevented = !0,
				b.call(this)
			}
		}
	}
	var m = (a.zepto.qsa, {}),
	n = 1,
	o = {},
	p = {
		mouseenter: "mouseover",
		mouseleave: "mouseout"
	};
	o.click = o.mousedown = o.mouseup = o.mousemove = "MouseEvents",
	a.event = {
		add: i,
		remove: j
	},
	a.proxy = function(c, d) {
		if (a.isFunction(c)) {
			var e = function() {
				return c.apply(d, arguments)
			};
			return e._zid = b(c),
			e
		}
		if ("string" == typeof d) return a.proxy(c[d], c);
		throw new TypeError("expected function")
	},
	a.fn.bind = function(a, b) {
		return this.each(function() {
			i(this, a, b)
		})
	},
	a.fn.unbind = function(a, b) {
		return this.each(function() {
			j(this, a, b)
		})
	},
	a.fn.one = function(a, b) {
		return this.each(function(c, d) {
			i(this, a, b, null,
			function(a, b) {
				return function() {
					var c = a.apply(d, arguments);
					return j(d, b, a),
					c
				}
			})
		})
	};
	var q = function() {
		return ! 0
	},
	r = function() {
		return ! 1
	},
	s = /^([A-Z]|layer[XY]$)/,
	t = {
		preventDefault: "isDefaultPrevented",
		stopImmediatePropagation: "isImmediatePropagationStopped",
		stopPropagation: "isPropagationStopped"
	};
	a.fn.delegate = function(b, c, d) {
		return this.each(function(e, f) {
			i(f, c, d, b,
			function(c) {
				return function(d) {
					var e, g = a(d.target).closest(b, f).get(0);
					if (g) return e = a.extend(k(d), {
						currentTarget: g,
						liveFired: f
					}),
					c.apply(g, [e].concat([].slice.call(arguments, 1)))
				}
			})
		})
	},
	a.fn.undelegate = function(a, b, c) {
		return this.each(function() {
			j(this, b, c, a)
		})
	},
	a.fn.live = function(b, c) {
		return a(document.body).delegate(this.selector, b, c),
		this
	},
	a.fn.die = function(b, c) {
		return a(document.body).undelegate(this.selector, b, c),
		this
	},
	a.fn.on = function(b, c, d) {
		return ! c || a.isFunction(c) ? this.bind(b, c || d) : this.delegate(c, b, d)
	},
	a.fn.off = function(b, c, d) {
		return ! c || a.isFunction(c) ? this.unbind(b, c || d) : this.undelegate(c, b, d)
	},
	a.fn.trigger = function(b, c) {
		return ("string" == typeof b || a.isPlainObject(b)) && (b = a.Event(b)),
		l(b),
		b.data = c,
		this.each(function() {
			"dispatchEvent" in this && this.dispatchEvent(b)
		})
	},
	a.fn.triggerHandler = function(b, d) {
		var e, f;
		return this.each(function(g, h) {
			e = k("string" == typeof b ? a.Event(b) : b),
			e.data = d,
			e.target = h,
			a.each(c(h, b.type || b),
			function(a, b) {
				if (f = b.proxy(e), e.isImmediatePropagationStopped()) return ! 1
			})
		}),
		f
	},
	"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(b) {
		a.fn[b] = function(a) {
			return a ? this.bind(b, a) : this.trigger(b)
		}
	}),
	["focus", "blur"].forEach(function(b) {
		a.fn[b] = function(a) {
			return a ? this.bind(b, a) : this.each(function() {
				try {
					this[b]()
				} catch(a) {}
			}),
			this
		}
	}),
	a.Event = function(a, b) {
		"string" != typeof a && (b = a, a = b.type);
		var c = document.createEvent(o[a] || "Events"),
		d = !0;
		if (b) for (var e in b)"bubbles" == e ? d = !!b[e] : c[e] = b[e];
		return c.initEvent(a, d, !0, null, null, null, null, null, null, null, null, null, null, null, null),
		c.isDefaultPrevented = function() {
			return this.defaultPrevented
		},
		c
	}
} (Zepto),
function(a, b) {
	function c(a) {
		return d(a.replace(/([a-z])([A-Z])/, "$1-$2"))
	}
	function d(a) {
		return a.toLowerCase()
	}
	function e(a) {
		return f ? f + a: d(a)
	}
	var f, g, h, i, j, k, l, m, n = "",
	o = {
		Webkit: "webkit",
		Moz: "",
		O: "o",
		ms: "MS"
	},
	p = window.document,
	q = p.createElement("div"),
	r = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
	s = {};
	a.each(o,
	function(a, c) {
		if (q.style[a + "TransitionProperty"] !== b) return n = "-" + d(a) + "-",
		f = c,
		!1
	}),
	g = n + "transform",
	s[h = n + "transition-property"] = s[i = n + "transition-duration"] = s[j = n + "transition-timing-function"] = s[k = n + "animation-name"] = s[l = n + "animation-duration"] = s[m = n + "animation-timing-function"] = "",
	a.fx = {
		off: f === b && q.style.transitionProperty === b,
		speeds: {
			_default: 400,
			fast: 200,
			slow: 600
		},
		cssPrefix: n,
		transitionEnd: e("TransitionEnd"),
		animationEnd: e("AnimationEnd")
	},
	a.fn.animate = function(b, c, d, e) {
		return a.isPlainObject(c) && (d = c.easing, e = c.complete, c = c.duration),
		c && (c = ("number" == typeof c ? c: a.fx.speeds[c] || a.fx.speeds._default) / 1e3),
		this.anim(b, c, d, e)
	},
	a.fn.anim = function(d, e, f, n) {
		var o, p, q, t = {},
		u = "",
		v = this,
		w = a.fx.transitionEnd;
		if (e === b && (e = .4), a.fx.off && (e = 0), "string" == typeof d) t[k] = d,
		t[l] = e + "s",
		t[m] = f || "linear",
		w = a.fx.animationEnd;
		else {
			p = [];
			for (o in d) r.test(o) ? u += o + "(" + d[o] + ") ": (t[o] = d[o], p.push(c(o)));
			u && (t[g] = u, p.push(g)),
			e > 0 && "object" == typeof d && (t[h] = p.join(", "), t[i] = e + "s", t[j] = f || "linear")
		}
		return q = function(b) {
			if ("undefined" != typeof b) {
				if (b.target !== b.currentTarget) return;
				a(b.target).unbind(w, q)
			}
			a(this).css(s),
			n && n.call(this)
		},
		e > 0 && this.bind(w, q),
		this.size() && this.get(0).clientLeft,
		this.css(t),
		e <= 0 && setTimeout(function() {
			v.each(function() {
				q.call(this)
			})
		},
		0),
		this
	},
	q = null
} (Zepto),
function(a) {
	function b(b, c, d) {
		var e = a.Event(c);
		return a(b).trigger(e, d),
		!e.defaultPrevented
	}
	function c(a, c, d, e) {
		if (a.global) return b(c || s, d, e)
	}
	function d(b) {
		b.global && 0 === a.active++&&c(b, null, "ajaxStart")
	}
	function e(b) {
		b.global && !--a.active && c(b, null, "ajaxStop")
	}
	function f(a, b) {
		var d = b.context;
		return b.beforeSend.call(d, a, b) !== !1 && c(b, d, "ajaxBeforeSend", [a, b]) !== !1 && void c(b, d, "ajaxSend", [a, b])
	}
	function g(a, b, d) {
		var e = d.context,
		f = "success";
		d.success.call(e, a, f, b),
		c(d, e, "ajaxSuccess", [b, d, a]),
		i(f, b, d)
	}
	function h(a, b, d, e) {
		var f = e.context;
		e.error.call(f, d, b, a),
		c(e, f, "ajaxError", [d, e, a]),
		i(b, d, e)
	}
	function i(a, b, d) {
		var f = d.context;
		d.complete.call(f, b, a),
		c(d, f, "ajaxComplete", [b, d]),
		e(d)
	}
	function j() {}
	function k(a) {
		return a && (a == x ? "html": a == w ? "json": u.test(a) ? "script": v.test(a) && "xml") || "text"
	}
	function l(a, b) {
		return (a + "&" + b).replace(/[&?]{1,2}/, "?")
	}
	function m(b) {
		b.processData && b.data && "string" != a.type(b.data) && (b.data = a.param(b.data, b.traditional)),
		b.data && (!b.type || "GET" == b.type.toUpperCase()) && (b.url = l(b.url, b.data))
	}
	function n(b, c, d, e) {
		var f = !a.isFunction(c);
		return {
			url: b,
			data: f ? c: void 0,
			success: f ? a.isFunction(d) ? d: void 0 : c,
			dataType: f ? e || d: d
		}
	}
	function o(b, c, d, e) {
		var f, g = a.isArray(c);
		a.each(c,
		function(c, h) {
			f = a.type(h),
			e && (c = d ? e: e + "[" + (g ? "": c) + "]"),
			!e && g ? b.add(h.name, h.value) : "array" == f || !d && "object" == f ? o(b, h, d, c) : b.add(c, h)
		})
	}
	var p, q, r = 0,
	s = window.document,
	t = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	u = /^(?:text|application)\/javascript/i,
	v = /^(?:text|application)\/xml/i,
	w = "application/json",
	x = "text/html",
	y = /^\s*$/;
	a.active = 0,
	a.ajaxJSONP = function(b) {
		if ("type" in b) {
			var c, d = "jsonp" + ++r,
			e = s.createElement("script"),
			i = function() {
				clearTimeout(c),
				a(e).remove(),
				delete window[d]
			},
			k = function(a) {
				i(),
				a && "timeout" != a || (window[d] = j),
				h(null, a || "abort", l, b)
			},
			l = {
				abort: k
			};
			return m(b),
			f(l, b) === !1 ? (k("abort"), !1) : (window[d] = function(a) {
				i(),
				g(a, l, b)
			},
			e.onerror = function() {
				k("error")
			},
			e.src = b.url.replace(/=\?/, "=" + d), a("head").append(e), b.timeout > 0 && (c = setTimeout(function() {
				k("timeout")
			},
			b.timeout)), l)
		}
		return a.ajax(b)
	},
	a.ajaxSettings = {
		type: "GET",
		beforeSend: j,
		success: j,
		error: j,
		complete: j,
		context: null,
		global: !0,
		xhr: function() {
			return new window.XMLHttpRequest
		},
		accepts: {
			script: "text/javascript, application/javascript",
			json: w,
			xml: "application/xml, text/xml",
			html: x,
			text: "text/plain"
		},
		crossDomain: !1,
		timeout: 0,
		processData: !0
	},
	a.ajax = function(b) {
		var c = a.extend({},
		b || {});
		for (p in a.ajaxSettings) void 0 === c[p] && (c[p] = a.ajaxSettings[p]);
		d(c),
		c.crossDomain || (c.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(c.url) && RegExp.$2 != window.location.host);
		var e = c.dataType,
		i = /=\?/.test(c.url);
		if ("jsonp" == e || i) return i || (c.url = l(c.url, "callback=?")),
		a.ajaxJSONP(c);
		c.url || (c.url = window.location.toString()),
		m(c);
		var n, o = c.accepts[e],
		r = {},
		s = /^([\w-]+:)\/\//.test(c.url) ? RegExp.$1: window.location.protocol,
		t = c.xhr();
		c.crossDomain || (r["X-Requested-With"] = "XMLHttpRequest"),
		o && (r.Accept = o, o.indexOf(",") > -1 && (o = o.split(",", 2)[0]), t.overrideMimeType && t.overrideMimeType(o)),
		(c.contentType || c.contentType !== !1 && c.data && "GET" != c.type.toUpperCase()) && (r["Content-Type"] = c.contentType || "application/x-www-form-urlencoded"),
		c.headers = a.extend(r, c.headers || {}),
		t.onreadystatechange = function() {
			if (4 == t.readyState) {
				t.onreadystatechange = j,
				clearTimeout(n);
				var b, d = !1;
				if (t.status >= 200 && t.status < 300 || 304 == t.status || 0 == t.status && "file:" == s) {
					e = e || k(t.getResponseHeader("content-type")),
					b = t.responseText;
					try {
						"script" == e ? (0, eval)(b) : "xml" == e ? b = t.responseXML: "json" == e && (b = y.test(b) ? null: a.parseJSON(b))
					} catch(f) {
						d = f
					}
					d ? h(d, "parsererror", t, c) : g(b, t, c)
				} else h(null, t.status ? "error": "abort", t, c)
			}
		};
		var u = !("async" in c) || c.async;
		t.open(c.type, c.url, u);
		for (q in c.headers) t.setRequestHeader(q, c.headers[q]);
		return f(t, c) === !1 ? (t.abort(), !1) : (c.timeout > 0 && (n = setTimeout(function() {
			t.onreadystatechange = j,
			t.abort(),
			h(null, "timeout", t, c)
		},
		c.timeout)), t.send(c.data ? c.data: null), t)
	},
	a.get = function(b, c, d, e) {
		return a.ajax(n.apply(null, arguments))
	},
	a.post = function(b, c, d, e) {
		var f = n.apply(null, arguments);
		return f.type = "POST",
		a.ajax(f)
	},
	a.getJSON = function(b, c, d) {
		return a.ajax(n(b, c, d, "json"))
	},
	a.fn.load = function(b, c, d) {
		if (!this.length) return this;
		var e, f = this,
		g = b.split(/\s/),
		h = n(b, c, d),
		i = h.success;
		return g.length > 1 && (h.url = g[0], e = g[1]),
		h.success = function(b) {
			f.html(e ? a("<div>").html(b.replace(t, "")).find(e) : b),
			i && i.apply(f, arguments)
		},
		a.ajax(h),
		this
	};
	var z = encodeURIComponent;
	a.param = function(a, b) {
		var c = [];
		return c.add = function(a, b) {
			this.push(z(a) + "=" + z(b))
		},
		o(c, a, b),
		c.join("&").replace(/%20/g, "+")
	}
} (Zepto),
function(a) {
	a.fn.serializeArray = function() {
		var b, c = [];
		return a(Array.prototype.slice.call(this.get(0).elements)).each(function() {
			b = a(this);
			var d = b.attr("type");
			"fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != d && "reset" != d && "button" != d && ("radio" != d && "checkbox" != d || this.checked) && c.push({
				name: b.attr("name"),
				value: b.val()
			})
		}),
		c
	},
	a.fn.serialize = function() {
		var a = [];
		return this.serializeArray().forEach(function(b) {
			a.push(encodeURIComponent(b.name) + "=" + encodeURIComponent(b.value))
		}),
		a.join("&")
	},
	a.fn.submit = function(b) {
		if (b) this.bind("submit", b);
		else if (this.length) {
			var c = a.Event("submit");
			this.eq(0).trigger(c),
			c.defaultPrevented || this.get(0).submit()
		}
		return this
	}
} (Zepto),
function(a, b) {
	function c(c, d, e, f, g) {
		"function" == typeof d && !g && (g = d, d = b);
		var h = {
			opacity: e
		};
		return f && (h.scale = f, c.css(a.fx.cssPrefix + "transform-origin", "0 0")),
		c.animate(h, d, null, g)
	}
	function d(b, d, e, f) {
		return c(b, d, 0, e,
		function() {
			g.call(a(this)),
			f && f.call(this)
		})
	}
	var e = window.document,
	f = (e.documentElement, a.fn.show),
	g = a.fn.hide,
	h = a.fn.toggle;
	a.fn.show = function(a, d) {
		return f.call(this),
		a === b ? a = 0 : this.css("opacity", 0),
		c(this, a, 1, "1,1", d)
	},
	a.fn.hide = function(a, c) {
		return a === b ? g.call(this) : d(this, a, "0,0", c)
	},
	a.fn.toggle = function(c, d) {
		return c === b || "boolean" == typeof c ? h.call(this, c) : this.each(function() {
			var b = a(this);
			b["none" == b.css("display") ? "show": "hide"](c, d)
		})
	},
	a.fn.fadeTo = function(a, b, d) {
		return c(this, a, b, null, d)
	},
	a.fn.fadeIn = function(a, b) {
		var c = this.css("opacity");
		return c > 0 ? this.css("opacity", 0) : c = 1,
		f.call(this).fadeTo(a, c, b)
	},
	a.fn.fadeOut = function(a, b) {
		return d(this, a, null, b)
	},
	a.fn.fadeToggle = function(b, c) {
		return this.each(function() {
			var d = a(this);
			d[0 == d.css("opacity") || "none" == d.css("display") ? "fadeIn": "fadeOut"](b, c)
		})
	}
} (Zepto),
function(a) {
	function b(b) {
		return b = a(b),
		!(!b.width() && !b.height() || "none" === b.css("display"))
	}
	function c(a, b) {
		a = a.replace(/=#\]/g, '="#"]');
		var c, d, e = h.exec(a);
		if (e && e[2] in g && (c = g[e[2]], d = e[3], a = e[1], d)) {
			var f = Number(d);
			d = isNaN(f) ? d.replace(/^["']|["']$/g, "") : f
		}
		return b(a, c, d)
	}
	var d = a.zepto,
	e = d.qsa,
	f = d.matches,
	g = a.expr[":"] = {
		visible: function() {
			if (b(this)) return this
		},
		hidden: function() {
			if (!b(this)) return this
		},
		selected: function() {
			if (this.selected) return this
		},
		checked: function() {
			if (this.checked) return this
		},
		parent: function() {
			return this.parentNode
		},
		first: function(a) {
			if (0 === a) return this
		},
		last: function(a, b) {
			if (a === b.length - 1) return this
		},
		eq: function(a, b, c) {
			if (a === c) return this
		},
		contains: function(b, c, d) {
			if (a(this).text().indexOf(d) > -1) return this
		},
		has: function(a, b, c) {
			if (d.qsa(this, c).length) return this
		}
	},
	h = new RegExp("(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*"),
	i = /^\s*>/,
	j = "Zepto" + +new Date;
	d.qsa = function(b, f) {
		return c(f,
		function(c, g, h) {
			try {
				var k; ! c && g ? c = "*": i.test(c) && (k = a(b).addClass(j), c = "." + j + " " + c);
				var l = e(b, c)
			} catch(m) {
				throw console.error("error performing selector: %o", f),
				m
			} finally {
				k && k.removeClass(j)
			}
			return g ? d.uniq(a.map(l,
			function(a, b) {
				return g.call(a, b, l, h)
			})) : l
		})
	},
	d.matches = function(a, b) {
		return c(b,
		function(b, c, d) {
			return (!b || f(a, b)) && (!c || c.call(a, null, d) === a)
		})
	}
} (Zepto),
function(a) {
	function b(a) {
		return "[object Function]" == Object.prototype.toString.call(a)
	}
	function c(a) {
		return "[object Array]" == Object.prototype.toString.call(a)
	}
	function d(a, b) {
		var c = /^\w+\:\/\//;
		return /^\/\/\/?/.test(a) ? a = location.protocol + a: c.test(a) || "/" == a.charAt(0) || (a = (b || "") + a),
		c.test(a) ? a: ("/" == a.charAt(0) ? s: r) + a
	}
	function e(a, b) {
		for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
		return b
	}
	function f(a) {
		for (var b = !1,
		c = 0; c < a.scripts.length; c++) a.scripts[c].ready && a.scripts[c].exec_trigger && (b = !0, a.scripts[c].exec_trigger(), a.scripts[c].exec_trigger = null);
		return b
	}
	function g(a, b, c, d) {
		a.onload = a.onreadystatechange = function() {
			a.readyState && "complete" != a.readyState && "loaded" != a.readyState || b[c] || (a.onload = a.onreadystatechange = null, d())
		}
	}
	function h(a) {
		a.ready = a.finished = !0;
		for (var b = 0; b < a.finished_listeners.length; b++) a.finished_listeners[b]();
		a.ready_listeners = [],
		a.finished_listeners = []
	}
	function i(a, b, c, d, e) {
		setTimeout(function() {
			var f, h, i = b.real_src;
			if ("item" in t) {
				if (!t[0]) return void setTimeout(arguments.callee, 25);
				t = t[0]
			}
			f = document.createElement("script"),
			b.type && (f.type = b.type),
			b.charset && (f.charset = b.charset),
			e ? z ? (a[p] && v("start script preload: " + i), c.elem = f, y ? (f.preload = !0, f.onpreload = d) : f.onreadystatechange = function() {
				"loaded" == f.readyState && d()
			},
			f.src = i) : e && 0 == i.indexOf(s) && a[l] ? (h = new XMLHttpRequest, a[p] && v("start script preload (xhr): " + i), h.onreadystatechange = function() {
				4 == h.readyState && (h.onreadystatechange = function() {},
				c.text = h.responseText + "\n//@ sourceURL=" + i, d())
			},
			h.open("GET", i), h.send()) : (a[p] && v("start script preload (cache): " + i), f.type = "text/cache-script", g(f, c, "ready",
			function() {
				t.removeChild(f),
				d()
			}), f.src = i, t.insertBefore(f, t.firstChild)) : A ? (a[p] && v("start script load (ordered async): " + i), f.async = !1, g(f, c, "finished", d), f.src = i, t.insertBefore(f, t.firstChild)) : (a[p] && v("start script load: " + i), g(f, c, "finished", d), f.src = i, t.insertBefore(f, t.firstChild))
		},
		0)
	}
	function j() {
		function r(a, b, c) {
			function d() {
				null != e && (e = null, h(c))
			}
			var e;
			D[b.src].finished || (a[n] || (D[b.src].finished = !0), e = c.elem || document.createElement("script"), b.type && (e.type = b.type), b.charset && (e.charset = b.charset), g(e, c, "finished", d), c.elem ? c.elem = null: c.text ? (e.onload = e.onreadystatechange = null, e.text = c.text) : e.src = b.real_src, t.insertBefore(e, t.firstChild), c.text && d())
		}
		function s(a, b, c, e) {
			var f, g, j = function() {
				b.ready_cb(b,
				function() {
					r(a, b, f)
				})
			},
			k = function() {
				b.finished_cb(b, c)
			};
			b.src = d(b.src, a[q]),
			b.real_src = b.src + (a[o] ? (/\?.*$/.test(b.src) ? "&_": "?_") + ~~ (1e9 * Math.random()) + "=": ""),
			D[b.src] || (D[b.src] = {
				items: [],
				finished: !1
			}),
			g = D[b.src].items,
			a[n] || 0 == g.length ? (f = g[g.length] = {
				ready: !1,
				finished: !1,
				ready_listeners: [j],
				finished_listeners: [k]
			},
			i(a, b, f, e ?
			function() {
				f.ready = !0;
				for (var a = 0; a < f.ready_listeners.length; a++) f.ready_listeners[a]();
				f.ready_listeners = []
			}: function() {
				h(f)
			},
			e)) : (f = g[0], f.finished ? k() : f.finished_listeners.push(k))
		}
		function u() {
			function a(a, b) {
				k[p] && v("script preload finished: " + a.real_src),
				a.ready = !0,
				a.exec_trigger = b,
				g()
			}
			function d(a, b) {
				k[p] && v("script execution finished: " + a.real_src),
				a.ready = a.finished = !0,
				a.exec_trigger = null;
				for (var c = 0; c < b.scripts.length; c++) if (!b.scripts[c].finished) return;
				b.finished = !0,
				g()
			}
			function g() {
				for (; n < l.length;) if (b(l[n])) {
					k[p] && v("JDLAB.wait() executing: " + l[n]);
					try {
						l[n++]()
					} catch(a) {
						k[p] && w("JDLAB.wait() error caught: ", a)
					}
				} else {
					if (!l[n].finished) {
						if (f(l[n])) continue;
						break
					}
					n++
				}
				n == l.length && (o = !1, j = !1)
			}
			function h() {
				j && j.scripts || l.push(j = {
					scripts: [],
					finished: !0
				})
			}
			var i, j, k = e(y, {}),
			l = [],
			n = 0,
			o = !1;
			return i = {
				script: function() {
					for (var f = 0; f < arguments.length; f++) !
					function(f, g) {
						var l;
						c(f) || (g = [f]);
						for (var n = 0; n < g.length; n++) h(),
						f = g[n],
						b(f) && (f = f()),
						f && (c(f) ? (l = [].slice.call(f), l.unshift(n, 1), [].splice.apply(g, l), n--) : ("string" == typeof f && (f = {
							src: f
						}), f = e(f, {
							ready: !1,
							ready_cb: a,
							finished: !1,
							finished_cb: d
						}), j.finished = !1, j.scripts.push(f), s(k, f, j, A && o), o = !0, k[m] && i.wait()))
					} (arguments[f], arguments[f]);
					return i
				},
				wait: function() {
					if (arguments.length > 0) {
						for (var a = 0; a < arguments.length; a++) l.push(arguments[a]);
						j = l[l.length - 1]
					} else j = !1;
					return g(),
					i
				}
			},
			{
				script: i.script,
				wait: i.wait,
				setOptions: function(a) {
					return e(a, k),
					i
				}
			}
		}
		var x, y = {},
		A = z || B,
		C = [],
		D = {};
		return y[l] = !0,
		y[m] = !1,
		y[n] = !1,
		y[o] = !1,
		y[p] = !1,
		y[q] = "",
		x = {
			setGlobalDefaults: function(a) {
				return e(a, y),
				x
			},
			setOptions: function() {
				return u().setOptions.apply(null, arguments)
			},
			script: function() {
				return u().script.apply(null, arguments)
			},
			wait: function() {
				return u().wait.apply(null, arguments)
			},
			queueScript: function() {
				return C[C.length] = {
					type: "script",
					args: [].slice.call(arguments)
				},
				x
			},
			queueWait: function() {
				return C[C.length] = {
					type: "wait",
					args: [].slice.call(arguments)
				},
				x
			},
			runQueue: function() {
				for (var a, b = x,
				c = C.length,
				d = c; --d >= 0;) a = C.shift(),
				b = b[a.type].apply(null, a.args);
				return b
			},
			noConflict: function() {
				return a.JDLAB = k,
				x
			},
			sandbox: function() {
				return j()
			}
		}
	}
	var k = a.JDLAB,
	l = "UseLocalXHR",
	m = "AlwaysPreserveOrder",
	n = "AllowDuplicates",
	o = "CacheBust",
	p = "Debug",
	q = "BasePath",
	r = /^[^?#]*\//.exec(location.href)[0],
	s = /^\w+\:\/\/\/?[^\/]+/.exec(r)[0],
	t = document.head || document.getElementsByTagName("head"),
	u = a.opera && "[object Opera]" == Object.prototype.toString.call(a.opera) || "MozAppearance" in document.documentElement.style,
	v = function() {},
	w = v,
	x = document.createElement("script"),
	y = "boolean" == typeof x.preload,
	z = y || x.readyState && "uninitialized" == x.readyState,
	A = !z && x.async === !0,
	B = !z && !A && !u;
	a.console && a.console.log && (a.console.error || (a.console.error = a.console.log), v = function(b) {
		a.console.log(b)
	},
	w = function(b, c) {
		a.console.error(b, c)
	}),
	a.JDLAB = j(),
	function(a, b, c) {
		null == document.readyState && document[a] && (document.readyState = "loading", document[a](b, c = function() {
			document.removeEventListener(b, c, !1),
			document.readyState = "complete"
		},
		!1))
	} ("addEventListener", "DOMContentLoaded")
} (this),
function(a) {
	"use strict";
	var b = function(b, c, d) {
		function e(a) {
			return h.body ? a() : void setTimeout(function() {
				e(a)
			})
		}
		function f() {
			i.addEventListener && i.removeEventListener("load", f)
		}
		var g, h = a.document,
		i = h.createElement("link");
		if (c) g = c;
		else {
			var j = (h.body || h.getElementsByTagName("head")[0]).childNodes;
			g = j[j.length - 1]
		}
		var k = h.styleSheets;
		i.rel = "stylesheet",
		i.href = b,
		i.media = d || "screen",
		e(function() {
			g.parentNode.insertBefore(i, c ? g: g.nextSibling)
		});
		var l = function(a) {
			for (var b = i.href,
			c = k.length; c--;) if (k[c].href === b) return a();
			setTimeout(function() {
				l(a)
			})
		};
		return i.addEventListener && i.addEventListener("load", f),
		i.onloadcssdefined = l,
		l(f),
		i
	};
	"undefined" != typeof exports ? exports.loadCSS = b: a.loadCSS = b
} ("undefined" != typeof global ? global: this);