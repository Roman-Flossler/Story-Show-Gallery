# Simple Scroll Gallery

I've made Simple Scroll Gallery for my Wordpress blog about photography. I wanted a simple gallery (without disturbing elements) which works similarly like a presentation. A user only needs to scroll down and sees image by image. You can try it on the [sample  gallery page at ssg.Flor.cz](http://ssg.flor.cz/).

## Main features

- SSG is fully **responsive** - works on a desktop, tablets and smartphones
- Minimalist and **unobtrusive** - SSG gives max. space to images
- **Fullscreen** mode with an unobtrusive scrollbar and cursor
- **Jump scroll** automatically scrolls from image to image
- Images are gradually loaded as a user scrolls down
- There can be a caption under each image and **your logo** over the image
- SSG supports **Google analytics**. When a user views an image it is counted as a virtual pageview.
- You can **link inside the gallery** to show a particular photo.
- After the last photo SSG can load a **signpost** to other galleries

## License
You can use SSG freely [under Mozilla Public License 2.0](https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)). There is one exception added in the license. It is not granted to develop a Wordpress plugin based on SSG. I am planning to do it.


## How to implement gallery
Simple Scroll Gallery is very easy to implement on your website. You just need to add two lines of code somewhere before </body> tag:

```sh
<link rel="stylesheet" href="ssg.css" type="text/css">
<script type="text/javascript" src="ssg.js"></script>
```
If you don't already use jQuery, you also have to include jQuery.js at least in version 1.5. The gallery is compatible with Wordpress and its version of jQuery. If you want to adjust how the gallery looks or behave you have to edit css or js file.

The same situation is in case of a signpost which can be loaded after gallery. If you want it, you have to create the signpost in HTML or edit mine.

## How gallery works
Simple Scroll Gallery looks for all hyperlinks (<a> tags) on a page that points to an image file (jpg, png, gif). SSG adds to all these hyperlinks onclick function which runs the gallery.

SGG excellently cooperates with the **Wordpress built-in gallery**. Wordpress creates image thumbnails with hyperlinks, and SGG assembles them into a fullscreen image presentation.

The image the user clicked on is displayed first, then follow other images in the order they appear on the page. If the clicked image is sixth in order or highter (7th, 8th,..), then the image is displayed twice. On the first place and on its original place. Becouse that image can be part of some image series and it would be missing there.

The text caption below images is taken from the alt atribute. If there is no alt atribute, the gallery shows just an empty stripe.

You can also run the gallery by calling SSG.run method:

```sh
<a onclick="SSG.run();">Show gallery</a>
```

And use arguments - any image url and any text caption.
```sh
<a onclick="SSG.run({img: {href: 'url', alt: 'some text' }});">
Show gallery</a>
```

You can link inside the gallery to show a particular photo. Just add a hashtag with photo's name after url. For example this link http://ssg.flor.cz/#bangkang shows the photo lombok-bangkang-cave.jpg. It is enough to have in the hashtag crucial part of the name.

## Fullscreen mode
Fullscreen mode can be activated four ways.
Adding the fs class to the parrent tag of <a> tags. The fs class must be the first class. All images inside mygallery activate fullscreen mode:
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

## Navigation in gallery ~ jump scroll
There are two options. Classic scrolling with a scrollbar or fingers. And then jump scroll. A mouse wheel and arrow keys have an altered function - they scroll from one image to next image.

Move to the next image: down arrow key, right arrow, PgDn key or spacebar. 
Move to the previous image: press up arrow key, left arrow, or PgUP key.

For touch screens there are two invisible areas - the top and bottom half of the screen. After tapping somewhere into the bottom half, SSG jump scroll to the next image.
&nbsp;

[![N|Solid](https://www.flor.cz/blog/wp-content/uploads/simple-scroll-gallery.jpg)](http://ssg.flor.cz/)