/// <reference path="jquery.lazyload.min.js" />



/*
 * M站移动端公共模板样式-@2018
 * 提供基础公共模板的基础功能，记录来源，统计代码等
 * Design:ColdClub@Hua
 * Modify:新增客服返回参数
 * ModifyTime:2018年6月14日09:52:48
 * 
 * */
(function($, window, document) {
	function autoLoadFile(links, filename, callback) {
		filename = filename || 'script';
		var jqueryEl = document.createElement(filename);
		jqueryEl.onload = callback;
		if(filename == 'link') {
			jqueryEl.href = links;
			var head = document.getElementsByTagName('head')[0]
			head.appendChild(jqueryEl);
		} else {
			jqueryEl.src = links;
			var body = document.getElementsByTagName('body')[0];
			body.appendChild(jqueryEl);
		}
	}
	var hua = function(customConfig) {
		//默认配置
		var config = {
			menu: {
				toggle: true,
				back: true,
				selector: '.header-bar>.icon-menu',
				nav: '.nav'
			},
			gotop: {
				rate: 1, //屏幕高度倍数
				anim: 300 //返回顶部动画时效
			},
			lazyimg: {
				effect: 'fadeIn',
				threshold: 200,
				placeholder: '//img.lwpoor.cn/hua/icon/375x409.png'
			},
			shopcar: {
				selector: '.nav .icon-badge'
			}
		};
		this.urlparam = {
			sid: "",
			u_id: ""
		};
		var _init = function() {
			//返回顶部
			var $goTopEl = $("#goTopBtn");
			if($goTopEl.length > 0) {
				$goTopEl.click(function() {
					$("html,body").animate({
						scrollTop: 0
					}, config.gotop.anim);
				});
				$(document).scroll(function() {
					var $scrollTop = $(this).scrollTop();
					//ToggleFloatBtn GoTop
					if($scrollTop >= window.screen.height * config.gotop.rate) {
						$goTopEl.show();
					} else {
						$goTopEl.hide();
					}
				});
			}

			//自动识别异步加载图片标记[data-original]
			var $lazyImg = $('img[data-original]');
			if($lazyImg.length > 0) {
				if($.fn && typeof $.fn.lazyload == 'function') {
					console.info('已自动开启异步加载图片');
					$lazyImg.lazyload({
						effect: config.lazyimg.effect,
						threshold: config.lazyimg.threshold,
						placeholder: config.lazyimg.placeholder
					});
				} else {
				    autoLoadFile('/Scripts/jquery.lazyload.min.js', 'script', function () {
						$lazyImg.lazyload({
							effect: config.lazyimg.effect,
							threshold: config.lazyimg.threshold,
							placeholder: config.lazyimg.placeholder
						});
					});
				}
			}

			//绑定切换目录
			if(config.menu.toggle) {
				var $toggleMenu = $(config.menu.selector);
				if($toggleMenu.length > 0) {
					$toggleMenu.click(function(e) {
						e.preventDefault();
						e.stopPropagation();
						var $nav = $(config.menu.nav);
						if($nav.css("display") == "none") {
							$nav.show();
						} else {
							$nav.hide();
						}
					})
				}
			}

			//绑定返回键
			if(config.menu.back) {
				var $back = $('[data-back=true]');
				if($back.length > 0) {
					$back.click(function(e) {
						e.preventDefault();
						e.stopPropagation();
						var ref = document.referrer.toLowerCase();
						if(ref && ref.indexOf("m.lwpoor.cn") > -1) {
						    if (ref.indexOf("/shopping/sendinfo") > -1) {
								history.go(-2);
							}
						    else if(ref.indexOf("/payment/balancefill") > -1) {
						        window.location.replace("/");
						    }
						    else {
						    	history.go(-1);
						    }
						} else {
							window.location.replace("/");
						}
					});
				}
			}
		};
		this.getParam = function(paramname) {
			var kv = location.search.slice(1).split("&");
			for(var i = 0; i < kv.length; i++) {
				var index = kv[i].indexOf("=");
				if(index == -1) {
					continue;
				}
				this.urlparam[kv[i].slice(0, index)] = kv[i].slice(index + 1);
			}
			return this.urlparam[paramname];
		};

		//自调
		_init();
		this.getParam();
	}
	window.Hua = hua;
	setTimeout(function() {
		window.hua = new Hua();
	}, 0);
})(jQuery, window, document);


//判断是否为微信浏览器
function isWeiXinBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

$(function () {
    if (isWeiXinBrowser()) {

        $(".header-bar").hide();
        $("header").hide();
    }
});