/*!  
    Story Show Gallery (SSG) ver: 2.9.6 - https://roman-flossler.github.io/StoryShowGallery/
    Copyright (C) 2020 Roman Flössler - SSG is Licensed under GPLv3  */

/*   
    SSG on Github: https://github.com/Roman-Flossler/Simple-Scroll-Gallery.git   

    There is one exception from the license:
    Distributing Story Show Gallery within a Wordpress plugin or theme 
    is only allowed for the author of Story Show Gallery.   
*/


// Main object - namespace - the only global variable
var SSG = {};
SSG.cfg = {};

// ---------------------- ⚙️⚙️⚙️ Story Show Gallery CONFIGURATION ⚙️⚙️⚙️ ---------------------------

// duration of scroll animation in miliseconds. Set to 0 for no scroll animation.
SSG.cfg.scrollDuration = 500;

// Force SSG to always display in fullscreen - true/false
SSG.cfg.alwaysFullscreen = false;

// Force SSG to never display in fullscreen - true/false. There is an exception for smartphones and tablets
SSG.cfg.neverFullscreen = false;

// URL of the HTML file to load behind the gallery (usually a signpost to other galleries). 
// HTML file has to be loaded over http(s) due to a browser's CORS policy. Set to null if you don't want it.
SSG.cfg.fileToLoad = null;

// display social share icon and menu
SSG.cfg.socialShare = true;

// log image views into Google Analytics - true/false. SSG supports only ga.js tracking code.
SSG.cfg.logIntoGA = true;

// Protect photos from being copied via right click menu - true/false
SSG.cfg.rightClickProtection = true;

// Side caption for smaller, landscape oriented photos, where is enough space below them as well as on their side. true/false
SSG.cfg.sideCaptionforSmallerLandscapeImg = false;  // false means caption below
// in other cases caption position depends on photo size vs. screen size.

// Locking the scale of mobile viewport at 1. Set it to true if the gallery has scaling problem on your website. 
SSG.cfg.scaleLock1 = false; 

// Show first 3 images of a separate gallery together - e.g. third image clicked - image order will be 3,1,2,4,5,6...
SSG.cfg.showFirst3ImgsTogether = true;

// Watermark - logo configuration. Enter watermark text or image URL to display it
SSG.cfg.watermarkWidth = 147; // image watermark width in pixels, it is downsized on smaller screens.
SSG.cfg.watermarkImage = '';  // watermark image URL e.g. 'https://www.flor.cz/img/florcz.png'
SSG.cfg.watermarkText = '';  //  watermark text, use <br> tag for word wrap
SSG.cfg.watermarkFontSize = 20; // font size in pixels  
SSG.cfg.watermarkOffsetX = 1.8; // watermark horizontal offset from left in percents of photo
SSG.cfg.watermarkOffsetY = 1.2; // watermark vertical offset from bottom in percents of photo
SSG.cfg.watermarkOpacity = 0.36; // opacity

// Here you can translate SSG into other language. Leave tags <> and "" as they are.
SSG.cfg.hint1 = "Browse through Story Show Gallery by:";
SSG.cfg.hint2 = "a mouse wheel <strong>⊚</strong> or arrow keys <strong>↓→↑←</strong>";
SSG.cfg.hint3 = "or <strong>TAP</strong> on the bottom (top) of the screen";
SSG.cfg.hintTouch = "<strong>TAP</strong> on the bottom (top) of the screen<br> to browse through Story Show Gallery.";
SSG.cfg.hintFS = "For a better experience <br><a>click for fullscreen mode</a>"
SSG.cfg.toTheTop = "Scroll to top";
SSG.cfg.exitLink = "Exit the Gallery";

// share link dialog
SSG.cfg.imageLink = "The link to selected image:";
SSG.cfg.copyButton  = "⎘ Copy the link to clipboard";
SSG.cfg.linkPaste = "…and you can paste it anywhere via ctrl+v";

// in the portrait mode the gallery suggest to turn phone into landscape mode
SSG.cfg.showLandscapeHint = true;
SSG.cfg.landscapeHint = 'photos look better in landscape mode <span>😉</span>';

