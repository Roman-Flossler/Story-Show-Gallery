function initGallery() {
    jQuery("body").append("<div id='gal_bg'></div><div id='gallery'></div>")
    jQuery(document).keydown(function(event){if (event.which == 27) destroyGallery();}) //ESC key destroys gallery
    SSG.pos = window.pageYOffset || document.documentElement.scrollTop; // save actual vertical scroll of page
    getImgList();    
}

function getImgList() {    
    SSG.imgs = jQuery( "a[href$='.jpg']").toArray().map(function (el) { // search for A tags which points to .jpg file and returns it in array 
        return {href:el.href, alt:el.children[0].alt} // map function gets a-href and img-alg property and returns them in object
    });    
}

function createGallery() { // imgList - array of object with a-href and img-alg property    
    SSG.actual = -1;
    window.scrollTo(0, 0);
    addImage(4 ); // for begining gallery will contain 4 images
}

function addImage(howmuch) {
    var max;
    if (SSG.actual + howmuch < SSG.imgs.length-1) { // check 
        max =  SSG.actual+howmuch;   
    } else {
        max = SSG.imgs.length-1;
        clearInterval(loading);
    }
    
    for (i=SSG.actual+1; i<=max; i++) {
        jQuery("#gallery").append("<img id='i"+i+"' src='"+SSG.imgs[i].href+"'><p id='p"+i+"'>"+ SSG.imgs[i].alt +"</p>");
        jQuery("#i"+i).load({imgId:i}, function(event) { console.log(event.data.imgId); })
    }
    //SSG.imgs[i].pos= Math.round(jQuery("#p"+i).offset().top); console.log(Math.round(jQuery("#p"+i).offset().top))
    SSG.actual = max;
    console.log(max);
}

function checkLoading() { // this function every one second check if more images should be loaded
    var Faraway = Math.round(jQuery("#p"+SSG.actual).offset().top); // the newest loaded image offset from top of the page
    var actual = window.pageYOffset || document.documentElement.scrollTop; // actual offset from top of the page
    if (Faraway-actual < 3000) { addImage(4);}  // when actaual offset is near from faraway gallery loads more images 
}

function destroyGallery() {
    clearInterval(loading);
    jQuery("#gal_bg,#gallery").remove();
    window.scrollTo(0, SSG.pos); // sets the original (before initGallery) vertical scroll of page    
}

function run() {
    initGallery();
    createGallery();
    loading = setInterval(checkLoading,1000);
    return false;
}

var SSG = {};

jQuery("a[href$='.jpg']").click(run);


//    imgList.forEach(function (el) {
//        jQuery("#gallery").append("<img src='"+el.href+"'><p>"+ el.alt +"</p>");
//    });