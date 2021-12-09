import { useEffect } from "react";
import jQuery from "jquery";
import SSG from "./ssg.esm.js";
import "./ssg.css";


function StoryShowGallery({ config }) {
  let configString = JSON.stringify(config);

  useEffect(() => {
    window.jQuery = jQuery;
    Object.assign(SSG.cfg, config);
    

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
            SSG.jQueryImgCollection.click(SSG.run);
            SSG.addClasses();
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

  return true;
}

export default StoryShowGallery;
export { SSG };
