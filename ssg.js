

// Simple Scroll Gallery (SSG)
// Copyright (C) 2018 Roman Flössler - flor@flor.cz
//
// licensed under Mozilla Public License 2.0 with one exception: it is not granted to develop a Wordpress plugin based on SSG.
// Here you can see how gallery works - http://ssg.flor.cz/
// SSG on Github: https://github.com/Roman-Flossler/Simple-Scroll-Gallery.git


var SSG = {};  // main object - namespace

SSG.setVariables = function () {
    SSG.imgs = [];  // array of objects where image attributes are stored
    SSG.loaded = -1; // index of newest loaded image
    SSG.displayed = -1;  // index of image displayed in viewport
    SSG.originalPos = window.pageYOffset || document.documentElement.scrollTop; // save actual vertical scroll of page
    SSG.scrHeight = jQuery(window).height();
    jQuery(window).width() / SSG.scrHeight >= 1 ? SSG.scrFraction = 2 : SSG.scrFraction = 4;  // different screen fraction for different screen aspect ratios
    SSG.imageDown = false;   // if it was pressed arrow down
    SSG.imageUp = false;    // if it was pressed arrow up
    SSG.firstImageCentered = false;  // if it is centered first image
    SSG.scrollingAllowed = true;  // when true, scrolling is allowed
    SSG.arrowsExist = true;  // if there are are navigation arrows displayed
    SSG.fullscreenMode = false;  // if fullscreen mode is active
    SSG.exitFullscreen = false; // true when exiting from fullscreen mode
    SSG.finito = false;  // if all images are loaded
    SSG.lastone = false; // if it was scrolled to last element in the gallery - go back button
    SSG.exitClicked = false; // set to true when user clicks exit button, prevents call SSG.destroyGallery twice
}

SSG.initGallery = function initGallery(event) {
    window.scrollTo(0, 0);
    jQuery("body").append("<div id='SSG_galBg'></div><div id='SSG_gallery'></div> <div id='SSG_lastone'></div> <div id='SSG_exit'><span>&times;</span></div>"); // gallery's divs
    jQuery("body").append("<div id='SSG_up'></div><div id='SSG_down'></div> <div id='SSG_arrows'><span class='up'></span><span class='down'></span></div>"); // gallery's arrows navigation    
    jQuery("body").append('<link rel="stylesheet" id="scrollstyle" href="scrollbar.css" type="text/css" />');  // scrollbar style
    if ((event && event.currentTarget) && (event.currentTarget.parentNode.tagName == "DT" || event.currentTarget.parentElement.classList[0] == 'fs' || event.currentTarget.classList[0] == 'fs')) {
        SSG.fullscreenMode = true;
    }    // when event exists it checks also event.currentTarget and if some of fs flag is set it sets fullscreen to true
    if (event && event.fs) SSG.fullscreenMode = true;
    jQuery(document).keydown(SSG.keyFunction);
    jQuery("#SSG_exit").click(function () {SSG.exitClicked=true; SSG.destroyGallery()});
    jQuery("#SSG_arrows .up, #SSG_up").click(function () { SSG.imageUp = true; });
    jQuery("#SSG_arrows .down").click(function () { SSG.imageDown = true; jQuery('#SSG_arrows .down').css('animation', 'none'); });
    jQuery("#SSG_down").click(function () { SSG.imageDown = true; SSG.removeArrows(); });
    jQuery('body').on('mousewheel DOMMouseScroll', SSG.revealScrolling);
    SSG.fullscreenMode && SSG.openFullscreen();
}

SSG.keyFunction = function (event) {
    if (event.which == 27) SSG.destroyGallery(); //ESC key destroys gallery
    if (event.which == 40 || event.which == 39 || event.which == 34 || event.which == 32) {
        SSG.imageDown = true; // Arrow down or left sets the property that causes jumping on next photo        
        SSG.removeArrows();
    }
    if (event.which == 38 || event.which == 37 || event.which == 33) {
        SSG.imageUp = true; // Arrow up or right sets the property that causes jumping on previos photo        
        SSG.removeArrows();
    }
    event.preventDefault();
    event.stopPropagation();
}

SSG.removeArrows = function () {
    if (SSG.arrowsExist) {
        jQuery("#SSG_arrows").remove();
        SSG.arrowsExist = false;
    }
}

