/*!
    --- ESM module ---
    Story Show Gallery (SSG) ver: 3.2.5 - https://roman-flossler.github.io/StoryShowGallery/
    Copyright (C) 2020 Roman Flossler - SSG is Licensed under GPLv3  */

/*   
    SSG on Github: https://github.com/Roman-Flossler/Simple-Scroll-Gallery.git   

    There is one exception from the license:
    Distributing Story Show Gallery within a Wordpress plugin or theme 
    is only allowed for the author of Story Show Gallery.   
*/


// Main object - namespace - the only global variable
var SSG = {};
export default SSG;
SSG.cfg = {};

// ---------------------- ⚙️⚙️⚙️ Story Show Gallery CONFIGURATION ⚙️⚙️⚙️ ---------------------------

// duration of scroll animation in miliseconds. Set to 0 for no scroll animation.
SSG.cfg.scrollDuration = 500;

// Force SSG to always display in fullscreen - true/false
SSG.cfg.alwaysFullscreen = false;

// Force SSG to never display in fullscreen - true/false. There is an exception for smartphones and tablets
SSG.cfg.neverFullscreen = false;

// When a mobile phone is in portrait mode, start SSG in fullscreen mode. But only if FS is demanded - fs class or fs:true.
// rotating into landscape works better, if mobilePortraitFS is set to true.
SSG.cfg.mobilePortraitFS = false;

// Force landscape mode on smartphones. With landscape mode is also activated full screen mode (it's mandatory).
SSG.cfg.forceLandscapeMode = false;

// Visual theme of the gallery - four possible values: dim, light, black, dark (default)
SSG.cfg.theme = 'dark'

// unobtrusive cross cursor
SSG.cfg.crossCursor = false;

// URL of the HTML file to load behind the gallery (usually a signpost to other galleries). 
// HTML file has to be loaded over http(s) due to a browser's CORS policy. Set to null if you don't want it.
SSG.cfg.fileToLoad = null;

// display social share icon and menu
SSG.cfg.socialShare = true;

// hide image captions, it doesn't impact global caption or exif
SSG.cfg.hideImgCaptions = false;

// Enlarge image above its original resolution. But only if the image is smaller than two third of screen. It doesn't work on mobiles and tablets.
SSG.cfg.enlargeImg = false; 

// EXIF info (or just the EXIF icon) appears as a part of the caption with link to full EXIF listing
// 4 possible values: 'none' (no exif, default), 'standard', 'trim' (reduced lens info to save space), 'icon'
SSG.cfg.captionExif = 'none';

// log image views into Google Analytics - true/false. SSG supports only ga.js tracking code.
SSG.cfg.logIntoGA = true;

// Protect photos from being copied via right click menu - true/false
SSG.cfg.rightClickProtection = true;

// Caption location depends on a photo size vs. screen size and SSG.cfg.preferedCaptionLocation.
// Negative number => more likely side caption. Positive number => more likely caption below the photo.
// If the number will be too large (eg: 300 or -300 ) a caption will be only in one location.
SSG.cfg.preferedCaptionLocation = 3;

// Side caption for smaller, landscape oriented photos, where is enough space below them as well as on their side.
SSG.cfg.sideCaptionforSmallerLandscapeImg = false;  // false means caption below, true side caption

// an author signature (or some text), which will appear in every caption. The data-author attribute overrides it.
SSG.cfg.globalAuthorCaption = "";

// Show first 3 images of a separate gallery together - e.g. third image clicked - image order will be 3,1,2,4,5,6...
SSG.cfg.showFirst3ImgsTogether = true;

// Locking the scale of mobile viewport at 1. Set it to true if the gallery has scaling problem on your website. 
SSG.cfg.scaleLock1 = false; 

// SSG will observe DOM for changes, to know about image hyperlinks changes after page loads / render.
// if you use routing in React or Next.js, observeDOM should be true, otherwise SSG won't work  (only SSG.run will).
SSG.cfg.observeDOM = false;

// image border width in pixels
SSG.cfg.imgBorderWidthX = 1;
SSG.cfg.imgBorderWidthY = 1;
// image border color in CSS format (eg: #366988 or black)
SSG.cfg.imgBorderColor = "";
// image outline color in CSS format - imgBorderWidthX and imgBorderWidthY should be the same, otherwise outline won't fit
SSG.cfg.imgOutlineColor = "";
// Light effect on image border - it looks good mainly on thicker borders
SSG.cfg.imgBorderLightFx = false;
// radius is in vh unit, but above 33 is in percent of image size, so it is possible to achieve circle/ellipse (50)
SSG.cfg.imgBorderRadius = 0;
// display shadow around the image (border) as it is defined in the theme
SSG.cfg.imgBorderShadow = true;

// Watermark - logo configuration. Enter watermark text or image URL to display it
SSG.cfg.watermarkWidth = 147; // image watermark width in pixels, it is downsized on smaller screens.
SSG.cfg.watermarkImage = '';  // watermark image URL e.g. 'https://www.flor.cz/img/florcz.png'
SSG.cfg.watermarkText = '';  //  watermark text, use <br> tag for word wrap
SSG.cfg.watermarkFontColor = ""; // custom font color, it will deactivate dark text-shadow from theme
SSG.cfg.watermarkFontSize = 20; // font size in pixels, it is downsized on smaller screens.
SSG.cfg.watermarkOffsetX = 1.8; // watermark horizontal offset from left border in percents of photo, for align to right use value near 100
SSG.cfg.watermarkOffsetY = 0.6; // vertical offset from bottom border in percents of photo, for align to top use value near 100 
// Watermark can be also positioned inside image border, use negative values to do so. Negative values are in pixels - as border width
SSG.cfg.watermarkOpacity = 0.42; // opacity

// Here you can translate SSG into other language. Leave tags <> and "" as they are.
SSG.cfg.hint1 = "Browse through Story Show Gallery by:";
SSG.cfg.hint2 = "a mouse wheel <strong>⊚</strong> or arrow keys <strong>↓→↑←</strong>";
SSG.cfg.hint3 = "or <strong>TAP</strong> on the bottom (top) of the screen";
SSG.cfg.hintTouch = "<strong>TAP</strong> on the bottom (top) of the screen<br> or <strong>swipe</strong> to left (right) <br> to browse through Story Show Gallery.";
SSG.cfg.hintFS = 'For a better experience <br><a><abbr>⎚</abbr> go full screen</a>';
SSG.cfg.toTheTop = "Scroll to top";
SSG.cfg.exitLink = "Exit the Gallery";

// share link dialog
SSG.cfg.imageLink = "The link to selected image:";
SSG.cfg.copyButton  = "⎘ Copy the link to clipboard";
SSG.cfg.linkPaste = "…and you can paste it anywhere via ctrl+v";

// in the portrait mode the gallery suggest to turn phone into landscape mode
SSG.cfg.showLandscapeHint = true;
SSG.cfg.landscapeHint = '<i>↻</i> photos look better in landscape mode <span>📱</span>';

// SSG events - see complete example of SSG events in the example directory
SSG.cfg.onGalleryStart = null; // fires on the gallery start before loading and displaying of the first image.
SSG.cfg.onImgScrollsIn = null; // fires when the next/previous/first image starts scrolling in to display (doesn't apply on manual scrolling)
SSG.cfg.onImgView = null; // fires when an image is viewed
SSG.cfg.onImgLoad = null; // fires when an image is loaded from server
SSG.cfg.onOrientationChange = null; // fires when a device orientation changes
SSG.cfg.onBeyondGallery = null; // fires when a user gets beyond the gallery - usually on a signpost
SSG.cfg.onGalleryExit = null;  // fires on the gallery exit


// -------------- end of configuration ----------------------------------------

SSG.addClasses = function() {
    // adding of control classes to hyperlinks which match jQueryImgSelector
    jQuery( '.nossg a' ).filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'nossg' );
    jQuery( '.fs a' ).filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'fs' );
    jQuery( '.vipssg a').filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'vipssg' );
    jQuery( '.ssglight a').filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'ssglight' );
    jQuery( '.ssgdim a').filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'ssgdim' );
    jQuery( '.ssgdark a').filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'ssgdark' );
    jQuery( '.ssgblack a').filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'ssgblack' );
}

SSG.beforeRun = function () {
    // all hyperlinks from the page, which links to an image file
    SSG.jQueryImgSelector = "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.JPEG'],a[href$='.png'],a[href$='.PNG'],a[href$='.gif'],a[href$='.GIF'],a[href$='.webp']";

    // line below are for use SSG with Wordpress.
    SSG.cfg.respectOtherWpGalleryPlugins && jQuery("body [class*='gallery']").not( jQuery(".wp-block-gallery, .blocks-gallery-grid, .blocks-gallery-item, .gallery, .gallery-item, .gallery-icon, .gallery-caption ")).addClass('nossg');
    SSG.cfg.wordpressGalleryFS && jQuery( '.gallery a, .wp-block-gallery a' ).filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'fs' );
    if (typeof SSG.cfg.wordpressGalleryFS !== 'undefined') {
        if ( SSG.cfg.separateWpGalleries  ) {
            jQuery( '.gallery, .wp-block-gallery, article[id^="post-"], div[id^="post-"]' ).addClass( 'ssg' );
        } else {
            jQuery( 'article[id^="post-"], div[id^="post-"]' ).addClass( 'ssg' );
        }
    }

    SSG.addClasses();
    
    SSG.isMobile = window.matchMedia( '(max-width: 933px) and (orientation: landscape), (max-width: 500px) and (orientation: portrait) ' ).matches;    
    var isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase());
    var newIpads = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    SSG.isTablet = isTablet || newIpads;

    // collection of all img hypelinks which can be in the gallery
    SSG.jQueryImgCollection = jQuery( SSG.jQueryImgSelector ).filter( jQuery( 'a:not(.nossg)' ) );
};

SSG.run = function ( event ) {
    !SSG.jQueryImgCollection && SSG.beforeRun();

    // It prevents to continue if SSG is already running or there is no photo on the page to display.
    if ( SSG.running || (SSG.jQueryImgCollection.length == 0 && !event.imgs )) {
        return false;
    }
    SSG.running = true;

    // .ssg-active has to be add asap, it overrides possible scroll-behavior:smooth which mess with gallery jump scrolling
    jQuery( 'html' ).addClass( 'ssg-active' );    

    // backward compatibility due to renaming SSG.cfg.onSignpost to SSG.cfg.onBeyondGallery
    if (SSG.cfg.onSignpost && !SSG.cfg.onBeyondGallery) { SSG.cfg.onBeyondGallery = SSG.cfg.onSignpost; }
    // fuse of global settings and local settings of the current gallery. 
    SSG.cfgFused = {};
    if( event && event.cfg && Object.assign ) {
        Object.assign(SSG.cfgFused, SSG.cfg, event.cfg );
    } else {
        Object.assign(SSG.cfgFused, SSG.cfg);        
    }
    SSG.cfgFused.crossCursor && jQuery( 'html' ).addClass( 'crosscur' );

    // setting of Visual theme - also has to be done asap, otherwise there are problems with right coloring of the scrollbar
    var imgClassList, theme;
    theme = SSG.cfgFused.theme;

    if ( event && event.currentTarget ) {
        imgClassList =  event.currentTarget.classList
    } else if (event && event.initImgID && !event.imgs ) {
        imgClassList = SSG.jQueryImgCollection[event.initImgID].classList
    }
    if ( SSG.hasClass( imgClassList, 'ssgdim' ))  theme='dim'
    else if  ( SSG.hasClass( imgClassList, 'ssglight' )) theme='light'
    else if  ( SSG.hasClass( imgClassList, 'ssgblack' )) theme='black'
    else if  ( SSG.hasClass( imgClassList, 'ssgdark' )) theme='dark';    

    if (event && event.cfg && event.cfg.theme ) {
            theme = event.cfg.theme;
    }
    
    SSG.theme = theme;
    (theme != 'dark') && jQuery( 'html' ).addClass( 'ssg' + SSG.theme );

    // If there is no start image specified (in the noExit mode), try to get image from hash.
    if ( event && event.noExit && !event.initImgID ) {
        var initImgID = SSG.getHash( true );
        if ( initImgID != null ) {
         event.initImgID = initImgID;
        }
    }

    SSG.initEvent = event;
    SSG.setVariables();
    SSG.initGallery( event );
    
    // SSG firstly switch the browser into FS mode (if wanted) and then the fullscreenchange event creates the gallery
    // It is because of problems (Chrome mobile, Firefox) with initiation of the gallery when switching into FS mode. 
    // if no FS mode is wanted, then the createGallery() is called directly from FSmode()
    SSG.FSmode( event );
    return false;
};

