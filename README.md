# Story Show Gallery

Show a story with your photos! SSG is designed for that. A spectator only needs to scroll down and sees image by image in not disturbing ambience. With optimally placed text captions you can tell a story too. You can try it on the [sample  gallery page at ssg.Flor.cz](http://ssg.flor.cz/).

## Main features

- SSG is fully **responsive** - works on a desktop, tablets and smartphones. For every image size SSG calculates optimal position of a text caption: [![N|Solid](http://ssg.flor.cz/minimal-crash-course/story-show-gallery-responsive-modes-fullscreen.jpg)](http://ssg.flor.cz/)
- **Fullscreen** mode with an unobtrusive scrollbar and cursor. Even dark photos are well visible.
- SSG supports **Google analytics**. When a user views an image it is counted as a virtual pageview.
- **No e×it mode:** You can write just a minimal HTML code and SSG creates a gallery which works like a separate webpage. Because there is not much to display without SSG, the gallery can run in the no exit mode. See a [minimal crash course](http://ssg.flor.cz/minimal-crash-course/) how to use SSG.
- SSG can display **your logo** over the image and text caption under image
- **Jump scroll** automatically scrolls from image to image. Images are being gradually **lazy loaded** as a user scrolls down.
- You can **link inside the gallery** to show a [particular photo](http://ssg.flor.cz/#element).
- SSG can load a **signpost** to other galleries behind the last photo. [See the sample](http://gal.brno.me/#lombok).

## License
You can use SSG freely [under Mozilla Public License 2.0](https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)). There is one exception added in the license. It is not granted to develop a Wordpress plugin based on SSG. I am planning to do it.


## SSG is easy to implement
Story Show Gallery is easy to implement on your website, it searches for images automatically. You just need to add two lines of code somewhere before </body> tag:

```sh
<link rel="stylesheet" href="https://.../ssg.css" type="text/css">
<script type="text/javascript" src="https://.../ssg.js"></script>
```
SSG requires jQuery library at least in version 1.5.  Place jQuery code inside the <head> section (Wordpress already includes jQuery):

```sh
<script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
```

Story Show Gallery consists of three files: 
- **ssg.js** - the gallery code 
- **ssg.css** - the gallery styles, includes icons and cursor
- **ssg-loaded.html (optional)** -  a html file to load behind the last photo, typically a signpost to other galleries. Edit it to contain your links.

## How the gallery works
Story Show Gallery looks for all hyperlinks (<a> tags) on the page that points to an image file  (extensions: jpg, jpeg, JPG, png, PNG, gif, GIF). SSG adds to all these hyperlinks onclick function which runs the gallery. 

The image a user clicked on is displayed first, then SSG shows following images and then the rest. Example: A user clicked on the sixth image. Images are shown in the following order - 6,7,8,9 and then it continues with images 1,2,3,4,5. If a user click up to third image, SSG prefers to show initial images together: 3,1,2,4,5,6,7,8,9.

SGG excellently cooperates with the **Wordpress built-in gallery**. Wordpress creates image thumbnails with hyperlinks, and SGG assembles them into a fullscreen image presentation.

 

The **text caption** below images is taken from a thumbnail's alt attribute or a link text. SSG will create the gallery from all theese three images (BigImage1~3):

```sh
<a href='BigImage1.jpg'> <img alt='text caption' src='thumb.jpg'> </a>
<a href='BigImage2.jpg'> Another text caption </a>
<a href='BigImage3.jpg'></a> (an empty link, no caption)
```

The gallery activates after a user clicks on some hyperlink from the above example. But you can also run the gallery by calling **SSG.run method**. Example: the body's onload event activates the gallery immediately after a page is loaded:

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
See a [crash course](http://ssg.flor.cz/minimal-crash-course/) - the most minimal way how to use SSG.

You can **link inside the gallery** to show a particular photo. Just add a hashtag with photo's name after url. For example this link http://ssg.flor.cz/#element shows the photo paty-element.jpg. It is enough to have in the hashtag crucial part of the name.

## Fullscreen mode
Fullscreen mode can be activated three ways.

Adding the "gallery" or "wp-block-gallery" class to the wrapper tag of <a> tags. These two classes use the Wordpress built-in gallery. All images inside the gallery activate fullscreen mode:
```sh
<div class='gallery'>
<a href='big-image.jpg'> <img src='thumbnail.jpg'></a>
<a href='big-image2.jpg'> <img src='thumbnail2.jpg'></a>
</div>
```
Running the gallery by calling the SSG.run method with the fs:true parameter.

```sh
<a onclick='SSG.run({fs:true})'> Show gallery</a>
```
Adding the fs class to <a> tag. This single image activates fullscreen mode:
```sh
<a class='fs' href='big-image.jpg'> <img src='thumbnail.jpg'></a> 
```

## Navigation in the gallery ~ jump scroll
There are two options. Classic scrolling with a scrollbar or fingers. And then jump scroll. A mouse wheel and arrow keys have an altered function, they scroll from one image to next image.

**Move to the next image**: mouse wheel, down arrow key, right arrow, PgDn key or spacebar. 
**Move to the previous image**: mouse wheel, press up arrow key, left arrow, or PgUP key.

For **touch screens** there are two invisible areas: the top and bottom half of the screen. After tapping somewhere into the bottom (top) half, SSG jump scroll to the next (previous) image.
&nbsp;

[![N|Solid](http://ssg.flor.cz/img/story-show-gallery-logo.jpg)](http://ssg.flor.cz/)