SSG.getImgList = function (event) {
    Array.prototype.forEach.call(jQuery("a[href$='.jpg'],a[href$='.png'],a[href$='.gif']").toArray(), function (el) { // call invokes forEach method in context of jQuery output
        if (el.children[0])
            SSG.imgs.push({ href: el.href, alt: el.children[0].alt }); // if A tag has children (img tag) its atributes are pushed into SSG.imgs array
        // text legend under image apears only if A tag's children[0] has alt attribute (is image) - it should be fixed, maybe :)
    });

    if (event && event.currentTarget) {
        var clickedHref = event.currentTarget.href;
        var clickedAlt = event.currentTarget.children["0"].alt;
    } else if (event && event.img) {
        var clickedHref = event.img.href;
        var clickedAlt = event.img.alt;
    }

    if (clickedHref) {
        var i;
        var max = SSG.imgs.length >= 6 ? 5 : SSG.imgs.length - 1;
        for (i = 0; i < max; i++) {
            SSG.imgs[i].href == clickedHref && SSG.imgs.splice(i, 1);  // remove the image that the user clicked, it will be added on begining of the gallery
        }
        SSG.imgs.unshift({ href: clickedHref, alt: clickedAlt }); //  the image that the user clicked is added to beginning of the gallery
    }
}

jQuery(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function () {
    if (SSG.fullscreenMode && SSG.exitFullscreen && !SSG.exitClicked) {  // if exit from fullscreen mode detected, close gallery
        SSG.destroyGallery();
    }
    if (!SSG.exitFullscreen) SSG.exitFullscreen = true;
});

SSG.refreshPos = function () {  // recalculate all loaded images positions after new image is loaded
    for (var i = 0; i <= SSG.loaded; i++) {
        SSG.imgs[i].pos = Math.round(jQuery("#i" + i).offset().top);
    }
}

SSG.countResize = function () {
    SSG.scrHeight = jQuery(window).height();
    jQuery(window).width() / SSG.scrHeight >= 1 ? SSG.scrFraction = 2 : SSG.scrFraction = 4;
    SSG.firstImageCentered && SSG.refreshPos(); // only if first image is already centered. Prevents problems when gallery is initiate in fullscreen mode (it activates onresize event)
    SSG.finito && jQuery("#SSG_lastone").css('top', jQuery('#p' + SSG.loaded).offset().top + 100 + 'px');
}

SSG.addImage = function () {
    var newOne = SSG.loaded + 1; // newone is index of image which will be load

    if (newOne < SSG.imgs.length) {
        jQuery("#SSG_gallery").append("<span class='wrap'><img id='i" + newOne + "' src='" + SSG.imgs[newOne].href + "'><span class='logo'></span></span>");
        if (!SSG.imgs[newOne].alt) SSG.imgs[newOne].alt = "";
        jQuery("#SSG_gallery").append("<p id='p" + newOne + "'>" + SSG.imgs[newOne].alt + "</p>");
        jQuery("#i" + newOne).on('load', function (event) {
            SSG.refreshPos(); // when img is loaded positions of images a recalculated
        });
        SSG.loaded = newOne; // index of newest loaded image
    }
    if (newOne == SSG.imgs.length) {  // newOne is now actually by +1 larger than array index. I know, lastone element should be part of SSG.imgs array
        jQuery("#SSG_lastone").css('top', jQuery('#p' + SSG.loaded).offset().top + 100 + 'px');
        jQuery("#SSG_lastone").append("<p id='back'><a class='link'>Back to website</a></p><div id='more'></div>");
        jQuery("#back").click(function () {SSG.exitClicked=true; SSG.destroyGallery()} );
        //		jQuery("#more").load( "https://www.flor.cz/js/SSG/more.html" ); load html file with links to next galleries
        SSG.finito = true; //  all images are already loaded
    }
}

SSG.getName = function (url) {  // acquire image name from url address
    return url.slice(url.lastIndexOf("/") + 1);
}

