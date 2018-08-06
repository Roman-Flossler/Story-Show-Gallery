// Simple Scroll Gallery
// Created by Roman Flössler flor@flor.cz
// You can see how gallery works on my blog - https://www.flor.cz/blog/hrbitov-vlaku/

var SSG = {};  // main object - namespace

SSG.initGallery = function initGallery(event) {
    SSG.imgs = [];  // array of objects where image attributes are stored
    jQuery("body").append("<div id='SSG_galBg'></div> <div id='SSG_gallery'></div> <div id='SSG_exit'><span>&times;</span></div>"); // gallery's divs
    jQuery("body").append("<div id='SSG_arrows'><span class='up'></span><span class='down'></span></div>"); // gallery's arrows navigation
    if (arguments[0] == 'gmode' || event.currentTarget.parentNode.tagName == "DT") {  //Wordpress use a DT tag in its gallery
        jQuery("#SSG_arrows").append("<div id='tip'>For fast scrolling use arrow keys <strong>&darr;&rarr;&uarr;&larr;</strong> or arrows on the right:</div>"); // tip how to use gallery
    }
    jQuery("body").append('<link rel="stylesheet" id="scrollstyle" href="scrollbar.css" type="text/css" />');  // scrollbar style
    jQuery(document).keydown(SSG.keyFunction);
    jQuery("#SSG_exit").click(SSG.destroyGallery);
    jQuery("#SSG_arrows .up").click(function () { SSG.imageUp = true; });
    jQuery("#SSG_arrows .down").click(function () { SSG.imageDown = true; jQuery('#SSG_arrows #tip').remove(); });
}

SSG.keyFunction = function (event) {
    if (event.which == 27) SSG.destroyGallery(); //ESC key destroys gallery
    if (event.which == 40 || event.which == 39) { SSG.imageDown = true; jQuery("#SSG_arrows").remove(); } // Arrow down or right sets a property that causes jumping on next photo
    if (event.which == 38 || event.which == 37) { SSG.imageUp = true; jQuery("#SSG_arrows").remove(); } // Arrow up or left sets a property that causes jumping on next photo        
    event.preventDefault();
    event.stopPropagation();
}

SSG.getImgList = function (clickedHref, clickedAlt) {
    Array.prototype.forEach.call(jQuery("a[href$='.jpg'],a[href$='.png'],a[href$='.gif']").toArray(), function (el) { // call invokes forEach method in context of jQuery output
        if (el.children[0]) SSG.imgs.push({ href: el.href, alt: el.children[0].alt }); // if A tag has children (img tag) its atributes are pushed into SSG.imgs array
        // text legend under image apears only if A tag's children[0] has alt attribute (is image) - it should be fixed, maybe :)
    });

    if (clickedHref) {
        var i;
        var max = SSG.imgs.length >= 6 ? 5 : SSG.imgs.length - 1;
        for (i = 0; i < max; i++) {
            SSG.imgs[i].href == clickedHref && SSG.imgs.splice(i, 1);  // remove the image that the user clicked, it will be added on begining of the gallery
        }
        SSG.imgs.unshift({ href: clickedHref, alt: clickedAlt }); //  the image that the user clicked is added to beginning of the gallery
    }
}

SSG.setVariables = function () {
    SSG.actual = -1; // index of newest loaded image
    SSG.displayed = -1;  // index of image displayed in viewport
    SSG.pos = window.pageYOffset || document.documentElement.scrollTop; // save actual vertical scroll of page
    window.scrollTo(0, 0);
    SSG.scrHeight = jQuery(window).height();
    jQuery(window).width() / SSG.scrHeight >= 1 ? SSG.scrFraction = 2 : SSG.scrFraction = 4;  // different screen fraction for different screen aspect ratios
    SSG.imageDown = false;
    SSG.imageUp = false;
    SSG.firstImage = true;
    SSG.addImage();
}


SSG.countResize = function () {
    SSG.scrHeight = jQuery(window).height();
    jQuery(window).width() / SSG.scrHeight >= 1 ? SSG.scrFraction = 2 : SSG.scrFraction = 4;
    for (var i = 0; i <= SSG.actual; i++) {
        SSG.imgs[i].pos = Math.round(jQuery("#i" + i).offset().top);
    }
}

SSG.addImage = function () {
    var newOne = SSG.actual + 1; // newone is index of image which will be load

    if (newOne < SSG.imgs.length) {
        jQuery("#SSG_gallery").append("<span class='wrap'><img id='i" + newOne + "' src='" + SSG.imgs[newOne].href + "'><span class='logo'></span></span>");
        if (!SSG.imgs[newOne].alt) SSG.imgs[newOne].alt = "";
        jQuery("#SSG_gallery").append("<p id='p" + newOne + "'>" + SSG.imgs[newOne].alt + "</p>");
        jQuery("#i" + newOne).load(function (event) {
            SSG.imgs[newOne].pos = Math.round(jQuery("#i" + newOne).offset().top); // when img is loaded his offset from top of the page is saved
        });
        SSG.actual = newOne; // index of newest loaded image
    }
    newOne == SSG.imgs.length - 1 && jQuery("#SSG_gallery").append("<p id='back'><a class='link'>Back to website</a></p>").click(SSG.destroyGallery);
}

