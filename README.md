# Story Show Gallery - minimalist, vertical photo gallery, mobile friendly

[![](https://data.jsdelivr.com/v1/package/npm/story-show-gallery/badge?style=rounded)](https://www.jsdelivr.com/package/npm/story-show-gallery)
[![Known Vulnerabilities](https://snyk.io/test/npm/story-show-gallery/2.9.3/badge.svg)](https://snyk.io/test/npm/story-show-gallery/2.9.3)

SSG nicely combines photos and captions to show a whole story in full ­screen, mini­­mal­ist, non-dis­tracting environ­­ment (no ugly arrows). SSG can support your brand and mar­ket­ing. The gallery is [vertical](https://roman-flossler.github.io/StoryShowGallery/#themes) - optimized for use on smart­phones.
 
View demo gallery and documentation at [github.io](https://roman-flossler.github.io/StoryShowGallery/) <br>
SSG is also in the form of a [Wordpress plugin](https://roman-flossler.github.io/StoryShowGallery/wordpress/)

<br>

*Story Show Gallery versus usual gallery lightbox. Do you want more icons or more from a photo? SSG use whole smartphone display - even notch area and even on iPhone.*

[![Google Analytics](https://roman-flossler.github.io/StoryShowGallery/img/gallery-compare.jpg)](https://roman-flossler.github.io/StoryShowGallery/#gallery-compare)


Story Show Gallery has **very easy setup**, it binds onto image hyper­links on the page auto­mati­cally. You can control this proccess by **CSS classes**. Define sepa­rate galleries, activate full screen mode, selectively deactivate SSG, etc.

<br>

## Not another photo gallery

- On smartphones, full screen mode works like on You­Tube. It activa­tes after rotating a phone into landscape mode.
- Brand building (image or text), social sharing icon that can be [hardly overlooked](https://roman-flossler.github.io/StoryShowGallery/#brand)
- Easy browsing without [clicking and thinking](https://roman-flossler.github.io/StoryShowGallery/#browsing)
- [EXIF](https://roman-flossler.github.io/StoryShowGallery/wordpress/#puffins) info inside captions
- Deeplinking 
- Four visual themes
- Goo­gle Analytics support 
- [HTML signpost](https://roman-flossler.github.io/StoryShowGallery/#signpost) to other galleries
- No e×it mode for galleries based on bare HTML
- SSG is probably the only gallery which can place each caption individually according to image size vs. screen size:

[![SSG is fully responsive image gallery](https://roman-flossler.github.io/StoryShowGallery/img/story-show-gallery-responsive-modes-fullscreen.jpg)](https://roman-flossler.github.io/StoryShowGallery/#responsive)

<br>

## Implementation

Add ssg.min.css and jQuery in the &lt;head&gt; of the document. Add ssg.min.js before end of &lt;/body&gt;. You can link files directly from CDN:
``` html
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/story-show-gallery@2/dist/ssg.min.css">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"> </script>
</head>
...
<script src="https://cdn.jsdelivr.net/npm/story-show-gallery@2/dist/ssg.min.js"></script>
<!--  add also Exifr library if you want to display EXIF info -->
<script src="https://cdn.jsdelivr.net/npm/exifr@7/dist/lite.umd.js"> </script>
</body>
```


SSG binds onto image hyper­links on the page auto­mati­cally, BigImage1-4 will be in the gallery. You can control this proccess by CSS classes. 
``` html
<div class='ssg fs'>
    <a href='BigImage1.jpg'> <img alt='This text will appear under picture as a caption' src='thumbnail.jpg'> </a>
    <a href='BigImage2.jpg' data-author='photo by Misty'> Also image caption </a>
    <a href='BigImage3.jpg data-caption='this caption has priority over link text or alt'> some text </a>
    <a href='BigImage4.jpg'></a> <!-- an empty link, no caption -->
    

    <a href='BigImage5.jpg' class='nossg'> don't include me into SSG </a>
</div>
```
The **ssg class** creates a separate gallery, the **fs class** will activate full screen mode. 
The BigImage4.jpg will open normally within a browser because of the **nossg class**.  [There are more control classes](https://roman-flossler.github.io/StoryShowGallery/#classes).

You can also run the gallery by calling [SSG.run method](https://roman-flossler.github.io/StoryShowGallery/#ssg-run) and passing an JS array of images into SSG.
Story Show Gallery can also work as a Javascript module. Just add into ssg.js file this line to export SSG object:
```
export default SSG;
```

<br>

##  Configuration
Default SSG configuration and language localization are at the begining of ssg.js file. You can edit source ssg.js file and then minify it. 
Or copy selected settings into your document to override default configuration. [See all possible settings](https://roman-flossler.github.io/StoryShowGallery/#SSGconfig). Place the selected settings after ssg.min.js: 

``` html
   <script type="text/javascript" src="ssg.min.js"></script>    
    <script>
        SSG.cfg.fileToLoad = 'signpost.html'; // HTML file to load behind the gallery
        SSG.cfg.watermarkText = '〽️ Misty';  // watermark text overlaying a photo
        SSG.cfg.watermarkFontSize = 18;
        SSG.cfg.captionExif = 'trim'; // show EXIF with reduced lens info
    </script>
```    
Complete HTML5 example of SSG implementation and configuration:

[![HTML5 example of SSG implementation](https://roman-flossler.github.io/StoryShowGallery/img/html5-sample-source-code-ssg.png)](https://roman-flossler.github.io/StoryShowGallery/#html5)

Part of the configuration are also [SSG events](https://roman-flossler.github.io/StoryShowGallery/#events), you can use them to run your functions on the gallery start, on an image change, etc.

<br>

## Minifying
If you modify source files (src folder), you will probably want to minify the result. Use existing npm script:
``` js
npm install   // it will install uglify-JS and uglify-CSS which are needed for minifying
npm run-script dist  // it will minify the source files and put them into the dist directory. 
```

<br>

## License
You can use Story Show Gallery freely within open source GNU GPL-3.0 license.<br>

There is one **exception** from the license: Distributing Story Show Gallery within a Wordpress plugin or theme is only allowed for the author of Story Show Gallery.
