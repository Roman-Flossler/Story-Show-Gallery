//   Story Show Gallery (SSG) ver: 2.3.3
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
SSG.jQueryImgSelector = "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.PNG'],a[href$='.gif'],a[href$='.GIF']";

SSG.getJQueryImgCollection = function () {
    SSG.jQueryImgCollection = jQuery( SSG.jQueryImgSelector ).filter( jQuery( 'a:not(.nossg)' ) );
};

SSG.setVariables = function () {

    // Load a HTML file behind the gallery (better to use absolute URL http://), or set SSG.fileToLoad = null; if you don't want it
    SSG.fileToLoad = 'ssg-loaded.html';

    // Array of objects where image attributes are stored
    SSG.imgs = [];

    // Index of the newest loaded image
    SSG.loaded = -1;

    // Index of the image displayed in the viewport
    SSG.displayed = -1;
    
    // Index of the image displayed in the viewport before the screen resize (orientation change)
    SSG.displayedLock = 0;

    // change of currently displayed photo. delta -1 is a previous photo.  
    SSG.delta = 1;

    // It saves an actual vertical scroll of a page.
    SSG.originalPos = window.pageYOffset || document.documentElement.scrollTop;
    SSG.scrHeight = jQuery( window ).height();
    SSG.scrWidth = jQuery( window ).width();

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

    // If fullscreen mode should be activated.
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

    // If the tip window was shown
    SSG.fsTipShown = false;
    
    SSG.location = window.location.href.split( '#', 1 )[ 0 ];
    SSG.viewport = jQuery( "meta[name='viewport']" ).attr( 'content' );    
    SSG.landscapeMode = window.matchMedia( '(orientation: landscape)' ).matches;
};

