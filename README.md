# Story Show Gallery 

Show a story with your photos! SSG is designed for that. A site visitor only needs to scroll down and he sees image by image in non-distracting environment. You can also tell a story by optimally placed text captions. View demo gallery at [ssg.Flor.cz](http://ssg.flor.cz/). SSG is also in the form of a [Wordpress plugin](http://ssg.flor.cz/wordpress/).

## Main features

- Story Show Gallery is fully **responsive** - works on a desktop, tablets and smartphones. For every image size SSG calculates optimal position of a text caption: [![SSG is fully responsive image gallery](http://ssg.flor.cz/minimal-crash-course/story-show-gallery-responsive-modes-fullscreen.jpg)](http://ssg.flor.cz/)
- **Fullscreen** mode with an unobtrusive scrollbar and cursor. Even dark photos are well visible.
- Story Show Gallery supports **Google analytics**. When a user views an image it is counted as a virtual pageview.
- **No e×it mode:** You can write just a minimal HTML code and SSG creates a gallery which works like a separate webpage. Because there is not much to display without SSG, the gallery can run in the no exit mode. See a [minimal crash course](http://ssg.flor.cz/minimal-crash-course/) how to use SSG.
- Story Show Gallery can display **watermark - logo** over images.
- **Jump scroll** automatically scrolls from image to image. Images are being gradually **lazy loaded** as a user scrolls down.
- Every image has its own address, so you can **link into the gallery** to show a [particular photo](http://ssg.flor.cz/#element).
- Story Show Gallery can load a **signpost** to other galleries behind the last photo. [See the sample](http://ssg.flor.cz/signpost/).

## License
You can use SSG freely within [Mozilla Public License 2.0](https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)).

## Support Story Show Gallery
Any size donation is greatly appreciated. It will help me to continue developing Story Show Gallery.
[![Paypal-donate](http://ssg.flor.cz/img/paypal-donate.png)](https://www.paypal.me/FlorSSG)

## Story Show Gallery is easy to implement
SSG is easy to implement on your website, it binds onto images automatically. Download SSG files and add these two lines somewhere before the &lt;/body&gt; tag:

```sh
<link rel="stylesheet" href="ssg.css" >
<script src="ssg.js"> </script>
```

For a quick try of Story Show Gallery on your website you can link SSG files from Flor.cz:

```sh
<link rel="stylesheet" href="http://ssg.flor.cz/ssg.css">
<script src="http://ssg.flor.cz/ssg.js"> </script>
```

SSG requires jQuery library at least in version 1.5.  Place jQuery code inside the <head> section (Wordpress already includes jQuery):

```sh
<script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
```
Sample HTML5 code and adding logo - watermark via CSS styles:

[![SSG - sample source code](http://ssg.flor.cz/minimal-crash-course/html5-sample-source-code-ssg.png)](http://ssg.flor.cz/minimal-crash-course/html5-sample-source-code-ssg.png)

Story Show Gallery consists of three files: 
- **ssg.js** - the gallery code 
- **ssg.css** - the gallery styles, includes icons and cursor
- **ssg-loaded.html (optional)** -  a html file to load behind the last photo, typically a signpost to other galleries. Edit it to contain your links.

## How Story Show Gallery works
SSG looks for all hyperlinks (<a> tags) on the page that points to an image file  (extensions: jpg, jpeg, JPG, png, PNG, gif, GIF). SSG adds to all these hyperlinks onclick function which runs the gallery. 

The image a user clicked on is displayed first, then SSG shows following images and then the rest. Example: A user clicked on the sixth image. Images are shown in the following order - 6,7,8,9 and then it continues with images 1,2,3,4,5. If a user click up to third image, SSG prefers to show initial images together: 3,1,2,4,5,6,7,8,9.

A **caption** next to image is taken from a thumbnail's alt attribute or a link text. Story Show Gallery will create the gallery from all these three images (BigImage1~3):

```sh
<a href='BigImage1.jpg'> <img alt='text caption' src='thumb.jpg'> </a>
<a href='BigImage2.jpg'> Another text caption </a>
<a href='BigImage3.jpg'></a> (an empty link, no caption)
```

Story Show Gallery activates after a user clicks on some hyperlink from the above example. But you can also run the gallery by calling **SSG.run method**. Example: the body's onload event activates the gallery immediately after a page is loaded:

```sh
<body onload='SSG.run()'>
```
Use arguments to show any image before the rest of images:

```sh
<body onload="SSG.run({img: {href: 'url', alt: 'some text' }})">
```
Run SSG immediately after page loads is useful, when the html page is just a plain list of links without any design. There is nothing much to see without SSG. So the gallery can run in the **no e×it mode** - no close icon, no ESC key.

```sh
<body onload='SSG.run({noExit:true})'>
```
See a [crash course](http://ssg.flor.cz/minimal-crash-course/) - the most minimal way how to use Story Show Gallery.



## linking into the gallery

SSG can be also initiated by a link with photo's name in a hashtag. For example this link [http://ssg.flor.cz/#paty-element](http://ssg.flor.cz/#paty-element) will activate SSG and show image named paty-element. It is enough to have in the hashtag crucial part of the name - **#element**.

An address of each photo is shown in a browser’s navigation bar while browsing through the gallery. But it isn't visible in fullscreen mode, so there is a **little hack**. If you hold an alt key and click on a thumbnail, SSG won’t run into fullscreen and you can copy an image address.

## Fullscreen mode
Fullscreen mode can be activated three ways.

Adding the "gallery" or "wp-block-gallery" class to the wrapper tag of <a> tags. These two classes use the Wordpress built-in gallery. All images inside the gallery activate fullscreen mode:
```sh
<div class='gallery'>
<a href='big-image.jpg'> <img src='thumbnail.jpg'></a>
<a href='big-image2.jpg'> <img src='thumbnail2.jpg'></a>
</div>
```

Adding the fs class to <a> tag. This single image activates fullscreen mode:
```sh
<a class='fs' href='big-image.jpg'> <img src='thumbnail.jpg'></a> 
```

Running the gallery by calling the SSG.run method with the fs:true or fsa:true  parameter.

```sh
<a onclick='SSG.run({fs:true})'> Show gallery</a>
```

The **fsa parameter** is good to use when the gallery is initiate without an active click from a user. But that click is needed for entering fullscreen mode. So the gallery will ask if a user wants to switch into fullscreen mode.

## Navigation in the gallery ~ jump scroll
There are two options. Classic scrolling with a scrollbar or fingers. And then jump scroll. A mouse wheel and arrow keys have an altered function, they scroll from one image to next image.

**Move to the next image**: mouse wheel, down arrow key, right arrow, PgDn key or spacebar. 
**Move to the previous image**: mouse wheel, press up arrow key, left arrow, or PgUP key.

For **touch screens** there are two invisible areas: the top and bottom half of the screen. After tapping somewhere into the bottom (top) half, SSG jump scroll to the next (previous) image.
&nbsp;

[![Story Show Gallery logo](http://ssg.flor.cz/img/story-show-gallery-logo.jpg)](http://ssg.flor.cz/)