// SSG events - see complete example of SSG events in the example directory
SSG.cfg.onGalleryStart = null; // fires after creating a gallery
SSG.cfg.onImgChange = null; // fires on every image change (even the first one)
SSG.cfg.onSignpost = null; // fires when a user reach the HTML signpost after photos or if he scrolls after the final menu
SSG.cfg.onGalleryExit = null;  // fires on the gallery exit


// -------------- end of configuration ----------------------------------------


// isMobile is needed before the gallery is running
SSG.isMobile = window.matchMedia( '(max-width: 933px) and (orientation: landscape), (max-width: 500px) and (orientation: portrait) ' ).matches;
var userAgent = navigator.userAgent.toLowerCase();
var isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
var newIpads = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
SSG.isTablet = isTablet || newIpads;

// get a collection of all anchor tags from the page, which links to an image
SSG.jQueryImgSelector = "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.PNG'],a[href$='.gif'],a[href$='.GIF'],a[href$='.webp']";
SSG.getJQueryImgCollection = function () {
    SSG.jQueryImgCollection = jQuery( SSG.jQueryImgSelector ).filter( jQuery( 'a:not(.nossg)' ) );
};

jQuery( document ).ready( function () {
    // two lines below are for use SSG with Wordpress. Outside of Wordpress leave both lines inactiv. Condition booleans aren't defined, they are false 
    SSG.cfg.respectOtherWpGalleryPlugins && jQuery("body [class*='gallery']").not( jQuery(".wp-block-gallery, .blocks-gallery-grid, .blocks-gallery-item, .gallery, .gallery-item, .gallery-icon ")).addClass('nossg');
    SSG.cfg.wordpressGalleryFS && jQuery( '.gallery a, .wp-block-gallery a' ).filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'fs' ); 
    
    // looks for galleries with nossg class and marks every jQueryImgSelector element inside by nossg class
    jQuery( '.nossg a' ).filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'nossg' );

    // adding of fs class to all thumbnails in a gallery, it activates full screen
    jQuery( '.fs a' ).filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'fs' );
    jQuery( '.vipssg a').filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'vipssg' );
    !SSG.jQueryImgCollection && SSG.getJQueryImgCollection();
    SSG.jQueryImgCollection.click( SSG.run );

    // The possible SSG.run in body's onload will run first thanks to delayed run of getHash. It is important in the noExit mode.
    // If the getHash would initiate SSG first, there wouldn't be any information about the noExit mode.
    window.setTimeout( function () {
        !SSG.running && SSG.getHash( false );
    }, 10 );
} );