SSG.setVariables = function () {

    // Array of objects where image attributes are stored
    SSG.imgs = [];

    // Index of the newest loaded image
    SSG.justLoadedImg = -1;

    // Index of the image displayed in the viewport
    SSG.displayedImg = -1;

    // Index of the image displayed in the viewport before the screen resize (orientation change)
    SSG.lockedImg = 0;

    // if set to true lockedImg isn't being refreshed, it is locked
    SSG.isImgLocked = false;

    // change of currently displayed photo. delta -1 is a previous photo.  
    SSG.imgDelta = 1;
    SSG.scrHeight = window.innerHeight;

    // Different screen fraction for different screen aspect ratios
    SSG.scrFraction = ( jQuery( window ).width() / SSG.scrHeight >= 1 ) ? 2 : 3.5;

    // If a user wants the next photo.
    SSG.imageDown = false;

    // If a user wants the previous photo.
    SSG.imageUp = false;

    // If the first image is already centered .
    SSG.isFirstImageCentered = false;

    // If fullscreen mode is active.
    SSG.inFullscreenMode = false;

    // if a browser supports fs mode
    SSG.fullScreenSupport = true;

    // if true it will show an offer of fs mode
    SSG.isFullscreenModeWanted = false;

    // True right after entering FS mode, it tells that next onFSchange will be the exit.
    SSG.readyToExitFullScreen = false;

    // If all images are loaded,
    SSG.finito = false;

    // If it was scrolled to the the bottom menu - the last element in the gallery.
    SSG.atLastone = false;

    // it the SSG.cfg.fileToLoad was successfully loaded
    SSG.fileLoaded = false;

    // prevents exit the gallery onFullscreenChange event. e.g. link with target=_blank will close FS
    SSG.destroyOnFsChange = true;

    // If the inExitMode is true a user can exit the gallery.
    SSG.inExitMode = true;

    // When the img is loaded loadnextImg is set true.
    SSG.loadNextImg = false;

    // initial value for scroll event time stamp
    SSG.savedTimeStamp = 0;

    // If a user used jump scroll in Landscape mode. Due to showing the tip window on touchmove event
    SSG.wasJumpScrollUsed = false;

    // prevents to load a next image while animated jump scroll is performed
    SSG.jumpScrollingNow = false;

    // If the tip window was shown
    SSG.fsTipShown = false;

    // if the gallery is already created, prevents to create the gallery again
    SSG.isGalleryCreated = false;

    // is set to true while a user is rotating a phone. Landscape mode activates fullscreen mode (as on YouTube)
    SSG.isOrientationChanging = false;

    // is set to true while the phone is being turned into forced landscape
    SSG.isGalleryLandscaping = false;
    
    SSG.location = window.location.href.split( '#', 1 )[ 0 ];
    SSG.viewport = jQuery( "meta[name='viewport']" ).attr( 'content' );
    SSG.themeColor = jQuery( "meta[name='theme-color']" ).attr( 'content' );
    SSG.smallScreen = window.matchMedia( '(max-width: 933px) and (orientation: landscape), (max-width: 500px) and (orientation: portrait) ' ).matches;
    SSG.landscapeMode = window.matchMedia( '(orientation: landscape)' ).matches;
    SSG.actualPos = window.pageYOffset || document.documentElement.scrollTop;
    SSG.slide = {};  // touchmove data
    
    // Intial scroll, rotation and height. Don't overwrite originals if the gallery is being restarted 
    
    if ( SSG.initEvent && !SSG.initEvent.restart || !SSG.initEvent ) {    
        SSG.originalPos = window.pageYOffset || document.documentElement.scrollTop;
        SSG.originalBodyHeight = jQuery( 'body' ).height();
        SSG.landscapeModeOriginal = window.matchMedia( '(orientation: landscape)' ).matches;
    }
    
    SSG.radiusUnit = SSG.cfgFused.imgBorderRadius > 33 ? "%" : "vmax";
    if ( SSG.cfgFused.imgBorderRadius > 50 ) SSG.cfgFused.imgBorderRadius = 50;
    if ( SSG.cfgFused.imgBorderWidthY === "") SSG.cfgFused.imgBorderWidthY = 1;
    if ( SSG.cfgFused.imgBorderWidthX === "") SSG.cfgFused.imgBorderWidthX = 1;
    if ( SSG.cfgFused.watermarkOffsetY === "") SSG.cfgFused.watermarkOffsetY = 1;
    if ( SSG.cfgFused.watermarkOffsetX === "") SSG.cfgFused.watermarkOffsetX = 1;
    
    // size adjustments for small screens
    if (SSG.smallScreen) {
        
        if( SSG.cfgFused.watermarkOffsetY < 0 ) {
            SSG.cfgFused.watermarkOffsetY *= 0.8;
        } else if ( SSG.cfgFused.watermarkOffsetY > 100 ) {
            SSG.cfgFused.watermarkOffsetY = 100 + (( SSG.cfgFused.watermarkOffsetY - 100 ) * 0.8 );
        } else if ( SSG.cfgFused.watermarkOffsetY < 5 ) {
            SSG.cfgFused.watermarkOffsetY *= 1.2;
        }
        if( SSG.cfgFused.watermarkOffsetX < 0 ) {
            SSG.cfgFused.watermarkOffsetX *= 0.8;
        } else if ( SSG.cfgFused.watermarkOffsetX > 100 ) {
            SSG.cfgFused.watermarkOffsetX = 100 + (( SSG.cfgFused.watermarkOffsetX - 100 ) * 0.8 );
        } else if ( SSG.cfgFused.watermarkOffsetX < 5 ) {
            SSG.cfgFused.watermarkOffsetX *= 1.2;
        }
        
        if(SSG.cfgFused.imgBorderWidthX >= 2 ) SSG.cfgFused.imgBorderWidthX *= 0.8;
        if(SSG.cfgFused.imgBorderWidthY >= 2 ) SSG.cfgFused.imgBorderWidthY *= 0.8;

        SSG.cfgFused.watermarkFontSize *= 0.8;
        if (SSG.cfgFused.imgBorderRadius < 2) SSG.cfgFused.imgBorderRadius =  SSG.cfgFused.imgBorderRadius * ( SSG.cfgFused.imgBorderRadius * -0.4 + 1.8 );
        
    } else {        
        if (SSG.cfgFused.imgBorderRadius < 0.5) SSG.cfgFused.imgBorderRadius *= Math.pow( 1920 / window.innerWidth, 0.7 );
    }

    // Styles for watermark
    SSG.watermarkStyle = '';
    if ( SSG.cfgFused.watermarkImage || SSG.cfgFused.watermarkText ) {
        var width = Math.round( SSG.cfgFused.watermarkWidth / 1260 * 1000 ) / 10;
        var posX = SSG.cfgFused.watermarkOffsetX;
        var posY = SSG.cfgFused.watermarkOffsetY;
        var wmLeft, wmBottom;
        var transform = "transform:";

        if (posX < 0) {
            wmLeft = (SSG.cfgFused.imgBorderWidthY + posX ) + "px"; 
        } else if (posX > 100) {
            wmLeft = `calc( ${SSG.cfgFused.imgBorderWidthY}px +  ( ( (100% - ${2*SSG.cfgFused.imgBorderWidthY}px ) / 100 ) * 100 ) + ${posX-100}px )`
        } else {
            wmLeft = `calc( ${SSG.cfgFused.imgBorderWidthY}px +  ( ( (100% - ${2*SSG.cfgFused.imgBorderWidthY}px ) / 100 ) * ${posX} ) )`
        }

        if (posY < 0) {
            wmBottom = (SSG.cfgFused.imgBorderWidthX + posY ) + "px"; 
        } else if (posY > 100) {
            wmBottom = `calc( ${SSG.cfgFused.imgBorderWidthX}px +  ( ( (100% - ${2*SSG.cfgFused.imgBorderWidthX}px ) / 100 ) * 100 ) + ${posY-100}px )`
        } else {
            wmBottom = `calc( ${SSG.cfgFused.imgBorderWidthX}px +  ( ( (100% - ${2*SSG.cfgFused.imgBorderWidthX}px ) / 100 ) * ${posY} ) )`
        }

        SSG.watermarkStyle = "left:" +  wmLeft + "; bottom: " + wmBottom + "; " + 
        "font-size:" + SSG.cfgFused.watermarkFontSize + "px;opacity:" + SSG.cfgFused.watermarkOpacity + ";";

        if ( SSG.cfgFused.watermarkFontColor ) {
            SSG.watermarkStyle = SSG.watermarkStyle + "color: "  + SSG.cfgFused.watermarkFontColor + "; text-shadow:none; ";
        }

        if ( SSG.cfgFused.watermarkImage  ) {
            SSG.watermarkStyle = SSG.watermarkStyle + "max-width:" + SSG.cfgFused.watermarkWidth + "px; min-width:" +
            Math.round( SSG.cfgFused.watermarkWidth * 0.75 ) + "px; width:" + width + "vmax; background-image: url(" + SSG.cfgFused.watermarkImage + ");" + 
            "height:" +  SSG.cfgFused.watermarkWidth * 1.5 + "px;" + "max-height: 48vmin;"
            // for IE 11
            SSG.watermarkStyle = "width:" + width + "vw;" + SSG.watermarkStyle;
        }

        if (posX > 33 && posX < 66 ) {
            transform = transform + " translateX(-50%)"
        } else if ( posX >= 66 ) {
            transform = transform + " translateX(-100%)"
        }

        if (posY > 33 && posY < 66 ) {
            transform = transform + " translateY(50%);  background-position: center"
        } else if ( posY >= 66 ) {
            transform = transform + " translateY(100%); background-position: top"
        }        
        SSG.watermarkStyle = SSG.watermarkStyle + transform + ";";
    }
};

