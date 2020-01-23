var isRTL = ($('html').attr('dir') == "rtl") ? true : false,
    winWidth = $(window).width(),
    winHeight = $(window).height();

$(function() {
    browserDetect();
});

$(window).on('load', function() {
    // Do after Page ready
    doOnLoad();
});

$(window).on('resize orientationchange', function() {
    // Do on resize
    winWidth = $(window).width(),
    winHeight = $(window).height();
});

$(window).on('scroll', function() {
    //Do on Scroll
});

$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        //Do on ESC press
    }
});

function doOnLoad() {
    //OnLoad Function
    setTimeout(function() {
        addVideoPlugin();
    }, 4000);
}

function browserDetect() {
    navigator.sayswho = (function() {
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join('').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();
    $('body').addClass(navigator.sayswho);
}

function addVideoPlugin() {
    if (winWidth > 1024 && $('.js-video').get(0)) {
        var plyrScriptElement = document.createElement("script");
        if (isRTL) {
            plyrScriptElement.setAttribute('src', customVariables.baseURL + '../assets/js/plyr.min.js');
        } else {
            plyrScriptElement.setAttribute('src', customVariables.baseURL + 'assets/js/plyr.min.js');
        }
        plyrScriptElement.setAttribute('async', 'true');
        document.body.appendChild(plyrScriptElement);
    } else {
        jsVideoDirect();
    }
}

var players = [];

function jsVideo() {
    // Custom player
    if ($('.js-video').length) {
        $('.js-video').each(function(i) {
            var thisParent = $(this).parent();
            players[i] = new Plyr(this, {
                playsinline: true,
            });
            thisParent.find('.plyr').attr('data-video-instance', i);
        });
    }
}

function jsVideoDirect() {
    if ($('.js-video').length) {
        $('.js-video').each(function(i) {
            $(this).attr('data-video-instance', i);
            var videoId = $(this).attr('data-plyr-embed-id');
            $(this).html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + videoId + '?rel=0&playsinline=1&enablejsapi=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
        });
    }
}