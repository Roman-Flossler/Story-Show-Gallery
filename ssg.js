
// Simple Scroll Gallery (SSG)
// Copyright (C) 2018 Roman Flössler - flor@flor.cz
//
// licensed under Mozilla Public License 2.0 with one exception: it is not granted to develop a Wordpress plugin based on SSG.
// Here you can see how gallery works - http://ssg.flor.cz/
// SSG on Github: https://github.com/Roman-Flossler/Simple-Scroll-Gallery.git

var SSG = {};  // main object - namespace
SSG.jQueryImgSelector = "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.PNG'],a[href$='.gif'],a[href$='.GIF']";

SSG.setVariables = function () {
    SSG.fileToLoad = 'ssg-loaded.html'; // load a HTML file behind the gallery (better to use absolute URL http://), or set SSG.fileToLoad = null; if you don't want it
    SSG.imgs = [];  // array of objects where image attributes are stored
    SSG.loaded = -1; // index of the newest loaded(loading) image
    SSG.displayed = -1;  // index of an image displayed in viewport
    SSG.originalPos = window.pageYOffset || document.documentElement.scrollTop; // save actual vertical scroll of a page
    SSG.scrHeight = jQuery(window).height();
    jQuery(window).width() / SSG.scrHeight >= 1 ? SSG.scrFraction = 2 : SSG.scrFraction = 3.5;  // different screen fraction for different screen aspect ratios
    SSG.imageDown = false;   // a user wants next photo
    SSG.imageUp = false;    // a user wants previous photo
    SSG.firstImageCentered = false;  // if the first image is already centered 
    SSG.scrollingAllowed = true;  // when true, scrolling is allowed
    SSG.fullscreenMode = false;  // if fullscreen mode is active
    SSG.fullscreenModeWanted = false;  // if fullscreen mode should be activated
    SSG.exitFullscreen = false; // true when exiting from fullscreen mode    
    SSG.finito = false;  // if all images are loaded
    SSG.lastone = false; // if it was scrolled to the last element in the gallery - exit gallery link
    SSG.exitClicked = false; // set to true when a user clicks the exit button, prevents call SSG.destroyGallery twice
    SSG.firstTick = true;  // first tick of metronome function
    SSG.standardMode = true;  // standard mode with exit
}