SSG.metronome = function () {
    var actual = window.pageYOffset || document.documentElement.scrollTop; // actual offset from top of the page

    if (SSG.imgs[SSG.loaded].pos && !SSG.finito) {  // if imgs.pos exists image is already loaded and not all images are loaded
        var Faraway = SSG.imgs[SSG.loaded].pos; // the newest loaded image offset from top of the page        
        (Faraway - actual < SSG.scrHeight * 3) && SSG.addImage();  // when actual offset is three screen near from faraway gallery loads next image
    }

    if ((SSG.loaded > 0 && (SSG.imgs[SSG.loaded - 1].pos - actual < SSG.scrHeight * 0.5) && !SSG.finito) || !SSG.imgs[0].pos) {  // if user is close enough to last loaded image
        jQuery(document.body).addClass("wait");  //wait cursor will appear 
    } else {
        jQuery(document.body).removeClass("wait");
    }

    actual += Math.round(SSG.scrHeight / SSG.scrFraction);  // actual + some screen fractions, determinates exactly when image pageview is logged into GA

    for (var i = 0; i <= SSG.loaded; i++) {
        var topPos = 0;
        if (i < SSG.imgs.length - 1) { topPos = SSG.imgs[i + 1].pos } else { topPos = SSG.imgs[i].pos + SSG.scrHeight } // get topPos of last image bottom side
        if ((actual > SSG.imgs[i].pos) && (actual < topPos)) {
            if (typeof ga !== 'undefined') {
                SSG.displayed != i && ga('send', 'pageview', '/img' + location.pathname + SSG.getName(SSG.imgs[i].href));
            } // sends pageview of actual image to Google Analytics
            SSG.displayed != i && console.log('/img' + location.pathname + SSG.getName(SSG.imgs[i].href));
            SSG.displayed = i;
        }
    }
    SSG.jumpScroll();
}

SSG.jumpScroll = function () {
    if (SSG.imageUp && SSG.displayed - 1 >= 0 && !SSG.lastone)  // if imageUp is true then scroll on previous image
        jQuery("html, body").animate({ scrollTop: SSG.imgs[SSG.displayed - 1].pos - SSG.countImageIndent(SSG.displayed - 1) + "px" }, 500, "swing");

    if (SSG.imageUp && SSG.lastone) { // if lastone is true, i am out of index, so scroll on last image in index. I know, this lastone element should be part of SSG.imgs array
        jQuery("html, body").animate({ scrollTop: SSG.imgs[SSG.displayed].pos - SSG.countImageIndent(SSG.displayed) + "px" }, 500, "swing");
        SSG.lastone = false;
    }


    if (SSG.displayed + 1 < SSG.imgs.length && SSG.imageDown && SSG.imgs[SSG.displayed + 1].pos) { // if imageDown is true and next image is loaded (pos exists) then scroll down        
        jQuery("html, body").animate({ scrollTop: SSG.imgs[SSG.displayed + 1].pos - SSG.countImageIndent(SSG.displayed + 1) + "px" }, 500, "swing");
    } else {
        if (typeof jQuery("#back").offset() !== 'undefined') { // if back button exists scroll to it
            SSG.imageDown && jQuery("html, body").animate({ scrollTop: jQuery("#back").offset().top - (SSG.scrHeight / 10) }, 500, "swing", function () { SSG.lastone = true; });
        }        
    }


    if (SSG.imgs[0].pos && !SSG.firstImageCentered) {   // center first image after initiation of gallery
        window.scrollTo(0, SSG.imgs[0].pos - SSG.countImageIndent(0));
        if (!SSG.firstImageCentered) SSG.firstImageCentered = true;
    }

    SSG.imageDown = false;
    SSG.imageUp = false;
}

SSG.countImageIndent = function (index) {  // function count how much indent image from the top of the screen to center image    
    var screen = jQuery(window).height();
    var img = jQuery("#i" + index).outerHeight(true);
    var pIn = jQuery("#p" + index).innerHeight();
    var pOut = jQuery("#p" + index).outerHeight(true);
    var pMargin = pOut - pIn;
    var centerPos = Math.round((screen - (img + pIn)) / 2);
    if (centerPos < 0) centerPos = 0;
    return centerPos > pMargin ? pMargin : centerPos;  // it prevents fraction of previous image appears above centered image
}

SSG.seizeScrolling = function (scroll) {
    if (scroll == 1 && SSG.scrollingAllowed) {
        setScroll();
        SSG.imageDown = true;
    } else if (scroll == -1 && SSG.scrollingAllowed) {
        setScroll();
        SSG.imageUp = true;
    }

    function setScroll() {
        jQuery(window).bind("mousewheel DOMMouseScroll", SSG.preventDef);
        SSG.scrollTimeout = setTimeout(SSG.setScrollActive, 666);  // it will renew ability to scroll in 666ms
        scroll = 0;
        SSG.scrollingAllowed = false;
        SSG.removeArrows();
    }
}