SSG.run = function ( event ) {
    !SSG.jQueryImgCollection && SSG.getJQueryImgCollection();

    // It prevents to continue if SSG is already running or there is no photo on the page to display.
    if ( SSG.running || (SSG.jQueryImgCollection.length == 0 && !event.imgs )) {
        return false;
    }
    SSG.running = true;

    // .ssg-active has to be add asap, it overrides possible scroll-behavior:smooth which mess with gallery jump scrolling
    jQuery( 'html' ).addClass( 'ssg-active' );

    // If there is no start image specified (in the noExit mode), try to get image from hash.
    if ( event && event.noExit && !event.initImgID ) {
        var initImgID = SSG.getHash( true );
        if ( initImgID != null ) {
         event.initImgID = initImgID;
        }
    }    
    SSG.cfgFused = {};
    if( event && event.cfg ) {
        Object.assign(SSG.cfgFused, SSG.cfg, event.cfg );        
    } else {
        SSG.cfgFused = SSG.cfg;
    }

    SSG.initEvent = event;
    SSG.setVariables();
    
    // Adding meta tags for mobile browsers to maximize viewport and dye an address bar into the dark color
    if (!SSG.cfgFused.scaleLock1) {
        jQuery( "meta[name='viewport']" ).attr( 'content', 'initial-scale=1, viewport-fit=cover' );
    } else {
        jQuery( "meta[name='viewport']" ).attr( 'content', 'initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no, ' );
    }
    if ( SSG.themeColor ) {
        jQuery( "meta[name='theme-color']" ).attr( 'content', '#131313' );
    } else {
        jQuery( 'head' ).append( "<meta name='theme-color' content='#131313'>" );
    }
    jQuery( 'body' ).append( "<div id='SSG_bg'><b>&#xA420;</b> Story Show Gallery</div>" );

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
    SSG.scrHeight = jQuery( window ).height();

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

    // prevents exit the gallery onFullscreenChange event. e.g. link with target=_blank will close FS
    SSG.destroyOnFsChange = true;

    // If the inExitMode is true a user can exit the gallery.
    SSG.inExitMode = true;

    // When the img is loaded loadnextImg is set true.
    SSG.loadNextImg = false;

    // initial value for scroll event time stamp
    SSG.savedTimeStamp = 0;

    // If a user used jump scroll. Due to showing the tip window on touchmove event
    SSG.wasJumpScrollUsed = false;

    // prevents to load a next image while animated jump scroll is performed
    SSG.jumpScrollingNow = false;

    // If the tip window was shown
    SSG.fsTipShown = false;

    // if the gallery is already created, prevents to create the gallery again
    SSG.isGalleryCreated = false;

    // if a user turn a phone around. Landscape mode activates fullscreen mode (as on YouTube)
    SSG.isOrientationChanged = false;
    
    SSG.location = window.location.href.split( '#', 1 )[ 0 ];
    SSG.viewport = jQuery( "meta[name='viewport']" ).attr( 'content' );
    SSG.themeColor = jQuery( "meta[name='theme-color']" ).attr( 'content' );
    SSG.smallScreen = window.matchMedia( '(max-width: 933px) and (orientation: landscape), (max-width: 500px) and (orientation: portrait) ' ).matches;
    SSG.landscapeMode = window.screen.width > window.screen.height;
    SSG.actualPos = window.pageYOffset || document.documentElement.scrollTop;
    
    // Intial scroll, rotation and height. Don't overwrite originals if the gallery is being restarted 
    
    if ( SSG.initEvent && !SSG.initEvent.restart ) {
        SSG.originalPos = window.pageYOffset || document.documentElement.scrollTop;
        SSG.originalBodyHeight = jQuery( 'body' ).height();
        SSG.landscapeModeOriginal = window.screen.width > window.screen.height;
    }
    


    // Styles for watermark
    SSG.watermarkStyle = '';
    if ( SSG.cfgFused.watermarkImage || SSG.cfgFused.watermarkText ) {
        var watermarkFontSize = SSG.smallScreen ? SSG.cfgFused.watermarkFontSize * 0.8 : SSG.cfgFused.watermarkFontSize;
        var width = Math.round( SSG.cfgFused.watermarkWidth / 1260 * 1000 ) / 10;

        SSG.watermarkStyle = "max-width:" + SSG.cfgFused.watermarkWidth + "px; min-width:" + Math.round( SSG.cfgFused.watermarkWidth * 0.69 ) + 
        "px; width:" + width + "vmax; background-image: url(" + SSG.cfgFused.watermarkImage + ");" +
        "left:" +  SSG.cfgFused.watermarkOffsetX + "%; bottom:" + SSG.cfgFused.watermarkOffsetY + "%; height:" +  SSG.cfgFused.watermarkWidth * 1.5 + "px;" +
        "max-height: 48vmin;" + "font-size:" + watermarkFontSize + "px;opacity:" + SSG.cfgFused.watermarkOpacity;
        // for IE 11
        SSG.watermarkStyle = "width:" + width + "vw;" + SSG.watermarkStyle;
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
            window.stop();
            SSG.loadingStopped = true;
            SSG.run( {
                fsa: SSG.hasClass( allimgs[findex].classList, 'fs' ) || SSG.isMobile || SSG.isTablet,
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
        window.setTimeout( function () {
            SSG.showFsTip( 'fsOffer' );
        }, 600 );
    } );

    var mobileLandscape = SSG.isMobile &&  SSG.landscapeMode;
    var mobilePortrait = SSG.isMobile && !SSG.landscapeMode;

    // event.fs and event.fsa isn't a browser's object. MobileLandscape (tablets included) goes everytime in FS, it solves problems with mobile browsers
    if (SSG.cfgFused.alwaysFullscreen) {
        SSG.openFullscreen();
    } else if ( mobilePortrait || SSG.cfgFused.neverFullscreen ) {
        SSG.createGallery( SSG.initEvent );
    } else if ( event && event.fsa ) {
        SSG.createGallery( SSG.initEvent );
        SSG.isFullscreenModeWanted = true;
    } else if ( mobileLandscape || SSG.isTablet || ( event && event.fs ) ) {
        SSG.openFullscreen();
    } else if ( ( event && event.currentTarget ) && ( SSG.hasClass( event.currentTarget.classList, 'fs' ) ) && !event.altKey ) {
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
    SSG.initGallery( event );

    if ( event && event.imgs ) {

        // SSG.imgs = event.imgs would create just reference to source array (and use it for storing pos), deep copy is needed:
        var deepCopy = JSON.parse( JSON.stringify( event.imgs ) );

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
        
    SSG.clickedGalleryID = -1;
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
    window.scrollTo( 0, 0 );

    // Append gallery's HTML tags
    jQuery( 'body' ).append( "<div id='SSG1'></div>" );
    SSG.setNotchRight();
    SSG.inExitMode && jQuery( 'body' ).append( "<div id='SSG_exit'></div>" );

    // SSG adds Id (ssgid) to all finded images and subID (ssgsid) to all finded images within an each gallery
    SSG.jQueryImgCollection.each( function ( index ) {
        jQuery( this ).attr( 'ssgid', index );
        jQuery( this ).attr( 'ssg', 0 );
    } );

    // "article and div[id^="post-"]" is for Wordpress
    jQuery( 'article[id^="post-"], div[id^="post-"], .ssg' ).each( function (index) {
        jQuery( this ).find( SSG.jQueryImgSelector ).each( function ( sindex ) {
            jQuery( this ).attr( 'ssgsid', sindex );
            jQuery( this ).attr( 'ssg', index + 1 );
        }, index );
    } );


    // Adding event listeners
    jQuery( document ).keydown( SSG.keyFunction );
    jQuery( '#SSG_exit' ).click( SSG.destroyGallery );
    jQuery( '#SSG1' ).click( SSG.touchScroll );

    window.addEventListener("hashchange", SSG.onHashExit );

    // passive:false is due to Chrome, it sets the mousewheel event as passive:true by default and then preventDefault cannot be used
    document.addEventListener( 'mousewheel', SSG.seizeScrolling, {
        passive: false, capture: true
    } );
    document.addEventListener( 'DOMMouseScroll', SSG.seizeScrolling, {
        passive: false, capture: true
    } );
    !SSG.isMobile && jQuery( window ).resize( SSG.onResize );    
    SSG.cfgFused.rightClickProtection && jQuery( '#SSG1, #SSG_exit' ).on( "contextmenu", function ( event ) {
        event.preventDefault();
        SSG.showFsTip( 'hint' );
    } );
    if ( SSG.isMobile ) {
        if ( window.screen.orientation ) {
            // new standard - works on Android
            window.screen.orientation.addEventListener( 'change', SSG.orientationChanged );            
        } else {
            // obsolete works on iOS
            window.addEventListener( 'orientationchange', SSG.orientationChanged );
            // window.onorientationchange = SSG.orientationChanged;
        }
    }

    // if a user wants to touch scroll to next photo, the tip window shows that there is a better way    
    jQuery( document ).on( 'touchmove', function badTouchMove() {
        if ( SSG.landscapeMode && !SSG.wasJumpScrollUsed && !SSG.fsTipShown && SSG.running ) {
            SSG.showFsTip( 'hint' );
            jQuery( document ).off( 'touchmove', badTouchMove );
        }
    } );
};

SSG.orientationChanged = function () {
    SSG.isOrientationChanged = true;

    // if a portrait mode is in FS mode, turning into landscape won't fire onFS event (gallery resize), so else branch is needed
    // and also for iPhone which doesn't have any FS mode
    if ( SSG.fullScreenSupport && ( (!SSG.landscapeMode && !SSG.inFullscreenMode) || (SSG.landscapeMode && SSG.inFullscreenMode) ) ) {
        // landscapeMode is an old info - when phone is rotated into portrait landscapeMode is true.
        // So landscapeMode doesn't depend on a browser speed of actualization present orientation.
        !SSG.landscapeMode ? SSG.openFullscreen() : SSG.closeFullscreen();
    } else {
        SSG.onResize();
    }
    SSG.setNotchRight();
};


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

    // If A tag has a children (img tag) with an alt atribute.
    if ( el.children[ 0 ] && el.children[ 0 ].alt )
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
    SSG.clickedGalleryID = clickedGalleryID;

    // Call invokes forEach method in the context of jQuery output     
    Array.prototype.forEach.call( SSG.jQueryImgCollection.toArray(), function ( el ) {
        // don't include image with gossg class unless it was clicked
        var noGossg =  !SSG.hasClass( el.classList, 'gossg' ) || clickedImgID == el.attributes.ssgid.nodeValue;
        
        // include only images with the same GalleryID as clicked image or from the galleries with vipssg class
        var rightGallery = clickedGalleryID == el.attributes.ssg.nodeValue || ( SSG.hasClass( el.classList, 'vipssg' ) && clickedGalleryID == 0 );

        if ( noGossg && (rightGallery || clickedGalleryID == -1 )) {
            obj.href = el.href;
            obj.alt = SSG.getAlt( el );
            obj.id = el.attributes.ssgid.nodeValue;
            if (el.attributes['data-author']) {
                obj.author = el.attributes['data-author'].nodeValue;
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
    SSG.isMobile && SSG.onResize();

    // readyToExitFullScreen is true, that means than FS mode is ending
    if ( SSG.inFullscreenMode && SSG.readyToExitFullScreen ) {
        SSG.inFullscreenMode = false;
        SSG.readyToExitFullScreen = false;
        if ( SSG.isOrientationChanged ) {
            SSG.isOrientationChanged = false;
            return;
        }
        // Destroys gallery on exit from FS (if destroyOnFsChange) or removes exit icon.        
        if (SSG.inExitMode) {
            SSG.destroyOnFsChange && SSG.destroyGallery();
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
    SSG.scrHeight = jQuery( window ).height();
    SSG.scrFraction = ( jQuery( window ).width() / SSG.scrHeight >= 1 ) ? 2 : 3.5;
    SSG.landscapeMode = window.screen.width > window.screen.height;
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
    // onresize event can fire several times, so re-countiong the gallery is conditioned by isImgLocked
    var fraction = SSG.isOrientationChanged ? 1 : 3;

    if ( !SSG.isImgLocked ) {
        SSG.isImgLocked = true;
        window.setTimeout( SSG.countResize, 600 / fraction );
        // Timeout gives browser time to fully render page. RefreshFormat changes image sizes, it has to run before refreshPos.
        window.setTimeout( SSG.refreshFormat, 690 / fraction );
        window.setTimeout( SSG.refreshPos, 1110 / fraction );
        window.setTimeout( SSG.scrollToActualImg, 1200 / fraction );
    }
};

SSG.displayFormat = function ( e ) {
    var index = e.data.imgid;
    var imgHeight = jQuery( '#SSG1 #i' + index ).innerHeight();
    var imgWidth = jQuery( '#SSG1 #i' + index ).innerWidth();    
    var imgRatio = imgWidth / imgHeight;
    var vwidth = jQuery( window ).width();
    var vheight = jQuery( window ).height();
    var photoFrameWidth = 0.8;
    if ( vwidth > 1333 ) {
        photoFrameWidth = 0.85;
    }
    var titleSideRatio = ( vwidth * photoFrameWidth ) / (vheight*0.97);
    var tooNarrow = (vwidth * photoFrameWidth > imgWidth * 1.38);
    var preferSideCaption = tooNarrow && SSG.cfgFused.sideCaptionforSmallerLandscapeImg;
    var balanceShift = SSG.smallScreen ? -7 : 4;

    
    // if caption frame is smaller than screen Height, overflow is set to visible due to social sharing menu.
    window.setTimeout( function() {
        if ( jQuery('#SSG1 #uwp'+ index).outerHeight() < SSG.scrHeight * 0.9) {
            jQuery('#SSG1 #uwp'+ index).addClass('share-overflow');
        } else {
            jQuery('#SSG1 #uwp'+ index).removeClass('share-overflow');
        }
    }, 666);
    
//    console.log(SSG.getName(SSG.imgs[index].href) + '  ' +  ((imgRatio - titleSideRatio) * 100));

    if ( ((imgRatio - titleSideRatio) * 100 ) + balanceShift < 0 || preferSideCaption ) {
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
SSG.onImageLoad = function ( event ) {

    // Index of the newest loaded image
    SSG.justLoadedImg = event.data.imgid;
    SSG.displayFormat( event );

    // When img is loaded positions of images are recalculated.
    SSG.refreshPos();

    // It secures to run addImage only once after image is loaded.
    SSG.loadNextImg = true;
};


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


SSG.addImage = function () { 


    // Newone is index of a image which will be load.
    var newOne = SSG.justLoadedImg + 1;

    if ( newOne < SSG.imgs.length ) {

        var author = SSG.imgs[ newOne ].author ? "<em>" + SSG.imgs[ newOne ].author + "</em>" : '';
        var authorbr = author ? "<br>" + author : author;
        var caption =  SSG.imgs[ newOne ].alt ?  SSG.imgs[ newOne ].alt : '';        

        if (SSG.cfgFused.socialShare) {
        var urlToShare = window.location.href.split("#")[0] + '#' + SSG.getName(SSG.imgs[ newOne ].href);
        var urlToShareEnc = encodeURIComponent(urlToShare);
        var h1ToShare = SSG.escapeHtml(jQuery('h1').first().text());
        var captionToShare = SSG.escapeHtml(caption);
        var textToShareEnc =  SSG.escapeHtml(encodeURIComponent( jQuery('h1').first().text() + ' - ' + caption ));
        var windowOpen = ' target="_blank" href="';
        var WindoOpenParams =  '" ';
     
        var shareMenu = "<span class='share'><span class='share-menu'>" +
                "<a class='linkedin' " + windowOpen + "https://www.linkedin.com/shareArticle?mini=true&url=" + urlToShareEnc + WindoOpenParams + "></a>" + 
                "<a class='whatsapp'  " + windowOpen + "https://wa.me/?text=" + urlToShareEnc + " - " + textToShareEnc + WindoOpenParams + "></a>" + 
                "<a class='mess' " + windowOpen + "fb-messenger://share/?link=" + urlToShareEnc + WindoOpenParams + "></a>" + 
                "<a class='reddit' " + windowOpen + "https://www.reddit.com/submit?url=" + urlToShareEnc + "&title=" + textToShareEnc + WindoOpenParams + "></a>" + 
                "<a class='link' onclick='SSG.showFsTip(\"" + urlToShare + "\")'></a>" +
                "<a class='tweet' " + windowOpen + "http://twitter.com/share?text=" + textToShareEnc + "&url=" + urlToShareEnc + WindoOpenParams + "></a>" + 
                "<a class='pin' " + windowOpen + "http://www.pinterest.com/pin/create/button/?url="+ urlToShareEnc + "&amp;media=" + 
                SSG.imgs[ newOne ].href + "&amp;description=" + textToShareEnc + WindoOpenParams + "></a>" +
                "<a class='email' href='mailto:?subject=" + h1ToShare + "&body=" +  h1ToShare + ' - ' + captionToShare + " " + urlToShare + "' ><b>@</b></a>" +
                "<a class='FB' " + windowOpen + "http://www.facebook.com/sharer/sharer.php?u=" + urlToShareEnc + WindoOpenParams + "></a>" + 
                "</span><a class='ico'></a></span>";
        } else {
            shareMenu ='';
        }

        var uwCaption = '';
        var titleClass = 'title';
        if ( !SSG.imgs[ newOne ].alt && !SSG.imgs[ newOne ].author ) {
            titleClass = 'notitle';
        } else if (!SSG.imgs[ newOne ].alt && SSG.imgs[ newOne ].author) {
            titleClass = 'title author-only';
        } else if ( SSG.imgs[ newOne ].author ) {
            titleClass = 'title author';
        }

        //  Condition NewOne == 0 leaves P tag for the "down arrow" if there is no alt text.
        if ( SSG.imgs[ newOne ].alt || newOne == 0 || SSG.imgs[ newOne ].author ) {
            uwCaption = "<p class='uwtitle' id='uwp" + newOne + "'>" + caption + shareMenu + authorbr + "</p>";
        }
        var imgWrap = "<div class='SSG_imgWrap'><span class='SSG_forlogo'><img id='i" +
            newOne + "' src='" + SSG.imgs[ newOne ].href + "'><span class='SSG_logo' style='" + SSG.watermarkStyle + "'>" +
             SSG.cfgFused.watermarkText +"</span>"+ shareMenu +"</span></div>";
        var caption = "<p class='title' id='p" + newOne + "'><span>" + caption + author + shareMenu + "</span></p>";
                
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

        //onclick for share menu 
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

    // NewOne is now actually by +1 larger than array index. 
    if ( newOne == SSG.imgs.length ) {
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

        // All images are already loaded.
        SSG.finito = true;
    }

    // Append a little help to the first image.
    if ( newOne == 0 ) {
        jQuery( '#SSG1 #p0' ).append( '<a class="SSG_tipCall">&nbsp;</a>' );
        jQuery( '#SSG1 #uwp0' ).append( '<span class="SSG_tipPlace"><a class="SSG_tipCall">&nbsp;</a></span>' );
        SSG.cfgFused.showLandscapeHint && jQuery( '#SSG1 #f0').after("<div class='golandscape'>"+ SSG.cfgFused.landscapeHint +"<div>");
        jQuery( '.SSG_tipCall' ).click( function ( event ) {
            SSG.showFsTip( 'hint' );
            event.stopPropagation();
        } );
    }
};


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

    // Opera browser has unfortunately problem with custom cursor when hash is changing.
    navigator.userAgent.indexOf( 'OPR' ) == -1 && history.replaceState( null, null, SSG.location + hashName );
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
                    SSG.cfgFused.onImgChange && SSG.cfgFused.onImgChange(SSG.createDataObject(j));
                } 
                SSG.displayedImg = j;                
                SSG.imgDelta = 0;
                SSG.atLastone = false;
                break;
            } else if (!SSG.atLastone && treshold > finalPos) {
                SSG.atLastone = true;
                SSG.displayedImg =  SSG.imgs.length - 1;
                SSG.setHashGA( -1 );
                SSG.cfgFused.onSignpost && SSG.cfgFused.onSignpost();
            }
        }
    }

    SSG.actualPos = actual;

    if ( SSG.imageUp || SSG.imageDown || !SSG.isFirstImageCentered ) {
        if ( SSG.landscapeMode && SSG.isFirstImageCentered && !SSG.wasJumpScrollUsed ) {
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
    }

    // If the imageUp is true then scroll on previous image.    
    else if ( SSG.imageUp && SSG.displayedImg - 1 >= 0 && !SSG.atLastone ) {
        SSG.imgDelta = -1;
        SSG.ScrollTo( SSG.imgs[ SSG.displayedImg - 1 ].pos - SSG.countImageIndent( SSG.displayedImg - 1 ), -bigImage );
    }

    // Center the first image after initiation of the gallery or can be used to jump to the 1st image.
    // Without setTimeout someb browsers aren't able to completely center the image.
    else if ( SSG.imgs[ 0 ].pos && !SSG.isFirstImageCentered ) {
        window.setTimeout( function () {
            SSG.ScrollTo( SSG.imgs[ 0 ].pos - SSG.countImageIndent( 0 ), 0 );
            SSG.isFirstImageCentered = true;
        }, 100 );
    }

    // If the lastone is true, i am out of the index, so scroll on the last image in index.
    else if ( SSG.imageUp && SSG.atLastone ) {
        SSG.ScrollTo( SSG.imgs[ SSG.displayedImg ].pos - SSG.countImageIndent( SSG.displayedImg ), 0 );
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
    var screen = jQuery( window ).height();
    var img = jQuery( '#SSG1 #i' + index ).outerHeight();
    var pIn = jQuery( '#SSG1 #p' + index ).innerHeight();    
    var centerPos, marginAfterP;

    // get previous index unless index = 0
    var useIndex = index == 0 ? 0 : index-1;

    // if a title is under and image
    if ( jQuery( '#SSG1 #f' + useIndex ).hasClass('title') &&  !jQuery( '#SSG1 #f' + useIndex ).hasClass('SSG_uwide') ) {
        marginAfterP = parseInt(jQuery( '#SSG1 #p' + useIndex ).css('marginBottom'));
    }  
    else {
        marginAfterP = jQuery( '#SSG1 #p' + ( useIndex ) ).outerHeight( true ) - jQuery( '#SSG1 #p' + ( useIndex ) ).innerHeight();
    }    
     
    if ( jQuery( '#SSG1 #f' + index ).hasClass('title') &&  !jQuery( '#SSG1 #f' + index ).hasClass('SSG_uwide') ) {
        centerPos = Math.round( ( screen - ( img + pIn + parseInt(jQuery( '#SSG1 #p' + index ).css('marginTop')) ) ) / 2 );
    } else {
        centerPos = Math.round( ( screen - ( img + pIn ) ) / 2 ) + 1;
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
    data.imgGalleryId = imgIndex;
    data.imgPageId = SSG.imgs[imgIndex].id ? SSG.imgs[imgIndex].id : -1;
    data.imgPath = SSG.imgs[imgIndex].href;
    data.imgName =  SSG.getName(data.imgPath);
    data.imageCaption = SSG.imgs[imgIndex].alt;
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
    SSG.run(config);
}

SSG.destroyGallery = function (mode) {
    if ( SSG.loadingStopped && mode != 'restart' ) {        
        if (mode == 'hashlink') {            
            window.location.reload();
        } else {
            window.location.href = window.location.href.substring( 0, window.location.href.lastIndexOf('#') );
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
    window.removeEventListener( 'orientationchange', SSG.orientationChanged );
    if ( window.screen.orientation ) {
        window.screen.orientation.removeEventListener( 'change', SSG.orientationChanged );
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
        if ( SSG.inFullscreenMode ) {
            window.setTimeout( function () {
                window.scrollTo( 0, restoredPos );
            }, 200 );
        } else {
            window.scrollTo( 0, restoredPos );
        }
    }

    jQuery( '#SSG_bg, #SSG1, #SSG_exit, #SSG_lastone, #SSG_tip' ).remove();
    jQuery( 'html' ).removeClass( 'ssg-active' );
    jQuery( "meta[name='viewport']" ).attr( 'content', SSG.viewport );
    jQuery( "meta[name='theme-color']" ).attr( 'content', SSG.themeColor ? SSG.themeColor : '' );

    if( SSG.inFullscreenMode &&  mode != 'restart' ) {
         SSG.closeFullscreen(); }
    SSG.running = false;
    SSG.cfgFused.onGalleryExit && SSG.cfgFused.onGalleryExit(SSG.atLastone ? null : SSG.createDataObject( SSG.displayedImg));
};

SSG.showFsTip = function ( content ) {
    if ( jQuery( '#SSG_tip' ).length == 0 ) {
        var begin = "<div id='SSG_tip'><span class='" + (content.length > 8 ? 'linkShare' : content) + "'><div id='SSG_tipClose'>&times;</div>";
        var end = "</span></div>";
        var fs =  SSG.cfgFused.hintFS + "<br>";
        var gofs = function() {
            SSG.openFullscreen();
            jQuery( '#SSG_tip' ).remove();
        }

        if ( content == 'fsOffer' ) {
            jQuery( 'body' ).append( begin + fs + end );
            jQuery( '#SSG_tip' ).click( gofs );
        } else if (content.length > 8) {
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
