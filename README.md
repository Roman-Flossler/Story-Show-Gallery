# Simple Scroll Gallery

I've made Simple Scroll Gallery for my Wordpress blog about photography. I wanted a simple gallery (without disturbing elements) which works similarly like a presentation. A user only needs to scroll down and sees image by image. You can try it on the [sample  gallery page at ssg.Flor.cz](http://ssg.flor.cz/).

## Main features

- SSG is fully **responsive** - works on a desktop, tablets and smartphones
- Minimalist and **unobtrusive** - SSG gives max. space to images
- Just **333 lines** of JS code, all icons and cursor inside the code
- **Fullscreen** mode with an unobtrusive scrollbar and cursor
- **Jump scroll** automatically scrolls from image to image
- Images are gradually loaded as a user scrolls down
- There can be a caption under each image and **your logo** over the image
- SSG supports **Google analytics**. When a user views an image it is counted as a virtual pageview.
- You can **link inside the gallery** to show a [particular photo](http://ssg.flor.cz/#cerna).
- SSG can load a **signpost** to other galleries behind the last photo. [See the sample](http://gal.brno.me/#haku).

## License
You can use SSG freely [under Mozilla Public License 2.0](https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)). There is one exception added in the license. It is not granted to develop a Wordpress plugin based on SSG. I am planning to do it.


## SSG is easy to implement
Simple Scroll Gallery is easy to implement on your website. You just need to add two lines of code somewhere before </body> tag:

```sh
<link rel="stylesheet" href="https://.../ssg.css" type="text/css">
<script type="text/javascript" src="https://.../ssg.js"></script>
```
SSG requires jQuery library at least in version 1.5. Wordpress already includes jQuery. jQuery code should be inside </head> tag:

```sh
<script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
```

Simple Scroll Gallery consists of three files: 
- **ssg.js** - the gallery code 
- **ssg.css** - the gallery styles 
- **ssg-loaded.html (optional)** -  a html file to load behind the last photo, typically a signpost to other galleries.

If you want to adjust how the gallery looks or behave, you have to edit ssg.css or ssg.js file. The gallery loads a signpost behind the last photo. You have to edit the signpost to contain your hyperlinks. Deactivate the signpost or write its new URL on **line 13 in ssg.js file**.

## How the gallery works
Simple Scroll Gallery looks for all hyperlinks (<a> tags) on the page that points to an image file  (extensions: jpg, jpeg, JPG, png, PNG, gif, GIF). SSG adds to all these hyperlinks onclick function which runs the gallery.

SGG excellently cooperates with the **Wordpress built-in gallery**. Wordpress creates image thumbnails with hyperlinks, and SGG assembles them into a fullscreen image presentation.

The image the user clicked on is displayed first, then follow other images in the order they appear on the page. If the clicked image is sixth in order or higher (7th, 8th,..), then the image is displayed twice. On the first place and on its original place. Because that image can be part of some image series and it would be missing there.

The **text caption** below images is taken from the alt attribute. If there is no alt attribute, the gallery shows just an empty stripe.

You can also run the gallery by calling SSG.run method:

```sh
<a onclick="SSG.run();">Show gallery</a>
```

And use arguments - any image url and any text caption.
```sh
<a onclick="SSG.run({img: {href: 'url', alt: 'some text' }});">
Show gallery</a>
```

You can **link inside the gallery** to show a particular photo. Just add a hashtag with photo's name after url. For example this link http://ssg.flor.cz/#element shows the photo paty-element.jpg. It is enough to have in the hashtag crucial part of the name.

## Fullscreen mode
Fullscreen mode can be activated four ways.
Adding the fs class to the parent tag of <a> tags. The fs class must be the first class. All images inside mygallery activate fullscreen mode:
```sh
<div class='fs mygallery'>
<a href='big-image.jpg'> <img src='thumbnail.jpg'></a>
<a href='big-image2.jpg'> <img src='thumbnail2.jpg'></a>
</div>
```
Running the gallery by calling the SSG.run method with the fs:true parameter.

```sh
<a onclick='SSG.run({fs:true})'> Show gallery</a>
```
Wrap the image in a DT tag as it is in a Wordpress gallery. This single image activates fullscreen mode:

```sh
<dt><a href='big-image.jpg'> <img src='thumbnail.jpg'></a></dt> 
```
Adding the fs class to <a> tag. The fs class must be the first class. This single image activates fullscreen mode:
```sh
<a class='fs' href='big-image.jpg'> <img src='thumbnail.jpg'></a> 
```

## Navigation in the gallery ~ jump scroll
There are two options. Classic scrolling with a scrollbar or fingers. And then jump scroll. A mouse wheel and arrow keys have an altered function, they scroll from one image to next image.

**Move to the next image**: mouse wheel, down arrow key, right arrow, PgDn key or spacebar. 
**Move to the previous image**: mouse wheel, press up arrow key, left arrow, or PgUP key.

For **touch screens** there are two invisible areas: the top and bottom half of the screen. After tapping somewhere into the bottom (top) half, SSG jump scroll to the next (previous) image.
&nbsp;

[![N|Solid](https://www.flor.cz/blog/wp-content/uploads/simple-scroll-gallery.jpg)](http://ssg.flor.cz/)