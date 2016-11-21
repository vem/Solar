function loadfn(arr, fn, fn2) {
	var loader = new PxLoader();
	for (var i = 0; i < arr.length; i++) { loader.addImage(arr[i]); };

	loader.addProgressListener(function(e) {
		var percent = Math.round(e.completedCount / e.totalCount * 100);
		if (fn2) fn2(percent);
	});

	loader.addCompletionListener(function() {
		if (fn) fn();
	});

	loader.start();
}

function updateOrientation() {
	if (window.orientation != 0) $('.cantsp').show();
	else $('.cantsp').hide();
}

function getQueryStringByName(name) {
	var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
	if (result == null || result.length < 1) return "";
	return result[1];
}

function rand(under, over) {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * under + 1);
		case 2:
			return parseInt(Math.random() * (over - under + 1) + under);
		default:
			return 0;
	}
}

function checkClient() {
	if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/Windows Phone/i)) {
		return 'wap';
	} else if (navigator.userAgent.match(/iPad/i)) {
		return 'pad';
	} else {
		return 'web';
	}
}

function is_wechat() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.match(/MicroMessenger/i) == "micromessenger";
}

function track_btn(val) {
	ga('send', 'event', 'button', 'click', val);
}

function setCookie(name, value, seconds) {
	seconds = seconds || 0; //seconds有值就直接赋值，没有为0，这个根php不一样。  
	var expires = "";
	if (seconds != 0) { //设置cookie生存时间  
		var date = new Date();
		date.setTime(date.getTime() + (seconds * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + escape(value) + expires + "; path=/"; //转码并赋值  
}

$.fn.draggable = function() {
	var offset = null;
	var start = function(e) {
		var orig = e.originalEvent;
		var pos = $(this).position();
		offset = {
			x: orig.changedTouches[0].pageX - pos.left,
			y: orig.changedTouches[0].pageY - pos.top
		};
	};
	var moveMe = function(e) {
		e.preventDefault();
		var orig = e.originalEvent;
		$(this).css({
			top: orig.changedTouches[0].pageY - offset.y,
			left: orig.changedTouches[0].pageX - offset.x
		});
	};
	this.bind("touchstart", start);
	this.bind("touchmove", moveMe);
};

(function() {
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());

var deg2rad = function(e) {
	return e * Math.PI / 180;
};

Object.size = function(obj) {
	var size = 0,
		key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};