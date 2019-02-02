
// Simple Scroll Gallery (SSG)
// Copyright (C) 2018 Roman Flössler - flor@flor.cz
//
// licensed under Mozilla Public License 2.0 with one exception: it is not granted to develop a Wordpress plugin based on SSG.
// Here you can see how gallery works - http://ssg.flor.cz/
// SSG on Github: https://github.com/Roman-Flossler/Simple-Scroll-Gallery.git

var SSG={jQueryImgSelector:"a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.PNG'],a[href$='.gif'],a[href$='.GIF']",setVariables:function(){SSG.fileToLoad="ssg-loaded.html",SSG.imgs=[],SSG.loaded=-1,SSG.displayed=-1,SSG.originalPos=window.pageYOffset||document.documentElement.scrollTop,SSG.scrHeight=jQuery(window).height(),jQuery(window).width()/SSG.scrHeight>=1?SSG.scrFraction=2:SSG.scrFraction=3.5,SSG.imageDown=!1,SSG.imageUp=!1,SSG.firstImageCentered=!1,SSG.scrollingAllowed=!0,SSG.fullscreenMode=!1,SSG.fullscreenModeWanted=!1,SSG.exitFullscreen=!1,SSG.finito=!1,SSG.lastone=!1,SSG.exitClicked=!1,SSG.exitMode=!0,SSG.loadNext=!1},initGallery:function(e){e&&e.noExit&&(SSG.exitMode=!1),jQuery(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange",SSG.onFS),window.scrollTo(0,0),jQuery("body").append("<div id='SSG_galBg'></div><div id='SSG_gallery'></div>"),SSG.exitMode&&jQuery("body").append("<div id='SSG_exit'></div>"),jQuery("html").addClass("ssg"),jQuery(".gallery a, .wp-block-gallery a").filter(jQuery(SSG.jQueryImgSelector)).addClass("fs"),e&&e.currentTarget&&SSG.hasClass(e.currentTarget.classList,"fs")&&SSG.openFullscreen(),e&&e.fs&&(SSG.openFullscreen(),SSG.fullscreenModeWanted=!0),jQuery(document).keydown(SSG.keyFunction),jQuery("#SSG_exit").click(function(){SSG.exitClicked=!0,SSG.destroyGallery()}),jQuery("#SSG_gallery").click(SSG.touchScroll),jQuery("body").on("mousewheel DOMMouseScroll",SSG.revealScrolling),jQuery(window).resize(SSG.onResize)},hasClass:function(e,S){for(var i=0;i<e.length;i++)if(e[i]==S)return!0;return!1},keyFunction:function(e){27==e.which&&SSG.exitMode&&SSG.destroyGallery(),40!=e.which&&39!=e.which&&34!=e.which&&32!=e.which||(SSG.imageDown=!0),38!=e.which&&37!=e.which&&33!=e.which||(SSG.imageUp=!0),e.preventDefault()},touchScroll:function(e){e.clientY<SSG.scrHeight/2?SSG.imageUp=!0:SSG.imageDown=!0},getHrefAlt:function(e){return e.children[0]&&e.children[0].alt?{href:e.href,alt:e.children[0].alt}:e.innerText&&" "!=e.innerText?{href:e.href,alt:e.innerText}:{href:e.href,alt:""}},getImgList:function(e){if(Array.prototype.forEach.call(jQuery(SSG.jQueryImgSelector).toArray(),function(e){SSG.imgs.push(SSG.getHrefAlt(e))}),e&&e.currentTarget)var S=SSG.getHrefAlt(e.currentTarget),i=S.href,r=S.alt;else if(e&&e.img)i=e.img.href,r=e.img.alt;if(i&&SSG.imgs.length>1){for(var o=-1,n=0;n<SSG.imgs.length;n++)if(SSG.imgs[n].href==i){o=n;break}if(0!=o&&o<=2)-1!=o&&SSG.imgs.splice(o,1),SSG.imgs.unshift({href:i,alt:r});else if(o>2){var t=SSG.imgs.splice(0,o);for(n=0;n<t.length;n++)SSG.imgs.push(t[n])}}},onFS:function(){SSG.fullscreenMode&&SSG.exitFullscreen&&!SSG.exitClicked?(SSG.fullscreenMode=!1,SSG.exitFullscreen=!1,SSG.exitMode?SSG.destroyGallery():jQuery("#SSG_exit").remove()):SSG.exitFullscreen||(SSG.exitFullscreen=!0,SSG.fullscreenMode=!0,SSG.exitMode||(jQuery("body").append("<div id='SSG_exit'></div>"),jQuery("#SSG_exit").click(SSG.closeFullscreen)))},refreshPos:function(){for(var e=0;e<=SSG.loaded;e++)SSG.imgs[e].pos=Math.round(jQuery("#i"+e).offset().top)},countResize:function(){SSG.running&&(SSG.scrHeight=jQuery(window).height(),jQuery(window).width()/SSG.scrHeight>=1?SSG.scrFraction=2:SSG.scrFraction=3.5,SSG.refreshPos(),-1!=SSG.loaded&&void 0!==SSG.imgs[SSG.displayed]&&jQuery("html, body").animate({scrollTop:SSG.imgs[SSG.displayed].pos-SSG.countImageIndent(SSG.displayed)},500,"swing"))},refreshFormat:function(){for(var e=0;e<=SSG.loaded;e++)SSG.displayFormat({data:{imgid:e}})},onResize:function(){window.setTimeout(SSG.countResize,200),window.setTimeout(SSG.refreshFormat,100)},displayFormat:function(e){var S=e.data.imgid,i=jQuery("#i"+S).innerHeight(),r=jQuery("#i"+S).innerWidth(),o=jQuery("#i"+S).outerHeight(!0)-i+jQuery("#p"+S).innerHeight(),n=r/i,t=jQuery(window).width(),l=jQuery(window).height(),a=.8;t>1333&&(a=.85);var s=t/(l-o),c=t*a/l,d=t*a>1.25*r;Math.abs(n-s)-.25>Math.abs(n-c)||d?!jQuery("#f"+S).hasClass("SSG_uwide")&&jQuery("#f"+S).addClass("SSG_uwide"):jQuery("#f"+S).removeClass("SSG_uwide"),d?!jQuery("#f"+S).hasClass("SSG_captionShift")&&jQuery("#f"+S).addClass("SSG_captionShift"):jQuery("#f"+S).removeClass("SSG_captionShift")},onImageLoad:function(e){SSG.loaded=e.data.imgid,SSG.displayFormat(e),SSG.refreshPos(),SSG.loadNext=!0},addImage:function(){var e=SSG.loaded+1;if(e<SSG.imgs.length){var S="",i="";SSG.imgs[e].alt||(S="notitle"),(SSG.imgs[e].alt||0==e)&&(i="<p class='uwtitle' id='uwp"+e+"'>"+SSG.imgs[e].alt+"</p>"),imgWrap="<div class='SSG_imgWrap'><span class='SSG_forlogo'><img id='i"+e+"' src='"+SSG.imgs[e].href+"'><span class='SSG_logo'></span></span></div>",caption="<p class='title' id='p"+e+"'><span>"+SSG.imgs[e].alt+"</span></p>",jQuery("#SSG_gallery").append("<figure id='f"+e+"' class='"+S+"'><div id='uwb"+e+"' class='SSG_uwBlock'>"+i+imgWrap+"</div>"+caption+"</figure>"),jQuery("#i"+e).on("load",{imgid:e},SSG.onImageLoad)}if(e==SSG.imgs.length){var r;r=SSG.exitMode?"<a id='SSG_exit2' class='SSG_link'>&times; Exit the Gallery</a>":"";jQuery("#SSG_gallery").append("<div id='SSG_lastone'> <p id='SSG_menu'><a id='SSG_first' class='SSG_link'><span>&nbsp;</span> Scroll to top</a>"+r+"<a id='SSGL' target='_blank' href='http://ssg.flor.cz/wordpress/' class='SSG_link'>&raquo;SSG</a></p> <div id='SSG_loadInto'></div></div>"),jQuery("#SSG_menu").click(function(e){e.stopPropagation()}),jQuery("#SSG_exit2").click(function(){SSG.exitClicked=!0,SSG.destroyGallery()}),jQuery("#SSG_first").click(function(){SSG.firstImageCentered=!1}),SSG.fileToLoad&&jQuery("#SSG_loadInto").load(SSG.fileToLoad,function(){jQuery(".SSG_icell").click(function(e){e.stopPropagation()})}),SSG.finito=!0}0==e&&(jQuery("#p0").append('<a class="SSG_tipCall">next photo</a>'),jQuery("#uwp0").append('<span><a class="SSG_tipCall">next photo</a></span>'),jQuery(".SSG_tipCall").click(function(e){SSG.showFsTip(!1),e.stopPropagation()}))},getName:function(e){return e.slice(e.lastIndexOf("/")+1)},metronome:function(){var e=window.pageYOffset||document.documentElement.scrollTop;-1==SSG.loaded||SSG.finito||SSG.imgs[SSG.loaded].pos-e<3*SSG.scrHeight&&SSG.loadNext&&(SSG.addImage(),SSG.loadNext=!1);(-1==SSG.loaded||SSG.imgs[SSG.loaded].pos-e<.5*SSG.scrHeight)&&!SSG.finito?jQuery(document.body).addClass("wait"):jQuery(document.body).removeClass("wait"),e+=Math.round(SSG.scrHeight/SSG.scrFraction),SSG.onEachSecondTick=!SSG.onEachSecondTick,SSG.onEachSecondTick&&(SSG.afterScroll=!1);for(var S=0;S<=SSG.loaded;S++){var i=0;i=S<SSG.imgs.length-1?SSG.imgs[S+1].pos:SSG.imgs[S].pos+SSG.scrHeight,e>SSG.imgs[S].pos&&e<i&&("undefined"!=typeof ga&&SSG.displayed!=S&&ga("send","pageview","/img"+location.pathname+SSG.getName(SSG.imgs[S].href)),SSG.displayed=S)}SSG.jumpScroll()},jumpScroll:function(){SSG.imageUp&&SSG.displayed-1>=0&&!SSG.lastone&&jQuery("html, body").animate({scrollTop:SSG.imgs[SSG.displayed-1].pos-SSG.countImageIndent(SSG.displayed-1)},500,"swing"),SSG.imageUp&&SSG.lastone&&(jQuery("html, body").animate({scrollTop:SSG.imgs[SSG.displayed].pos-SSG.countImageIndent(SSG.displayed)},500,"swing"),SSG.lastone=!1),SSG.displayed+1<SSG.imgs.length&&SSG.imageDown&&SSG.imgs[SSG.displayed+1].pos?jQuery("html, body").animate({scrollTop:SSG.imgs[SSG.displayed+1].pos-SSG.countImageIndent(SSG.displayed+1)},500,"swing"):void 0!==jQuery("#SSG_menu").offset()&&SSG.imageDown&&jQuery("html, body").animate({scrollTop:jQuery("#SSG_menu").offset().top-SSG.scrHeight/10},500,"swing",function(){SSG.lastone=!0}),SSG.imgs[0].pos&&!SSG.firstImageCentered&&(jQuery("html, body").animate({scrollTop:SSG.imgs[0].pos-SSG.countImageIndent(0)},200,"swing"),SSG.firstImageCentered=!0),SSG.imageDown=!1,SSG.imageUp=!1},countImageIndent:function(e){var S=jQuery(window).height(),i=jQuery("#i"+e).outerHeight(!0),r=jQuery("#p"+e).innerHeight(),o=jQuery("#p"+e).outerHeight(!0)-r,n=Math.round((S-(i+r))/2);return n<0&&(n=2*n-2),n>o?o:n},
seizeScrolling:function(e){function S(){jQuery(window).bind("mousewheel DOMMouseScroll",SSG.preventDef),SSG.scrollTimeout=setTimeout(SSG.setScrollActive,482),e=0,SSG.scrollingAllowed=!1}1==e&&SSG.scrollingAllowed?(S(),SSG.afterScroll||(SSG.imageDown=!0)):-1==e&&SSG.scrollingAllowed&&(S(),SSG.afterScroll||(SSG.imageUp=!0))},preventDef:function(e){e.preventDefault()},setScrollActive:function(){SSG.scrollingAllowed=!0,SSG.afterScroll=!0,clearTimeout(SSG.scrollTimeout),jQuery(window).off("mousewheel DOMMouseScroll",SSG.preventDef)},revealScrolling:function(e){"number"==typeof e.originalEvent.detail&&0!==e.originalEvent.detail?e.originalEvent.detail>0?SSG.seizeScrolling(1):e.originalEvent.detail<0&&SSG.seizeScrolling(-1):"number"==typeof e.originalEvent.wheelDelta&&(e.originalEvent.wheelDelta<0?SSG.seizeScrolling(1):e.originalEvent.wheelDelta>0&&SSG.seizeScrolling(-1))},openFullscreen:function(){var e=document.documentElement;e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen&&e.webkitRequestFullscreen()},closeFullscreen:function(){document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen()},destroyGallery:function(){clearInterval(SSG.metronomInterval),"undefined"!=typeof ga&&ga("send","pageview",location.pathname),jQuery("body").off("mousewheel DOMMouseScroll",SSG.revealScrolling),jQuery(window).off("resize",SSG.onResize),jQuery(document).off("keydown",SSG.keyFunction),jQuery(document).off("webkitfullscreenchange mozfullscreenchange fullscreenchange",SSG.onFS),SSG.fullscreenMode&&SSG.closeFullscreen(),SSG.fullscreenMode?window.setTimeout(function(){window.scrollTo(0,SSG.originalPos)},100):window.scrollTo(0,SSG.originalPos),SSG.running=!1,jQuery("#SSG_galBg,#SSG_gallery,#SSG_exit,#SSG_lastone,#SSG_tip").remove(),jQuery("html").removeClass("ssg")},showFsTip:function(e){if(0==jQuery("#SSG_tip").length){var S="<div id='SSG_tip'><span><div id='SSG_tipClose'>&times;</div>",i="<div class='classic'>Browse through Story Show Gallery by:<br>a mouse wheel <strong>&circledcirc;</strong> or arrow keys <strong>&darr;&rarr;&uarr;&larr;</strong><br>",r="or <strong>TAP</strong> on the bottom (top) of the screen</div>",o="<div class='touch'><strong>TAP</strong> on the bottom (top) of the image<br> to browse through Story Show Gallery.</div>",n="For a better experience <br><a>click for fullscreen mode</a><br>",t="</span></div>";e?jQuery("body").append(S+n+t):SSG.fullscreenMode?jQuery("body").append(S+i+r+o+t):jQuery("body").append(S+i+r+o+"<hr>"+n+t),!SSG.fullscreenMode&&jQuery("#SSG_tip").click(function(){SSG.openFullscreen(),jQuery("#SSG_tip").remove()}),jQuery("#SSG_tipClose").click(function(){jQuery("#SSG_tip").remove()})}else jQuery("#SSG_tip").remove()},getHash:function(e){var S=window.location.hash;if(""!=S){S=S.substring(1,S.length);var i=jQuery("a[href*='"+S+"'][href$='.jpg'],a[href*='"+S+"'][href$='.JPG'],a[href*='"+S+"'][href$='.jpeg'],a[href*='"+S+"'][href$='.png'],a[href*='"+S+"'][href$='.gif']").toArray();if(i[0]){var r=SSG.getHrefAlt(i[0]);if(e)return{href:r.href,alt:r.alt};SSG.run({fs:!0,img:{href:r.href,alt:r.alt}})}}return null},run:function(e){return!SSG.running&&(SSG.running=!0,e||(e={}),e&&!e.img&&SSG.getHash(!0)&&(e.img=SSG.getHash(!0)),SSG.setVariables(),SSG.initGallery(e),SSG.getImgList(e),SSG.addImage(),SSG.metronomInterval=setInterval(SSG.metronome,333),window.setTimeout(function(){!SSG.fullscreenMode&&SSG.fullscreenModeWanted&&SSG.showFsTip(!0)},600),!1)}};jQuery(document).ready(function(){jQuery(SSG.jQueryImgSelector).click(SSG.run)}),jQuery(document).ready(function(){window.setTimeout(SSG.getHash(!1),10)});