SSG.initGallery = function initGallery( event ) {

    // Adding meta tags for mobile browsers to maximize viewport and activating dark theme
    jQuery( 'head' ).append( "<meta name='theme-color' content='#131313' id='an-dark'>" );
    jQuery( "meta[name='viewport']" ).attr( 'content', 'initial-scale=1, viewport-fit=cover' );

    if ( event && event.noExit ) {
        SSG.exitMode = false;
    }
    window.scrollTo( 0, 0 );

    // Append gallery's HTML tags
    jQuery( 'body' ).append( "<div id='SSG_galBg'></div><div id='SSG_gallery'></div>" );
    SSG.setNotchRight();
    SSG.exitMode && jQuery( 'body' ).append( "<div id='SSG_exit'></div>" );
    jQuery( 'html' ).addClass( 'ssg' );

    // adding of fs class to all thumbnails in a gallery.
    jQuery( '.gallery a, .wp-block-gallery a' ).filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'fs' );

    // SSG adds Id (ssgid) to all finded images and subID (ssgsid) to all finded images within an each gallery
    SSG.jQueryImgCollection.each( function ( index ) {
        jQuery( this ).attr( 'ssgid', index );
    } );
    jQuery( '.gallery, .wp-block-gallery' ).each( function () {
        jQuery( this ).find( SSG.jQueryImgSelector ).each( function ( index ) {
            jQuery( this ).attr( 'ssgsid', index );
        } );
    } );


    // Adding event listeners
    jQuery( document ).on( 'webkitfullscreenchange mozfullscreenchange fullscreenchange', SSG.onFS );
    jQuery( document ).keydown( SSG.keyFunction );
    jQuery( '#SSG_exit' ).click( function () {
        SSG.exitClicked = true;
        SSG.destroyGallery();
    } );
    jQuery( '#SSG_gallery' ).click( SSG.touchScroll );

    // passive:false is due to Chrome, it sets the mousewheel event as passive:true by default and then preventDefault cannot be used
    document.addEventListener( 'mousewheel', SSG.seizeScrolling, {
        passive: false
    } );
    document.addEventListener( 'DOMMouseScroll', SSG.seizeScrolling, {
        passive: false
    } );
    jQuery( window ).resize( SSG.onResize );
    jQuery('#SSG_gallery, #SSG_exit').on("contextmenu", function(event) {
        event.preventDefault();
        SSG.showFsTip( false );
    });

    // if a user wants to touch scroll to next photo, the tip window shows that there is a better way
    jQuery( document ).on( 'touchmove', function badTouchMove() { 
        if ( SSG.landscapeMode && !SSG.jumpScrollUsed && !SSG.fsTipShown && SSG.running ) {
            SSG.showFsTip( false );
            jQuery( document ).off( 'touchmove', badTouchMove );
        }
    } );

    // Fullscreen mode.
    // If A tag has fs class it sets fullscreen to true. Event is a browser's object.    
    if ( ( event && event.currentTarget ) && ( SSG.hasClass( event.currentTarget.classList, 'fs' ) ) && !event.altKey ) {
        SSG.openFullscreen();

        // In this case event isn't a browser's object.
    } else if ( event && event.fs ) {
        SSG.openFullscreen();
    } else if ( event && event.fsa ) {
        SSG.openFullscreen();
        SSG.fullscreenModeWanted = true;

        // If a user has a small screen - activate FS mode. It also solves the problem with a moving address bar on mobiles.
    } else if ( window.matchMedia( '(max-height: 500px) and (orientation: landscape),' +
            ' (max-width: 500px) and (orientation: portrait) ' ).matches ) {
        SSG.openFullscreen();
    }
    window.setTimeout( function () {
        // It shows offer of FS mode.
        if ( !SSG.fullscreenMode && SSG.fullscreenModeWanted ) {
            SSG.showFsTip( true );
        }
    }, 600 );
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

    var clickedImgID, arrayImgID, clickedImgSubID;
    var obj = {};

    if ( event && event.currentTarget ) {
        clickedImgID = event.currentTarget.attributes.ssgid.nodeValue;
        if ( event.currentTarget.attributes.ssgsid ) {
            clickedImgSubID = event.currentTarget.attributes.ssgsid.nodeValue;
        }
    } else if ( event && typeof event.initImgID != 'undefined' ) {
        clickedImgID = event.initImgID;
        clickedImgSubID = jQuery( 'a[ssgid=' + clickedImgID + ']' ).attr( 'ssgsid' );
    }

    // Call invokes forEach method in the context of jQuery output    
    Array.prototype.forEach.call( SSG.jQueryImgCollection.toArray(), function ( el ) {
        if ( !SSG.hasClass( el.classList, 'gossg' ) || clickedImgID == el.attributes.ssgid.nodeValue ) {
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


// On Fullscreen change, detects if a user ends FS mode
SSG.onFS = function () {
    if ( SSG.fullscreenMode && SSG.exitFullscreen && !SSG.exitClicked ) {
        SSG.fullscreenMode = false;
        SSG.exitFullscreen = false;

        // Destroys gallery on exit from FS or removes exit icon.
        SSG.exitMode ? SSG.destroyGallery() : jQuery( '#SSG_exit' ).remove();

        // Exitfullscreen is set to true when enter FS mode.
    } else if ( !SSG.exitFullscreen ) {

        // entering fs mode fires several onresize event, so refresh format is called after fs mode is completed
        SSG.refreshFormat();
        SSG.exitFullscreen = true;
        SSG.fullscreenMode = true;
        if ( !SSG.exitMode ) {
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

SSG.setNotchRight = function () {
    // screen.orientation.type works in Chrome
    if ( screen.orientation ) {
        if ( screen.orientation.type === "landscape-secondary" ) {
            jQuery( '#SSG_gallery, #SSG_exit' ).addClass( 'notchright' );
        } else {
            jQuery( '#SSG_gallery, #SSG_exit' ).removeClass( 'notchright' );
        }

        // window.orientation works on Mac, on Android tablets it returns different values
    } else if ( window.orientation ) {
        if ( window.orientation === -90 ) {
            jQuery( '#SSG_gallery, #SSG_exit' ).addClass( 'notchright' );
        } else {
            jQuery( '#SSG_gallery, #SSG_exit' ).removeClass( 'notchright' );
        }
    }
};

// Recounts variables on resize event
SSG.countResize = function () { 
    SSG.scrHeight = jQuery( window ).height();
    SSG.scrWidth = jQuery( window ).width();
    SSG.scrFraction = ( jQuery( window ).width() / SSG.scrHeight >= 1 ) ? 2 : 3.5;
    SSG.landscapeMode = window.matchMedia( '(orientation: landscape)' ).matches;
};

SSG.scrollToActualImg = function () {
    if ( !SSG.running ) {
        return;
    }
    if ( SSG.loaded != -1 && ( typeof SSG.imgs[ SSG.displayed ] != 'undefined' ) ) {        
        SSG.ScrollTo( SSG.imgs[ SSG.displayedLock ].pos - SSG.countImageIndent( SSG.displayed ) );
    }
}

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
    // console.log(SSG.scrWidth + 'x' + SSG.scrHeight + ' >> ' + jQuery( window ).width() + 'x' + jQuery( window ).height() + 'loaded:' + SSG.loaded);
    // Samsung browser fires resize event even when the resolution didn't change
    if ( jQuery( window ).width() != SSG.scrWidth || jQuery( window ).height() != SSG.scrHeight ) {    
        SSG.displayedLock = SSG.displayed;
        window.setTimeout( SSG.countResize, 10 );
        window.setTimeout( SSG.setNotchRight, 50 );

        // entering fs mode would fire commands below several times, so there is a conditon
        // Timeout gives browser time to fully render page. RefreshFormat changes image sizes, it has to run before refreshPos.
        if (SSG.firstImageCentered) {
            window.setTimeout( SSG.refreshFormat, 100 );
            window.setTimeout( SSG.refreshPos, 200 );
            window.setTimeout( SSG.scrollToActualImg, 250 );
        }
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
    var tooNarrow = vwidth * photoFrameWidth > imgWidth * 1.28;

    if ( ( Math.abs( imgRatio - titleUnderRatio ) - 0.25 > Math.abs( imgRatio - titleSideRatio ) ) || tooNarrow ) {
        !( jQuery( '#f' + index ).hasClass( 'SSG_uwide' ) ) && jQuery( '#f' + index ).addClass( 'SSG_uwide' );
    } else {
        jQuery( '#f' + index ).removeClass( 'SSG_uwide' );
    }

    // If the photo is too narrow shift the caption towards the photo.
    if ( tooNarrow ) {
        !( jQuery( '#f' + index ).hasClass( 'SSG_captionShift' ) ) && jQuery( '#f' + index ).addClass( 'SSG_captionShift' );
    } else {
        jQuery( '#f' + index ).removeClass( 'SSG_captionShift' );
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

    // Newone is index of ah image which will be load.
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
        jQuery( "#SSG_gallery" ).append( "<figure id='f" + newOne + "' class='" + noTitle + "'><div id='uwb" +
            newOne + "' class='SSG_uwBlock'>" + uwCaption + imgWrap + "</div>" + caption + "</figure>" );

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
        var menuItem1 = "<a id='SSG_first' class='SSG_link'><span>&nbsp;</span> Scroll to top</a>";
        var menuItem2 = SSG.exitMode ? "<a id='SSG_exit2' class='SSG_link'>&times; Exit the Gallery</a>" : "";
        var menuItem3 = "<a id='SSGL' target='_blank' href='https://ssg.flor.cz/wordpress/' class='SSG_link'>&raquo;SSG</a>";
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
        SSG.fileToLoad && jQuery( '#SSG_loadInto' ).load( SSG.fileToLoad, function ( response, status, xhr ) {
            if ( status == "success" ) {
                SSG.fileLoaded = true;
                jQuery( '.SSG_icell' ).click( function ( event ) {
                    event.stopPropagation();
                } );
            }
        } );

        // All images are already loaded.
        SSG.finito = true;
    }

    // Append a little help to the first image.
    if ( newOne == 0 ) {
        jQuery( '#p0' ).append( '<a class="SSG_tipCall">next photo</a>' );
        jQuery( '#uwp0' ).append( '<span><a class="SSG_tipCall">next photo</a></span>' );
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
    typeof ga !== 'undefined' && ga( 'send', 'pageview', '/img' + location.pathname + hashName );
    if ( hashName == '#signpost' ) {
        hashName = '';
    }

    // Opera browser has unfortunately problem with custom cursor when hash is changing.
    navigator.userAgent.indexOf('OPR') == -1 && history.replaceState( null, null, SSG.location + hashName );
};

SSG.metronome = function () {

    // Actual offset from top of the page
    var actual = window.pageYOffset || document.documentElement.scrollTop;

    // SSG.loaded is set to -1 before the first image is loaded.
    if ( SSG.loaded != -1 && !SSG.finito ) {

        // The newest loaded image offset from top of the page.
        var Faraway = SSG.imgs[ SSG.loaded ].pos;

        // Loadnext is true only when image is just loaded.
        if ( ( Faraway - actual < SSG.scrHeight * 2 ) && SSG.loadNext ) {

            // When actual offset is three screen near from faraway gallery loads next image.
            SSG.addImage();
            SSG.loadNext = false;
        }
    }

    // If user is close enough to the last loaded image.
    if ( ( SSG.loaded == -1 || ( SSG.imgs[ SSG.loaded ].pos - actual < SSG.scrHeight * 0.5 ) ) && !SSG.finito ) {

        // wait cursor will appear 
        jQuery( document.body ).addClass( 'wait' );
    } else {
        jQuery( document.body ).removeClass( 'wait' );
    }


    // Actual + some screen fractions determinates exactly when an image pageview is logged into GA.
    actual += Math.round( SSG.scrHeight / SSG.scrFraction );

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
        if ( ( actual > SSG.imgs[ j ].pos ) && ( actual < topPos ) ) {
            SSG.displayed != j && SSG.setHashGA( j );
            SSG.displayed = j;
            SSG.delta = 0;
            break;
        }
    }
    if ( SSG.imageUp || SSG.imageDown || !SSG.firstImageCentered ) {
        if ( SSG.landscapeMode && SSG.firstImageCentered && !SSG.jumpScrollUsed ) {
            SSG.jumpScrollUsed = true;            
        }
        SSG.jumpScroll();
    }
};

SSG.ScrollTo = function ( posY, direction ) {
    if ( direction ) {
        jQuery( 'figure[id=f' + ( SSG.displayed + direction ) + ']' ).fadeTo( 0, 0 );
        jQuery( 'figure[id=f' + ( SSG.displayed ) + ']' ).fadeTo( 400, 0 );
    }
    jQuery( 'html, body' ).animate( {
        scrollTop: posY
    }, 500, 'swing' );
    if ( direction ) {
        jQuery( 'figure[id=f' + ( SSG.displayed + direction ) + ']' ).fadeTo( 666, 1 );
        jQuery( 'figure[id=f' + ( SSG.displayed ) + ']' ).fadeTo( 400, 1 );
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
        }, 333 );        
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
            }, 500, 'swing', function () {
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
    var centerPos = Math.round( ( screen - ( img + pIn ) ) / 2 );
    if ( centerPos < 0 ) {
        centerPos = ( centerPos * 2 ) - 2;
    }

    // It prevents fraction of previous image appears above centered image.
    return centerPos > ppMargin ? ppMargin : centerPos;
};

// prevents scrolling, finds out its direction and activates jump scroll
SSG.seizeScrolling = function ( e ) {
    e.preventDefault();
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
        elem.requestFullscreen();
    } else if ( elem.mozRequestFullScreen ) {

        // Firefox
        elem.mozRequestFullScreen();
    } else if ( elem.webkitRequestFullscreen ) {

        // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
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
    if ( typeof ga !== 'undefined' ) {
        ga( 'send', 'pageview', location.pathname );
    }
    // DOMMouseScroll event is for FF, mousewheel for other browsers, true (capturing phase) is for IE11
    document.removeEventListener( "mousewheel", SSG.seizeScrolling, false );
    document.removeEventListener( "mousewheel", SSG.seizeScrolling, true );
    document.removeEventListener( "DOMMouseScroll", SSG.seizeScrolling, false );
    jQuery( window ).off( 'resize', SSG.onResize );
    jQuery( document ).off( 'keydown', SSG.keyFunction );
    jQuery( document ).off( 'webkitfullscreenchange mozfullscreenchange fullscreenchange', SSG.onFS );
    SSG.fullscreenMode && SSG.closeFullscreen();

    // Renew an original scroll of a page. SetTimeout solves problem with return from FS, simple scrollTo doesn't work.
    if ( SSG.fullscreenMode ) {
        window.setTimeout( function () {
            window.scrollTo( 0, SSG.originalPos );
        }, 100 );
    } else {
        window.scrollTo( 0, SSG.originalPos );
    }
    SSG.running = false;
    jQuery( '#SSG_galBg, #SSG_gallery, #SSG_exit, #SSG_lastone, #SSG_tip, #an-dark' ).remove();
    jQuery( 'html' ).removeClass( 'ssg' );
    jQuery( "meta[name='viewport']" ).attr( 'content', SSG.viewport );
};

SSG.showFsTip = function ( justFsOffer ) {
    if ( jQuery( '#SSG_tip' ).length == 0 ) {        
        var begin = "<div id='SSG_tip'><span><div id='SSG_tipClose'>&times;</div>";
        var man1 = "<div class='classic'>Browse through Story Show Gallery by:<br>a mouse wheel" +
            " <strong>&circledcirc;</strong> or arrow keys <strong>&darr;&rarr;&uarr;&larr;</strong><br>";
        var man2 = "or <strong>TAP</strong> on the bottom (top) of the screen</div>";
        var touch = "<div class='touch'><strong>TAP</strong> on the bottom (top) of the screen<br>" +
            " to browse through Story Show Gallery.</div>";
        var hr = "<hr>";
        var fs = "For a better experience <br><a>click for fullscreen mode</a><br>";
        var end = "</span></div>";
        if ( justFsOffer ) {
            jQuery( 'body' ).append( begin + fs + end );
        } else if ( !SSG.fullscreenMode ) {
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
        jQuery('#SSG_tip').on("contextmenu", function(event) {
            event.preventDefault();
        });
    } else {
        jQuery( '#SSG_tip' ).remove();
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
            SSG.run( {
                fsa: true,
                initImgID: findex
            } );
        }
    }
    return null;
};

SSG.run = function ( event ) {

    // It prevents to continue if SSG is already running.
    if ( SSG.running ) {
        return false;
    }
    SSG.running = true;
    !SSG.jQueryImgCollection && SSG.getJQueryImgCollection();

    // If there is no start image specified (in the noExit mode), try to get image from hash.
    if ( event && event.noExit && !event.initImgID ) {
        event.initImgID = SSG.getHash( true );
    }
    SSG.setVariables();
    SSG.initGallery( event );


    if ( event && event.imgs ) {

        // use just event.imgs 
        if ( event.imgsPos == 'whole' || !event.imgsPos ) {
            SSG.imgs = event.imgs;

            // combine images from the page with event.imgs. Apply accepts an array as an argument unlike the unshift.
        } else if ( event.imgsPos == 'start' ) {
            SSG.getImgList( event );
            Array.prototype.unshift.apply( SSG.imgs, event.imgs );
        } else if ( event.imgsPos == 'end' ) {
            SSG.getImgList( event );
            Array.prototype.push.apply( SSG.imgs, event.imgs );
        }
    } else {
        // use just images on the page
        SSG.getImgList( event );
    }

    SSG.addImage();

    // Every 333 ms check if more images should be loaded and logged into Analytics. Jump-scrolling
    SSG.metronomInterval = setInterval( SSG.metronome, 333 );
    return false;
};

jQuery( document ).ready( function () {
    // looks for galleries with nossg class and marks every jQueryImgSelector element inside by nossg class
    jQuery( '.gallery.nossg a, .wp-block-gallery.nossg a' ).filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'nossg' );
    !SSG.jQueryImgCollection && SSG.getJQueryImgCollection();
    SSG.jQueryImgCollection.click( SSG.run );

    // The possible SSG.run in body's onload will run first thanks to delayed run of getHash. It is important in the noExit mode.
    // If the getHash would initiate SSG first, there wouldn't be any information about the noExit mode.
    window.setTimeout( function () {
        !SSG.running && SSG.getHash( false );
    }, 10 );
} );