// Searching for the first image which match the hash in URL.
SSG.getHash = function ( justResult ) {
    var hash = window.location.hash;
    var findex;
    var allimgs = SSG.jQueryImgCollection.toArray();

    if ( hash != '' ) {
        hash = hash.substring( 1, hash.length );
        for ( var i = 0; i < allimgs.length; i++ ) {
            var imgname = SSG.getName( allimgs[ i ].href );
            if ( imgname.indexOf( hash ) != -1 ) {

                // Index of the first image which match the hash
                findex = i;
                break;
            }
        }
        
        // If there is an image which match the hash
        if ( typeof findex != 'undefined' ) {

            if ( justResult ) {
                return findex;
            }

            // Only if justResult is false
            if (window.stop) {
                window.stop();
                SSG.loadingStopped = true;
            }
            var fsClass = SSG.hasClass( allimgs[findex].classList, 'fs' );            
            SSG.run( {
                fsa: ( fsClass && !SSG.isMobile && !SSG.cfg.neverFullscreen ) 
                    ||  ( fsClass && SSG.isMobile && SSG.cfg.mobilePortraitFS && !SSG.cfg.showLandscapeHint ) 
                    || SSG.isTablet || SSG.cfg.alwaysFullscreen || window.screen.width > window.screen.height,
                fs: fsClass && !SSG.cfg.neverFullscreen,  // just due to SSG.pageFS, it has to be true for right function of SSG.cfg.mobilePortraitFS
                initImgID: findex
            } );
        }
    }
    return null;
};

// decides whether to turn the gallery into FS mode and set FS variables
SSG.FSmode = function ( event ) {
    jQuery( document ).on( 'webkitfullscreenchange mozfullscreenchange fullscreenchange', SSG.onFS );
    jQuery( document ).on( 'fullscreenerror', function () {
        SSG.createGallery( SSG.initEvent );
    } );

    var mobileLandscape = SSG.isMobile &&  SSG.landscapeMode;
    var mobilePortrait = SSG.isMobile && !SSG.landscapeMode;
    SSG.pageFS = event && event.fs || ( event && event.currentTarget && SSG.hasClass( event.currentTarget.classList, 'fs' ) && !event.altKey );
    var mobilePortraitFS = mobilePortrait && SSG.pageFS && SSG.cfgFused.mobilePortraitFS;

    // event.fs and event.fsa isn't a browser's object. MobileLandscape & tablets goes everytime in FS, it solves problems with mobile browsers
    if ( event && event.fsa ) {
        SSG.createGallery( SSG.initEvent );
        SSG.isFullscreenModeWanted = true;
    } else if ( SSG.isMobile && event.fsa === undefined && SSG.cfgFused.forceLandscapeMode) {
        SSG.forceLandscapeMode();
    } else if ( mobileLandscape || SSG.isTablet || mobilePortraitFS || SSG.cfgFused.alwaysFullscreen ) {
        SSG.openFullscreen();
    } else if ( mobilePortrait || SSG.cfgFused.neverFullscreen ) {
        SSG.createGallery( SSG.initEvent );    
    } else if ( SSG.pageFS ) {
        SSG.openFullscreen();
    } else {
        // if no FS mode is wanted, call createGallery directly
        SSG.createGallery( SSG.initEvent );
    }

    // if a browser is already in FS mode. But fullscreenElement detects only FS turned on by Javascript, not by F11 key
    // if the browser is in FS via F11 key, surprisingly fullscreenRequest will successfuly fire fullscreenchange event
    if( document.fullscreenElement ) {
        SSG.inFullscreenMode = true;
        SSG.readyToExitFullScreen = true;
        SSG.createGallery( SSG.initEvent );
    }

    // if a browser doesn't support FS mode
    var elem = document.documentElement;
    if ( ( !elem.requestFullscreen && !elem.mozRequestFullScreen && !elem.webkitRequestFullscreen ) || document.fullscreenEnabled === false ) {
        SSG.createGallery( SSG.initEvent );
        SSG.fullScreenSupport = false;
    }

    // for browsers which don't have fully implemented FS API and when FS mode fails for whatever reason
        window.setTimeout( function () {
            SSG.createGallery( SSG.initEvent );
        }, 1333 );

    if ( !SSG.inFullscreenMode && SSG.isFullscreenModeWanted && SSG.fullScreenSupport ) {
        window.setTimeout( function () {
            // It shows an offer of FS mode.    
            SSG.showFsTip( 'fsOffer' );
        }, 600 );
    }
};

SSG.createGallery = function ( event ) {
    if ( !SSG.isGalleryCreated ) {
        SSG.isGalleryCreated = true;
    } else {
        return;
    }
    
    // Append gallery's HTML tags
    jQuery( 'body' ).append( "<div id='SSG1'></div>" );
    if ( SSG.cfgFused.imgBorderWidthY == 1) jQuery( '#SSG1' ).addClass( 'border1' );
    SSG.setNotchRight();
    SSG.inExitMode && jQuery( 'body' ).append( "<div id='SSG_exit'></div>" );
    // event listeners for SSG tags    
    jQuery( '#SSG_exit' ).click( SSG.destroyGallery );
    jQuery( '#SSG1' ).click( SSG.touchScroll );
    SSG.cfgFused.rightClickProtection && jQuery( '#SSG1, #SSG_exit' ).on( "contextmenu", function ( event ) {
        event.preventDefault();
        SSG.showFsTip( 'hint' );
    } );

    if ( event && event.imgs ) {

        // SSG.imgs = event.imgs would create just reference to source array (and use it for storing pos), deep copy is needed:
        var deepCopy = JSON.parse( JSON.stringify( event.imgs ) );
        
        for ( var i = 0; i<deepCopy.length; i++ ) {
            if ( typeof deepCopy[i].author == 'undefined') {                
                deepCopy[i].author = SSG.cfgFused.globalAuthorCaption;
            }
        }

        // use just event.imgs 
        if ( event.imgsPos == 'whole' || !event.imgsPos ) {
            SSG.imgs = deepCopy;
            if  ( event.initImgID ) {
                var imgsRemoved = SSG.imgs.splice( 0, event.initImgID );
                Array.prototype.push.apply( SSG.imgs, imgsRemoved )
            }

        // combine images from the page with event.imgs. Apply accepts an array as an argument unlike the unshift/push.
        } else if ( event.imgsPos == 'start' ) {
            SSG.getImgList( event );
            Array.prototype.unshift.apply( SSG.imgs, deepCopy );
        } else if ( event.imgsPos == 'end' ) {
            SSG.getImgList( event );
            Array.prototype.push.apply( SSG.imgs, deepCopy );
        }
        
        SSG.clickedGalleryID = event && event.id ? event.id : SSG.clickedGalleryID;
    } else {
        // use just images on the page
        SSG.getImgList( event );
    }
    SSG.cfgFused.onGalleryStart && SSG.cfgFused.onGalleryStart( SSG.createDataObject(0) );

    SSG.addImage();

    // Every 333 ms check if more images should be loaded and logged into Analytics. Jump-scrolling
    SSG.metronomInterval = setInterval( SSG.metronome, 333 );
};

SSG.initGallery = function ( event ) {

    if ( event && event.noExit ) {
        SSG.inExitMode = false;
    }
    window.setTimeout( function()  { window.scrollTo( 0, 0 ); }, 381);
    window.setTimeout( function()  { jQuery('#SSG_bg').css('padding-top','75vh')}, 888);


    // Adding meta tags for mobile browsers to maximize viewport and dye an address bar into the dark color
    if (!SSG.cfgFused.scaleLock1) {
        jQuery( "meta[name='viewport']" ).attr( 'content', 'initial-scale=1, viewport-fit=cover' );
    } else {
        jQuery( "meta[name='viewport']" ).attr( 'content', 'initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no, ' );
    }    
    var themecolor = SSG.theme == 'light' ? '#fafafa' : '#131313';
    if ( SSG.themeColor ) {
        jQuery( "meta[name='theme-color']" ).attr( 'content', themecolor );
    } else {
        jQuery( 'head' ).append( "<meta name='theme-color' content='" + themecolor + "'>" );
    }
    jQuery( 'body' ).append( "<div id='SSG_bg'><b>&#xA420;</b> Story Show Gallery</div>" );    

    // SSG adds Id (ssgid) to all finded images and subID (ssgsid) to all finded images within an each gallery
    SSG.jQueryImgCollection.each( function ( index ) {
        jQuery( this ).attr( 'ssgid', index );
        jQuery( this ).attr( 'ssg', 0 );
    } );

    jQuery( '.ssg' ).each( function (index) {
        SSG.tempi = index;
        jQuery( this ).find( SSG.jQueryImgSelector ).each( function ( sindex ) {
            jQuery( this ).attr( 'ssgsid', sindex );
            jQuery( this ).attr( 'ssg', SSG.tempi + 1 );
        } );
    } );


    // Adding event listeners
    jQuery( document ).keydown( SSG.keyFunction );
    window.addEventListener("hashchange", SSG.onHashExit );

    // passive:false is due to Chrome, it sets the mousewheel event as passive:true by default and then preventDefault cannot be used
    document.addEventListener( 'mousewheel', SSG.seizeScrolling, {
        passive: false, capture: true
    } );
    document.addEventListener( 'DOMMouseScroll', SSG.seizeScrolling, {
        passive: false, capture: true
    } );
    !SSG.isMobile && jQuery( window ).resize( SSG.onResize );

    if ( SSG.isMobile ) {
        if ( window.screen.orientation ) {
            // new standard - works on Android
            window.screen.orientation.addEventListener( 'change', SSG.onOrientationChanged );            
        } else {
            // obsolete works on iOS
            window.addEventListener( 'orientationchange', SSG.onOrientationChanged );
            // window.onorientationchange = SSG.onOrientationChanged;
        }
    }
   
    jQuery( document ).on( 'touchstart', SSG.slideStart );
    jQuery( document ).on( 'touchmove', SSG.slideBrowse );
    SSG.iphoneScrollBlock();

    jQuery( document ).on( 'scroll', function removeArrowDown() {
        // in portrait mode, if the gallery is fully scrolled to the first image, on next scroll hide arrow down
        
        if ( !SSG.landscapeMode && SSG.displayedImg >= 0 && SSG.actualPos > SSG.imgs[0].pos ) {
            jQuery('.SSG_tipCall').addClass('hide');
            jQuery( document ).off( 'scroll', removeArrowDown );
        }
    })
};

SSG.onOrientationChanged = function () {
    SSG.isOrientationChanging = true;
    SSG.cfgFused.onOrientationChange && SSG.cfgFused.onOrientationChange(SSG.createDataObject( SSG.displayedImg ));
    
    // if the gallery should stay in fullscreen
    if ( SSG.inFullscreenMode && ( (SSG.cfgFused.mobilePortraitFS && SSG.pageFS ) || SSG.cfgFused.alwaysFullscreen || SSG.userAcceptFs )) {
        SSG.onResize();
        SSG.setNotchRight();
        return;
    }

    // if a portrait mode is in FS mode, turning into landscape won't fire onFS event (gallery resize), so else branch is needed
    // and also for iPhone which doesn't have any FS mode
    if ( SSG.fullScreenSupport && ( (!SSG.landscapeMode && !SSG.inFullscreenMode) || (SSG.landscapeMode && SSG.inFullscreenMode) ) ) {
        // landscapeMode is an old info - it returns what is true before rotation
        // So landscapeMode doesn't depend on a browser speed of actualization present orientation.
        !SSG.landscapeMode ? SSG.openFullscreen() : SSG.closeFullscreen();
    } else {
        // orientation.lock triggers orientationChange, but onResize should run only when orientation.lock resolves
        !SSG.isGalleryLandscaping && SSG.onResize();
    }
    SSG.setNotchRight();
    SSG.iphoneScrollBlock();
};

