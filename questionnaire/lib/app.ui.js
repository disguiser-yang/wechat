/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(y)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g,y=/^$|,+/;e.openTag="{{",e.closeTag="}}";var z=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a){a=a.replace(/^\s/,"");var b=a.split(" "),c=b.shift(),e=b.join(" ");switch(c){case"if":a="if("+e+"){";break;case"else":b="if"===b.shift()?" if("+b.join(" ")+")":"",a="}else"+b+"{";break;case"/if":a="}";break;case"each":var f=b[0]||"$data",g=b[1]||"as",h=b[2]||"$value",i=b[3]||"$index",j=h+","+i;"as"!==g&&(f="[]"),a="$each("+f+",function("+j+"){";break;case"/each":a="});";break;case"echo":a="print("+e+");";break;case"print":case"include":a=c+"("+b.join(",")+");";break;default:if(/^\s*\|\s*[\w\$]/.test(e)){var k=!0;0===a.indexOf("#")&&(a=a.substr(1),k=!1);for(var l=0,m=a.split("|"),n=m.length,o=m[l++];n>l;l++)o=z(o,m[l]);a=(k?"=":"=#")+o}else a=d.helpers[c]?"=#"+c+"("+b.join(",")+");":"="+a}return a},"function"==typeof define?define(function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}();
/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*global unescape, define, module */

