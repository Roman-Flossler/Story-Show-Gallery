//   Story Show Gallery (SSG) ver: 2.6.4
//   Copyright (C) 2018 Roman Flössler - flor@flor.cz
//
//   Try Story Show Gallery at - https://ssg.flor.cz/
//   SSG on Github: https://github.com/Roman-Flossler/Simple-Scroll-Gallery.git
//
//   This Source Code Form is subject to the terms of the Mozilla Public
//   License, v. 2.0. If a copy of the MPL was not distributed with this
//   file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
//   There is one exception from license:
//   Distributing Story Show Gallery within a Wordpress plugin or theme 
//   is only allowed for the author of Story Show Gallery.


// Main object - namespace - the only global variable
var SSG = {};
SSG.cfg = {};

// ---------------------- ⚙️⚙️⚙️ Story Show Gallery CONFIGURATION ⚙️⚙️⚙️ ---------------------------

// duration of scroll animation in miliseconds. Set to 0 for no scroll animation.
SSG.cfg.scrollDuration = 500;

// Force SSG to always display in fullscreen - true/false
SSG.cfg.alwaysFullscreen = false;

// Force SSG to never display in fullscreen - true/false
SSG.cfg.neverFullscreen = false;

// URL of the HTML file to load behind the gallery (usually a signpost to other galleries). Set to null if you don't want it.
SSG.cfg.fileToLoad = 'ssg-loaded.html';   // URL is relative to parent HTML file, it's safer to use absolute path https://...

// log image views into Google Analytics - true/false. SSG supports only ga.js tracking code.
SSG.cfg.logIntoGA = true;

// Protect photos from being copied via right click menu - true/false
SSG.cfg.rightClickProtection = true;

// Side caption for smaller, landscape oriented photos, where is enough space below them as well as on their side. true/false
SSG.cfg.sideCaptionforSmallerLandscapeImg = false;  // false means caption below
// in other cases caption position depends on photo size vs. screen size.

// Here you can translate SSG into other language. Leave tags <> and "" as they are.
SSG.cfg.hint1 = "Browse through Story Show Gallery by:";
SSG.cfg.hint2 = "a mouse wheel <strong>⊚</strong> or arrow keys <strong>↓→↑←</strong>";
SSG.cfg.hint3 = "or <strong>TAP</strong> on the bottom (top) of the screen";
SSG.cfg.hintTouch = "<strong>TAP</strong> on the bottom (top) of the screen<br> to browse through Story Show Gallery.";
SSG.cfg.hintFS = "For a better experience <br><a>click for fullscreen mode</a>"
SSG.cfg.toTheTop = "Scroll to top";
SSG.cfg.exitLink = "Exit the Gallery";

// in the portrait mode the gallery suggest to turn phone into landscape mode
SSG.cfg.showLandscapeHint = true;
SSG.cfg.landscapeHint = 'photos look better in landscape mode <span>😉</span>';

// -------------- end of configuration ----------------------------------------