SSG.forceLandscapeMode = function(event) {
    SSG.isGalleryLandscaping = true;
    event && event.stopPropagation();
    if ( !SSG.inFullscreenMode ) {
        SSG.openFullscreen();
    }
    setTimeout(function() {
        if ( !SSG.landscapeMode && screen.orientation ) {
            screen.orientation.lock("landscape-primary").then((success) => {
                // onResize runs after gallery is turned into full screen and rotated, so onResize can run without problems and it needs just short time.
                SSG.onResize();
                setTimeout(function () {SSG.isGalleryLandscaping = false;}, 2000);
            }).catch((err) => { console.log(err)} );
        }
    }, 200)
}

// iPhone doesn't support full screen mode, so it is needed to block touch move (scrolling), otherwise toolbar will appear on touch move - annoying.
SSG.iphoneShit = function(event) {
    event.preventDefault();
}

SSG.iphoneScrollBlock = function() {
    if ( /iPhone/i.test(window.navigator.userAgent) ) {
        if ( Math.abs(window.orientation) == 90 ) {
            document.addEventListener( 'touchmove', SSG.iphoneShit, {
                passive: false, capture: false
            } );
        } else {
            document.removeEventListener( "touchmove", SSG.iphoneShit, false );
        }
    }
}

SSG.slideBrowse = function(event) {
    if (  SSG.running && SSG.landscapeMode && SSG.slide.started == true ) {            
        SSG.slide.count++;
        if (  SSG.slide.count >= 4 ) {
            SSG.slide.started = false;
            SSG.slide.count = 0;

            if( Math.abs( (event.originalEvent.touches[0].clientX - SSG.slide.startX) / (event.originalEvent.touches[0].clientY - SSG.slide.startY) ) > 2.2 ) {
                if ( event.originalEvent.touches[0].clientX < SSG.slide.startX) {
                    SSG.imageDown = true;        
                } else {
                    SSG.imageUp = true;
                }
            } else {
                if (!SSG.wasJumpScrollUsed && !SSG.fsTipShown) {
                    SSG.showFsTip( 'hint' );
                }
            }
        }
    }
}

SSG.slideStart = function (event) {        
    if (  SSG.running && SSG.landscapeMode ) {
        SSG.slide = { started: true, count: 0, startX: event.originalEvent.touches[0].clientX, startY: event.originalEvent.touches[0].clientY }
    }
}

SSG.setNotchRight = function () {
    if ( window.screen.orientation ) {
        screen.orientation.type === "landscape-secondary" ?
            jQuery( '#SSG1, #SSG_exit' ).addClass( 'notchright' ) :
            jQuery( '#SSG1, #SSG_exit' ).removeClass( 'notchright' );
    } else if ( window.orientation ) {
        window.orientation === -90 ?
            jQuery( '#SSG1, #SSG_exit' ).addClass( 'notchright' ) :
            jQuery( '#SSG1, #SSG_exit' ).removeClass( 'notchright' );
    }
};

SSG.hasClass = function ( classList, classToFind ) {
    if ( !classList) return false;
    for ( var i = 0; i < classList.length; i++ ) {
        if ( classList[ i ] == classToFind ) {
            return true;
        }
    }
    return false;
};

SSG.keyFunction = function ( event ) {
    if ( event.which == 27 && SSG.inExitMode ) {
        SSG.destroyGallery();
    }
    if ( event.which == 40 || event.which == 39 || event.which == 34 || event.which == 32 ) {

        // Arrow down or left sets the property that causes jumping on next photo.
        SSG.imageDown = true;
    }
    if ( event.which == 38 || event.which == 37 || event.which == 33 ) {

        // Arrow up or right sets the property that causes jumping on previos photo.
        SSG.imageUp = true;
    }
    event.preventDefault();
};

SSG.touchScroll = function ( event ) {
    event.clientY < SSG.scrHeight / 2 ? SSG.imageUp = true : SSG.imageDown = true;
};

SSG.getAlt = function ( el ) {

    // if data-caption exists it has top priority
    if ( el.attributes['data-caption'] ) {
        return el.attributes['data-caption'].nodeValue;
    // If A tag has a children (img tag) with an alt atribute.
    } else if ( el.children[ 0 ] && el.children[ 0 ].alt )
        return el.children[ 0 ].alt;
    // if A tag has Picture tag as a children        
    else if ( el.children[ 0 ] && el.children[ 0 ].tagName == 'PICTURE') {
        return el.children[ 0 ].children[el.children[ 0 ].children.length-1].alt;
    }    
    // If A tag has inner text.
    else if ( el.innerText && el.innerText != ' ' )
        return el.innerText;
    else
        // There is no caption under image.
        return '';
};

SSG.getImgList = function ( event ) {

    var clickedImgID, arrayImgID, clickedImgSubID, clickedGalleryID;
    var obj = {};

    if ( event && event.currentTarget ) {
        clickedImgID = event.currentTarget.attributes.ssgid.nodeValue;
        clickedGalleryID = event.currentTarget.attributes.ssg.nodeValue;
        if ( event.currentTarget.attributes.ssgsid ) {
            clickedImgSubID = event.currentTarget.attributes.ssgsid.nodeValue;
        }
    } else if ( event && typeof event.initImgID != 'undefined' ) {
        clickedImgID = event.initImgID;
        clickedImgSubID = jQuery( 'a[ssgid=' + clickedImgID + ']' ).attr( 'ssgsid' );
        clickedGalleryID = jQuery( 'a[ssgid=' + clickedImgID + ']' ).attr( 'ssg' );
    } else {
        // there is no gallery specified
        clickedGalleryID = -1;
    }
    SSG.clickedGalleryID = event && event.id ? event.id : clickedGalleryID;

    // Call invokes forEach method in the context of jQuery output     
    Array.prototype.forEach.call( SSG.jQueryImgCollection.toArray(), function ( el ) {
        // don't include image with gossg class unless it was clicked
        var noGossg =  !SSG.hasClass( el.classList, 'gossg' ) || clickedImgID == el.attributes.ssgid.nodeValue;
        
        // include only images with the same GalleryID as clicked image or from the galleries with vipssg class
        var rightGallery = clickedGalleryID == el.attributes.ssg.nodeValue || ( SSG.hasClass( el.classList, 'vipssg' ) && clickedGalleryID == 0 );

        if ( noGossg && (rightGallery || clickedGalleryID == -1 )) {
            obj.href = el.href;
            obj.alt = SSG.cfgFused.hideImgCaptions ? "" : SSG.getAlt( el );
            obj.id = el.attributes.ssgid.nodeValue;
            if (el.attributes['data-author']) {
                obj.author = el.attributes['data-author'].nodeValue;
            } else if( jQuery.trim(SSG.cfgFused.globalAuthorCaption).length !== 0 ) {
                obj.author = SSG.cfgFused.globalAuthorCaption;
            } else {
                obj.author = '';
            }
            SSG.imgs.push( obj );
            obj = {};
        }
    } );

    if ( clickedImgID && SSG.imgs.length > 1 ) {
        arrayImgID = 0;

        // search for the img ID in imgs array. It can differ from clickedImgID due to gossg class.
        for ( var i = 0; i < SSG.imgs.length; i++ ) {
            if ( SSG.imgs[ i ].id == clickedImgID ) {
                arrayImgID = i;
                break;
            }
        }

        if ( SSG.cfgFused.showFirst3ImgsTogether ) {
        //  If a user click up to third image of the gallery, SSG prefers to show first three images together - e.g. 2,1,3,4,5,6..
        if ( typeof clickedImgSubID != 'undefined' && ( clickedImgSubID == 1 || clickedImgSubID == 2 ) ) {

            // condition prevents to switch initial images when the gossg class is used in the gallery and there is a gap in the images' IDs 
            if ( arrayImgID - clickedImgSubID >= 0 &&
                jQuery( 'a[ssgid=' + ( SSG.imgs[ arrayImgID - clickedImgSubID ].id ) + ']' ).attr( 'ssgsid' ) == 0 ) {

                // Remove the image that a user clicked
                var spliced = SSG.imgs.splice( arrayImgID, 1 );

                //  The image that a user clicked is added before the first image of current gallery, arrayImgID has to be actulized
                SSG.imgs.splice( arrayImgID - clickedImgSubID, 0, spliced[ 0 ] );
                arrayImgID = arrayImgID - clickedImgSubID;
                }
            }
        }
        if ( arrayImgID > 0 ) {

            // Removes all images up to the image user clicked.         
            var imgsRemoved = SSG.imgs.splice( 0, arrayImgID );

            // Adds removed images to the end of the array
            Array.prototype.push.apply( SSG.imgs, imgsRemoved );
        }
    }
};


// On Fullscreen Change event handler - creates or destroys the gallery
SSG.onFS = function () {    
    if (SSG.isMobile && !SSG.isGalleryLandscaping) {
        SSG.onResize();
    }

    // readyToExitFullScreen is true, that means than FS mode is ending
    if ( SSG.inFullscreenMode && SSG.readyToExitFullScreen ) {
        SSG.inFullscreenMode = false;
        SSG.readyToExitFullScreen = false;
        if ( SSG.isOrientationChanging ) {
            // gallery won't close if fullscreenChange is caused by OrientationChange
            SSG.isOrientationChanging = false;
            return;
        }
        // Destroys gallery on exit from FS (if destroyOnFsChange) or removes exit icon.        
        if (SSG.inExitMode) {
            SSG.destroyOnFsChange && SSG.destroyGallery('fsexit');
        } else {
            jQuery( '#SSG_exit' ).remove();
        }
        SSG.destroyOnFsChange = true;
    } else if ( !SSG.readyToExitFullScreen ) {  // browser was just turned into FS
        if ( !SSG.isGalleryCreated ) {
            if (SSG.isMobile && SSG.landscapeMode) {
                setTimeout(function() { SSG.createGallery( SSG.initEvent ); }, 2800 );
            } else {
                SSG.createGallery( SSG.initEvent );
            }                
        }
        SSG.readyToExitFullScreen = true;
        SSG.inFullscreenMode = true;

        if ( !SSG.inExitMode && !SSG.isMobile ) {
            jQuery( 'body' ).append( "<div id='SSG_exit'></div>" );

            // It fires onFS func and removes the Exit button & set all booleans.
            jQuery( '#SSG_exit' ).click( function() {
                SSG.destroyOnFsChange = true;                
                SSG.closeFullscreen(); 
            } );
        }
    }    
};


// Recalculates all loaded images positions after new image is loaded    
SSG.refreshPos = function () {
    if ( !SSG.running ) {
        return;
    }
    for ( var i = 0; i <= SSG.justLoadedImg; i++ ) {
        SSG.imgs[ i ].pos = Math.round( jQuery( '#SSG1 #i' + i ).offset().top );
    }
};

// Recounts variables on resize event
SSG.countResize = function () {
    SSG.scrHeight = window.innerHeight;
    SSG.scrFraction = ( jQuery( window ).width() / SSG.scrHeight >= 1 ) ? 2 : 3.5;
    SSG.landscapeMode = window.matchMedia( '(orientation: landscape)' ).matches;
};