;(function ($) {
  'use strict'

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safe_add (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bit_rol (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5_cmn (q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
  }
  function md5_ff (a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }
  function md5_gg (a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }
  function md5_hh (a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5_ii (a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binl_md5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32)
    x[(((len + 64) >>> 9) << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5_ff(a, b, c, d, x[i], 7, -680876936)
      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5_gg(b, c, d, a, x[i], 20, -373897302)
      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5_hh(d, a, b, c, x[i], 11, -358537222)
      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5_ii(a, b, c, d, x[i], 6, -198630844)
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safe_add(a, olda)
      b = safe_add(b, oldb)
      c = safe_add(c, oldc)
      d = safe_add(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i
    var output = ''
    for (i = 0; i < input.length * 32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    for (i = 0; i < input.length * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstr_md5 (s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstr_hmac_md5 (key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binl_md5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5C5C5C5C
    }
    hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hex_tab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hex_tab.charAt((x >>> 4) & 0x0F) +
      hex_tab.charAt(x & 0x0F)
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstr_utf8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function raw_md5 (s) {
    return rstr_md5(str2rstr_utf8(s))
  }
  function hex_md5 (s) {
    return rstr2hex(raw_md5(s))
  }
  function raw_hmac_md5 (k, d) {
    return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))
  }
  function hex_hmac_md5 (k, d) {
    return rstr2hex(raw_hmac_md5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hex_md5(string)
      }
      return raw_md5(string)
    }
    if (!raw) {
      return hex_hmac_md5(key, string)
    }
    return raw_hmac_md5(key, string)
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return md5
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
}(mui))
;(function($, window) {
	var CLASS_ZOOM = $.className('zoom');
	var CLASS_ZOOM_SCROLLER = $.className('zoom-scroller');

	var SELECTOR_ZOOM = '.' + CLASS_ZOOM;
	var SELECTOR_ZOOM_SCROLLER = '.' + CLASS_ZOOM_SCROLLER;

	var EVENT_PINCH_START = 'pinchstart';
	var EVENT_PINCH = 'pinch';
	var EVENT_PINCH_END = 'pinchend';
	if ('ongesturestart' in window) {
		EVENT_PINCH_START = 'gesturestart';
		EVENT_PINCH = 'gesturechange';
		EVENT_PINCH_END = 'gestureend';
	}
	$.Zoom = function(element, options) {
		var zoom = this;

		zoom.options = $.extend($.Zoom.defaults, options);

		zoom.wrapper = zoom.element = element;
		zoom.scroller = element.querySelector(SELECTOR_ZOOM_SCROLLER);
		zoom.scrollerStyle = zoom.scroller && zoom.scroller.style;

		zoom.zoomer = element.querySelector(SELECTOR_ZOOM);
		zoom.zoomerStyle = zoom.zoomer && zoom.zoomer.style;

		zoom.init = function() {
			zoom.initEvents();
		};

		zoom.initEvents = function(detach) {
			var action = detach ? 'removeEventListener' : 'addEventListener';
			var target = zoom.scroller;

			target[action](EVENT_PINCH_START, zoom.onPinchstart);
			target[action](EVENT_PINCH, zoom.onPinch);
			target[action](EVENT_PINCH_END, zoom.onPinchend);

			target[action]('touchstart', zoom.onTouchstart);
			target[action]('touchmove', zoom.onTouchMove);
			target[action]('touchcancel', zoom.onTouchEnd);
			target[action]('touchend', zoom.onTouchEnd);

			target[action]('drag', function(e) {
				if (imageIsMoved || isGesturing) {
					e.stopPropagation();
				}
			});
			target[action]('doubletap', function(e) {
				zoom.toggleZoom(e.detail.center);
			});
		};
		zoom.transition = function(style, time) {
			time = time || 0;
			style['webkitTransitionDuration'] = time + 'ms';
			return zoom;
		};
		zoom.translate = function(style, x, y) {
			x = x || 0;
			y = y || 0;
			style['webkitTransform'] = 'translate3d(' + x + 'px,' + y + 'px,0px)';
			return zoom;
		};
		zoom.scale = function(style, scale) {
			scale = scale || 1;
			style['webkitTransform'] = 'translate3d(0,0,0) scale(' + scale + ')';
			return zoom;
		};
		zoom.scrollerTransition = function(time) {
			return zoom.transition(zoom.scrollerStyle, time);
		};
		zoom.scrollerTransform = function(x, y) {
			return zoom.translate(zoom.scrollerStyle, x, y);
		};
		zoom.zoomerTransition = function(time) {
			return zoom.transition(zoom.zoomerStyle, time);
		};
		zoom.zoomerTransform = function(scale) {
			return zoom.scale(zoom.zoomerStyle, scale);
		};

		// Gestures
		var scale = 1,
			currentScale = 1,
			isScaling = false,
			isGesturing = false;
		zoom.onPinchstart = function(e) {
			isGesturing = true;
		};
		zoom.onPinch = function(e) {
			if (!isScaling) {
				zoom.zoomerTransition(0);
				isScaling = true;
			}
			scale = (e.detail ? e.detail.scale : e.scale) * currentScale;
			if (scale > zoom.options.maxZoom) {
				scale = zoom.options.maxZoom - 1 + Math.pow((scale - zoom.options.maxZoom + 1), 0.5);
			}
			if (scale < zoom.options.minZoom) {
				scale = zoom.options.minZoom + 1 - Math.pow((zoom.options.minZoom - scale + 1), 0.5);
			}
			zoom.zoomerTransform(scale);
		};
		zoom.onPinchend = function(e) {
			scale = Math.max(Math.min(scale, zoom.options.maxZoom), zoom.options.minZoom);
			zoom.zoomerTransition(zoom.options.speed).zoomerTransform(scale);
			currentScale = scale;
			isScaling = false;
		};
		zoom.setZoom = function(newScale) {
			scale = currentScale = newScale;
			zoom.scrollerTransition(zoom.options.speed).scrollerTransform(0, 0);
			zoom.zoomerTransition(zoom.options.speed).zoomerTransform(scale);
		};
		zoom.toggleZoom = function(position, speed) {
			if (typeof position === 'number') {
				speed = position;
				position = undefined;
			}
			speed = typeof speed === 'undefined' ? zoom.options.speed : speed;
			if (scale && scale !== 1) {
				scale = currentScale = 1;
				zoom.scrollerTransition(speed).scrollerTransform(0, 0);
			} else {
				scale = currentScale = zoom.options.maxZoom;
				if (position) {
					var offset = $.offset(zoom.zoomer);
					var top = offset.top;
					var left = offset.left;
					var offsetX = (position.x - left) * scale;
					var offsetY = (position.y - top) * scale;
					this._cal();
					if (offsetX >= imageMaxX && offsetX <= (imageMaxX + wrapperWidth)) { //center
						offsetX = imageMaxX - offsetX + wrapperWidth / 2;
					} else if (offsetX < imageMaxX) { //left
						offsetX = imageMaxX - offsetX + wrapperWidth / 2;
					} else if (offsetX > (imageMaxX + wrapperWidth)) { //right
						offsetX = imageMaxX + wrapperWidth - offsetX - wrapperWidth / 2;
					}
					if (offsetY >= imageMaxY && offsetY <= (imageMaxY + wrapperHeight)) { //middle
						offsetY = imageMaxY - offsetY + wrapperHeight / 2;
					} else if (offsetY < imageMaxY) { //top
						offsetY = imageMaxY - offsetY + wrapperHeight / 2;
					} else if (offsetY > (imageMaxY + wrapperHeight)) { //bottom
						offsetY = imageMaxY + wrapperHeight - offsetY - wrapperHeight / 2;
					}
					offsetX = Math.min(Math.max(offsetX, imageMinX), imageMaxX);
					offsetY = Math.min(Math.max(offsetY, imageMinY), imageMaxY);
					zoom.scrollerTransition(speed).scrollerTransform(offsetX, offsetY);
				} else {
					zoom.scrollerTransition(speed).scrollerTransform(0, 0);
				}
			}
			zoom.zoomerTransition(speed).zoomerTransform(scale);
		};

		zoom._cal = function() {
			wrapperWidth = zoom.wrapper.offsetWidth;
			wrapperHeight = zoom.wrapper.offsetHeight;
			imageWidth = zoom.zoomer.offsetWidth;
			imageHeight = zoom.zoomer.offsetHeight;
			var scaledWidth = imageWidth * scale;
			var scaledHeight = imageHeight * scale;
			imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
			imageMaxX = -imageMinX;
			imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
			imageMaxY = -imageMinY;
		};

		var wrapperWidth, wrapperHeight, imageIsTouched, imageIsMoved, imageCurrentX, imageCurrentY, imageMinX, imageMinY, imageMaxX, imageMaxY, imageWidth, imageHeight, imageTouchesStart = {},
			imageTouchesCurrent = {},
			imageStartX, imageStartY, velocityPrevPositionX, velocityPrevTime, velocityX, velocityPrevPositionY, velocityY;

		zoom.onTouchstart = function(e) {
			e.preventDefault();
			imageIsTouched = true;
			imageTouchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
			imageTouchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
		};
		zoom.onTouchMove = function(e) {
			e.preventDefault();
			if (!imageIsTouched) return;
			if (!imageIsMoved) {
				wrapperWidth = zoom.wrapper.offsetWidth;
				wrapperHeight = zoom.wrapper.offsetHeight;
				imageWidth = zoom.zoomer.offsetWidth;
				imageHeight = zoom.zoomer.offsetHeight;
				var translate = $.parseTranslateMatrix($.getStyles(zoom.scroller, 'webkitTransform'));
				imageStartX = translate.x || 0;
				imageStartY = translate.y || 0;
				zoom.scrollerTransition(0);
			}
			var scaledWidth = imageWidth * scale;
			var scaledHeight = imageHeight * scale;

			if (scaledWidth < wrapperWidth && scaledHeight < wrapperHeight) return;

			imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
			imageMaxX = -imageMinX;
			imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
			imageMaxY = -imageMinY;

			imageTouchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
			imageTouchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

			if (!imageIsMoved && !isScaling) {
				//				if (Math.abs(imageTouchesCurrent.y - imageTouchesStart.y) < Math.abs(imageTouchesCurrent.x - imageTouchesStart.x)) {
				//TODO 此处需要优化，当遇到长图，需要上下滚动时，下列判断会导致滚动不流畅
				if (
					(Math.floor(imageMinX) === Math.floor(imageStartX) && imageTouchesCurrent.x < imageTouchesStart.x) ||
					(Math.floor(imageMaxX) === Math.floor(imageStartX) && imageTouchesCurrent.x > imageTouchesStart.x)
				) {
					imageIsTouched = false;
					return;
				}
				//				}
			}
			imageIsMoved = true;
			imageCurrentX = imageTouchesCurrent.x - imageTouchesStart.x + imageStartX;
			imageCurrentY = imageTouchesCurrent.y - imageTouchesStart.y + imageStartY;

			if (imageCurrentX < imageMinX) {
				imageCurrentX = imageMinX + 1 - Math.pow((imageMinX - imageCurrentX + 1), 0.8);
			}
			if (imageCurrentX > imageMaxX) {
				imageCurrentX = imageMaxX - 1 + Math.pow((imageCurrentX - imageMaxX + 1), 0.8);
			}

			if (imageCurrentY < imageMinY) {
				imageCurrentY = imageMinY + 1 - Math.pow((imageMinY - imageCurrentY + 1), 0.8);
			}
			if (imageCurrentY > imageMaxY) {
				imageCurrentY = imageMaxY - 1 + Math.pow((imageCurrentY - imageMaxY + 1), 0.8);
			}

			//Velocity
			if (!velocityPrevPositionX) velocityPrevPositionX = imageTouchesCurrent.x;
			if (!velocityPrevPositionY) velocityPrevPositionY = imageTouchesCurrent.y;
			if (!velocityPrevTime) velocityPrevTime = $.now();
			velocityX = (imageTouchesCurrent.x - velocityPrevPositionX) / ($.now() - velocityPrevTime) / 2;
			velocityY = (imageTouchesCurrent.y - velocityPrevPositionY) / ($.now() - velocityPrevTime) / 2;
			if (Math.abs(imageTouchesCurrent.x - velocityPrevPositionX) < 2) velocityX = 0;
			if (Math.abs(imageTouchesCurrent.y - velocityPrevPositionY) < 2) velocityY = 0;
			velocityPrevPositionX = imageTouchesCurrent.x;
			velocityPrevPositionY = imageTouchesCurrent.y;
			velocityPrevTime = $.now();

			zoom.scrollerTransform(imageCurrentX, imageCurrentY);
		};
		zoom.onTouchEnd = function(e) {
			if (!e.touches.length) {
				isGesturing = false;
			}
			if (!imageIsTouched || !imageIsMoved) {
				imageIsTouched = false;
				imageIsMoved = false;
				return;
			}
			imageIsTouched = false;
			imageIsMoved = false;
			var momentumDurationX = 300;
			var momentumDurationY = 300;
			var momentumDistanceX = velocityX * momentumDurationX;
			var newPositionX = imageCurrentX + momentumDistanceX;
			var momentumDistanceY = velocityY * momentumDurationY;
			var newPositionY = imageCurrentY + momentumDistanceY;

			if (velocityX !== 0) momentumDurationX = Math.abs((newPositionX - imageCurrentX) / velocityX);
			if (velocityY !== 0) momentumDurationY = Math.abs((newPositionY - imageCurrentY) / velocityY);
			var momentumDuration = Math.max(momentumDurationX, momentumDurationY);

			imageCurrentX = newPositionX;
			imageCurrentY = newPositionY;

			var scaledWidth = imageWidth * scale;
			var scaledHeight = imageHeight * scale;
			imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
			imageMaxX = -imageMinX;
			imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
			imageMaxY = -imageMinY;
			imageCurrentX = Math.max(Math.min(imageCurrentX, imageMaxX), imageMinX);
			imageCurrentY = Math.max(Math.min(imageCurrentY, imageMaxY), imageMinY);

			zoom.scrollerTransition(momentumDuration).scrollerTransform(imageCurrentX, imageCurrentY);
		};
		zoom.destory = function() {
			zoom.initEvents(true); //detach
			delete $.data[zoom.wrapper.getAttribute('data-zoomer')];
			zoom.wrapper.setAttribute('data-zoomer', '');
		}
		zoom.init();
		return zoom;
	};
	$.Zoom.defaults = {
		speed: 300,
		maxZoom: 3,
		minZoom: 1,
	};
	$.fn.zoom = function(options) {
		var zoomApis = [];
		this.each(function() {
			var zoomApi = null;
			var self = this;
			var id = self.getAttribute('data-zoomer');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = zoomApi = new $.Zoom(self, options);
				self.setAttribute('data-zoomer', id);
			} else {
				zoomApi = $.data[id];
			}
			zoomApis.push(zoomApi);
		});
		return zoomApis.length === 1 ? zoomApis[0] : zoomApis;
	};
})(mui, window);
;(function($, window) {

	var template = '<div id="{{id}}" class="mui-slider mui-preview-image mui-fullscreen"><div class="mui-preview-header">{{header}}</div><div class="mui-slider-group"></div><div class="mui-preview-footer mui-hidden">{{footer}}</div><div class="mui-preview-loading"><span class="mui-spinner mui-spinner-white"></span></div></div>';
	var itemTemplate = '<div class="mui-slider-item mui-zoom-wrapper {{className}}"><div class="mui-zoom-scroller"><img src="{{src}}" data-preview-lazyload="{{lazyload}}" style="{{style}}" class="mui-zoom"></div></div>';
	var defaultGroupName = '__DEFAULT';
	var div = document.createElement('div');
	var imgId = 0;
	var PreviewImage = function(options) {
		this.options = $.extend(true, {
			id: '__MUI_PREVIEWIMAGE',
			zoom: true,
			header: '<span class="mui-preview-indicator"></span>',
			footer: ''
		}, options || {});
		this.init();
		this.initEvent();
	};
	var proto = PreviewImage.prototype;
	proto.init = function() {
		var options = this.options;
		var el = document.getElementById(this.options.id);
		if (!el) {
			div.innerHTML = template.replace(/\{\{id\}\}/g, this.options.id).replace('{{header}}', options.header).replace('{{footer}}', options.footer);
			document.body.appendChild(div.firstElementChild);
			el = document.getElementById(this.options.id);
		}
		//自动启用
		$.options.gestureConfig.pinch = true;
		$.options.gestureConfig.doubletap = true;

		this.element = el;
		this.scroller = this.element.querySelector($.classSelector('.slider-group'));
		this.indicator = this.element.querySelector($.classSelector('.preview-indicator'));
		this.loader = this.element.querySelector($.classSelector('.preview-loading'));
		if (options.footer) {
			this.element.querySelector($.classSelector('.preview-footer')).classList.remove($.className('hidden'));
		}
		this.addImages();
	};
	proto.initEvent = function() {
		var self = this;
		$(document.body).on('tap', 'img[data-preview-src]', function() {
			if (self.isAnimationing()) {
				return false;
			}
			self.open(this);
			return false;
		});
		var laterClose = null;
		var laterCloseEvent = function() {
			!laterClose && (laterClose = $.later(function() {
				self.isInAnimation = true;
				self.loader.removeEventListener('tap', laterCloseEvent);
				self.scroller.removeEventListener('tap', laterCloseEvent);
				self.close();
			}, 300));
		};
		this.scroller.addEventListener('doubletap', function() {
			if (laterClose) {
				laterClose.cancel();
				laterClose = null;
			}
		});
		this.element.addEventListener('webkitAnimationEnd', function() {
			if (self.element.classList.contains($.className('preview-out'))) { //close
				self.element.style.display = 'none';
				self.element.classList.remove($.className('preview-out'));
				laterClose = null;
			} else { //open
				self.loader.addEventListener('tap', laterCloseEvent);
				self.scroller.addEventListener('tap', laterCloseEvent);
			}
			self.isInAnimation = false;
		});
		this.element.addEventListener('slide', function(e) {
			if (self.options.zoom) {
				var lastZoomerEl = self.element.querySelector('.mui-zoom-wrapper:nth-child(' + (self.lastIndex + 1) + ')');
				if (lastZoomerEl) {
					$(lastZoomerEl).zoom().setZoom(1);
				}
			}
			var slideNumber = e.detail.slideNumber;
			self.lastIndex = slideNumber;
			self.indicator && (self.indicator.innerText = (slideNumber + 1) + '/' + self.currentGroup.length);
			self._loadItem(slideNumber);

		});
	};
	proto.isAnimationing = function() {
		if (this.isInAnimation) {
			return true;
		}
		this.isInAnimation = true;
		return false;
	};
	proto.addImages = function(group, index) {
		this.groups = {};
		var imgs = [];
		if (group) {
			if (group === defaultGroupName) {
				imgs = document.querySelectorAll("img[data-preview-src]:not([data-preview-group])");
			} else {
				imgs = document.querySelectorAll("img[data-preview-src][data-preview-group='" + group + "']");
			}
		} else {
			imgs = document.querySelectorAll("img[data-preview-src]");
		}
		if (imgs.length) {
			for (var i = 0, len = imgs.length; i < len; i++) {
				this.addImage(imgs[i]);
			}
		}
	};
	proto.addImage = function(img) {
		var group = img.getAttribute('data-preview-group');
		group = group || defaultGroupName;
		if (!this.groups[group]) {
			this.groups[group] = [];
		}
		var src = img.getAttribute('src');
		if (img.__mui_img_data && img.__mui_img_data.src === src) { //已缓存且图片未变化
			this.groups[group].push(img.__mui_img_data);
		} else {
			var lazyload = img.getAttribute('data-preview-src');
			if (!lazyload) {
				lazyload = src;
			}
			var imgObj = {
				src: src,
				lazyload: src === lazyload ? '' : lazyload,
				loaded: src === lazyload ? true : false,
				sWidth: 0,
				sHeight: 0,
				sTop: 0,
				sLeft: 0,
				sScale: 1,
				el: img
			};
			this.groups[group].push(imgObj);
			img.__mui_img_data = imgObj;
		}
	};


	proto.empty = function() {
		this.scroller.innerHTML = '';
	};
	proto._initImgData = function(itemData, imgEl) {
		if (!itemData.sWidth) {
			var img = itemData.el;
			itemData.sWidth = img.offsetWidth;
			itemData.sHeight = img.offsetHeight;
			var offset = $.offset(img);
			itemData.sTop = offset.top;
			itemData.sLeft = offset.left;
			itemData.sScale = Math.max(itemData.sWidth / window.innerWidth, itemData.sHeight / window.innerHeight);
		}
		imgEl.style.webkitTransform = 'translate3d(0,0,0) scale(' + itemData.sScale + ')';
	};

	proto._getScale = function(from, to) {
		var scaleX = from.width / to.width;
		var scaleY = from.height / to.height;
		var scale = 1;
		if (scaleX <= scaleY) {
			scale = from.height / (to.height * scaleX);
		} else {
			scale = from.width / (to.width * scaleY);
		}
		return scale;
	};
	proto._imgTransitionEnd = function(e) {
		var img = e.target;
		img.classList.remove($.className('transitioning'));
		img.removeEventListener('webkitTransitionEnd', this._imgTransitionEnd.bind(this));
	};
	proto._loadItem = function(index, isOpening) { //TODO 暂时仅支持img
		var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (index + 1) + ')'));
		var itemData = this.currentGroup[index];
		var imgEl = itemEl.querySelector('img');
		this._initImgData(itemData, imgEl);
		if (isOpening) {
			var posi = this._getPosition(itemData);
			imgEl.style.webkitTransitionDuration = '0ms';
			imgEl.style.webkitTransform = 'translate3d(' + posi.x + 'px,' + posi.y + 'px,0) scale(' + itemData.sScale + ')';
			imgEl.offsetHeight;
		}
		if (!itemData.loaded && imgEl.getAttribute('data-preview-lazyload')) {
			var self = this;
			self.loader.classList.add($.className('active'));
			//移动位置动画
			imgEl.style.webkitTransitionDuration = '0.5s';
			imgEl.addEventListener('webkitTransitionEnd', self._imgTransitionEnd.bind(self));
			imgEl.style.webkitTransform = 'translate3d(0,0,0) scale(' + itemData.sScale + ')';
			this.loadImage(imgEl, function() {
				itemData.loaded = true;
				imgEl.src = itemData.lazyload;
				self._initZoom(itemEl, this.width, this.height);
				imgEl.classList.add($.className('transitioning'));
				imgEl.addEventListener('webkitTransitionEnd', self._imgTransitionEnd.bind(self));
				imgEl.setAttribute('style', '');
				imgEl.offsetHeight;
				self.loader.classList.remove($.className('active'));
			});
		} else {
			itemData.lazyload && (imgEl.src = itemData.lazyload);
			this._initZoom(itemEl, imgEl.width, imgEl.height);
			imgEl.classList.add($.className('transitioning'));
			imgEl.addEventListener('webkitTransitionEnd', this._imgTransitionEnd.bind(this));
			imgEl.setAttribute('style', '');
			imgEl.offsetHeight;
		}
		this._preloadItem(index + 1);
		this._preloadItem(index - 1);
	};
	proto._preloadItem = function(index) {
		var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (index + 1) + ')'));
		if (itemEl) {
			var itemData = this.currentGroup[index];
			if (!itemData.sWidth) {
				var imgEl = itemEl.querySelector('img');
				this._initImgData(itemData, imgEl);
			}
		}
	};
	proto._initZoom = function(zoomWrapperEl, zoomerWidth, zoomerHeight) {
		if (!this.options.zoom) {
			return;
		}
		if (zoomWrapperEl.getAttribute('data-zoomer')) {
			return;
		}
		var zoomEl = zoomWrapperEl.querySelector($.classSelector('.zoom'));
		if (zoomEl.tagName === 'IMG') {
			var self = this;
			var maxZoom = self._getScale({
				width: zoomWrapperEl.offsetWidth,
				height: zoomWrapperEl.offsetHeight
			}, {
				width: zoomerWidth,
				height: zoomerHeight
			});
			$(zoomWrapperEl).zoom({
				maxZoom: Math.max(maxZoom, 1)
			});
		} else {
			$(zoomWrapperEl).zoom();
		}
	};
	proto.loadImage = function(imgEl, callback) {
		var onReady = function() {
			callback && callback.call(this);
		};
		var img = new Image();
		img.onload = onReady;
		img.onerror = onReady;
		img.src = imgEl.getAttribute('data-preview-lazyload');
	};
	proto.getRangeByIndex = function(index, length) {
		return {
			from: 0,
			to: length - 1
		};
		//		var from = Math.max(index - 1, 0);
		//		var to = Math.min(index + 1, length);
		//		if (index === length - 1) {
		//			from = Math.max(length - 3, 0);
		//			to = length - 1;
		//		}
		//		if (index === 0) {
		//			from = 0;
		//			to = Math.min(2, length - 1);
		//		}
		//		return {
		//			from: from,
		//			to: to
		//		};
	};

	proto._getPosition = function(itemData) {
		var sLeft = itemData.sLeft - window.pageXOffset;
		var sTop = itemData.sTop - window.pageYOffset;
		var left = (window.innerWidth - itemData.sWidth) / 2;
		var top = (window.innerHeight - itemData.sHeight) / 2;
		return {
			left: sLeft,
			top: sTop,
			x: sLeft - left,
			y: sTop - top
		};
	};
	proto.refresh = function(index, groupArray) {
		this.currentGroup = groupArray;
		//重新生成slider
		var length = groupArray.length;
		var itemHtml = [];
		var currentRange = this.getRangeByIndex(index, length);
		var from = currentRange.from;
		var to = currentRange.to + 1;
		var currentIndex = index;
		var className = '';
		var itemStr = '';
		var wWidth = window.innerWidth;
		var wHeight = window.innerHeight;
		for (var i = 0; from < to; from++, i++) {
			var itemData = groupArray[from];
			var style = '';
			if (itemData.sWidth) {
				style = '-webkit-transform:translate3d(0,0,0) scale(' + itemData.sScale + ');transform:translate3d(0,0,0) scale(' + itemData.sScale + ')';
			}
			itemStr = itemTemplate.replace('{{src}}', itemData.src).replace('{{lazyload}}', itemData.lazyload).replace('{{style}}', style);
			if (from === index) {
				currentIndex = i;
				className = $.className('active');
			} else {
				className = '';
			}
			itemHtml.push(itemStr.replace('{{className}}', className));
		}
		this.scroller.innerHTML = itemHtml.join('');
		this.element.style.display = 'block';
		this.element.classList.add($.className('preview-in'));
		this.lastIndex = currentIndex;
		this.element.offsetHeight;
		$(this.element).slider().gotoItem(currentIndex, 0);
		this.indicator && (this.indicator.innerText = (currentIndex + 1) + '/' + this.currentGroup.length);
		this._loadItem(currentIndex, true);
	};
	proto.openByGroup = function(index, group) {
		index = Math.min(Math.max(0, index), this.groups[group].length - 1);
		this.refresh(index, this.groups[group]);
	};
	proto.open = function(index, group) {
		if (this.element.classList.contains($.className('preview-in'))) {
			return;
		}
		if (typeof index === "number") {
			group = group || defaultGroupName;
			this.addImages(group, index); //刷新当前group
			this.openByGroup(index, group);
		} else {
			group = index.getAttribute('data-preview-group');
			group = group || defaultGroupName;
			this.addImages(group, index); //刷新当前group
			this.openByGroup(this.groups[group].indexOf(index.__mui_img_data), group);
		}
	};
	proto.close = function(index, group) {
		this.element.classList.remove($.className('preview-in'));
		this.element.classList.add($.className('preview-out'));
		var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (this.lastIndex + 1) + ')'));
		var imgEl = itemEl.querySelector('img');
		if (imgEl) {
			imgEl.classList.add($.className('transitioning'));
			var itemData = this.currentGroup[this.lastIndex];
			var posi = this._getPosition(itemData);
			var sLeft = posi.left;
			var sTop = posi.top;
			if (sTop > window.innerHeight || sLeft > window.innerWidth || sTop < 0 || sLeft < 0) { //out viewport
				imgEl.style.opacity = 0;
				imgEl.style.webkitTransitionDuration = '0.5s';
				imgEl.style.webkitTransform = 'scale(' + itemData.sScale + ')';
			} else {
				if (this.options.zoom) {
					$(imgEl.parentNode.parentNode).zoom().toggleZoom(0);
				}
				imgEl.style.webkitTransitionDuration = '0.5s';
				imgEl.style.webkitTransform = 'translate3d(' + posi.x + 'px,' + posi.y + 'px,0) scale(' + itemData.sScale + ')';
			}
		}
		var zoomers = this.element.querySelectorAll($.classSelector('.zoom-wrapper'));
		for (var i = 0, len = zoomers.length; i < len; i++) {
			$(zoomers[i]).zoom().destory();
		}
		//		$(this.element).slider().destory();
		//		this.empty();
	};
	proto.isShown = function() {
		return this.element.classList.contains($.className('preview-in'));
	};

	var previewImageApi = null;
	$.previewImage = function(options) {
		if (!previewImageApi) {
			previewImageApi = new PreviewImage(options);
		}
		return previewImageApi;
	};
	$.getPreviewImage = function() {
		return previewImageApi;
	}

})(mui, window);
;(function($, window, document) {
	var mid = 0;
	$.Lazyload = $.Class.extend({
		init: function(element, options) {
			var self = this;
			this.container = this.element = element;
			this.options = $.extend({
				selector: '',
				diff: false,
				force: false,
				autoDestroy: true,
				duration: 100
			}, options);

			this._key = 0;
			this._containerIsNotDocument = this.container.nodeType !== 9;
			this._callbacks = {};

			this._init();
		},
		_init: function() {
			this._initLoadFn();

			this.addElements();

			this._loadFn();

			$.ready(function() {
				this._loadFn();
			}.bind(this));

			this.resume();
		},
		_initLoadFn: function() {
			var self = this;
			self._loadFn = this._buffer(function() { // 加载延迟项
				if (self.options.autoDestroy && self._counter == 0 && $.isEmptyObject(self._callbacks)) {
					self.destroy();
				}
				self._loadItems();
			}, self.options.duration, self);
		},
		/**
		 *根据加载函数实现加载器
		 *@param {Function} load 加载函数
		 *@returns {Function} 加载器
		 */
		_createLoader: function(load) {
			var value, loading, handles = [],
				h;
			return function(handle) {
				if (!loading) {
					loading = true;
					load(function(v) {
						value = v;
						while (h = handles.shift()) {
							try {
								h && h.apply(null, [value]);
							} catch (e) {
								setTimeout(function() {
									throw e;
								}, 0)
							}
						}
					})
				}
				if (value) {
					handle && handle.apply(null, [value]);
					return value;
				}
				handle && handles.push(handle);
				return value;
			}
		},
		_buffer: function(fn, ms, context) {
			var timer;
			var lastStart = 0;
			var lastEnd = 0;
			var ms = ms || 150;

			function run() {
				if (timer) {
					timer.cancel();
					timer = 0;
				}
				lastStart = $.now();
				fn.apply(context || this, arguments);
				lastEnd = $.now();
			}

			return $.extend(function() {
				if (
					(!lastStart) || // 从未运行过
					(lastEnd >= lastStart && $.now() - lastEnd > ms) || // 上次运行成功后已经超过ms毫秒
					(lastEnd < lastStart && $.now() - lastStart > ms * 8) // 上次运行或未完成，后8*ms毫秒
				) {
					run();
				} else {
					if (timer) {
						timer.cancel();
					}
					timer = $.later(run, ms, null, arguments);
				}
			}, {
				stop: function() {
					if (timer) {
						timer.cancel();
						timer = 0;
					}
				}
			});
		},
		_getBoundingRect: function(c) {
			var vh, vw, left, top;

			if (c !== undefined) {
				vh = c.offsetHeight;
				vw = c.offsetWidth;
				var offset = $.offset(c);
				left = offset.left;
				top = offset.top;
			} else {
				vh = window.innerHeight;
				vw = window.innerWidth;
				left = 0;
				top = window.pageYOffset;
			}

			var diff = this.options.diff;

			var diffX = diff === false ? vw : diff;
			var diffX0 = 0;
			var diffX1 = diffX;

			var diffY = diff === false ? vh : diff;
			var diffY0 = 0;
			var diffY1 = diffY;

			var right = left + vw;
			var bottom = top + vh;


			left -= diffX0;
			right += diffX1;
			top -= diffY0;
			bottom += diffY1;
			return {
				left: left,
				top: top,
				right: right,
				bottom: bottom
			};
		},
		_cacheWidth: function(el) {
			if (el._mui_lazy_width) {
				return el._mui_lazy_width;
			}
			return el._mui_lazy_width = el.offsetWidth;
		},
		_cacheHeight: function(el) {
			if (el._mui_lazy_height) {
				return el._mui_lazy_height;
			}
			return el._mui_lazy_height = el.offsetHeight;
		},
		_isCross: function(r1, r2) {
			var r = {};
			r.top = Math.max(r1.top, r2.top);
			r.bottom = Math.min(r1.bottom, r2.bottom);
			r.left = Math.max(r1.left, r2.left);
			r.right = Math.min(r1.right, r2.right);
			return r.bottom >= r.top && r.right >= r.left;
		},
		_elementInViewport: function(elem, windowRegion, containerRegion) {
			// display none or inside display none
			if (!elem.offsetWidth) {
				return false;
			}
			var elemOffset = $.offset(elem);
			var inContainer = true;
			var inWin;
			var left = elemOffset.left;
			var top = elemOffset.top;
			var elemRegion = {
				left: left,
				top: top,
				right: left + this._cacheWidth(elem),
				bottom: top + this._cacheHeight(elem)
			};

			inWin = this._isCross(windowRegion, elemRegion);

			if (inWin && containerRegion) {
				inContainer = this._isCross(containerRegion, elemRegion);
			}
			// 确保在容器内出现
			// 并且在视窗内也出现
			return inContainer && inWin;
		},
		_loadItems: function() {
			var self = this;
			// container is display none
			if (self._containerIsNotDocument && !self.container.offsetWidth) {
				return;
			}
			self._windowRegion = self._getBoundingRect();

			if (self._containerIsNotDocument) {
				self._containerRegion = self._getBoundingRect(this.container);
			}
			$.each(self._callbacks, function(key, callback) {
				callback && self._loadItem(key, callback);
			});
		},
		_loadItem: function(key, callback) {
			var self = this;
			callback = callback || self._callbacks[key];
			if (!callback) {
				return true;
			}
			var el = callback.el;
			var remove = false;
			var fn = callback.fn;
			if (self.options.force || self._elementInViewport(el, self._windowRegion, self._containerRegion)) {
				try {
					remove = fn.call(self, el, key);
				} catch (e) {
					setTimeout(function() {
						throw e;
					}, 0);
				}
			}
			if (remove !== false) {
				delete self._callbacks[key];
			}
			return remove;
		},
		addCallback: function(el, fn) {
			var self = this;
			var callbacks = self._callbacks;
			var callback = {
				el: el,
				fn: fn || $.noop
			};
			var key = ++this._key;
			callbacks[key] = callback;

			// add 立即检测，防止首屏元素问题
			if (self._windowRegion) {
				self._loadItem(key, callback);
			} else {
				self.refresh();
			}
		},
		addElements: function(elements) {
			var self = this;
			self._counter = self._counter || 0;
			var lazyloads = [];
			if (!elements && self.options.selector) {
				lazyloads = self.container.querySelectorAll(self.options.selector);
			} else {
				$.each(elements, function(index, el) {
					lazyloads = lazyloads.concat($.qsa(self.options.selector, el));
				});
			}
			$.each(lazyloads, function(index, el) {
				if (!el.getAttribute('data-lazyload-id')) {
					if (self.addElement(el)) {
						el.setAttribute('data-lazyload-id', mid++);
						self.addCallback(el, self.handle);
					}
				}
			});
		},
		addElement: function(el) {
			return true;
		},
		handle: function() {
			//throw new Error('需子类实现');
		},
		refresh: function(check) {
			if (check) { //检查新的lazyload
				this.addElements();
			}
			this._loadFn();
		},
		pause: function() {
			var load = this._loadFn;
			if (this._destroyed) {
				return;
			}
			window.removeEventListener('scroll', load);
			window.removeEventListener('touchmove', load);
			window.removeEventListener('resize', load);
			if (this._containerIsNotDocument) {
				this.container.removeEventListener('scrollend', load);
				this.container.removeEventListener('scroll', load);
				this.container.removeEventListener('touchmove', load);
			}
		},
		resume: function() {
			var load = this._loadFn;
			if (this._destroyed) {
				return;
			}
			window.addEventListener('scroll', load, false);
			window.addEventListener('touchmove', load, false);
			window.addEventListener('resize', load, false);
			if (this._containerIsNotDocument) {
				this.container.addEventListener('scrollend', load, false);
				this.container.addEventListener('scroll', load, false);
				this.container.addEventListener('touchmove', load, false);
			}
		},
		destroy: function() {
			var self = this;
			self.pause();
			self._callbacks = {};
			$.trigger(this.container, 'destory', self);
			self._destroyed = 1;
		}
	});
})(mui, window, document);
;(function($, window, document) {
	var ImageLazyload = $.Lazyload.extend({
		init: function(element, options) {
			this._super(element, options);
		},
		_init: function() {
			this.options.selector = 'img[data-lazyload]';
			this._super();
		},
		addElement: function(img) {
			var self = this;
			var src = img.getAttribute('data-lazyload');
			if (src) {
				self.onPlaceHolder = self._createLoader(function(callback) {
					var img = new Image();
					var placeholder = self.options.placeholder;
					img.src = placeholder;
					img.onload = img.onerror = function() {
						callback(placeholder)
					};
				});
				if (img.offsetWidth) {
					self.addCallback(img, self.handle);
				} else {
					self._counter++;
					img.onload = function() {
						self._counter--;
						self.addCallback(img, self.handle);
						this.onload = null;
					};
					if (!img.src) {
						self.onPlaceHolder(function(placeholder) {
							if (!img.src) {
								img.src = placeholder;
							}
						});
					}
				}
				return true;
			}
			return false;
		},
		handle: function(img, key) {
			var dataSrc = img.getAttribute('data-lazyload');
			if (dataSrc && img.src != dataSrc) {
				img.src = dataSrc;
				img.removeAttribute('data-lazyload');
				img.parentNode.parentNode.setAttribute('data-lazyload', 'true');
			}
		}
	});
	$.fn.imageLazyload = function(options) {
		var lazyloadApis = [];
		this.each(function() {
			var self = this;
			var lazyloadApi = null;
			if (self === document || self === window) {
				self = document.body;
			}
			var id = self.getAttribute('data-imageLazyload');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = lazyloadApi = new ImageLazyload(self, options);
				self.setAttribute('data-imageLazyload', id);
			} else {
				lazyloadApi = $.data[id];
			}
			lazyloadApis.push(lazyloadApi);
		});
		return lazyloadApis.length === 1 ? lazyloadApis[0] : lazyloadApis;
	}
})(mui, window, document);
/*! webapp appui需引入appui.css */
;!function() {
	window.getFragment = function(dom) {
		var fragment = document.createDocumentFragment();
		if (!dom) {
			return fragment;
		}
		if (typeof dom === 'object') {
			fragment.appendChild(dom);
			return fragment;
		}
		dom = parseDom(dom);
		for (var i = 0, len = dom.length; i < len; i++) {
			fragment.appendChild(dom[i]);
		}
		return fragment;
	};
	window.parseDom = function(innerHTML) {　　
		var div = document.createElement('div');　　
		div.innerHTML = innerHTML;
		var childs = div.childNodes;
		var reNodes = [];
		//清理掉空格回车造成的 空白node
		for (var i = 0, len = childs.length; i < len; i++) {
			if (childs[i].nodeName !== "#text") {
				reNodes[reNodes.length] = childs[i];
			}
		}　　
		return reNodes;
	};
	window.templatePage = function(sel, temp, data, reload) {
		var fragment = getFragment(template(temp, data));
		var wrap = document.querySelector(sel);
		if (reload) {
			wrap.innerHTML = '';
		}
		wrap.appendChild(fragment);
	};
	window.ts = function(jsonObj, msg) {
		if (msg) {
			return msg + ':' + JSON.stringify(jsonObj);
		} else {
			return JSON.stringify(jsonObj);
		}
	};
	window.tb = function(str) {
		return JSON.parse(str);
	};
	window.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r) return unescape(r[2]);
		return null;
	};
	window.openView = function(url, title) {
		if (window.app && app.openView) {
			app.openView(ts({
				"url": url,
				"opt": {
					"goback": true,
					"title": title
				}
			}));
		}else{
			location.href=url;
		}
	};
	
}();
/!*  ui  */
var appui = (function() {
	var $_ = {};
	var appuiLoading=null;
	var confirm_=null;
	$_.openWatting = function() {
		var element = document.createElement('div');
		element.className='appui-loading';
		element.innerHTML='<div class="appui-loading-playwrap"><div class="appui-loading-play"></div></div>';
		return appuiLoading=document.body.appendChild(element);
	};
	$_.closeWatting = function() {
		if(appuiLoading){
			appuiLoading.addEventListener('webkitAnimationEnd',onLoadingHidden);
			appuiLoading.classList.add('hide');
		}
	};
	var onLoadingHidden=function(e){
		this.style.display='none';
		this.removeEventListener('webkitAnimationEnd', onLoadingHidden);
	};
	$_.showNullData=function(){
		var element = document.createElement('div');
		element.className='appui-nullBox';
		document.body.appendChild(element);
	};
	//toast 
	$_.toast=function(msg){
		if(!msg){
			msg='';
		}
		var element = document.createElement('div');
		element.className='appui-toast';
		element.innerHTML='<div class="appui-toast-text">'+msg+'</div>';
		document.body.appendChild(element);
		setTimeout(function(){
			element.addEventListener('webkitAnimationEnd',onToastRemove);
			element.classList.add('bounceOut');
		},2500);
	};
    var onToastRemove=function(e){
    		this.style.display='none';
		this.removeEventListener('webkitAnimationEnd', onToastRemove);
		document.body.removeChild(this);
    };
    
    //process HUD 
    $_.showHUD=function(msg) {
    		var bg = document.createElement('div');
    		bg.id='processHUD';
    		bg.classList.add('appui-hud');
    		
    		var hud = document.createElement('div');
    		hud.classList.add('appui-hud-bg');
    		bg.appendChild(hud);
    		
    		var imgBg = document.createElement('div');
    		imgBg.className = 'appui-hud-icon-imgbg';
    		hud.appendChild(imgBg);
    		
    		var iconBg = document.createElement('div');
    		iconBg.classList.add('appui-hud-icon-bg');
    		iconBg.id = 'processHUDiconBg';
    		imgBg.appendChild(iconBg);
    		
    		var icon = document.createElement('span');
    		icon.id = 'processHUDicon';
      	icon.classList.add('mui-icon');
      	icon.classList.add('appui-icon-hud');
      	icon.classList.add('appui-icon-hud-loading');
      	
      	icon.style.animation = 'rotation 1s linear infinite';
      	icon.style.webkitAnimation = 'rotation 1s linear infinite';
      	icon.style.MozAnimation = 'rotation 1s linear infinite';
      	icon.style.transformOrigin = '50% 50%';
    		iconBg.appendChild(icon);

		if (msg != null && msg != '' && msg != 'undefined') {
			var txt = document.createElement('div');
			txt.id = 'processHUDtxt';
			txt.classList.add('appui-hud-text');
			txt.innerHTML = msg;
			hud.appendChild(txt);
		} 
    		
    		document.body.appendChild(bg);
    };
    $_.removeHUD=function(state, msg){
    		if(q('#processHUD') == null) return;
    		var iconBg = q('#processHUDiconBg');
    		q('#processHUDicon').style.animation = '';
    		q('#processHUDicon').style.webkitAnimation = '';
    		q('#processHUDicon').style.MozAnimation = '';
    		
    		var txt = q('#processHUDtxt');
    		if (msg != null && msg != '' && msg != 'undefined') {
			if (txt == null || txt == 'undefined') {
				txt = document.createElement('div');
				txt.id = 'processHUDtxt';
				txt.classList.add('appui-hud-text');
				iconBg.parentElement.parentElement.appendChild(txt);
			}
			txt.innerHTML = msg;
		} else {
			if (txt != null && txt != 'undefined') {
				txt.style.display = 'none';
			}
		}
    		
    		if (state == 1) { // operation success
    			q('#processHUDicon').classList.remove('appui-icon-hud-loading');
    			q('#processHUDicon').classList.add('appui-icon-hud-check');
    			remove(2000);
    		} else if (state == 2) { // operation success
    			q('#processHUDicon').classList.remove('appui-icon-hud-loading');
    			q('#processHUDicon').classList.add('appui-icon-hud-close');
    			remove(2000);
    		} else if (state == 0) {  // remove straightly
    			remove(2000);
    		} else {
    			remove(0);
    		}
    		function remove(seconds){
    			setTimeout(function(){
    				document.body.removeChild(q('#processHUD'));
    			}, seconds);
    		}
    };
    
    
    //confirm
    $_.confirm=function(msg,subText,callback,ask){
    		if(document.querySelector('.appui-confirm')){
    			return false;
    		}
    		document.body.addEventListener('touchmove',mui.preventDefault);
    		if(!msg){
			msg='';
		}
    		if(!subText){
    			subText='确定';
    		}
    		var element = document.createElement('div');
		element.className='appui-confirm';
		element.innerHTML='';
		var inner='<div class="appui-confirm-wrap">'+
						'<div class="appui-confirm-msg">'+msg+'</div>'+
						'<div class="appui-confirm-btn">';
		 if(!ask){
		 	inner+='<span class="appui-confirm-btn-cancel">取消</span>';
		 }
		inner+='<span class="appui-confirm-btn-sub">'+subText+'</span>'+
						'</div>'+
					'</div>';
		element.innerHTML=inner;			
		document.body.appendChild(element);
		confirm_={};
		confirm_.callback=callback;
		confirm_.ele=element;
		element.addEventListener('tap',confirmClick);
    }
    //confirm 点击
    var confirmClick=function(e){
    		document.body.removeEventListener('touchmove',mui.preventDefault);
    		var clickObj=e.target;
    		if(clickObj.classList.contains('appui-confirm-btn-sub')){
	    		if(confirm_&&confirm_.ele){
	    			confirm_.ele.removeEventListener('tap',confirmClick);
	    			document.body.removeChild(confirm_.ele);
	    		}
    			if(confirm_&&confirm_.callback){
    				confirm_.callback();
    			}
    		}else if(clickObj.classList.contains('appui-confirm-btn-cancel')){
    			if(confirm_&&confirm_.ele){
	    			confirm_.ele.removeEventListener('tap',confirmClick);
	    			document.body.removeChild(confirm_.ele);
	    		}
    		}
    };
	return $_;

})();