// get a collection of all anchor tags from the page, which links to an image
SSG.jQueryImgSelector = "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.PNG'],a[href$='.gif'],a[href$='.GIF']";
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
    SSG.initEvent = event;
    SSG.setVariables();
    
    // Adding meta tags for mobile browsers to maximize viewport and dye an address bar into the dark color
    jQuery( "meta[name='viewport']" ).attr( 'content', 'initial-scale=1, viewport-fit=cover' );
    if ( SSG.themeColor ) {
        jQuery( "meta[name='theme-color']" ).attr( 'content', '#131313' );
    } else {
        jQuery( 'head' ).append( "<meta name='theme-color' content='#131313'>" );
    }
    jQuery( 'body' ).append( "<div id='SSG_galBg'><b>&#xA420;</b> Story Show Gallery</div>" );

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
    SSG.loaded = -1;

    // Index of the image displayed in the viewport
    SSG.displayed = -1;

    // Index of the image displayed in the viewport before the screen resize (orientation change)
    SSG.displayedLock = 0;

    // if set to true displayedLock isn't being refreshed
    SSG.isDisplayedLocked = false;

    // change of currently displayed photo. delta -1 is a previous photo.  
    SSG.delta = 1;

    // Intial and actual vertical scroll of a page.    
    SSG.originalPos = window.pageYOffset || document.documentElement.scrollTop;    
    SSG.actualPos = SSG.originalPos;
    SSG.scrHeight = jQuery( window ).height();    

    // Different screen fraction for different screen aspect ratios
    SSG.scrFraction = ( jQuery( window ).width() / SSG.scrHeight >= 1 ) ? 2 : 3.5;

    // If a user wants the next photo.
    SSG.imageDown = false;

    // If a user wants the previous photo.
    SSG.imageUp = false;

    // If the first image is already centered .
    SSG.firstImageCentered = false;

    // If fullscreen mode is active.
    SSG.fullscreenMode = false;

    // if a browser supports fs mode
    SSG.fullScreenSupport = true;

    // if true it will show an offer of fs mode
    SSG.fullscreenModeWanted = false;

    // True right after entering FS mode, it tells that next onFSchange will be the exit.
    SSG.exitFullscreen = false;

    // If all images are loaded,
    SSG.finito = false;

    // If it was scrolled to the the bottom menu - the last element in the gallery.
    SSG.lastone = false;

    // Set to true when a user clicks the exit button, prevents call SSG.destroyGallery twice.
    SSG.exitClicked = false;

    // If the exitMode is true a user can exit the gallery.
    SSG.exitMode = true;

    // When the img is loaded loadnext is set true.
    SSG.loadNext = false;

    // initial value for scroll event time stamp
    SSG.savedTimeStamp = 0;

    // If a user use jump scroll. Due to showing the tip window on touchmove event
    SSG.jumpScrollUsed = false;

    // prevents to load a next image while animated jump scroll is performed
    SSG.jumpScrolling = false;

    // If the tip window was shown
    SSG.fsTipShown = false;

    // if the gallery is already created, prevents to create the gallery again
    SSG.isGalleryCreated = false;

    // if a user turn a phone around. Landscape mode activates fullscreen mode (as on YouTube)
    SSG.isOrientationChanged = false;
    
    SSG.location = window.location.href.split( '#', 1 )[ 0 ];
    SSG.viewport = jQuery( "meta[name='viewport']" ).attr( 'content' );
    SSG.themeColor = jQuery( "meta[name='theme-color']" ).attr( 'content' );
    SSG.landscapeMode = window.matchMedia( '(orientation: landscape)' ).matches;
    SSG.landscapeModeOriginal = SSG.landscapeMode;
};

