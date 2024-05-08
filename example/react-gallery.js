import { useState } from "react";
import StoryShowGallery, { SSG } from "story-show-gallery/src/react";
import "story-show-gallery/src/ssg.css";

// SsgReactExample is a sample React page/component, which imports and uses StoryShowGallery
// you have to copy and import it into your React project, to try it 
// short React tutorial is at https://roman-flossler.github.io/StoryShowGallery/#react-nextjs 

function SsgReactExample() {
  // useState is here only as an example, how the SSG parameters can be switched using React
  // cross state is used for switching normal cursor to cross cursor inside the gallery
  const [cross, setCross] = useState(false);


  // iceland array defines url, caption and author of photos
  const iceland = [];
  iceland[0] = {
    href: "https://roman-flossler.github.io/StoryShowGallery/photos/reynisdrangar-black-beach.jpg",
    alt: "Black beach Reynisfjara with Reynisdrangar rocks. There are sneaker waves which can easily pull you off into the sea.",
  };
  iceland[1] = {
    href: "https://roman-flossler.github.io/StoryShowGallery/photos/Seljalandsfoss.jpg",
    alt: "Northern lights behind Seljalandsfoss waterfall",
    author: "photo by Flor",
  };
  iceland[2] = {
    href: "https://roman-flossler.github.io/StoryShowGallery/photos/iceland-horses.jpg",
  };

  // StoryShowGallery component loads ssg.js and ssg.css and via config parameter you can configure the gallery
  // with SSG.run you can create the brand new gallery and overide global config
  // but SSG.run isn't needed, SSG binds onto image hyper­links on the page and you can control the gallery via CSS classes

  return (
    <div>
      <StoryShowGallery
        config={{
          fileToLoad: "https://roman-flossler.github.io/StoryShowGallery/play.html",
          watermarkText: "ꐠ Story Show Gallery",
          watermarkOpacity: 0.44,
          theme: "dim",
          crossCursor: cross,
          observeDOM: true,
          // SSG will observe DOM for changes, to know about image hyperlinks changes after page loads / render.
          // If you use routing in React or Next.js, observeDOM should be set to true, otherwise SSG won't work (except SSG.run with imgs array).
        }}
      />

      <div className="butts" style={{ margin: "6em 0 2em 0", textAlign: 'center' }}>
        <button
          onClick={() => {
            SSG.run({
              imgs: iceland,
              fs: false,
              initImgID: 1,
              cfg: {
                theme: "black",
                watermarkText: "〄 Iceland",
              },
            });
          }}
        >
          SSG.run of the Iceland gallery
        </button>
        ____
        <button
          onClick={() => {
            setCross(!cross);
          }}
        >
          gallery crossCursor = {cross.toString()}
        </button>
        ____
        <button
          onClick={() => {
            SSG.run({ fs: true });
          }}
        >
          Simple SSG.run of imgs on entire page
        </button>
      </div>


      <div style={{ textAlign: "center", marginBottom: '6em' }} className="ssg fs ssglight">
        <a
          href="https://roman-flossler.github.io/StoryShowGallery/photos/its-time.jpg"
          data-author="photo by Flor"
        >
          <img
            src="https://roman-flossler.github.io/StoryShowGallery/thumbs/thumb_its-time.jpg"
            alt="It's time! For a foto shoot of course."
          />
        </a>
        &nbsp;
        <a href="https://roman-flossler.github.io/StoryShowGallery/photos/on-the-hook.jpg">
          <img
            src="https://roman-flossler.github.io/StoryShowGallery/thumbs/thumb_on-the-hook.jpg"
            alt="All the photos are from Michal coal mine in Ostrava city."
          />
        </a>
        &nbsp;
        <a href="https://roman-flossler.github.io/StoryShowGallery/photos/refreshment.jpg">
          <img
            src="https://roman-flossler.github.io/StoryShowGallery/thumbs/thumb_refreshment.jpg"
            alt=""
          />
        </a>
      </div>
    </div>
  );
}

export default SsgReactExample;