SSG.scrollToActualImg = function () {
    if ( !SSG.running ) {
        return;
    }
    // lockedImg holds the index of the last displayed image before onresize event.
    SSG.isImgLocked = false;
    if ( SSG.justLoadedImg != -1 && ( typeof SSG.imgs[ SSG.lockedImg ] != 'undefined' && !SSG.atLastone ) ) {
        SSG.ScrollTo( SSG.imgs[ SSG.lockedImg ].pos - SSG.countImageIndent( SSG.lockedImg ) );
    } else if (SSG.atLastone) {
        SSG.ScrollTo( jQuery( '#SSG_menu' ).offset().top - (SSG.scrHeight / 10), 0 );
    }
};

// Recalculates all image format classes
SSG.refreshFormat = function () {
    for ( var i = 0; i <= SSG.justLoadedImg; i++ ) {
        SSG.displayFormat( {
            data: {
                imgid: i
            }
        } );
    }
};

SSG.onResize = function () {
    var fraction = 2.5;
    var portrait = !SSG.landscapeMode;
    
    // when the portrait mode is active and not full screen, switching to landscape needs more time to rerender
    if (portrait && SSG.inFullscreenMode && SSG.isGalleryLandscaping) {
        fraction = 0.75;
    } else if (portrait && SSG.inFullscreenMode) {
        fraction = 2.5;
    } else if (portrait && !SSG.inFullscreenMode && SSG.isGalleryLandscaping) {
        fraction = 0.75;
    } else if (portrait && !SSG.inFullscreenMode && SSG.isFirstImageCentered) {
        fraction = 1;
    }
    // jQuery('#SSG1').css("background-color", "#"+ Math.round(Math.random()*1000));

    // onresize event can fire several times, so re-countiong the gallery is conditioned by isImgLocked
    if ( !SSG.isImgLocked ) {
        SSG.isImgLocked = true;
        window.setTimeout( SSG.countResize, 600 / fraction );
        // Timeout gives browser time to fully render page. RefreshFormat changes image sizes, it has to run before refreshPos.
        window.setTimeout( SSG.refreshFormat, 700 / fraction );
        window.setTimeout( SSG.refreshPos, 900 / fraction );
        window.setTimeout( SSG.scrollToActualImg, 1020 / fraction );
    }
};

SSG.displayFormat = function ( e ) {
    var index = e.data.imgid;
    var imgHeight = jQuery( '#SSG1 #i' + index ).innerHeight();
    var imgWidth = jQuery( '#SSG1 #i' + index ).innerWidth();    
    var imgRatio = imgWidth / imgHeight;
    var vwidth = jQuery( window ).width();
    var vheight = window.innerHeight;
    var photoFrameWidth =  vwidth > 1333 ? 0.82 : 0.77;
    // if there are no captions calculate with 90% width (10% is for the arrow next to the first photo)    
    if ( !SSG.imgs[index].alt && !SSG.imgs[index].author && !SSG.imgs[index].exif && !SSG.cfgFused.globalAuthorCaption ) {
        photoFrameWidth = 0.9;
    }
    var imageBoxRatio = ( vwidth * photoFrameWidth ) / (vheight*0.97 - 30);
    var tooNarrow = (vwidth * photoFrameWidth > imgWidth * 1.38);
    var preferSideCaption = tooNarrow && SSG.cfgFused.sideCaptionforSmallerLandscapeImg;
    
    // if caption frame is smaller than screen Height, overflow is set to visible due to social sharing menu.
    window.setTimeout( function() {
        if ( jQuery('#SSG1 #uwp'+ index).outerHeight() < SSG.scrHeight * 0.96) {
            jQuery('#SSG1 #uwp'+ index).addClass('share-overflow');
        } else {
            jQuery('#SSG1 #uwp'+ index).removeClass('share-overflow');
        }
    }, 666);

    // SSG_uwide class can be given to a photo regardless if it has some captions. Empty captions space si hidden via CSS.
    if ( ((imgRatio - imageBoxRatio) * 100 ) + SSG.cfgFused.preferedCaptionLocation < 0 || preferSideCaption ) {
        jQuery( '#SSG1 #f' + index ).addClass( 'SSG_uwide' );
    } else {
        jQuery( '#SSG1 #f' + index ).removeClass( 'SSG_uwide' );
        // jQuery( '#SSG1 #p' + index ).css('minWidth',imgWidth+'px');
    }

    //If the photo is too narrow shift the caption towards the photo.
    if ( tooNarrow ) {
        jQuery( '#SSG1 #f' + index ).addClass( 'SSG_captionShift' );
    } else {
        jQuery( '#SSG1 #f' + index ).removeClass( 'SSG_captionShift' );
    }
};


// A callback function when an image is loaded.
SSG.onImageLoad = async function ( event ) {

    // Index of the newest loaded image
    SSG.justLoadedImg = event.data.imgid;
    SSG.imgs[event.data.imgid].exif = false;
    SSG.cfgFused.onImgLoad && SSG.cfgFused.onImgLoad(SSG.createDataObject(SSG.justLoadedImg));

    if ( SSG.cfgFused.enlargeImg && !SSG.isTablet && !SSG.isMobile ) {
        var cImgH = jQuery('#SSG1 #i'+ event.data.imgid).innerHeight();
        var cImgW = jQuery('#SSG1 #i'+ event.data.imgid).innerWidth();
        var ww = window.innerWidth;
        var wh = window.innerHeight;
        var imgRatio = cImgW / cImgH;
        var scrRatio = ww / wh;
        
        //console.log('img: ' + cImgW + ' x ' + cImgH + ' - screen: '  + ww + ' x ' + wh );
        if ( cImgH < wh * 0.66 && cImgW < ww * 0.66 ) {
                if (imgRatio < scrRatio) {
                    jQuery('#SSG1 #i'+ event.data.imgid).css( {'height':'81vh'}); 
                } else {
                    jQuery('#SSG1 #i'+ event.data.imgid).css( {'width':'83vw'}); 
                }
        }
    }

    
    // if captionExif = icon run EXIF parsing only if the image caption isn't empty

    if (SSG.cfgFused.captionExif !=='none' && window.exifr) {
        try {
            var exif = await window.exifr.parse(document.querySelector("#SSG1 #i" + SSG.justLoadedImg));
        } catch(err) {
            console.log('Exifr ' + err)
        }
    
        if (exif) {
            SSG.exifTemp = SSG.getExif(exif, true);
            if (SSG.exifTemp) {
                SSG.imgs[event.data.imgid].exif = true;
                jQuery("#SSG1 #f" + SSG.justLoadedImg + " q").html(SSG.exifTemp);
                SSG.cfgFused.captionExif == 'icon' && jQuery("#SSG1 #f" + SSG.justLoadedImg + " q").addClass('exif-icon');
                SSG.cfgFused.captionExif == 'icon' && jQuery("#SSG1 #f" + SSG.justLoadedImg ).addClass('eicon');
                jQuery("#SSG1 #f" + SSG.justLoadedImg + " q").on('click',function(e) {
                    e.stopPropagation(); SSG.showFsTip(SSG.getExif(exif, false));
                });
                jQuery("#SSG1 #f" + SSG.justLoadedImg).addClass('exif');
                jQuery("#SSG1 #f" + SSG.justLoadedImg).removeClass('notitle');
            }
        }
    }

    SSG.displayFormat( event );

    // When img is loaded positions of images are recalculated.
    SSG.refreshPos();

    // It secures to run addImage only once after image is loaded.
    SSG.loadNextImg = true;

};

SSG.getExif = function ( exif, captionInfo ) {

    function lensSpecStringify (lensExif) {
        if (lensExif[0]== lensExif[1] ) {
            return lensExif[0] + 'mm f/' + lensExif[2];
        } else if (lensExif[2]== lensExif[3] ) {
            return lensExif[0] + '&#8209;' + lensExif[1] + 'mm, f/' + lensExif[2];
        } else {
            return lensExif[0] + '&#8209;' + lensExif[1] + 'mm, f/' + lensExif[2] + '&#8209;' + lensExif[3];
        }
    }
    
    // if fix == false -> removes maker from exif.Model; if fix == true -> fix makers name
    function fixMaker (name, fix) {
        var makers = ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'Olympus', 'Panasonic', 'Pentax', 'Leica', 'Samsung','Minolta', 'Ricoh', 'Hasselblad', 'Kodak', 'Sigma' ];
        var index;
        for(var i = 0; i < makers.length; i++) {
            index = name.toLowerCase().indexOf(makers[i].toLowerCase());
            if(index !== -1) {
                if (fix) {
                    return makers[i];                    
                } else {
                    return name.substring(0, index-1) + name.substring(index+makers[i].length + 1 );
                }
            }
        }
        return name;
    }

    function dash (value) {
        if (value === undefined) {
            return '-';
        } else if (value.toString().includes('undefined') || value.toString().includes('NaN')) {            
            return '-';
        }
        return value;
    }

    function fixModel (name) {
        name = name.replace('ILCE-','α');
        name = name.replace('DSC-','');
        return name;
    }

    var maker = exif.Make ? fixMaker(exif.Make, true) + ' ' : '';
    var camera = exif.Model ? fixModel(fixMaker(exif.Model,false)) : '';

    // 42034 = LensInfo, 42036 = LensModel    
    var lensExif = exif.LensModel || exif['42036'] || exif.LensInfo || exif['42034'];
    if (typeof lensExif === 'object') lensExif = lensSpecStringify(lensExif);
    // lensShort = short lens spec (if there is valid data in lens info) or shortened lensExif    
    if (exif.LensInfo || exif['42034']) {
        var lensInfoObj = exif.LensInfo || exif['42034'];
        var lensShort = lensInfoObj[2] ? lensSpecStringify(lensInfoObj) : lensExif.substring(0,13)+'…';
        var lens = SSG.cfgFused.captionExif == 'trim' ? lensShort : lensExif;
    } else {
        var lens = '';
    }
    var focalLengthExif = exif.FocalLengthIn35mmFormat || exif.FocalLength;
    var focalmm = exif.FocalLengthIn35mmFormat ? 'mmEQ' : 'mm';
    var focalLength = focalLengthExif ? ' <b class="focal">∢</b>' + focalLengthExif + focalmm : '';
    var fNumber = exif.FNumber ? " <b>⌬</b>f/" + Math.round(exif.FNumber*10)/10 : '';
    var iso =  exif.ISO ? " <b class='iso'>▦</b>" + exif.ISO : '';
    var exposureCalc = exif.ExposureTime <= 0.5 ? '1/' + 1/exif.ExposureTime : exif.ExposureTime;
    var exposure = exif.ExposureTime ? " <b>◔</b>" + exposureCalc + 's' : '';
    var exifLine = (maker? '<u>' : '') + maker + camera + (maker? '</u>' : '') + (lens? ' + ' : '') + lens + focalLength + fNumber + iso + exposure;
    
    if (SSG.cfgFused.captionExif == 'icon' && captionInfo && exifLine) return 'EXIF';
    if (captionInfo) return exifLine + ( exifLine ? ' …' : "" );

    var exifTable = `
    <div id="table-wrap">
    <table class="exif-table">
        <tr><td>author:</td><td> ${ dash( exif.Artist || exif.Copyright || exif['42032'] ) } </td></tr>
        <tr><td>camera&nbsp;maker:</td><td> ${exif.Make} </td></tr>
        <tr><td>camera model:</td><td> ${fixModel(fixMaker(exif.Model,false))} </td></tr>
        <tr><td>lens:</td><td>  ${ dash(lensExif)}</td></tr>
        <tr><td>focal length:</td><td> ${ !exif.FocalLengthIn35mmFormat && exif.FocalLength ? '<b>∢</b>' : '' } ${dash(exif.FocalLength + ' mm')}</td></tr>
        
        <tr><td>focal length 35mmEQ:</td><td><b class="focal">∢</b>  ${dash(exif.FocalLengthIn35mmFormat + ' mm') }</td></tr>
        <tr><td>f-number:</td><td><b>⌬</b>  ${dash('f/'+ Math.round(exif.FNumber*10)/10)}</td></tr>
        <tr><td>ISO speed:</td><td><b class='iso'>▦</b>  ${dash(exif.ISO)}</td></tr>
        <tr><td>exposure time:</td><td><b>◔</b>  ${exposureCalc}s<br></td></tr>
        
        <tr><td>compensation:</td><td>  ${ dash(exif.ExposureCompensation).toString().substring(0,5) + ' EV' }<br></td></tr>
        <tr><td>flash:</td><td>  ${dash(exif.Flash)}</td></tr>
        <tr><td>editor:</td><td>   ${dash(exif.Software)}<br></td></tr>
        <tr><td>date & time:</td><td>  ${exif.DateTimeOriginal.toLocaleString()}</td></tr>
        <tr><td>GPS Lat, Long:</td><td> <a target='_blank' href='https://www.google.com/maps/search/${exif.latitude + ',' + exif.longitude}'>
        ${dash(exif.latitude + ', ' + exif.longitude)}</a></td></tr>
        <tr><td>Altitude:</td><td>  ${dash(Math.round(exif.GPSAltitude) + ' metres' )} </td></tr>
    </table>
    </div>
    `
    return exifTable;   
}

