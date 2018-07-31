// Simple Scroll Gallery
// Created by Roman Flössler flor@flor.cz
// You can see how gallery works on my blog - https://www.flor.cz/blog/hrbitov-vlaku/

var SSG = {};  // main object - namespace

SSG.initGallery = function initGallery(tag) {
    SSG.imgs = [];  // array of objects where image attributes are stored
    jQuery("body").append("<div id='SSG_galBg'></div> <div id='SSG_gallery'></div> <div id='SSG_exit'><span>&times;</span></div>"); // gallery's divs
    if (tag == "DT") jQuery("#SSG_gallery").append("<a title='rolujte dolů'><div id='help'><div id='mouse'> <div id='scroll'></div> <div id='down'>&raquo;</div> </div></div></a>");
    // if gallery thumbnail is wrapped in DT tag user will see visual help how to use gallery - Wordpress use a DT tag in its gallery
    jQuery(document).keydown(function (event) {
        if (event.which == 27) SSG.destroyGallery(); //ESC key destroys gallery
    });
    jQuery(document).keydown(function (event) {
        if (event.which == 32) SSG.isSpaceBarPressed = true; // SpaceBar set a property, that cause jumping on next photo
    });    
    jQuery("#SSG_exit").click(SSG.destroyGallery);
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
    newOne == SSG.imgs.length - 1 && jQuery("#SSG_gallery").append("<p><a class='link'>Back to website</a></p>").click(SSG.destroyGallery);
}

SSG.getName = function (url) {  // acquire image name from url address
    return url.slice(url.lastIndexOf("/") + 1);
}

SSG.checkLoading = function () {
    var actual = window.pageYOffset || document.documentElement.scrollTop; // actual offset from top of the page            

    if (SSG.imgs[SSG.actual].pos && SSG.actual < SSG.imgs.length) {  // if imgs.pos exists image is already loaded
        var Faraway = SSG.imgs[SSG.actual].pos; // the newest loaded image offset from top of the page        
        (Faraway - actual < SSG.scrHeight * 3) && SSG.addImage();  // when actual offset is near from faraway gallery loads next image
    }

    actual += Math.round(SSG.scrHeight / SSG.scrFraction);

    for (var i = 0; i <= SSG.actual; i++) {
        var topPos = 0;
        if (i < SSG.imgs.length - 1) { topPos = SSG.imgs[i + 1].pos } else { topPos = SSG.imgs[i].pos + SSG.scrHeight }
        if ((actual > SSG.imgs[i].pos) && (actual < topPos)) {
            if (typeof ga !== 'undefined') {
                SSG.displayed != i && ga('send', 'pageview', '/img'+location.pathname+SSG.getName(SSG.imgs[i].href));
            } // sends pageview of actual image to Google Analytics
            //      SSG.displayed != i && console.log('/img'+location.pathname+SSG.getName(SSG.imgs[i].href));
            SSG.displayed = i;
        }
    }
}

SSG.destroyGallery = function () {
    clearInterval(SSG.loading);
    if (typeof ga !== 'undefined') ga('send', 'pageview', location.pathname);
    //    console.log(location.pathname);
    jQuery("#SSG_galBg,#SSG_gallery,#SSG_exit").remove();
    jQuery(window).off("resize", SSG.countResize);
    window.scrollTo(0, SSG.pos); // sets the original (before initGallery) vertical scroll of page    
}

SSG.run = function (event) {
    SSG.initGallery(event.currentTarget.parentNode.tagName); // event pass a lot of data about clicked A tag
    SSG.getImgList(event.currentTarget.href, event.currentTarget.children["0"].alt);
    SSG.setVariables();
    SSG.loading = setInterval(SSG.checkLoading, 300); // every 300 ms check if more images should be loaded
    jQuery(window).resize(SSG.countResize);
    return false;
}

jQuery(document).ready(function () { jQuery("a[href$='.jpg'],a[href$='.png'],a[href$='.gif']").click(SSG.run) });