// Searching for the first image which match the hash in URL.
SSG.getHash = function ( justResult ) {


    // these variables are needed before the gallery is running
    SSG.isMobile = window.matchMedia( '(max-width: 900px) and (orientation: landscape), (max-width: 500px) and (orientation: portrait) ' ).matches;
    var userAgent = navigator.userAgent.toLowerCase();
    SSG.isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);

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
            SSG.run( {
                fsa: SSG.hasClass( allimgs[findex].classList, 'fs' ) || SSG.isTablet || SSG.isMobile,
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
            SSG.showFsTip( true );
        }, 600 );
    } );

    var mobileLandscape = window.matchMedia( '(max-width: 900px) and (orientation: landscape)' ).matches;
    var mobilePortrait = window.matchMedia( '(max-width: 500px) and (orientation: portrait) ' ).matches;

    // event.fs and event.fsa isn't a browser's object. MobileLandscape and isTablet goes everytime in FS, it solves problems with mobile browsers
    if (SSG.cfg.alwaysFullscreen) {
        SSG.openFullscreen();
    } else if ( mobilePortrait || SSG.cfg.neverFullscreen ) {
        SSG.createGallery( SSG.initEvent );
    } else if ( event && event.fsa ) {
        SSG.createGallery( SSG.initEvent );
        SSG.fullscreenModeWanted = true;
    } else if ( mobileLandscape || SSG.isTablet || ( event && event.fs ) ) {
        SSG.openFullscreen();
    } else if ( ( event && event.currentTarget ) && ( SSG.hasClass( event.currentTarget.classList, 'fs' ) ) && !event.altKey ) {
        SSG.openFullscreen();
    } else {
        // if no FS mode is wanted, call createGallery directly
        SSG.createGallery( SSG.initEvent );
    }

    // if a browser is already in FS mode
    if( document.fullscreenElement ) {
        SSG.fullscreenMode = true;
    }

    // if a browser doesn't support FS mode
    var elem = document.documentElement;
    if ( ( !elem.requestFullscreen && !elem.mozRequestFullScreen && !elem.webkitRequestFullscreen ) || document.fullscreenEnabled === false ) {
        SSG.createGallery( SSG.initEvent );
        SSG.fullScreenSupport = false;
    }

    // for browsers which don't have fully implemented FS API and when the
    // gallery goes into FS without a user's click, there is no fullscreenerror event 
    if ( typeof document.fullscreenEnabled == 'undefined') {
        window.setTimeout( function () {
            SSG.createGallery( SSG.initEvent );
        }, 1333 );
    }    

    if ( !SSG.fullscreenMode && SSG.fullscreenModeWanted && SSG.fullScreenSupport ) {
        window.setTimeout( function () {
            // It shows an offer of FS mode.    
            SSG.showFsTip( true );
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
        

    } else {
        // use just images on the page
        SSG.getImgList( event );
    }

    SSG.addImage();

    // Every 333 ms check if more images should be loaded and logged into Analytics. Jump-scrolling
    SSG.metronomInterval = setInterval( SSG.metronome, 333 );
};

SSG.initGallery = function ( event ) {

    if ( event && event.noExit ) {
        SSG.exitMode = false;
    }
    window.scrollTo( 0, 0 );

    // Append gallery's HTML tags
    jQuery( 'body' ).append( "<div id='SSG_gallery'></div>" );
    SSG.setNotchRight();
    SSG.exitMode && jQuery( 'body' ).append( "<div id='SSG_exit'></div>" );

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
    jQuery( '#SSG_exit' ).click( function () {
        SSG.exitClicked = true;
        SSG.destroyGallery();
    } );
    jQuery( '#SSG_gallery' ).click( SSG.touchScroll );

    // passive:false is due to Chrome, it sets the mousewheel event as passive:true by default and then preventDefault cannot be used
    document.addEventListener( 'mousewheel', SSG.seizeScrolling, {
        passive: false, capture: true
    } );
    document.addEventListener( 'DOMMouseScroll', SSG.seizeScrolling, {
        passive: false, capture: true
    } );
    !SSG.isMobile && jQuery( window ).resize( SSG.onResize );    
    SSG.cfg.rightClickProtection && jQuery( '#SSG_gallery, #SSG_exit' ).on( "contextmenu", function ( event ) {
        event.preventDefault();
        SSG.showFsTip( false );
    } );
    if ( SSG.isMobile ) {

        // for android devices    
        if ( window.screen.orientation ) {
            window.screen.orientation.addEventListener( 'change', SSG.orientationChanged );
            // for Safari, on android it is unreliable
        } else {
            window.addEventListener( 'orientationchange', SSG.orientationChanged );
        }
    }

    // if a user wants to touch scroll to next photo, the tip window shows that there is a better way    
    jQuery( document ).on( 'touchmove', function badTouchMove() {
        if ( SSG.landscapeMode && !SSG.jumpScrollUsed && !SSG.fsTipShown && SSG.running ) {
            SSG.showFsTip( false );
            jQuery( document ).off( 'touchmove', badTouchMove );
        }
    } );
};

SSG.orientationChanged = function () {
    SSG.isOrientationChanged = true;    

    // if a portrait mode is in FS mode, turning into landscape won't fire onFS event (gallery resize), so else branch is needed
    if ( SSG.fullScreenSupport && ( (!SSG.landscapeMode && !SSG.fullscreenMode) || (SSG.landscapeMode && SSG.fullscreenMode) ) ) {
        // screen.orientation.type works in Chrome
        if ( window.screen.orientation ) {
            screen.orientation.type.startsWith( 'landscape' ) ? SSG.openFullscreen() : SSG.closeFullscreen();
            // window.orientation works on Mac, on Android tablets it returns different values
        } else if ( window.orientation ) {
            Math.abs( window.orientation ) === 90 ? SSG.openFullscreen() : SSG.closeFullscreen();
        }
    } else {
        SSG.onResize();
    }
    SSG.setNotchRight();
};


SSG.setNotchRight = function () {
    if ( window.screen.orientation ) {
        screen.orientation.type === "landscape-secondary" ?
            jQuery( '#SSG_gallery, #SSG_exit' ).addClass( 'notchright' ) :
            jQuery( '#SSG_gallery, #SSG_exit' ).removeClass( 'notchright' );
    } else if ( window.orientation ) {
        window.orientation === -90 ?
            jQuery( '#SSG_gallery, #SSG_exit' ).addClass( 'notchright' ) :
            jQuery( '#SSG_gallery, #SSG_exit' ).removeClass( 'notchright' );
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
    if ( event.which == 27 && SSG.exitMode ) {
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

        //  If a user click up to third image of the gallery, SSG prefers to show initial images together - e.g. 2,1,3,4,5,6..
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

    // Exitfullscreen is true, that means than FS mode is ending
    if ( SSG.fullscreenMode && SSG.exitFullscreen && !SSG.exitClicked ) {
        SSG.fullscreenMode = false;
        SSG.exitFullscreen = false;
        if ( SSG.isOrientationChanged ) {
            SSG.isOrientationChanged = false;
            return;
        }
        // Destroys gallery on exit from FS or removes exit icon.
        SSG.exitMode ? SSG.destroyGallery() : jQuery( '#SSG_exit' ).remove();

    // browser was just turned into FS
    } else if ( !SSG.exitFullscreen ) {
        if ( !SSG.isGalleryCreated ) {
            SSG.createGallery( SSG.initEvent );
        }
        SSG.exitFullscreen = true;
        SSG.fullscreenMode = true;

        if ( !SSG.exitMode && !SSG.isMobile ) {
            jQuery( 'body' ).append( "<div id='SSG_exit'></div>" );

            // It fires onFS func and removes the Exit button & set all booleans.
            jQuery( '#SSG_exit' ).click( SSG.closeFullscreen );
        }
    }
};


// Recalculates all loaded images positions after new image is loaded    
SSG.refreshPos = function () {
    if ( !SSG.running ) {
        return;
    }
    for ( var i = 0; i <= SSG.loaded; i++ ) {
        SSG.imgs[ i ].pos = Math.round( jQuery( '#i' + i ).offset().top );
    }
};

// Recounts variables on resize event
SSG.countResize = function () {
    SSG.scrHeight = jQuery( window ).height();
    SSG.scrFraction = ( jQuery( window ).width() / SSG.scrHeight >= 1 ) ? 2 : 3.5;
    SSG.landscapeMode = window.matchMedia( '(orientation: landscape)' ).matches;
};

SSG.scrollToActualImg = function () {
    if ( !SSG.running ) {
        return;
    }
    SSG.isDisplayedLocked = false;
    if ( SSG.loaded != -1 && ( typeof SSG.imgs[ SSG.displayedLock ] != 'undefined' ) ) {
        SSG.ScrollTo( SSG.imgs[ SSG.displayedLock ].pos - SSG.countImageIndent( SSG.displayedLock ) );
    }
};

// Recalculates all image format classes
SSG.refreshFormat = function () {
    for ( var i = 0; i <= SSG.loaded; i++ ) {
        SSG.displayFormat( {
            data: {
                imgid: i
            }
        } );
    }
};

SSG.onResize = function () {
    // negative displayedLock holds the index of the last displayed image before onresize event.
    // onresize event can fire several times, so re-countiong the gallery is conditioned by isDisplayedLocked
    var fraction = SSG.isOrientationChanged ? 1 : 0.4;

    if ( !SSG.isDisplayedLocked ) {
        SSG.isDisplayedLocked = true;
        window.setTimeout( SSG.countResize, 580 * fraction );
        // Timeout gives browser time to fully render page. RefreshFormat changes image sizes, it has to run before refreshPos.
        window.setTimeout( SSG.refreshFormat, 660 * fraction );
        window.setTimeout( SSG.refreshPos, 960 * fraction );
        window.setTimeout( SSG.scrollToActualImg, 1000 * fraction );
    }
};

SSG.displayFormat = function ( e ) {
    var index = e.data.imgid;
    var imgHeight = jQuery( '#i' + index ).innerHeight();
    var imgWidth = jQuery( '#i' + index ).innerWidth();
    var titleHeight = jQuery( '#i' + index ).outerHeight( true ) - imgHeight + jQuery( '#p' + index ).innerHeight();
    var imgRatio = imgWidth / imgHeight;
    var vwidth = jQuery( window ).width();
    var vheight = jQuery( window ).height();
    var photoFrameWidth = 0.8;
    if ( vwidth > 1333 ) {
        photoFrameWidth = 0.85;
    }
    var titleUnderRatio = vwidth / ( vheight - titleHeight );
    var titleSideRatio = ( vwidth * photoFrameWidth ) / vheight;
    var tooNarrow = vwidth * photoFrameWidth > imgWidth * 1.38;

    // sideCaptionforSmallerLandscapeImg would disable side captions completely, so there are two conditions, which allow side captions
    // Portrait mode condition is important for removing SSG_uwide class when the gallery is switched into portrait mode
    if ( SSG.cfg.sideCaptionforSmallerLandscapeImg || vheight < imgHeight * 1.2 ||  imgHeight >= imgWidth || !SSG.landscapeMode ) {
        if ( ( Math.abs( imgRatio - titleUnderRatio ) - 0.36 > Math.abs( imgRatio - titleSideRatio ) ) || tooNarrow ) {
            jQuery( '#f' + index ).addClass( 'SSG_uwide' );
        } else {
            jQuery( '#f' + index ).removeClass( 'SSG_uwide' );
        }

        // If the photo is too narrow shift the caption towards the photo.
        if ( tooNarrow ) {
            jQuery( '#f' + index ).addClass( 'SSG_captionShift' );
        } else {
            jQuery( '#f' + index ).removeClass( 'SSG_captionShift' );
        }
    }
};


// A callback function when an image is loaded.
SSG.onImageLoad = function ( event ) {

    // Index of the newest loaded image
    SSG.loaded = event.data.imgid;
    SSG.displayFormat( event );

    // When img is loaded positions of images are recalculated.
    SSG.refreshPos();

    // It secures to run addImage only once after image is loaded.
    SSG.loadNext = true;
};


// A callback function when an image cannot be loaded.
SSG.onLoadError = function ( event ) {
    // Image "Eror loading image" in base 64 encoding
    var ip1 = 'data:image/gif;base64,R0lGODlhUQAKAIABADVsagAAACH5BAEAAAEALAAAAABRAAoAAAJkjI+py+0PYwQyUCpx3bNqDiIANlpkaYr';
    var ip2 = 'GqKHm9R5scrHujZaktfb9x2updrCgT8ZLfopMm/JYRApjxOdu6DsxX65n0oj9iY3V77i8XV5bOdoKpwXHw+ucPYTv5M37vqjLMZNQAAA7';
    jQuery( '#i' + event.data.imgid ).attr( 'src', ip1 + ip2 );
    jQuery( '#uwb' + event.data.imgid ).addClass( 'serror' );
    SSG.onImageLoad( event );
};

SSG.addImage = function () {

    // Newone is index of a image which will be load.
    var newOne = SSG.loaded + 1;

    if ( newOne < SSG.imgs.length ) {
        var noTitle = '';
        var uwCaption = '';
        if ( !SSG.imgs[ newOne ].alt ) {
            noTitle = 'notitle';
        }

        //  Condition NewOne == 0 leaves P tag for the "next photo" link if there is no alt text.
        if ( SSG.imgs[ newOne ].alt || newOne == 0 ) {
            uwCaption = "<p class='uwtitle' id='uwp" + newOne + "'>" + SSG.imgs[ newOne ].alt + "</p>";
        }
        var imgWrap = "<div class='SSG_imgWrap'><span class='SSG_forlogo'><img id='i" +
            newOne + "' src='" + SSG.imgs[ newOne ].href + "'><span class='SSG_logo'></span></span></div>";
        var caption = "<p class='title' id='p" + newOne + "'><span>" + SSG.imgs[ newOne ].alt + "</span></p>";
        
        img = new Image();
        img.src = SSG.imgs[ newOne ].href;
        // decoding the image just after loading, image is completly ready to render, it makes scroll animation more fluent
        // img.decode isn't supported by older browsers (IE11, Edge)
        if (img.decode) {
            img.decode().catch( function() { console.log('no image to decode') } );
        }
        jQuery( "#SSG_gallery" ).append( "<figure id='f" + newOne + "' class='" + noTitle + "'><div id='uwb" +
            newOne + "' class='SSG_uwBlock'>" + uwCaption + imgWrap + "</div>" + caption + "</figure>" );
        
        // it would be better to bind onImageLoad and onLoadError to img.decode, but older browsers :(
        // Imgid is an argument passed into SSG.onImageLoad.
        jQuery( '#i' + newOne ).on( 'load', {
            imgid: newOne
        }, SSG.onImageLoad );
        jQuery( '#i' + newOne ).on( 'error', {
            imgid: newOne
        }, SSG.onLoadError );
    }

    // NewOne is now actually by +1 larger than array index. 
    if ( newOne == SSG.imgs.length ) {
        var menuItem1 = "<a id='SSG_first' class='SSG_link'><span>&nbsp;</span> " + SSG.cfg.toTheTop + "</a>";
        var menuItem2 = SSG.exitMode ? "<a id='SSG_exit2' class='SSG_link'>&times; " + SSG.cfg.exitLink + "</a>" : "";
        var menuItem3 = "<a id='SSGL' target='_blank' href='https://ssg.flor.cz/wordpress/' class='SSG_link'><b>&#xA420;</b>SSG</a>";
        jQuery( '#SSG_gallery' ).append( "<div id='SSG_lastone'> <p id='SSG_menu'>" + menuItem1 + menuItem2 + menuItem3 +
            "</p> <div id='SSG_loadInto'></div></div>" );
        jQuery( '#SSG_menu' ).click( function ( event ) {
            event.stopPropagation();
        } );
        jQuery( '#SSG_exit2' ).click( function () {
            SSG.exitClicked = true;
            SSG.destroyGallery();
        } );
        jQuery( '#SSG_first' ).click( function () {
            SSG.firstImageCentered = false;
        } );

        // Load a html file with links to other galleries.
        SSG.cfg.fileToLoad && jQuery( '#SSG_loadInto' ).load( SSG.cfg.fileToLoad, function ( response, status, xhr ) {
            if ( status == "success" ) {
                SSG.fileLoaded = true;
                jQuery( '.SSG_icell' ).click( function ( event ) {
                    event.stopPropagation();
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
        jQuery( '#p0' ).append( '<a class="SSG_tipCall">&nbsp;</a>' );
        jQuery( '#uwp0' ).append( '<span><a class="SSG_tipCall">&nbsp;</a></span>' );
        SSG.cfg.showLandscapeHint && jQuery( '#f0').after("<div class='golandscape'>"+ SSG.cfg.landscapeHint +"<div>");
        jQuery( '.SSG_tipCall' ).click( function ( event ) {
            SSG.showFsTip( false );
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
    if (SSG.cfg.logIntoGA && typeof ga == 'function' ) {
        ga( 'send', 'pageview', '/img' + location.pathname + hashName );        
    }
    if ( hashName == '#signpost' ) {
        hashName = '';
    }

    // Opera browser has unfortunately problem with custom cursor when hash is changing.
    navigator.userAgent.indexOf( 'OPR' ) == -1 && history.replaceState( null, null, SSG.location + hashName );
};

SSG.metronome = function () {
    if ( !SSG.isDisplayedLocked && SSG.displayed >= 0 ) {
        SSG.displayedLock = SSG.displayed;
    }
    // Actual offset from top of the page
    var actual = window.pageYOffset || document.documentElement.scrollTop;

    // Loadnext is true only when the next image should be loaded. SSG.jumpScrolling prevents to start loading an image in the middle of animation
    // SSG.loaded is set to -1 before the first image is loaded. 
    if ( SSG.loadNext && !SSG.jumpScrolling && SSG.loaded != -1 && !SSG.finito ) {

        // The newest loaded image offset from top of the page.
        var Faraway = SSG.imgs[ SSG.loaded ].pos;        
        if ( Faraway - actual < SSG.scrHeight * 2 ) {

            // When actual offset is three screen near from faraway gallery loads next image.
            SSG.addImage();
            SSG.loadNext = false;
        }
    }

    // If user is close enough to the last loaded image..
    if ( !SSG.finito && ( SSG.loaded == -1 || ( SSG.imgs[ SSG.loaded ].pos - actual < SSG.scrHeight * 0.5 ) ) ) {
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

        for ( var i = 0; i <= SSG.loaded; i++ ) {

            // j is the new index which begins at SSG.displayed + delta. At first tick of metronome: -1 + 1 = 0
            var j = SSG.displayed + SSG.delta + i;
            if ( j > SSG.loaded ) {
                j = j - SSG.loaded - 1;
            }
            var topPos;
            if ( j < SSG.imgs.length - 1 ) {
                topPos = SSG.imgs[ j + 1 ].pos;
            } else {

                // Get topPos of the last image's bottom
                topPos = SSG.imgs[ j ].pos + SSG.scrHeight;
            }
            
            if ( ( treshold > SSG.imgs[ j ].pos ) && ( treshold < topPos ) ) {
                SSG.displayed != j && SSG.setHashGA( j );
                SSG.displayed = j;
                SSG.delta = 0;
                break;
            }
        }
    }

    SSG.actualPos = actual;

    if ( SSG.imageUp || SSG.imageDown || !SSG.firstImageCentered ) {
        if ( SSG.landscapeMode && SSG.firstImageCentered && !SSG.jumpScrollUsed ) {
            SSG.jumpScrollUsed = true;
        }
        SSG.jumpScroll();
    }
};

SSG.ScrollTo = function ( posY, direction ) {
    SSG.jumpScrolling = true;
    if ( direction ) {
        jQuery( 'figure[id=f' + ( SSG.displayed + direction ) + ']' ).fadeTo( 0, 0 );
        jQuery( 'figure[id=f' + ( SSG.displayed ) + ']' ).fadeTo( SSG.cfg.scrollDuration*0.8, 0 );
    }    
    jQuery( 'html, body' ).animate( { scrollTop: posY }, SSG.cfg.scrollDuration, 'swing', 
                            function() { SSG.jumpScrolling = false; } );
    if ( direction ) {
        jQuery( 'figure[id=f' + ( SSG.displayed + direction ) + ']' ).fadeTo( SSG.cfg.scrollDuration*1.33, 1 );
        jQuery( 'figure[id=f' + ( SSG.displayed ) + ']' ).fadeTo( SSG.cfg.scrollDuration, 1 );
    }
};

SSG.jumpScroll = function () {

    // Function finds out if image is roughly decentered (more than treshold) from ideal center.
    var countDecentering = function () {
        var actual = window.pageYOffset || document.documentElement.scrollTop;
        var indent = SSG.countImageIndent( SSG.displayed );
        var difference = ( actual + indent ) - SSG.imgs[ SSG.displayed ].pos;
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
        if ( SSG.scrHeight * 0.3 < jQuery( '#i' + SSG.displayed ).outerHeight( true ) ) {
            bigImage = 1;
        }
        if ( bigImage == 0 && SSG.imageUp ) {
            bigImage = 1;
        }
        if ( SSG.scrHeight * 0.3 > jQuery( '#i' + ( SSG.displayed - 1 ) ).outerHeight( true ) && SSG.imageUp ) {
            bigImage = 0;
        }
    }


    var isDecentered;
    if ( SSG.displayed != -1 ) {
        isDecentered = countDecentering();
        if ( isDecentered != 0 ) {
            bigImage = 0;
        }
    }

    // If image is roughly decentered down and navigation is down, center image.
    if ( SSG.imageDown && isDecentered == -1 && !SSG.lastone ) {
        SSG.ScrollTo( SSG.imgs[ SSG.displayed ].pos - SSG.countImageIndent( SSG.displayed ), 0 );
    }

    // If image is roughly decentered up and navigation is up, center image.
    else if ( SSG.imageUp && isDecentered == 1 && !SSG.lastone ) {
        SSG.ScrollTo( SSG.imgs[ SSG.displayed ].pos - SSG.countImageIndent( SSG.displayed ), 0 );
    }

    // If the imageDown is true and next image is loaded (pos exists) then scroll down.
    else if ( SSG.imageDown && SSG.displayed + 1 < SSG.imgs.length && SSG.imgs[ SSG.displayed + 1 ].pos ) {
        SSG.ScrollTo( SSG.imgs[ SSG.displayed + 1 ].pos - SSG.countImageIndent( SSG.displayed + 1 ), bigImage );
    }

    // If the imageUp is true then scroll on previous image.    
    else if ( SSG.imageUp && SSG.displayed - 1 >= 0 && !SSG.lastone ) {
        SSG.delta = -1;
        SSG.ScrollTo( SSG.imgs[ SSG.displayed - 1 ].pos - SSG.countImageIndent( SSG.displayed - 1 ), -bigImage );
    }

    // Center the first image after initiation of the gallery or can be used to jump to the 1st image.
    // Without setTimeout someb browsers aren't able to completely center the image.
    else if ( SSG.imgs[ 0 ].pos && !SSG.firstImageCentered ) {
        window.setTimeout( function () {
            SSG.ScrollTo( SSG.imgs[ 0 ].pos - SSG.countImageIndent( 0 ), 0 );
            SSG.firstImageCentered = true;
        }, 100 );
    }

    // If the lastone is true, i am out of the index, so scroll on the last image in index.
    else if ( SSG.imageUp && SSG.lastone ) {
        SSG.ScrollTo( SSG.imgs[ SSG.displayed ].pos - SSG.countImageIndent( SSG.displayed ), 0 );
        SSG.lastone = false;
        SSG.setHashGA( SSG.displayed );
    } else {

        // If the bottom menu exists scroll to it
        if ( typeof jQuery( '#SSG_menu' ).offset() !== 'undefined' ) {
            var menuPosition = SSG.fileLoaded ? SSG.scrHeight / 10 : SSG.scrHeight - SSG.scrHeight / 5;
            SSG.imageDown && jQuery( 'html, body' ).animate( {
                scrollTop: jQuery( '#SSG_menu' ).offset().top - menuPosition
            }, SSG.cfg.scrollDuration, 'swing', function () {
                if ( !SSG.lastone ) {
                    SSG.lastone = true;
                    SSG.setHashGA( -1 );
                }
            } );
        }
    }

    SSG.imageDown = false;
    SSG.imageUp = false;
};


// Function counts how much to indent image from the top of the screen to center image.
SSG.countImageIndent = function ( index ) {
    var screen = jQuery( window ).height();
    var img = jQuery( '#i' + index ).outerHeight( true );
    var pIn = jQuery( '#p' + index ).innerHeight();
    var pOut = jQuery( '#p' + index ).outerHeight( true );
    var pMargin = pOut - pIn;
    var ppMargin;

    // If index > 0 use margin-bottom of previous p tag    
    if ( index > 0 ) {
        ppMargin = jQuery( '#p' + ( index - 1 ) ).outerHeight( true ) - jQuery( '#p' + ( index - 1 ) ).innerHeight();
    } else {
        ppMargin = pMargin;
    }
    var centerPos = Math.round( ( screen - ( img + pIn ) ) / 2 ) + 1;
    if ( centerPos < 0 ) {
        centerPos = ( centerPos * 2 ) - 2;
    }

    // It prevents fraction of previous image appears above centered image.
    return centerPos > ppMargin ? ppMargin : centerPos;
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

SSG.destroyGallery = function () {
    history.replaceState( null, null, SSG.location );
    clearInterval( SSG.metronomInterval );
    if (SSG.cfg.logIntoGA && typeof ga == 'function' ) {
        ga( 'send', 'pageview', location.pathname );
    }
    // DOMMouseScroll event is for FF, mousewheel for other browsers, true (capturing phase) is for IE11
    document.removeEventListener( "mousewheel", SSG.seizeScrolling, false );
    document.removeEventListener( "mousewheel", SSG.seizeScrolling, true );
    document.removeEventListener( "DOMMouseScroll", SSG.seizeScrolling, false );
    jQuery( window ).off( 'resize', SSG.onResize );
    jQuery( document ).off( 'keydown', SSG.keyFunction );
    jQuery( document ).off( 'webkitfullscreenchange mozfullscreenchange fullscreenchange', SSG.onFS );
    window.removeEventListener( 'orientationchange', SSG.orientationChanged );
    if ( window.screen.orientation ) {
        window.screen.orientation.removeEventListener( 'change', SSG.orientationChanged );
    }
    SSG.fullscreenMode && SSG.closeFullscreen();

    var restoredPos;    
    //if orientation has changed, restore a page position on the hyperlink which activated the gallery
    if ( SSG.landscapeMode != SSG.landscapeModeOriginal && SSG.initEvent && SSG.initEvent.currentTarget ) {
        restoredPos = jQuery( 'a[ssgid="' + SSG.initEvent.currentTarget.attributes.ssgid.nodeValue + '"]' ).offset().top - SSG.scrHeight/3;
    }   else {
        restoredPos = SSG.originalPos;
    }

    // Renew an original scroll of a page. SetTimeout solves problem with return from FS, simple scrollTo doesn't work.
    if ( SSG.fullscreenMode ) {
        window.setTimeout( function () {
            window.scrollTo( 0, restoredPos );
        }, 50 );
    } else {
        window.scrollTo( 0, restoredPos );
    }
    SSG.running = false;
    jQuery( '#SSG_galBg, #SSG_gallery, #SSG_exit, #SSG_lastone, #SSG_tip' ).remove();
    jQuery( 'html' ).removeClass( 'ssg-active' );
    jQuery( "meta[name='viewport']" ).attr( 'content', SSG.viewport );
    jQuery( "meta[name='theme-color']" ).attr( 'content', SSG.themeColor ? SSG.themeColor : '' );
};

SSG.showFsTip = function ( justFsOffer ) {
    if ( jQuery( '#SSG_tip' ).length == 0 ) {
        var begin = "<div id='SSG_tip'><span><div id='SSG_tipClose'>&times;</div>";
        var man1 = "<div class='classic'>" + SSG.cfg.hint1 + "<br>" + SSG.cfg.hint2 + "<br>";
        var man2 =  SSG.cfg.hint3 + "</div>";
        var touch = "<div class='touch'>" + SSG.cfg.hintTouch + "</div>";
        var hr = "<hr>";
        var fs =  SSG.cfg.hintFS + "<br>";
        var end = "</span></div>";
        if ( justFsOffer ) {
            jQuery( 'body' ).append( begin + fs + end );
        } else if ( !SSG.fullscreenMode && SSG.fullScreenSupport ) {
            jQuery( 'body' ).append( begin + man1 + man2 + touch + hr + fs + end );
            SSG.fsTipShown = true;
        } else {
            jQuery( 'body' ).append( begin + man1 + man2 + touch + end );
            SSG.fsTipShown = true;
        }
        !SSG.fullscreenMode && jQuery( '#SSG_tip' ).click( function () {
            SSG.openFullscreen();
            jQuery( '#SSG_tip' ).remove();
        } );
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