// A callback function when an image cannot be loaded.
SSG.onLoadError = function ( event ) {
    // Image "Eror loading image" in base 64 encoding
    var ip1 = 'data:image/gif;base64,R0lGODlhUQAKAIABADVsagAAACH5BAEAAAEALAAAAABRAAoAAAJkjI+py+0PYwQyUCpx3bNqDiIANlpkaYr';
    var ip2 = 'GqKHm9R5scrHujZaktfb9x2updrCgT8ZLfopMm/JYRApjxOdu6DsxX65n0oj9iY3V77i8XV5bOdoKpwXHw+ucPYTv5M37vqjLMZNQAAA7';
    jQuery( '#SSG1 #i' + event.data.imgid ).attr( 'src', ip1 + ip2 );
    jQuery( '#SSG1 #uwb' + event.data.imgid ).addClass( 'serror' );
    SSG.onImageLoad( event );
};

SSG.escapeHtml = function(string) {
    var entityMap = {  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;' };
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
};

SSG.shareMenu = function(newOne, caption) {
    var urlToShare = window.location.href.split("#")[0] + '#' + SSG.getName(SSG.imgs[ newOne ].href);
    var urlToShareEnc = encodeURIComponent(urlToShare);
    var h1ToShare = SSG.escapeHtml(jQuery('h1').first().text());
    var captionToShare = SSG.escapeHtml(caption);
    var textToShareEnc =  SSG.escapeHtml(encodeURIComponent( jQuery('h1').first().text() + ' - ' + caption ));
    var windowOpen = ' target="_blank" href="';
    var WindoOpenParams =  '" ';
    var shareMenu = "<span class='share' " + (SSG.cfgFused.imgBorderRadius > 6 ? ("style='bottom:"+ (SSG.cfgFused.imgBorderRadius-1) + SSG.radiusUnit + "'") : "")  + "'><span class='share-menu'>" +
                "<a class='linkedin' " + windowOpen + "https://www.linkedin.com/shareArticle?mini=true&url=" + urlToShareEnc + WindoOpenParams + " title='Share on Linkedin'></a>" + 
                "<a class='whatsapp'  " + windowOpen + "https://wa.me/?text=" + urlToShareEnc + " - " + textToShareEnc + WindoOpenParams + " title='Share on WhatsApp'></a>" + 
                "<a class='mess' " + windowOpen + "fb-messenger://share/?link=" + urlToShareEnc + WindoOpenParams + " title='Share on Messenger'></a>" + 
                "<a class='reddit' " + windowOpen + "https://www.reddit.com/submit?url=" + urlToShareEnc + "&title=" + textToShareEnc + WindoOpenParams + " title='Share on Reddit'></a>" + 
                "<a class='link' data-url='" + urlToShare + "' title='Get a link to share'></a>" +
                "<a class='tweet' " + windowOpen + "http://twitter.com/share?text=" + textToShareEnc + "&url=" + urlToShareEnc + WindoOpenParams + " title='Share on Twitter'></a>" + 
                "<a class='pin' " + windowOpen + "http://www.pinterest.com/pin/create/button/?url="+ urlToShareEnc + "&amp;media=" + 
                SSG.imgs[ newOne ].href + "&amp;description=" + textToShareEnc + WindoOpenParams + " title='Share on Pinterest'></a>" +
                "<a class='email' href='mailto:?subject=" + h1ToShare + "&body=" +  h1ToShare + ' - ' + captionToShare + " " + urlToShare + "' title='Send by email' ><b>@</b></a>" +
                "<a class='FB' " + windowOpen + "http://www.facebook.com/sharer/sharer.php?u=" + urlToShareEnc + WindoOpenParams + " title='Share on Facebook'></a>" + 
                "</span><a class='ico'></a></span>";
    return shareMenu;
}

SSG.addImage = function () {

    // Newone is index of a image which will be load.
    var newOne = SSG.justLoadedImg + 1;

    if ( newOne < SSG.imgs.length ) {
        var author = SSG.imgs[ newOne ].author ? "<em>" + SSG.imgs[ newOne ].author + "</em>" : '';        
        var caption =  SSG.imgs[ newOne ].alt ?  SSG.imgs[ newOne ].alt : '';
        var shareMenu;

        if (SSG.cfgFused.socialShare) {
            shareMenu = SSG.shareMenu( newOne, caption );        
        } else {
            shareMenu ='';
        }

        
        var titleClass = '';
        if ( SSG.imgs[ newOne ].alt) {
            titleClass = 'title';
        }
        if ( SSG.imgs[ newOne ].author) {
            titleClass += ' author';
        }
        if ( !SSG.imgs[ newOne ].alt && !SSG.imgs[ newOne ].author ) {
            titleClass = 'notitle';
        }
        if ( newOne == 0) {
            titleClass += ' arrow';
        }       
        var uwCaption = "<p class='uwtitle' id='uwp" + newOne + "'>" + caption + shareMenu + "<q></q>" + author + "</p>";
        
        var bWidth =  "padding:" + SSG.cfgFused.imgBorderWidthX + "px " + SSG.cfgFused.imgBorderWidthY + "px; ";
        var lightFx =  SSG.cfgFused.imgBorderLightFx ? "background-image: linear-gradient(" + Math.round(Math.random()*359) +"deg, #00000030, #ffffff30,  #00000030); " : "";
        var bColor =  SSG.cfgFused.imgBorderColor ? " background-color:" + SSG.cfgFused.imgBorderColor + "; " : "";
        var outlineOffset = SSG.cfgFused.imgOutlineColor ? " outline-offset: " + ((SSG.cfgFused.imgBorderWidthX + SSG.cfgFused.imgBorderWidthY + 1.2) / -2 ) + "px; " : "";
        var OutlineColor =  SSG.cfgFused.imgOutlineColor ? " outline: 1px solid " + SSG.cfgFused.imgOutlineColor + "; " : "";
        var bRadius =  "border-radius:" + SSG.cfgFused.imgBorderRadius + SSG.radiusUnit + "; ";
        var bShadow = !SSG.cfgFused.imgBorderShadow ? "box-shadow: none !important; " : "";

        var imgStyles = "style='" + bWidth + lightFx + bColor + outlineOffset + OutlineColor + bRadius + bShadow + "'";

        var imgWrap = "<div class='SSG_imgWrap'><span class='SSG_forlogo'><img id='i" +
            newOne + "' src='" + SSG.imgs[ newOne ].href + "' " + imgStyles + " ><span class='SSG_logo' style='" + SSG.watermarkStyle + "'>" +
             SSG.cfgFused.watermarkText +"</span>"+ shareMenu +"</span></div>";
        var caption = "<p class='title' id='p" + newOne + "'><span>" + caption + "<q></q>" + author + shareMenu + "</span></p>";
                
        var img = new Image();
        img.src = SSG.imgs[ newOne ].href;
        // decoding the image just after loading, image is completly ready to render, it makes scroll animation more fluent
        // img.decode isn't supported by older browsers (IE11, Edge)
        if (img.decode) {
            img.decode().catch( function() { console.log('no image to decode') } );
        }
        jQuery( "#SSG1" ).append( "<figure id='f" + newOne + "' class='" + titleClass + "'><div id='uwb" +
            newOne + "' class='SSG_uwBlock'>" + uwCaption + imgWrap + "</div>" + caption + "</figure>" );
        
        // it would be better to bind onImageLoad and onLoadError to img.decode, but older browsers :(
        // Imgid is an argument passed into SSG.onImageLoad.
        jQuery( '#SSG1 #i' + newOne ).on( 'load', {
            imgid: newOne
        }, SSG.onImageLoad );
        jQuery( '#SSG1 #i' + newOne ).on( 'error', {
            imgid: newOne
        }, SSG.onLoadError );
        jQuery( '.share' ).click( function ( event ) {
            event.stopPropagation();
        } );
        jQuery('#SSG1 #f' + newOne + ' .link').click(function() {            
            SSG.showFsTip(jQuery('#SSG1 #f' + newOne + ' .link').attr('data-url'));            
        } );

        //onclick for share menu; onclick a.ico toggles overflow:visible, onclick on a. othericons hides share menu (overflow:hidden)         
        jQuery( '#SSG1 #f' + newOne + ' .share a' ).click( function () {
            jQuery( '#SSG1 #f' + newOne + ' .share' ).toggleClass('share-overflow-coarse');
            if( this.classList[0] != 'ico' && this.classList[0] != 'email' && SSG.inFullscreenMode ) {
                SSG.destroyOnFsChange = false; // prevents to close the gallery when onfullscreenchange event happens
                SSG.closeFullscreen();
            } else if (this.classList[0] == 'email') {
                SSG.destroyOnFsChange = false; // opening email window could close FS mode and it would exit even the gallery
                // in case that browser stays in FS mode (email client on Windows) set destroyOnFsChange back
                setTimeout(function(){ SSG.destroyOnFsChange = true }, 1500);
            }
        } );


    }

    // with the last image of the gallery load even signpost
    if ( newOne == SSG.imgs.length - 1) {
        SSG.beyondGallery();
        // All images are already loaded.
        SSG.finito = true;
    }

    // Append a little help to the first image.
    if ( newOne == 0 ) {
        jQuery( '#SSG1 #p0' ).append( '<a class="SSG_tipCall">&nbsp;</a>' );
        jQuery( '#SSG1 #uwp0' ).append( '<span class="SSG_tipPlace"><a class="SSG_tipCall">&nbsp;</a></span>' );
        SSG.cfgFused.showLandscapeHint && jQuery( '#SSG1 #f0').after("<div class='golandscape'>"+ SSG.cfgFused.landscapeHint +"<div>");
        jQuery( '#SSG1 .golandscape').click( SSG.forceLandscapeMode )
        jQuery( '.SSG_tipCall' ).click( function ( event ) {
            SSG.showFsTip( 'hint' );
            event.stopPropagation();
        } );
    }
};

SSG.beyondGallery = function() {
    var menuItem1 = "<a id='SSG_first' class='SSG_link'><span>&nbsp;</span> " + SSG.cfgFused.toTheTop + "</a>";
    var menuItem2 = SSG.inExitMode ? "<a id='SSG_exit2' class='SSG_link'>&times; " + SSG.cfgFused.exitLink + "</a>" : "";
    var menuItem3 = "<a id='SSGL' target='_blank'  onclick='SSG.preventExit()' href='https://roman-flossler.github.io/StoryShowGallery/#play' class='SSG_link'><b>&#xA420;</b>SSG</a>";
    jQuery( '#SSG1' ).append( "<div id='SSG_lastone'> <p id='SSG_menu'>" + menuItem1 + menuItem2 + menuItem3 +
        "</p> <div id='SSG_loadInto'></div></div>" );
    jQuery( '#SSG_menu' ).click( function ( event ) {
        event.stopPropagation();
    } );
    jQuery( '#SSG_exit2' ).click( SSG.destroyGallery );
    jQuery( '#SSG_first' ).click( function () {
        SSG.isFirstImageCentered = false;
    } );

    // Load a html file with links to other galleries.
    SSG.cfgFused.fileToLoad && jQuery( '#SSG_loadInto' ).load( SSG.cfgFused.fileToLoad, function ( response, status, xhr ) {
        if ( status == "success" ) {
            SSG.fileLoaded = true;
            jQuery( '.SSG_icell a' ).click( function ( event ) {
                event.stopPropagation();
                if(!event.ctrlKey && !event.shiftKey) {
                    SSG.preventExit();
                }
            } );

            // load styles also into the head section, it force a browser to load styles properly
            var loadedStyles = jQuery( '#SSG_loadInto style' ).html();
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = loadedStyles;
            jQuery('head').append(style);
        }
    } );
}


// Acquire an image name from url address.
SSG.getName = function ( url ) {
    return url.slice( url.lastIndexOf( '/' ) + 1, url.lastIndexOf( '.' ) );
};

SSG.setHashGA = function ( index ) {
    var hashName;
    if ( index != -1 ) {
        hashName = '#' + SSG.getName( SSG.imgs[ index ].href );
    } else {
        hashName = '#signpost';
    }

    // Sends a pageview of an actual image to Google Analytics.    
    if (SSG.cfgFused.logIntoGA && typeof ga == 'function' ) {
        ga( 'send', 'pageview', '/img' + location.pathname + hashName );        
    }
    if ( hashName == '#signpost' ) {
        hashName = '';
    }

    history.replaceState( null, null, SSG.location + hashName );
};

SSG.metronome = function () {
    if ( !SSG.isImgLocked && SSG.displayedImg >= 0 ) {
        SSG.lockedImg = SSG.displayedImg;
    }
    // Actual offset from top of the page
    var actual = window.pageYOffset || document.documentElement.scrollTop;

    // Loadnext is true only when the next image should be loaded. SSG.jumpScrollingNow prevents to start loading an image in the middle of animation
    // SSG.justLoadedImg is set to -1 before the first image is loaded. 
    if ( SSG.loadNextImg && !SSG.jumpScrollingNow && SSG.justLoadedImg != -1 && !SSG.finito ) {

        // The newest loaded image offset from top of the page.
        var Faraway = SSG.imgs[ SSG.justLoadedImg ].pos;        
        if ( Faraway - actual < SSG.scrHeight * 2 ) {

            // When actual offset is three screen near from faraway gallery loads next image.
            SSG.addImage();
            SSG.loadNextImg = false;
        }
    }

    // If user is close enough to the last loaded image..
    if ( !SSG.finito && ( SSG.justLoadedImg == -1 || ( SSG.imgs[ SSG.justLoadedImg ].pos - actual < SSG.scrHeight * 0.5 ) ) ) {
        // ..wait cursor will appear 
        jQuery( document.body ).addClass( 'wait' );
    } else {
        jQuery( document.body ).removeClass( 'wait' );
    }
   
    // Only if the gallery is scrolled slowly change the URL and send views to GA. 
    // Scrolling (manual, animated) is jerky when history.replaceState happens
    if ( Math.abs(SSG.actualPos - actual) < SSG.scrHeight/8 ) {

        // Actual + some screen fractions determinates exactly when the new image starts and it is logged into GA.
        var treshold = actual + Math.round( SSG.scrHeight / SSG.scrFraction );

        for ( var i = 0; i <= SSG.justLoadedImg; i++ ) {

            // j is the new index which begins at SSG.displayedImg + delta. At first tick of metronome: -1 + 1 = 0
            var j = SSG.displayedImg + SSG.imgDelta + i;
            if ( j > SSG.justLoadedImg ) {
                j = j - SSG.justLoadedImg - 1;
            }
            var topPos;
            if ( j < SSG.imgs.length - 1 ) {
                topPos = SSG.imgs[ j + 1 ].pos;
            } else {
                // Get topPos of the last image's bottom
                topPos = SSG.imgs[ j ].pos + jQuery('#SSG1 #f'+ j).outerHeight(true);
                var finalPos = topPos;
            }
            
            if ( ( treshold > SSG.imgs[ j ].pos ) && ( treshold < topPos ) ) {
                if (SSG.displayedImg != j || SSG.atLastone) {
                    SSG.setHashGA( j );
                    SSG.cfgFused.onImgView && SSG.cfgFused.onImgView(SSG.createDataObject(j));
                } 
                SSG.displayedImg = j;                
                SSG.imgDelta = 0;
                SSG.atLastone = false;
                break;
            } else if (!SSG.atLastone && treshold > finalPos) {
                SSG.atLastone = true;
                SSG.displayedImg =  SSG.imgs.length - 1;
                SSG.setHashGA( -1 );
                SSG.cfgFused.onBeyondGallery && SSG.cfgFused.onBeyondGallery( SSG.fileLoaded );
            }
        }
    }

    SSG.actualPos = actual;

    if ( SSG.imageUp || SSG.imageDown || !SSG.isFirstImageCentered ) {
        if ( SSG.landscapeMode && SSG.isFirstImageCentered && !SSG.wasJumpScrollUsed && !( SSG.imageUp && SSG.displayedImg == 0 )) {
            SSG.wasJumpScrollUsed = true;
        }
        SSG.jumpScroll();
    }
};

SSG.ScrollTo = function ( posY, direction ) {
    SSG.jumpScrollingNow = true;
    if ( direction ) {
        jQuery( '#SSG1 figure[id=f' + ( SSG.displayedImg + direction ) + ']' ).fadeTo( 0, 0 );
        jQuery( '#SSG1 figure[id=f' + ( SSG.displayedImg ) + ']' ).fadeTo( SSG.cfgFused.scrollDuration*0.8, 0 );
    }    
    jQuery( 'html, body' ).animate( { scrollTop: posY }, SSG.cfgFused.scrollDuration, 'swing', 
                            function() { SSG.jumpScrollingNow = false; } );
    if ( direction ) {
        jQuery( '#SSG1 figure[id=f' + ( SSG.displayedImg + direction ) + ']' ).fadeTo( SSG.cfgFused.scrollDuration*1.33, 1 );
        jQuery( '#SSG1 figure[id=f' + ( SSG.displayedImg ) + ']' ).fadeTo( SSG.cfgFused.scrollDuration, 1 );
    }
};

SSG.jumpScroll = function () {

    // Function finds out if image is roughly decentered (more than treshold) from ideal center.
    var countDecentering = function () {
        var actual = window.pageYOffset || document.documentElement.scrollTop;
        var indent = SSG.countImageIndent( SSG.displayedImg );
        var difference = ( actual + indent ) - SSG.imgs[ SSG.displayedImg ].pos;
        var treshold = ( indent / 2 > SSG.scrHeight / 20 ) ? indent / 2 : SSG.scrHeight / 20;
        if ( difference > treshold ) {
            return 1;
        } else if ( difference < -treshold ) {
            return -1;
        } else {
            return 0;
        }
    };

    // finds out if the crucial image is sufficiently big for fading animation
    var bigImage = 0;
    if ( SSG.landscapeMode ) {
        if ( SSG.scrHeight * 0.3 < jQuery( '#SSG1 #i' + SSG.displayedImg ).outerHeight( true ) ) {
            bigImage = 1;
        }
        if ( bigImage == 0 && SSG.imageUp ) {
            bigImage = 1;
        }
        if ( SSG.scrHeight * 0.3 > jQuery( '#SSG1 #i' + ( SSG.displayedImg - 1 ) ).outerHeight( true ) && SSG.imageUp ) {
            bigImage = 0;
        }
    }


    var isDecentered;
    if ( SSG.displayedImg != -1 ) {
        isDecentered = countDecentering();
        if ( isDecentered != 0 ) {
            bigImage = 0;
        }
    }

    // If image is roughly decentered down and navigation is down, center image.
    if ( SSG.imageDown && isDecentered == -1 && !SSG.atLastone ) {
        SSG.ScrollTo( SSG.imgs[ SSG.displayedImg ].pos - SSG.countImageIndent( SSG.displayedImg ), 0 );
    }

    // If image is roughly decentered up and navigation is up, center image.
    else if ( SSG.imageUp && isDecentered == 1 && !SSG.atLastone ) {
        SSG.ScrollTo( SSG.imgs[ SSG.displayedImg ].pos - SSG.countImageIndent( SSG.displayedImg ), 0 );
    }

    // If the imageDown is true and next image is loaded (pos exists) then scroll down.
    else if ( SSG.imageDown && SSG.displayedImg + 1 < SSG.imgs.length && SSG.imgs[ SSG.displayedImg + 1 ].pos ) {
        SSG.ScrollTo( SSG.imgs[ SSG.displayedImg + 1 ].pos - SSG.countImageIndent( SSG.displayedImg + 1 ), bigImage );
        SSG.cfgFused.onImgScrollsIn && SSG.cfgFused.onImgScrollsIn(SSG.createDataObject(SSG.displayedImg + 1));
    }

    // If the imageUp is true then scroll on previous image.    
    else if ( SSG.imageUp && SSG.displayedImg - 1 >= 0 && !SSG.atLastone ) {
        SSG.imgDelta = -1;
        SSG.ScrollTo( SSG.imgs[ SSG.displayedImg - 1 ].pos - SSG.countImageIndent( SSG.displayedImg - 1 ), -bigImage );
        SSG.cfgFused.onImgScrollsIn && SSG.cfgFused.onImgScrollsIn(SSG.createDataObject(SSG.displayedImg - 1));
    }

    // Center the first image after initiation of the gallery or can be used to jump to the 1st image.
    // Without setTimeout someb browsers aren't able to completely center the image.
    else if ( SSG.imgs[ 0 ].pos && !SSG.isFirstImageCentered ) {
        window.setTimeout( function () {
            SSG.ScrollTo( SSG.imgs[ 0 ].pos - SSG.countImageIndent( 0 ), 0 );
            SSG.cfgFused.onImgScrollsIn && SSG.cfgFused.onImgScrollsIn(SSG.createDataObject(0));
            jQuery('#SSG1').animate({opacity:1}, 500);
            SSG.isFirstImageCentered = true;
        }, 55 );
    }

    // If the lastone is true, i am out of the index, so scroll on the last image in index.
    else if ( SSG.imageUp && SSG.atLastone ) {
        SSG.ScrollTo( SSG.imgs[ SSG.displayedImg ].pos - SSG.countImageIndent( SSG.displayedImg ), 0 );
        SSG.cfgFused.onImgScrollsIn && SSG.cfgFused.onImgScrollsIn(SSG.createDataObject(SSG.displayedImg));
    } else {
        // If the bottom menu exists scroll to it
        if ( typeof jQuery( '#SSG_menu' ).offset() !== 'undefined' ) {
            var menuPosition = SSG.fileLoaded ? SSG.scrHeight / 10 : SSG.scrHeight - SSG.scrHeight / 5;
            SSG.imageDown && SSG.ScrollTo( jQuery( '#SSG_menu' ).offset().top - menuPosition, 0 );
        }
    }

    SSG.imageDown = false;
    SSG.imageUp = false;
};


// Function counts how much to indent image from the top of the screen to center image.
SSG.countImageIndent = function ( index ) {
    var screen =  window.innerHeight;
    var img = jQuery( '#SSG1 #i' + index ).outerHeight();
    var pIn = jQuery( '#SSG1 #p' + index ).innerHeight();    
    var centerPos, marginAfterP;

    // get previous index unless index = 0
    var useIndex = index == 0 ? 0 : index-1;

    // if there is no title/caption under the image or title is on the side
    if ( jQuery( '#SSG1 #f' + useIndex ).hasClass('notitle') ||  jQuery( '#SSG1 #f' + useIndex ).hasClass('SSG_uwide') ) {
        marginAfterP = jQuery( '#SSG1 #p' + ( useIndex ) ).outerHeight( true ) - jQuery( '#SSG1 #p' + ( useIndex ) ).innerHeight();        
    }  
    else {
        marginAfterP = parseInt(jQuery( '#SSG1 #p' + useIndex ).css('marginBottom'));
    }
     
    if ( jQuery( '#SSG1 #f' + index ).hasClass('notitle') ||  jQuery( '#SSG1 #f' + index ).hasClass('SSG_uwide') ) {
        centerPos = Math.round( ( screen - ( img + pIn ) ) / 2 ) + 1;
    } else {
        centerPos = Math.round( ( screen - ( img + pIn + parseInt(jQuery( '#SSG1 #p' + index ).css('marginTop')) ) ) / 2 + 1 );
    }
    if ( centerPos < 0 ) {
        centerPos = ( centerPos * 2 ) - 2;
    }

    // It prevents fraction of previous image appears above centered image.
    return centerPos > marginAfterP? marginAfterP: centerPos;
};

// prevents scrolling, finds out its direction and activates jump scroll
SSG.seizeScrolling = function ( e ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if ( Math.abs( e.timeStamp - SSG.savedTimeStamp ) > 333 ) {
        if ( typeof e.detail == 'number' && e.detail !== 0 ) {
            if ( e.detail > 0 ) {
                SSG.imageDown = true;
            } else if ( e.detail < 0 ) {
                SSG.imageUp = true;
            }
        } else if ( typeof e.wheelDelta == 'number' ) {
            if ( e.wheelDelta < 0 ) {
                SSG.imageDown = true;
            } else if ( e.wheelDelta > 0 ) {
                SSG.imageUp = true;
            }
        }
    }
    SSG.savedTimeStamp = e.timeStamp;
};

SSG.openFullscreen = function () {
    var elem = document.documentElement;
    if ( elem.requestFullscreen ) {
        elem.requestFullscreen({ navigationUI: "hide" });
    } else if ( elem.mozRequestFullScreen ) {

        // Firefox
        elem.mozRequestFullScreen({ navigationUI: "hide" });
    } else if ( elem.webkitRequestFullscreen ) {

        // Chrome, Safari and Opera
        elem.webkitRequestFullscreen({ navigationUI: "hide" });
    }
};

SSG.closeFullscreen = function () {
    if ( document.exitFullscreen ) {
        document.exitFullscreen();
    } else if ( document.mozCancelFullScreen ) {

        // Firefox
        document.mozCancelFullScreen();
    } else if ( document.webkitExitFullscreen ) {

        // Chrome, Safari and Opera
        document.webkitExitFullscreen();
    }
};

SSG.createDataObject = function (imgIndex) {
    var data = {};
    data.imgCount = SSG.imgs.length;
    data.GalleryId = SSG.clickedGalleryID;    
    if (imgIndex >= 0) {
        data.imgGalleryId = imgIndex;
        data.imgPageId = SSG.imgs[imgIndex].id ? SSG.imgs[imgIndex].id : -1;
        data.imgPath = SSG.imgs[imgIndex].href;
        data.imgName =  SSG.getName(data.imgPath);
        data.imageCaption = SSG.imgs[imgIndex].alt;
    }
    return data;
}

// for hash links in signost - when hash link is clicked, destroy gallery and don't restore scroll 
SSG.onHashExit = function() { 
    setTimeout( function() 
        { SSG.atLastone && SSG.running && SSG.destroyGallery('hashlink') }
        , 333) 
}


SSG.preventExit = function() {
    // opening new tab will close FS mode and it would exit even the gallery
    SSG.destroyOnFsChange = false; 
}

SSG.restart = function(config) { 
    SSG.destroyGallery('restart');
    if (config) config.restart = true;
    if(!config.cfg) config.cfg = {};
    config.cfg.theme = SSG.theme;
    SSG.run(config);
}

SSG.destroyGallery = function (mode) {
    if ( SSG.loadingStopped && mode != 'restart' ) {        
        if (mode == 'hashlink') {            
            window.location.reload();
        } else {
            window.scrollTo( 0, 0 );
            var newUrl = window.location.href.substring( 0, window.location.href.lastIndexOf('#') );
            (newUrl != '') ? window.location.assign(newUrl) : window.location.reload();
        }
    }
    if( mode != 'hashlink' && mode != 'restart' ) {
        history.replaceState( null, null, SSG.location );
    }
    clearInterval( SSG.metronomInterval );
    if (SSG.cfgFused.logIntoGA && typeof ga == 'function' ) {
        ga( 'send', 'pageview', location.pathname );
    }
    // DOMMouseScroll event is for FF, mousewheel for other browsers, true means capturing phase
    document.removeEventListener( "mousewheel", SSG.seizeScrolling, true );
    document.removeEventListener( "DOMMouseScroll", SSG.seizeScrolling, true );
    window.removeEventListener('hashChange', SSG.onHashExit );
    jQuery( window ).off( 'resize', SSG.onResize );
    jQuery( document ).off( 'keydown', SSG.keyFunction );
    jQuery( document ).off( 'webkitfullscreenchange mozfullscreenchange fullscreenchange', SSG.onFS );
    jQuery( document ).off( 'touchstart', SSG.slideStart );
    jQuery( document ).off( 'touchmove', SSG.slideBrowse );
    window.removeEventListener( 'orientationchange', SSG.onOrientationChanged );
    document.removeEventListener( "touchmove", SSG.iphoneShit, false );
    SSG.userAcceptFs = false;
    if ( window.screen.orientation ) {
        window.screen.orientation.removeEventListener( 'change', SSG.onOrientationChanged );
    }

    var restoredPos;    
    //if orientation has changed, restore a page position on the hyperlink which activated the gallery
    if ( SSG.landscapeMode != SSG.landscapeModeOriginal && SSG.initEvent && SSG.initEvent.currentTarget ) {
        restoredPos = jQuery( 'a[ssgid="' + SSG.initEvent.currentTarget.attributes.ssgid.nodeValue + '"]' ).offset().top - SSG.scrHeight/3;
    }   else if ( SSG.landscapeMode != SSG.landscapeModeOriginal)  {
        restoredPos = (jQuery( 'body' ).height() / ( SSG.originalBodyHeight / SSG.originalPos ));      
    }   else {
        restoredPos = SSG.originalPos;
    }

    // Renew an original scroll of a page. SetTimeout solves problem with return from FS, simple scrollTo doesn't work.
    if( mode != 'hashlink' && mode != 'restart' ) {
        if ( SSG.inFullscreenMode || mode == 'fsexit' ) {
            window.setTimeout( function () {
                window.scrollTo( 0, restoredPos );
            }, 555 );
        } else {
            window.scrollTo( 0, restoredPos );
        }
    }

    jQuery( '#SSG_bg, #SSG1, #SSG_exit, #SSG_lastone, #SSG_tip' ).remove();
    jQuery( 'html' ).removeClass( 'ssg-active crosscur ssgdim ssglight ssgblack' );
    jQuery( "meta[name='viewport']" ).attr( 'content', SSG.viewport );
    jQuery( "meta[name='theme-color']" ).attr( 'content', SSG.themeColor ? SSG.themeColor : '' );

    if( SSG.inFullscreenMode &&  mode != 'restart' ) {
         SSG.closeFullscreen(); }
    SSG.running = false;
    SSG.cfgFused.onGalleryExit && SSG.cfgFused.onGalleryExit(SSG.atLastone ? SSG.fileLoaded : SSG.createDataObject( SSG.displayedImg));
};

SSG.showFsTip = function ( content ) {
    if ( jQuery( '#SSG_tip' ).length == 0 ) {
        var begin = "<div id='SSG_tip'><span class='" + (content.length > 8 ? 'linkShare' : content) + "'><div id='SSG_tipClose'>&times;</div>";
        var end = "</span></div>";
        var fs =  SSG.cfgFused.hintFS + "<br>";
        var gofs = function() {
            SSG.openFullscreen();
            jQuery( '#SSG_tip' ).remove();
            SSG.userAcceptFs = true;
        }

        if ( content == 'fsOffer' ) {
            jQuery( 'body' ).append( begin + fs + end );
            jQuery( '#SSG_tip' ).click( gofs );
        } else if (content.substring(0,8).indexOf('://') != -1) {
            var linkInput = '<textarea readonly rows="2"  id="linkText" >'+content+'</textarea><br/><button id="copyLink">' + SSG.cfgFused.copyButton + '</button>';
            jQuery( 'body' ).append( begin + "<p>" + SSG.cfgFused.imageLink + "</p>" + linkInput + "<div>" + SSG.cfgFused.linkPaste + "</div>" + end );
            jQuery('#SSG_tip #copyLink').click( function() {
                jQuery('#SSG_tip #linkText').select(); 
                document.execCommand("copy");
            });
        } else if (content == 'hint') {
            var man1 = "<div class='classic'>" + SSG.cfgFused.hint1 + "<br>" + SSG.cfgFused.hint2 + "<br>";
            var man2 =  SSG.cfgFused.hint3 + "</div>";
            var touch = "<div class='touch'>" + SSG.cfgFused.hintTouch + "</div>";
            var hr = "<hr>";

            if ( !SSG.inFullscreenMode && SSG.fullScreenSupport ) {
                jQuery( 'body' ).append( begin + man1 + man2 + touch + hr + fs + end );
                jQuery( '#SSG_tip' ).click( gofs );
                SSG.fsTipShown = true;
            } else {
                jQuery( 'body' ).append( begin + man1 + man2 + touch + end );
                SSG.fsTipShown = true;
            }
        } else if (content.length > 33) {
            jQuery( 'body' ).append( begin + content + end );
            jQuery( '.exif-table' ).on( 'touchmove', function (e) { e.stopPropagation(); } );
        }
        
        jQuery( '#SSG_tipClose' ).click( function () {
            jQuery( '#SSG_tip' ).remove();
        } );
        jQuery( '#SSG_tip' ).on( "contextmenu", function ( event ) {
            event.preventDefault();
        } );
    } else {
        jQuery( '#SSG_tip' ).remove();
    }
};