SSG.initGallery = function initGallery(event) {
    if (event && event.noExit) SSG.standardMode = false;
    jQuery(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', SSG.onFS);
    window.scrollTo(0, 0);
    jQuery("body").append("<div id='SSG_galBg'></div><div id='SSG_gallery'></div>"); // gallery's divs
    SSG.standardMode && jQuery("body").append("<div id='SSG_exit'></div>"); // gallery's divs
    jQuery('html').addClass('ssg');
    if ((event && event.currentTarget) && (event.currentTarget.parentNode.tagName == "DT" || event.currentTarget.parentElement.classList[0] == 'fs' || event.currentTarget.classList[0] == 'fs')) {
        SSG.openFullscreen();
    }    // when event exists it checks also event.currentTarget and if some of fs flag is set it sets fullscreen to true    
    if (event && event.fs) {
         SSG.openFullscreen(); SSG.fullscreenModeWanted = true;
    }    
    jQuery(document).keydown(SSG.keyFunction);    
    jQuery("#SSG_exit").click(function () { SSG.exitClicked = true; SSG.destroyGallery() });
    jQuery('#SSG_gallery').click(SSG.touchScroll);
    jQuery('body').on('mousewheel DOMMouseScroll', SSG.revealScrolling);    
}

SSG.keyFunction = function (event) {
    if (event.which == 27 && SSG.standardMode) SSG.destroyGallery(); //ESC key destroys gallery
    if (event.which == 40 || event.which == 39 || event.which == 34 || event.which == 32) {
        SSG.imageDown = true; // Arrow down or left sets the property that causes jumping on next photo
    }
    if (event.which == 38 || event.which == 37 || event.which == 33) {
        SSG.imageUp = true; // Arrow up or right sets the property that causes jumping on previos photo
    }
    event.preventDefault();    
}

SSG.touchScroll = function (event) {
    event.clientY < SSG.scrHeight / 2 ? SSG.imageUp = true : SSG.imageDown = true;
}

SSG.getHrefAlt = function (el) {
    if (el.children[0] && el.children[0].alt)  // if A tag has a children (img tag) with an alt atribute
        return { href: el.href, alt: el.children[0].alt };
    else if (el.innerText)  // if A tag has inner text
        return { href: el.href, alt: el.innerText };
    else
        return { href: el.href, alt: '' }; // else there is no caption under image
}

SSG.getImgList = function (event) {
    Array.prototype.forEach.call(jQuery(SSG.jQueryImgSelector).toArray(), function (el) { // call invokes forEach method in the context of jQuery output
        SSG.imgs.push(SSG.getHrefAlt(el));  
    });

    if (event && event.currentTarget) {
        var result = SSG.getHrefAlt(event.currentTarget);
        var clickedHref = result.href;
        var clickedAlt = result.alt;
    } else if (event && event.img) {
        var clickedHref = event.img.href;
        var clickedAlt = event.img.alt;
    }
    if (clickedHref && SSG.imgs.length > 1) {
        var max = SSG.imgs.length >= 6 ? 5 : SSG.imgs.length;
        for (var i = 0; i < max; i++) {
           if(SSG.imgs[i].href == clickedHref) { 
               SSG.imgs.splice(i, 1); break;  // remove the image that a user clicked
            }
        }
        SSG.imgs.unshift({ href: clickedHref, alt: clickedAlt }); //  the image that a user clicked is added to the beginning of the gallery
    }
}

SSG.onFS = function () {
    if (SSG.fullscreenMode && SSG.exitFullscreen && !SSG.exitClicked) {  // if exit from fullscreen mode detected, close gallery
        SSG.standardMode && SSG.destroyGallery(); SSG.fullscreenMode = false;
    }
    if (!SSG.exitFullscreen) {
        SSG.exitFullscreen = true;  SSG.fullscreenMode = true;
    }    
};

SSG.refreshPos = function () {  // recalculate all loaded images positions after new image is loaded
    for (var i = 0; i <= SSG.loaded; i++) {
        SSG.imgs[i].pos = Math.round(jQuery("#i" + i).offset().top);
    }
}

SSG.countResize = function () { // recount variables on resize event
    SSG.scrHeight = jQuery(window).height();
    jQuery(window).width() / SSG.scrHeight >= 1 ? SSG.scrFraction = 2 : SSG.scrFraction = 3.5;
    SSG.firstImageCentered && SSG.refreshPos(); // only if first image is already centered. Prevents problems when gallery is initiate in fullscreen mode (it activates onresize event)
}

SSG.addImage = function () {
    var newOne = SSG.loaded + 1; // newone is index of image which will be load

    if (newOne < SSG.imgs.length) {
        jQuery("#SSG_gallery").append("<div class='SSG_imgWrap'><span class='SSG_forlogo'><img id='i" + newOne + "' src='" + SSG.imgs[newOne].href + "'><span class='SSG_logo'></span></span></div>");
        if (!SSG.imgs[newOne].alt) SSG.imgs[newOne].alt = "";
        jQuery("#SSG_gallery").append("<p id='p" + newOne + "'>" + SSG.imgs[newOne].alt + "</p>");
        jQuery("#i" + newOne).on('load', function (event) {
            SSG.refreshPos(); // when img is loaded positions of images a recalculated
        });
        SSG.loaded = newOne; // index of newest loaded image
    }
    if (newOne == SSG.imgs.length) {  // newOne is now actually by +1 larger than array index. I know, lastone element should be part of SSG.imgs array
        var menuItem1 = "<a id='SSG_first' class='SSG_link'><span>&nbsp;</span> Scroll to top</a>";
        var menuItem2;
        SSG.standardMode ? menuItem2 = "<a id='SSG_exit2' class='SSG_link'>&times; Exit the Gallery</a>" : menuItem2 = "";
        var menuItem3 = "<a id='SSGL' target='_blank' href='http://ssg.flor.cz/' class='SSG_link'>&#9910; SSG</a>";
        jQuery("#SSG_gallery").append("<div id='SSG_lastone'> <p id='SSG_menu'>" + menuItem1 + menuItem2 + menuItem3 + "</p> <div id='SSG_loadInto'></div></div>");
        jQuery('#SSG_menu').click(function (event) { event.stopPropagation(); });
        jQuery("#SSG_exit2").click(function () { SSG.exitClicked = true; SSG.destroyGallery() });
        jQuery("#SSG_first").click(function () { SSG.firstImageCentered = false; });        
        SSG.fileToLoad && jQuery("#SSG_loadInto").load(SSG.fileToLoad, function() { // load html file with links to other galleries
            jQuery('.SSG_icell').click(function (event) { event.stopPropagation(); });  });
        SSG.finito = true; //  all images are already loaded
    }
    if (newOne == 0) {  // append a little help to the first image
        jQuery('#p0').append('<a id="SSG_tipCall">more photos</a>');
        jQuery('#SSG_tipCall').click(function (event) { SSG.showFsTip(false); event.stopPropagation(); });
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
    SSG.onEachSecondTick = !SSG.onEachSecondTick;
    if (SSG.onEachSecondTick) SSG.afterScroll = false;    // set afterScroll to false on every second tick, it enables scroll move again

    for (var i = 0; i <= SSG.loaded; i++) {
        var topPos = 0;
        if (i < SSG.imgs.length - 1) { topPos = SSG.imgs[i + 1].pos } else { topPos = SSG.imgs[i].pos + SSG.scrHeight } // get topPos of last image bottom side
        if ((actual > SSG.imgs[i].pos) && (actual < topPos)) {
            if (typeof ga !== 'undefined') {
                SSG.displayed != i && ga('send', 'pageview', '/img' + location.pathname + SSG.getName(SSG.imgs[i].href));
            } // sends pageview of actual image to Google Analytics. Verify it in the console: SSG.displayed != i && console.log('/img' + location.pathname + SSG.getName(SSG.imgs[i].href));
            SSG.displayed = i;
        }
    }

    if(SSG.firstTick) {
        if (!SSG.fullscreenMode && SSG.fullscreenModeWanted) SSG.showFsTip(true);
        SSG.firstTick = false;
    }

    SSG.jumpScroll();
}

SSG.jumpScroll = function () {
    if (SSG.imageUp && SSG.displayed - 1 >= 0 && !SSG.lastone)  // if imageUp is true then scroll on previous image
        jQuery("html, body").animate({ scrollTop: SSG.imgs[SSG.displayed - 1].pos - SSG.countImageIndent(SSG.displayed - 1) }, 500, "swing");

    if (SSG.imageUp && SSG.lastone) { // if lastone is true, i am out of index, so scroll on last image in index. I know, this lastone element should be part of SSG.imgs array
        jQuery("html, body").animate({ scrollTop: SSG.imgs[SSG.displayed].pos - SSG.countImageIndent(SSG.displayed) }, 500, "swing");
        SSG.lastone = false;
    }
    if (SSG.displayed + 1 < SSG.imgs.length && SSG.imageDown && SSG.imgs[SSG.displayed + 1].pos) { // if imageDown is true and next image is loaded (pos exists) then scroll down        
        jQuery("html, body").animate({ scrollTop: SSG.imgs[SSG.displayed + 1].pos - SSG.countImageIndent(SSG.displayed + 1) }, 500, "swing");
    } else {
        if (typeof jQuery("#SSG_menu").offset() !== 'undefined') { // if back button exists scroll to it
            SSG.imageDown && jQuery("html, body").animate({ scrollTop: jQuery("#SSG_menu").offset().top - (SSG.scrHeight / 10) }, 500, "swing", function () { SSG.lastone = true; });
        }
    }
    if (SSG.imgs[0].pos && !SSG.firstImageCentered) {   // center first image after initiation of gallery
        jQuery("html, body").animate({ scrollTop: SSG.imgs[0].pos - SSG.countImageIndent(0) }, 200, "swing");
        SSG.firstImageCentered = true;
        SSG.countResize();  // important when linking into gallery. Galery shows and a user clicks FS mode (should run refreshPos). But firstImageCentered is false to center image, so no refreshPos happens
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
    if (centerPos < 0) centerPos *= 2;
    return centerPos > pMargin ? pMargin : centerPos;  // it prevents fraction of previous image appears above centered image
}

SSG.seizeScrolling = function (scroll) {
    if (scroll == 1 && SSG.scrollingAllowed) {
        banScroll();
        if (!SSG.afterScroll) SSG.imageDown = true; // afterscroll prevents scrolling which remained in the scroll queue (on touchpads)
    } else if (scroll == -1 && SSG.scrollingAllowed) {
        banScroll();
        if (!SSG.afterScroll) SSG.imageUp = true;
    }
    function banScroll() {
        jQuery(window).bind("mousewheel DOMMouseScroll", SSG.preventDef); // ban default behaviour
        SSG.scrollTimeout = setTimeout(SSG.setScrollActive, 482);  // it will renew ability to scroll in 482ms
        scroll = 0;
        SSG.scrollingAllowed = false;
    }
}

SSG.preventDef = function (event) {
    event.preventDefault();
}

SSG.setScrollActive = function () {
    SSG.scrollingAllowed = true;
    SSG.afterScroll = true;
    clearTimeout(SSG.scrollTimeout);
    jQuery(window).off("mousewheel DOMMouseScroll", SSG.preventDef);
}

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
    // console.log(location.pathname);
    jQuery("#SSG_galBg,#SSG_gallery,#SSG_exit,#SSG_lastone,#SSG_tip").remove();
    jQuery('html').removeClass('ssg');
    jQuery('body').off('mousewheel DOMMouseScroll', SSG.revealScrolling);
    jQuery(window).off("resize", SSG.countResize);
    jQuery(document).off("keydown", SSG.keyFunction);
    jQuery(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange', SSG.onFS);
    SSG.fullscreenMode && SSG.closeFullscreen();
    SSG.fullscreenMode ?
        window.setTimeout(function () { window.scrollTo(0, SSG.originalPos) }, 100)
        : window.scrollTo(0, SSG.originalPos); // sets the original vertical scroll of page. SetTimeout solves problem with return from Fullscreen, when simple scrollTo didn't work
    SSG.running = false;
}

SSG.showFsTip = function (firstCall) {
    if (jQuery('#SSG_tip').length == 0) {
        var begin = "<div id='SSG_tip'><span><div id='SSG_tipClose'>&times;</div>";        
        var man1 = "Browse through the gallery by:<br/>a mouse wheel <strong>&circledcirc;</strong> or arrow keys <strong>&darr;&rarr;&uarr;&larr;</strong><br/>";
        var man2= "or <strong>TAP</strong> on the bottom (top) of the screen<br/>";
        var hr = "<hr/>";
        var fs = "For a better experience <br/><a>click for fullscreen mode</a><br/>";
        var end = "</span></div>";
        if (firstCall) {
            jQuery("body").append(begin + fs + end);
        } else if (!SSG.fullscreenMode) {
            jQuery("body").append(begin + man1 + man2 + hr + fs + end);
        } else {
            jQuery("body").append(begin + man1 + man2 + end);
        }
        !SSG.fullscreenMode && jQuery('#SSG_tip').click(function () {
            SSG.openFullscreen();
            jQuery('#SSG_tip').remove();
            SSG.firstImageCentered = false;
        });
        jQuery('#SSG_tipClose').click(function () { jQuery('#SSG_tip').remove(); });
    } else {
        jQuery('#SSG_tip').remove();
    }
}

SSG.getHash = function (justResult) {    
    var hash = window.location.hash;    
    if (hash != '') {
        hash = hash.substring(1, hash.length);
        var target = jQuery("a[href*='" + hash + "'][href$='.jpg'],a[href*='" + hash + "'][href$='.JPG'],a[href*='" + hash + "'][href$='.jpeg'],a[href*='" + hash + "'][href$='.png'],a[href*='" + hash + "'][href$='.gif']").toArray();
        if (target[0]) {
            var result = SSG.getHrefAlt(target[0]);
            if(justResult) return {href: result.href, alt: result.alt } 
            SSG.run({fs:true, img:{ href: result.href, alt: result.alt }}); // only if justResult is false
        }
    }
    return null;
}

SSG.run = function (event) { 
    if(SSG.running) return false; // it prevents to continue if SSG is already running
    SSG.running = true;
    if (!event) event = {};
    if (event && !event.img && SSG.getHash(true)) event.img = SSG.getHash(true);  // if SSG.run runs before getHash, it has to get hash    
    SSG.setVariables();
    SSG.initGallery(event); // pass onlick event
    SSG.getImgList(event); 
    SSG.addImage(); // load first image
    SSG.metronomInterval = setInterval(SSG.metronome, 333); // every 333 ms check if more images should be loaded and logged into Google Analytics, Speed scrolling
    jQuery(window).resize(SSG.countResize);    
    return false;
}

jQuery(document).ready(function () { jQuery(SSG.jQueryImgSelector).click(SSG.run) });
jQuery(document).ready(function () { window.setTimeout(SSG.getHash(false), 10) });  // thanks to a little setTimeout the SSG.run in body's onload will run first