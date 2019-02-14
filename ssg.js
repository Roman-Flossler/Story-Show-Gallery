//   Story Show Gallery (SSG) ver: 2.1.1
//   Copyright (C) 2018 Roman Flössler - flor@flor.cz
//
//   Try Story Show Gallery at - http://ssg.flor.cz/
//   SSG on Github: https://github.com/Roman-Flossler/Simple-Scroll-Gallery.git
//
//   This Source Code Form is subject to the terms of the Mozilla Public
//   License, v. 2.0. If a copy of the MPL was not distributed with this
//   file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
//   There is one exception:
//   Distributing Story Show Gallery within a Wordpress plugin or theme 
//  is only allowed with a permission from the author of Story Show Gallery.


// Main object - namespace - the only global variable
var SSG = {};
SSG.jQueryImgSelector = "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.PNG'],a[href$='.gif'],a[href$='.GIF']";

SSG.setVariables = function () {

    // Load a HTML file behind the gallery (better to use absolute URL http://), or set SSG.fileToLoad = null; if you don't want it
    SSG.fileToLoad = 'ssg-loaded.html';

    // Array of objects where image attributes are stored
    SSG.imgs = [];

    // Index of the newest loaded image
    SSG.loaded = -1;

    // Index of the image displayed in the viewport
    SSG.displayed = -1;

    // It saves an actual vertical scroll of a page.
    SSG.originalPos = window.pageYOffset || document.documentElement.scrollTop;
    SSG.scrHeight = jQuery( window ).height();

    // Different screen fraction for different screen aspect ratios
    SSG.scrFraction = ( jQuery( window ).width() / SSG.scrHeight >= 1 ) ? 2 : 3.5;

    // If a user wants the next photo.
    SSG.imageDown = false;

    // If a user wants the previous photo.
    SSG.imageUp = false;

    // If the first image is already centered .
    SSG.firstImageCentered = false;

    // When true, scrolling is allowed.
    SSG.scrollingAllowed = true;

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

    // Page URL without a hash
    SSG.location = window.location.href.split( '#', 1 )[ 0 ];
    SSG.viewport = jQuery( "meta[name='viewport']" ).attr( 'content' );
};

SSG.initGallery = function initGallery( event ) {
    jQuery( 'head' ).append( "<meta name='theme-color' content='#131313' id='mobile-theme'>" );
    jQuery( "meta[name='viewport']" ).attr( 'content', 'initial-scale=1, viewport-fit=cover' );
    if ( event && event.noExit ) SSG.exitMode = false;
    jQuery( document ).on( 'webkitfullscreenchange mozfullscreenchange fullscreenchange', SSG.onFS );
    window.scrollTo( 0, 0 );

    // Gallery's divs
    jQuery( 'body' ).append( "<div id='SSG_galBg'></div><div id='SSG_gallery'></div>" );

    // Exit button
    SSG.exitMode && jQuery( 'body' ).append( "<div id='SSG_exit'></div>" );
    jQuery( 'html' ).addClass( 'ssg' );

    //add fs class to all thumbs in a WP gallery    
    jQuery( '.gallery a, .wp-block-gallery a' ).filter( jQuery( SSG.jQueryImgSelector ) ).addClass( 'fs' );

    // If A tag has fs class or Alt is pressed, it sets fullscreen to true.
    if ( ( event && event.currentTarget ) && ( SSG.hasClass( event.currentTarget.classList, 'fs' ) ) && !event.altKey ) {
        SSG.openFullscreen();
    }

    // Alt key allows to run the gallery without fullscreen.
    if ( event && event.fs && !event.altKey ) {
        SSG.openFullscreen();
        SSG.fullscreenModeWanted = true;
    }
    jQuery( document ).keydown( SSG.keyFunction );
    jQuery( '#SSG_exit' ).click( function () {
        SSG.exitClicked = true;
        SSG.destroyGallery();
    } );
    jQuery( '#SSG_gallery' ).click( SSG.touchScroll );
    jQuery( 'body' ).on( 'mousewheel DOMMouseScroll', SSG.revealScrolling );
    jQuery( window ).resize( SSG.onResize );
};

SSG.hasClass = function ( classList, classToFind ) {
    for ( var i = 0; i < classList.length; i++ ) {
        if ( classList[ i ] == classToFind ) return true;
    }
    return false;
};