SSG.preventDef = function (event) {
    event.preventDefault();
}

SSG.setScrollActive = function () { SSG.scrollingAllowed = true; clearTimeout(SSG.scrollTimeout); jQuery(window).off("mousewheel DOMMouseScroll", SSG.preventDef); }

SSG.revealScrolling = function (e) {  // finds out if it is beeing used scroll wheel and then calls seize scrolling
    if (typeof e.originalEvent.detail == 'number' && e.originalEvent.detail !== 0) {
        if (e.originalEvent.detail > 0) {
            SSG.seizeScrolling(+1);
        } else if (e.originalEvent.detail < 0) {
            SSG.seizeScrolling(-1);
        }
    } else if (typeof e.originalEvent.wheelDelta == 'number') {
        if (e.originalEvent.wheelDelta < 0) {
            SSG.seizeScrolling(+1);
        } else if (e.originalEvent.wheelDelta > 0) {
            SSG.seizeScrolling(-1);
        }
    }
}

SSG.openFullscreen = function () {
    var elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    }
}

/* Close fullscreen */
SSG.closeFullscreen = function () {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    }
}

SSG.destroyGallery = function () {
    clearInterval(SSG.metronomInterval);
    if (typeof ga !== 'undefined') ga('send', 'pageview', location.pathname);
    console.log(location.pathname);
    jQuery("#SSG_galBg,#SSG_gallery,#SSG_exit,#scrollstyle,#SSG_up,#SSG_down,#SSG_lastone,#SSG_tip").remove();
    SSG.removeArrows();
    jQuery('body').off('mousewheel DOMMouseScroll', SSG.revealScrolling);
    jQuery(window).off("resize", SSG.countResize);
    jQuery(document).off("keydown", SSG.keyFunction);
    SSG.fullscreenMode && SSG.closeFullscreen();
    SSG.fullscreenMode ? window.setTimeout(function () { window.scrollTo(0, SSG.originalPos) }, 100) : window.scrollTo(0, SSG.originalPos);
    // sets the original (before initGallery) vertical scroll of page. SetTimeout solves problem with return from Fullscreen, when simple scrollTo didn't work
}

SSG.showFSTip = function () {
    var l1 = "<div id='SSG_tip'><span><div id='close'>&times;</div>For better experience <a>click for fullscreen mode</a><br/>";
    var l2 = "<hr/>navigation: mouse wheel <strong>&circledcirc;</strong> or arrow keys <strong>&darr;&rarr;&uarr;&larr;</strong><br/>";
    var l3 = "or <strong>TAP</strong> on bottom (upper) part of screen</span></div>";
    
    jQuery("body").append(l1+l2+l3); // gallery's arrows navigation
    jQuery('#SSG_tip').click(function () { SSG.openFullscreen(); SSG.fullscreenMode = true; jQuery('#SSG_tip').remove(); SSG.firstImageCentered = false; });
    jQuery('#SSG_tip #close').click(function () { jQuery('#SSG_tip').remove(); });
}


SSG.getHash = function () {
    var hash = window.location.hash;
    if (hash != '') {
        hash = hash.substring(1, hash.length);
        var target = jQuery('a[href*=' + hash + ']').toArray();

        if (target[0] && target[0].children[0]) {
            var href = target[0].href;
            var alt = target[0].children[0].alt;

            var event = {};
            event.img = { href: href, alt: alt }
            SSG.run(event);
            SSG.showFSTip();
        }
    }
}

SSG.run = function (event) {
    SSG.setVariables();
    SSG.initGallery(event); // pass onlick event    
    SSG.getImgList(event);
    SSG.addImage(); // load first image
    SSG.metronomInterval = setInterval(SSG.metronome, 333); // every 333 ms check if more images should be loaded and logged into Google Analytics, Speed scrolling
    jQuery(window).resize(SSG.countResize);
    return false;
}

jQuery(document).ready(function () { jQuery("a[href$='.jpg'],a[href$='.png'],a[href$='.gif']").click(SSG.run) });
jQuery(document).ready(SSG.getHash);
