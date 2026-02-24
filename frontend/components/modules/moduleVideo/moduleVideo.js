"use client";

import { useState } from "react";
import ImageCms from "../../utils/imageCms/imageCms";

const ModuleVideo = ({ module, lang = "en" }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!module?.vimeoId) return null;

  const flag = module.flagTitle && typeof module.flagTitle === "object" 
    ? module.flagTitle[lang] || module.flagTitle.en || "" 
    : ""

  const altText = module.illustrativeImage?.alt && typeof module.illustrativeImage.alt === "object"
    ? module.illustrativeImage.alt[lang] || module.illustrativeImage.alt.en || ""
    : module.illustrativeImage?.alt || "Video thumbnail"

  const vimeoUrl = `https://player.vimeo.com/video/${module.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`

  return (
    <section className="moduleVideo module">
      {flag && (
        <div className="module__flag" data-readable="true">
          <span>{flag}</span>
        </div>
      )}
      <div className="moduleVideo__container">
        {!isPlaying && module.illustrativeImage && (
          <button
            type="button"
            className="moduleVideo__thumbnail"
            onClick={() => setIsPlaying(true)}
            aria-label={lang === "de" ? "Video abspielen" : "Play video"}
          >
            <ImageCms image={module.illustrativeImage} alt={altText} />
            <div className="moduleVideo__play-button" aria-hidden="true">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="40" fill="white" fillOpacity="0.9"/>
                <path d="M32 24L32 56L56 40L32 24Z" fill="black"/>
              </svg>
            </div>
          </button>
        )}
        {isPlaying && (
          <div className="moduleVideo__iframe-wrapper">
            <iframe
              src={vimeoUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={altText}
              aria-label={altText}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleVideo;

