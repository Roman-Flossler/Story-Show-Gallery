import { useEffect } from "react";
import jQuery from "jquery";
import SSG from "./ssg.esm.js";
import exifr from "exifr/dist/lite.esm";

function StoryShowGallery({ config }) {
  let configString = JSON.stringify(config);

  useEffect(() => {
    window.jQuery = jQuery;
    Object.assign(SSG.cfg, config);
    window.exifr = exifr;

    jQuery(document).ready(function () {
      !SSG.jQueryImgCollection && SSG.beforeRun();
      SSG.jQueryImgCollection.click(SSG.run);
      window.setTimeout(function () {
        !SSG.running && SSG.getHash(false);
      }, 10);

      if (SSG.cfg.observeDOM) {
        SSG.observerCallback = function () {
          if (SSG.jQueryImgCollection && !SSG.running) {
            SSG.jQueryImgCollection = jQuery(SSG.jQueryImgSelector).filter(
              jQuery("a:not(.nossg)")
            );
            let urlsSum = "";
            SSG.jQueryImgCollection.toArray().forEach((el) => {
              urlsSum = urlsSum + el.href;
            });
            if (SSG.urlsSum != urlsSum) {
              SSG.jQueryImgCollection.click(SSG.run);
              SSG.addClasses();
              SSG.urlsSum = urlsSum;
            }
          }
        };
        SSG.observer = new MutationObserver(SSG.observerCallback);
        SSG.observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  }, []);

  useEffect(() => {
    Object.assign(SSG.cfg, config);
  }, [configString]);

  return null;
}

export default StoryShowGallery;
export { SSG };