SSG.keyFunction = function ( event ) {
    if ( event.which == 27 && SSG.exitMode ) SSG.destroyGallery();
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

SSG.getHrefAlt = function ( el ) {

    // If A tag has a children (img tag) with an alt atribute.
    if ( el.children[ 0 ] && el.children[ 0 ].alt )
        return {
            href: el.href,
            alt: el.children[ 0 ].alt
        };

    // If A tag has inner text.
    else if ( el.innerText && el.innerText != ' ' )
        return {
            href: el.href,
            alt: el.innerText
        };
    else

        // There is no caption under image.
        return {
            href: el.href,
            alt: ''
        };
};

SSG.getImgList = function ( event ) {

    // Call invokes forEach method in the context of jQuery output
    Array.prototype.forEach.call( jQuery( SSG.jQueryImgSelector ).toArray(), function ( el ) {
        SSG.imgs.push( SSG.getHrefAlt( el ) );
    } );
    var clickedHref, clickedAlt;

    if ( event && event.currentTarget ) {
        var result = SSG.getHrefAlt( event.currentTarget );
        clickedHref = result.href;
        clickedAlt = result.alt;
    } else if ( event && event.img ) {
        clickedHref = event.img.href;
        clickedAlt = event.img.alt;
    }
    if ( clickedHref && SSG.imgs.length > 1 ) {
        var ClickedImg = -1;
        for ( var i = 0; i < SSG.imgs.length; i++ ) {
            if ( SSG.imgs[ i ].href == clickedHref ) {
                ClickedImg = i;
                break;
            }
        }
        if ( ClickedImg != 0 && ClickedImg <= 2 ) {

            // Remove the image that a user clicked
            ClickedImg != -1 && SSG.imgs.splice( ClickedImg, 1 );

            //  The image that a user clicked is added to the beginning of the gallery.
            SSG.imgs.unshift( {
                href: clickedHref,
                alt: clickedAlt
            } );
        } else if ( ClickedImg > 2 ) {

            // Removes all images up to the image user clicked 
            var imgsRemoved = SSG.imgs.splice( 0, ClickedImg );

            // Adds removed images to the end of the array
            for ( i = 0; i < imgsRemoved.length; i++ ) {
                SSG.imgs.push( imgsRemoved[ i ] );
            }
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
    for ( var i = 0; i <= SSG.loaded; i++ ) {
        SSG.imgs[ i ].pos = Math.round( jQuery( '#i' + i ).offset().top );
    }
};


// Recounts variables on resize event
SSG.countResize = function () {
    if ( !SSG.running ) return;
    SSG.scrHeight = jQuery( window ).height();
    SSG.scrFraction = ( jQuery( window ).width() / SSG.scrHeight >= 1 ) ? 2 : 3.5;
    SSG.refreshPos();

    if ( SSG.loaded != -1 && ( typeof SSG.imgs[ SSG.displayed ] != 'undefined' ) ) {
        jQuery( 'html, body' ).animate( {
            scrollTop: SSG.imgs[ SSG.displayed ].pos - SSG.countImageIndent( SSG.displayed )
        }, 500, 'swing' );
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

// Timeout gives browser time to fully render page. RefreshFormat changes image sizes, it has to run before countResize.
SSG.onResize = function () {
    window.setTimeout( SSG.countResize, 200 );
    window.setTimeout( SSG.refreshFormat, 100 );
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
    if ( vwidth > 1333 ) photoFrameWidth = 0.85;
    var titleUnderRatio = vwidth / ( vheight - titleHeight );
    var titleSideRatio = ( vwidth * photoFrameWidth ) / vheight;
    var tooNarrow = vwidth * photoFrameWidth > imgWidth * 1.25;

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
        if ( !SSG.imgs[ newOne ].alt ) noTitle = 'notitle';

        //  Condition NewOne == 0 leaves P tag for the "next photo" link if there is no alt text.
        if ( SSG.imgs[ newOne ].alt || newOne == 0 ) {
            uwCaption = "<p class='uwtitle' id='uwp" + newOne + "'>" + SSG.imgs[ newOne ].alt + "</p>";
        }
        imgWrap = "<div class='SSG_imgWrap'><span class='SSG_forlogo'><img id='i" +
            newOne + "' src='" + SSG.imgs[ newOne ].href + "'><span class='SSG_logo'></span></span></div>";
        caption = "<p class='title' id='p" + newOne + "'><span>" + SSG.imgs[ newOne ].alt + "</span></p>";
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
        var menuItem3 = "<a id='SSGL' target='_blank' href='http://ssg.flor.cz/wordpress/' class='SSG_link'>&raquo;SSG</a>";
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
        SSG.fileToLoad && jQuery( '#SSG_loadInto' ).load( SSG.fileToLoad, function () {
            jQuery( '.SSG_icell' ).click( function ( event ) {
                event.stopPropagation();
            } );
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
    if ( hashName == '#signpost' ) hashName = '';

    // Opera browser has unfortunately problem with custom cursor when hash is changing.
    !( window.opr && !!window.opr.addons ) && history.replaceState( null, null, SSG.location + hashName );
};

SSG.metronome = function () {

    // Actual offset from top of the page
    var actual = window.pageYOffset || document.documentElement.scrollTop;


    // SSG.loaded is set to -1 before the first image is loaded.
    if ( SSG.loaded != -1 && !SSG.finito ) {

        // The newest loaded image offset from top of the page.
        var Faraway = SSG.imgs[ SSG.loaded ].pos;

        // Loadnext is true only when image is just loaded.
        if ( ( Faraway - actual < SSG.scrHeight * 3 ) && SSG.loadNext ) {

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
    SSG.onEachSecondTick = !SSG.onEachSecondTick;

    // Set afterScroll to false on every second tick, it enables scroll move again.
    if ( SSG.onEachSecondTick ) SSG.afterScroll = false;

    for ( var i = 0; i <= SSG.loaded; i++ ) {
        var topPos = 0;
        if ( i < SSG.imgs.length - 1 ) {
            topPos = SSG.imgs[ i + 1 ].pos;
        } else {

            // Get topPos of the last image's bottom
            topPos = SSG.imgs[ i ].pos + SSG.scrHeight;
        }
        if ( ( actual > SSG.imgs[ i ].pos ) && ( actual < topPos ) ) {
            SSG.displayed != i && SSG.setHashGA( i );
            SSG.displayed = i;
        }
    }

    SSG.jumpScroll();
};

SSG.jumpScroll = function () {

    // If the imageUp is true then scroll on previous image.
    if ( SSG.imageUp && SSG.displayed - 1 >= 0 && !SSG.lastone )
        jQuery( 'html, body' ).animate( {
            scrollTop: SSG.imgs[ SSG.displayed - 1 ].pos - SSG.countImageIndent( SSG.displayed - 1 )
        }, 500, 'swing' );


    // If the lastone is true, i am out of the index, so scroll on the last image in index.
    if ( SSG.imageUp && SSG.lastone ) {
        jQuery( 'html, body' ).animate( {
            scrollTop: SSG.imgs[ SSG.displayed ].pos - SSG.countImageIndent( SSG.displayed )
        }, 500, 'swing' );
        SSG.lastone = false;
        SSG.setHashGA( SSG.displayed );
    }

    // If the imageDown is true and next image is loaded (pos exists) then scroll down.
    if ( SSG.displayed + 1 < SSG.imgs.length && SSG.imageDown && SSG.imgs[ SSG.displayed + 1 ].pos ) {
        jQuery( 'html, body' ).animate( {
            scrollTop: SSG.imgs[ SSG.displayed + 1 ].pos - SSG.countImageIndent( SSG.displayed + 1 )
        }, 500, 'swing' );
    } else {

        // If the bottom menu exists scroll to it
        if ( typeof jQuery( '#SSG_menu' ).offset() !== 'undefined' ) {
            SSG.imageDown && jQuery( 'html, body' ).animate( {
                scrollTop: jQuery( '#SSG_menu' ).offset().top - ( SSG.scrHeight / 10 )
            }, 500, 'swing', function () {
                if ( !SSG.lastone ) {
                    SSG.lastone = true;
                    SSG.setHashGA( -1 );
                }
            } );
        }
    }

    // Center the first image after initiation of the gallery or can be used to jump to the 1st image.
    if ( SSG.imgs[ 0 ].pos && !SSG.firstImageCentered ) {
        jQuery( 'html, body' ).animate( {
            scrollTop: SSG.imgs[ 0 ].pos - SSG.countImageIndent( 0 )
        }, 200, 'swing' );
        SSG.firstImageCentered = true;
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
    if ( centerPos < 0 ) centerPos = ( centerPos * 2 ) - 2;

    // It prevents fraction of previous image appears above centered image.
    return centerPos > ppMargin ? ppMargin : centerPos;
};

SSG.seizeScrolling = function ( scroll ) {
    if ( scroll == 1 && SSG.scrollingAllowed ) {
        banScroll();

        // Afterscroll prevents scrolling which remained in the scroll queue on touchpads.
        if ( !SSG.afterScroll ) SSG.imageDown = true;
    } else if ( scroll == -1 && SSG.scrollingAllowed ) {
        banScroll();
        if ( !SSG.afterScroll ) SSG.imageUp = true;
    }

    function banScroll() {

        // Ban default behaviour
        jQuery( window ).bind( 'mousewheel DOMMouseScroll', SSG.preventDef );

        // It will renew ability to scroll in 482ms.
        SSG.scrollTimeout = setTimeout( SSG.setScrollActive, 482 );
        scroll = 0;
        SSG.scrollingAllowed = false;
    }
};

SSG.preventDef = function ( event ) {
    event.preventDefault();
};

SSG.setScrollActive = function () {
    SSG.scrollingAllowed = true;
    SSG.afterScroll = true;
    clearTimeout( SSG.scrollTimeout );
    jQuery( window ).off( 'mousewheel DOMMouseScroll', SSG.preventDef );
};


// Finds out if it is beeing used scroll wheel and then calls seize scrolling.
SSG.revealScrolling = function ( e ) {
    if ( typeof e.originalEvent.detail == 'number' && e.originalEvent.detail !== 0 ) {
        if ( e.originalEvent.detail > 0 ) {
            SSG.seizeScrolling( +1 );
        } else if ( e.originalEvent.detail < 0 ) {
            SSG.seizeScrolling( -1 );
        }
    } else if ( typeof e.originalEvent.wheelDelta == 'number' ) {
        if ( e.originalEvent.wheelDelta < 0 ) {
            SSG.seizeScrolling( +1 );
        } else if ( e.originalEvent.wheelDelta > 0 ) {
            SSG.seizeScrolling( -1 );
        }
    }
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
    if ( typeof ga !== 'undefined' ) ga( 'send', 'pageview', location.pathname );
    jQuery( 'body' ).off( 'mousewheel DOMMouseScroll', SSG.revealScrolling );
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
    jQuery( '#SSG_galBg, #SSG_gallery, #SSG_exit, #SSG_lastone, #SSG_tip, #mobile-theme' ).remove();
    jQuery( 'html' ).removeClass( 'ssg' );
    jQuery( "meta[name='viewport']" ).attr( 'content', SSG.viewport );
};

SSG.showFsTip = function ( firstCall ) {
    if ( jQuery( '#SSG_tip' ).length == 0 ) {
        var begin = "<div id='SSG_tip'><span><div id='SSG_tipClose'>&times;</div>";
        var man1 = "<div class='classic'>Browse through Story Show Gallery by:<br>a mouse wheel" +
            " <strong>&circledcirc;</strong> or arrow keys <strong>&darr;&rarr;&uarr;&larr;</strong><br>";
        var man2 = "or <strong>TAP</strong> on the bottom (top) of the screen</div>";
        var touch = "<div class='touch'><strong>TAP</strong> on the bottom (top) of the image<br>" +
            " to browse through Story Show Gallery.</div>";
        var hr = "<hr>";
        var fs = "For a better experience <br><a>click for fullscreen mode</a><br>";
        var end = "</span></div>";
        if ( firstCall ) {
            jQuery( 'body' ).append( begin + fs + end );
        } else if ( !SSG.fullscreenMode ) {
            jQuery( 'body' ).append( begin + man1 + man2 + touch + hr + fs + end );
        } else {
            jQuery( 'body' ).append( begin + man1 + man2 + touch + end );
        }!SSG.fullscreenMode && jQuery( '#SSG_tip' ).click( function () {
            SSG.openFullscreen();
            jQuery( '#SSG_tip' ).remove();
        } );
        jQuery( '#SSG_tipClose' ).click( function () {
            jQuery( '#SSG_tip' ).remove();
        } );
    } else {
        jQuery( '#SSG_tip' ).remove();
    }
};


// Searching for the first image which match the hash in URL.
SSG.getHash = function ( justResult ) {
    var hash = window.location.hash;
    var findex;
    var allimgs = jQuery( SSG.jQueryImgSelector ).toArray();

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
            var result = SSG.getHrefAlt( allimgs[ findex ] );
            if ( justResult ) {
                return {
                    href: result.href,
                    alt: result.alt
                };
            }

            // Only if justResult is false
            SSG.run( {
                fs: true,
                img: {
                    href: result.href,
                    alt: result.alt
                }
            } );
        }
    }
    return null;
};

SSG.run = function ( event ) {

    // It prevents to continue if SSG is already running.
    if ( SSG.running ) return false;
    SSG.running = true;

    // If there is no start image specified (in the noExit mode), try to get image from hash.
    if ( event && event.noExit && !event.img ) {
        event.img = SSG.getHash( true );
    }
    SSG.setVariables();

    // Pass onlick event
    SSG.initGallery( event );
    SSG.getImgList( event );

    // Load first image
    SSG.addImage();

    // Every 333 ms check if more images should be loaded and logged into Google Analytics. Scroll-jumping.
    SSG.metronomInterval = setInterval( SSG.metronome, 333 );
    window.setTimeout( function () {
        // It shows offer of FS mode.
        if ( !SSG.fullscreenMode && SSG.fullscreenModeWanted ) SSG.showFsTip( true );
    }, 600 );
    return false;
};

jQuery( document ).ready( function () {
    jQuery( SSG.jQueryImgSelector ).click( SSG.run );
} );

// Thanks to a little setTimeout the possible SSG.run in body's onload will run first. It is important in the noExit mode.
// If the getHash would initiate SSG first, there wouldn't be any information about the noExit mode.
jQuery( document ).ready( function () {
    window.setTimeout( SSG.getHash( false ), 10 );
} );
