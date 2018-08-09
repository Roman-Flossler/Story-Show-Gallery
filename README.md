# Simple Scroll Gallery

I've made Simple Scroll Gallery for my blog about photography. I wanted simple gallery which is easy to navigate. The user only needs to scroll down - just like on Facebook. But SSG uses "jump scroll".  You can try it on [sample  gallery page at ssg.Flor.cz](http://ssg.flor.cz/).

## Main features

- SSG is fully responsive - works on desktop, tablets and smartphones
- Minimalist and unobtrusive - it gives max. space to images
- Images are gradually loaded as the user scrolls down
- There can be a caption under each image
- You can put your logo with copyright over images
- SSG supports Google Analytics. When user views an image it is counted as virtual pageview.

## License
Simple Scroll Gallery is licensed under Mozilla Public License 2.0. There is one exception added in license. It is not granted to develop a Wordpress plugin that includes SSG. I am planning to do it.

## How to implement gallery
Simple Scroll Gallery is very easy to implement on your website. You just need to add two lines of code somewhere before </body> tag:

```sh
<link rel="stylesheet" href="ssg.css" type="text/css">
<script type="text/javascript" src="ssg.js"></script>
```
If you don't already use jQuery you also have to include jQuery.js at least in version 1.5. Gallery is compatible with Wordpress and its version of jQuery. If you want to adjust how gallery looks or behave you have to edit css or js file.

## How gallery works
Simple Scroll Gallery looks for all <a> tags on the page that points to image file (jpg, png, gif). SSG adds to all these <a> tags onclick function which runs the gallery. You can also run gallery by calling SSG.run method:

```sh
<a onclick="SSG.run();">Show gallery</a>
```

The image the user clicked on is displayed first, then follows other images in the order they appear on the page.

Text caption under images is taken from alt atribute. If there is no alt atribute gallery shows just empty stripe.

## Navigation in gallery ~ jump scroll
There are two options. Classic scrolling with scrollbar or fingers. And then jump scroll. Mouse wheel and arrow keys have altered function - they scroll from one image to next image. The same functionality have navigation arrows on the right side. They are mainly for touch screens. Up and left arrow key does the same thing (previous image) as well as down and right key navigate to next image. For some users can be more comfortable use left and right arrow instead of up and down arrow.
 .

[![N|Solid](https://www.flor.cz/blog/wp-content/uploads/simple-scroll-gallery.jpg)](http://ssg.flor.cz/)