SSG.getName = function (url) {  // acquire image name from url address
    return url.slice(url.lastIndexOf("/") + 1);
}

SSG.metronome = function () {
    var actual = window.pageYOffset || document.documentElement.scrollTop; // actual offset from top of the page            

    if (SSG.imgs[SSG.actual].pos && SSG.actual < SSG.imgs.length) {  // if imgs.pos exists image is already loaded
        var Faraway = SSG.imgs[SSG.actual].pos; // the newest loaded image offset from top of the page        
        (Faraway - actual < SSG.scrHeight * 3) && SSG.addImage();  // when actual offset is three screen near from faraway gallery loads next image
    }

    actual += Math.round(SSG.scrHeight / SSG.scrFraction);  // actual + some screen fractions, determinates exactly when image pageview is logged into GA

    for (var i = 0; i <= SSG.actual; i++) {
        var topPos = 0;
        if (i < SSG.imgs.length - 1) { topPos = SSG.imgs[i + 1].pos } else { topPos = SSG.imgs[i].pos + SSG.scrHeight } // get topPos behind the last image
        if ((actual > SSG.imgs[i].pos) && (actual < topPos)) {
            if (typeof ga !== 'undefined') {
                SSG.displayed != i && ga('send', 'pageview', '/img' + location.pathname + SSG.getName(SSG.imgs[i].href));
            } // sends pageview of actual image to Google Analytics
            SSG.displayed != i && console.log('/img' + location.pathname + SSG.getName(SSG.imgs[i].href));
            SSG.displayed = i;
        }
    }

    SSG.speedScroll();
}


SSG.speedScroll = function () {
    if (SSG.displayed == 0 && SSG.imgs[0].pos && SSG.firstImage) {   // center first image
        window.scrollTo(0, SSG.imgs[0].pos - SSG.countImageIndent(0));
        SSG.firstImage = false;
    }

    if (SSG.imageUp && SSG.displayed - 1 >= 0)  // if imageUp is true then scroll on previous image
        jQuery("html, body").animate({ scrollTop: SSG.imgs[SSG.displayed - 1].pos - SSG.countImageIndent(SSG.displayed - 1) + "px" }, 500, "swing");


    if (SSG.displayed + 1 < SSG.imgs.length) {
        if (SSG.imageDown && SSG.imgs[SSG.displayed + 1].pos)  // if imageDown is true and next image is loaded (pos exists) then scroll on next image
            jQuery("html, body").animate({ scrollTop: SSG.imgs[SSG.displayed + 1].pos - SSG.countImageIndent(SSG.displayed + 1) + "px" }, 500, "swing");
    } else {
        SSG.imageDown && jQuery("html, body").animate({ scrollTop: jQuery("#back").offset().top + 100 }, 200, "swing");  // scroll to back to website button
    }
    SSG.imageDown = false;
    SSG.imageUp = false;
}


SSG.countImageIndent = function (index) {  // function count how much indent image from the top of the screen to center image
    var screen = jQuery(window).height();;
    var img = jQuery("#i" + index).outerHeight(true);
    var pIn = jQuery("#p" + index).innerHeight();
    var pOut = jQuery("#p" + index).outerHeight(true);
    var pMargin = pOut - pIn;
    var centerPos = Math.round((screen - (img + pIn)) / 2);
    return centerPos > pMargin ? pMargin : centerPos;  // it prevents fraction of previous image appears above centered image
}

SSG.destroyGallery = function () {
    clearInterval(SSG.loading);
    if (typeof ga !== 'undefined') ga('send', 'pageview', location.pathname);
    console.log(location.pathname);
    jQuery("#SSG_galBg,#SSG_gallery,#SSG_exit,#SSG_arrows, #scrollstyle").remove();
    jQuery(window).off("resize", SSG.countResize);
    jQuery(document).off("keydown", SSG.keyFunction);
    window.scrollTo(0, SSG.pos); // sets the original (before initGallery) vertical scroll of page    
}

SSG.run = function (event) {
    SSG.initGallery(event); // pass onlick event
    event.currentTarget ? SSG.getImgList(event.currentTarget.href, event.currentTarget.children["0"].alt) : SSG.getImgList(); // pass href and alt of clicked image
    SSG.setVariables();
    SSG.loading = setInterval(SSG.metronome, 300); // every 300 ms check if more images should be loaded and logged into Google Analytics, Speed scrolling
    jQuery(window).resize(SSG.countResize);
    return false;
}

jQuery(document).ready(function () { jQuery("a[href$='.jpg'],a[href$='.png'],a[href$='.gif']").click(SSG.run) });