/!*  uitl  */
!function(){
	/**
	对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
	可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
	Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
	(new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
	(new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
	(new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
	(new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
	**/
	Date.prototype.pattern=function(fmt) {         
	    var o = {         
	    "M+" : this.getMonth()+1, //月份         
	    "d+" : this.getDate(), //日         
	    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
	    "H+" : this.getHours(), //小时         
	    "m+" : this.getMinutes(), //分         
	    "s+" : this.getSeconds(), //秒         
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
	    "S" : this.getMilliseconds() //毫秒         
	    };         
	    var week = {         
	    "0" : "/u65e5",         
	    "1" : "/u4e00",         
	    "2" : "/u4e8c",         
	    "3" : "/u4e09",         
	    "4" : "/u56db",         
	    "5" : "/u4e94",         
	    "6" : "/u516d"        
	    };         
	    if(/(y+)/.test(fmt)){         
	        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
	    }         
	    if(/(E+)/.test(fmt)){         
	        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
	    }         
	    for(var k in o){         
	        if(new RegExp("("+ k +")").test(fmt)){         
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
	        }         
	    }         
	    return fmt;         
	}     
}();
//图片加载成功后显示
! function() {
	
	
	window.imgLoad = function(elements,placeholder) {
		if (elements && elements.length > 0) {
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				var uri = element.getAttribute('data-imgload');
				set(element, uri,placeholder);
			}
		}
	};

	function set(element, uri,placeholder) {
		var img = new Image();
		img.onload = function() {
			element.src = uri;
			element.classList.add('m-img-load');
		};
		img.onerror = function() {
			if(placeholder){
				element.src = placeholder;
			}
		};
		img.src = uri;
		element.removeAttribute('data-imgload');
	}
}();
//设备标识
! function() {
	if (window.mui) {
		if (mui.os.ios) {
			document.documentElement.classList.add('m-ios');
		} else if (mui.os.android) {
			document.documentElement.classList.add('m-android');
		}
	}
}();
! function($) {
	$.m$d5KC=function(a,b){
		return $.md5(b+a);
	}
	$.md={};
	$.md.fullNull=function(){
		var element = document.createElement('div');
		element.className='m-fullNull';
		element.innerHTML='<i></i><label>暂时没有东东哟</label>';
		return document.body.appendChild(element);
	};
	/**修改title*/
	$.md.setTitle=function(title) {
		if(window.app&&app.setHtmlTitle){//调用原生修改title
			app.setHtmlTitle(title);
		}else{
			document.title = title;
			var _iframe = Zepto('<iframe style="display: none;" src="/favicon.ico"></iframe>').on('load', function() {
				setTimeout(function(){
					_iframe.off('load').remove();
				}, 0)
			}).appendTo(Zepto(document.body));
		}
	};
	/**转码*/
	$.md.htmlDecode=function(text) {
		var temp = document.createElement("div");
		temp.innerHTML = text;
		var output = temp.innerText || temp.textContent;
		temp = null;
		return output;
	};
	/**获取sid*/
	$.getSid=function(){
		var sid=sessionStorage.getItem('_st');
		if(sid) return sid;
		if(window.app&&app.getSid){
			sid=app.getSid();
		}else{
			sid=getQueryString('sid');
		}
		if(sid)sessionStorage.setItem('_st',sid);
		return sid?sid:'-1';
	};
	/**设置sid*/
	$.setSid=function(sid){
		sessionStorage.setItem('_st',sid);
		if(window.app&&app.setSid){
			app.setSid(ts({
				sid:sid
			}));//设置sid
		}
		return sid;
	};
	/**获取keyCode*/
	$.getKeyCode=function(){
		if(window.app&&app.getKeyCode){
			return app.getKeyCode();//返回keyCode
		}else{
			return '-1';
		}
	};
	$.timeStamp=function(){
		return new Date().getTime();
	};
	$.appVersion=function(){
		return 'web-h5';
	};
	$.channel=function(){
		return '010';
	};
	$.errorMsg=function(){
		return '网络开小差咯';
	};
	$.loadComplete=function(){
		return '亲爱滴，已经到底咯！';
	};
	$.loading=function(){
		return '加载中...';
	};
}(mui);
/**数据格式化*/
! function($) {
	
	$.format = {};
	//格式化卡号
	$.format.hexCard = function(hexCardNumber){
		var _hexCardNumber=hexCardNumber||'';
		return _hexCardNumber.replace(/(\d{5})/g,'$1 ').replace(/\s*$/,'');
	};
	//格式化人民币
	$.format.price = function(hexPrice,hexUnit){
		var _hexUnit=hexUnit||'元';
		var _hexPrice=hexPrice||0;
		if(typeof(_hexPrice)=="string"){
			_hexPrice=parseFloat(_hexPrice);
		}
		switch (hexUnit){
			case '角':
				_hexPrice=_hexPrice/10;
				break;
			case '分':
				_hexPrice=_hexPrice/100;
				break;
			default:
				break;
		}
		return _hexPrice.toFixed(2);
	};
	
}(mui);
//重写ready
! function($) {
	var appIsReady=false;
	$.pageReady = function(callback) {
		if (/complete|loaded|interactive/.test(document.readyState)) {
			$.appReady(callback);
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				$.appReady(callback);
			}, false);
		}
		return this;
	};
	$.appReady = function(callback) {
		if (window.app) {
			appIsReady=true;
			setTimeout(function() { //解决callback与plusready事件的执行时机问题
				$.getSid();
				callback($);
			}, 0);
		} else {
			document.addEventListener("appReady", function(e) {
				appIsReady=true;
				$.getSid();
				//callback($);
			}, false);
			$.checkAppIsReady(30,callback);
		}
		return this;
	};
	//为了兼容老版本 循环检测app接口是否注入完毕
	$.checkAppIsReady=function(i,callback){
		setTimeout(function() {
			if (appIsReady || window.app) {
				$.getSid();
				callback($);
			} else {
				if (i && i > 0) {
					i--;
					arguments.callee(i,callback);
				} else {
					appIsReady=true;
					$.getSid();
					callback($);
				}
			}
		}, 100);
	};
}(mui);