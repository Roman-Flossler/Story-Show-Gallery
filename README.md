# Story Show Gallery - minimalist, vertical photo gallery, mobile friendly

SSG nicely combines photos and captions to show a whole story in full ­screen, mini­­mal­ist, non-dis­tracting environ­­ment (no ugly arrows). SSG can support your brand and mar­ket­ing. The gallery is vertical - optimized for use on smart­phones.
 
View demo gallery and documentation at [ssg.Flor.cz](https://ssg.flor.cz/) <br>
SSG is also in the form of a [Wordpress plugin](https://ssg.flor.cz/wordpress/)

*Story Show Gallery (on the left) versus usual gallery lightbox. Do you want more icons or more from a photo? SSG use whole smartphone display - even notch area and even on iPhone.*

[![Google Analytics](https://ssg.flor.cz/img/gallery-compare.jpg)](https://ssg.flor.cz/#gallery-compare)


Story Show Gallery has **very easy setup**, it binds onto image hyper­links on the page auto­mati­cally. You can control this proccess by **CSS classes**. Define sepa­rate galleries, activate full screen mode, selectively deactivate SSG, etc.

## Not another photo gallery

- On smartphones (and tablets), full screen mode works like on You­Tube. It activa­tes after rotating a phone into landscape mode.
- Brand building (image or text), social sharing icon that can be [hardly miss](https://ssg.flor.cz/#brand)
- Easy browsing without [clicking and thinking](https://ssg.flor.cz/#browsing)
- Goo­gle Analytics support 
- Deeplinking
- [HTML signpost](https://ssg.flor.cz/#signpost) to other galleries
- No e×it mode for galleries based on bare HTML
- SSG is probably the only gallery which can place each caption individually according to image size vs. screen size:

[![SSG is fully responsive image gallery](https://ssg.flor.cz/img/story-show-gallery-responsive-modes-fullscreen.jpg)](https://ssg.flor.cz/#responsive)

## Implementation

Add ssg.min.css and jQuery in the &lt;head&gt; of the document. Add ssg.min.js before end of &lt;/body&gt;. You can link files directly from CDN:
``` html
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/story-show-gallery@2/dist/ssg.min.css">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"> </script>
</head>
...
<script src="https://cdn.jsdelivr.net/npm/story-show-gallery@2/dist/ssg.min.js"></script>
</body>
```


SSG binds onto image hyper­links on the page auto­mati­cally, BigImage1-3 will be in the gallery. You can control this proccess by CSS classes. 
``` html
<div class='ssg fs'>
    <a href='BigImage1.jpg'> <img alt='text caption' src='thumbnail.jpg'> </a>
    <a href='BigImage2.jpg'> Another text caption </a>
    <a href='BigImage3.jpg'></a> <!-- an empty link, no caption -->

    <a href='BigImage4.jpg' class='nossg'> don't include me into SSG </a>
</div>
```
The **ssg class** creates a separate gallery, the **fs class** will activate full screen mode. 
The BigImage4.jpg will open normally within a browser because of the **nossg class**.  [There are more control classes](https://ssg.flor.cz/#classes).

You can also run the gallery by calling [SSG.run method](https://ssg.flor.cz/#ssg-run) and passing an JS array of images into SSG.
Story Show Gallery can also work as a Javascript module. Just add into ssg.js file this line to export SSG object:
```
export default SSG;
```
##  Configuration
Default SSG configuration and language localization are at the begining of ssg.js file. You can edit source ssg.js file and then minify it. 
Or copy selected settings into your document to override default configuration. Place the settings after ssg.min.js: 

``` html
   <script type="text/javascript" src="ssg.min.js"></script>    
    <script>
        SSG.cfg.fileToLoad = 'signpost.html'; // HTML file to load behind the gallery
        SSG.cfg.watermarkText = '〽️ Misty';  // watermark text overlaying a photo
        SSG.cfg.watermarkFontSize = 18;
    </script>
```    

## Minifying
If you modify source files (src folder), you will probably want to minify the result. Use existing npm script:
``` js
npm install   // it will install uglify-JS and uglify-CSS which are needed for minifying
npm run-script dist  // it will minify of the source files and put them into the dist directory. 
```


## License
You can use Story Show Gallery freely within open source GNU GPL-3.0 license.<br>

There is one **exception** from the license: Distributing Story Show Gallery within a Wordpress plugin or theme is only allowed for the author of Story Show Gallery.

If you want to use Story Show Gallery within your commercially distributed SW, the Commercial license is appropriate. With this option, your source code 
is kept proprietary. Email me at flor@flor.cz for the Commercial license.

