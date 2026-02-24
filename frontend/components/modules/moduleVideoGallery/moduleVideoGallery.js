"use client";

import { useState } from "react";
import ImageCms from "../../utils/imageCms/imageCms";

const ModuleVideoGallery = ({ module, lang = "en" }) => {
  if (!module?.items || module.items.length === 0) return null;

  const flag = module.flagTitle && typeof module.flagTitle === "object" 
    ? module.flagTitle[lang] || module.flagTitle.en || "" 
    : ""

  return (
    <section className="moduleVideoGallery module">
      {flag && (
        <div className="module__flag" data-readable="true">
          <span>{flag}</span>
        </div>
      )}
      <div className="moduleVideoGallery__grid">
        {module.items.map((item, index) => {
          if (item._type === "videoItem") {
            return (
              <VideoItem 
                key={item._key || index} 
                item={item} 
                lang={lang}
              />
            );
          } else if (item._type === "imageItem") {
            return (
              <ImageItem 
                key={item._key || index} 
                item={item} 
                lang={lang}
              />
            );
          }
          return null;
        })}
      </div>
    </section>
  );
};

const VideoItem = ({ item, lang }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!item.vimeoId) return null;

  const altText = item.illustrativeImage?.alt && typeof item.illustrativeImage.alt === "object"
    ? item.illustrativeImage.alt[lang] || item.illustrativeImage.alt.en || ""
    : item.illustrativeImage?.alt || "Video thumbnail"

  const vimeoUrl = `https://player.vimeo.com/video/${item.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`

  return (
    <div className="moduleVideoGallery__item moduleVideoGallery__item--video">
      {!isPlaying && item.illustrativeImage && (
        <button
          type="button"
          className="moduleVideoGallery__thumbnail"
          onClick={() => setIsPlaying(true)}
          aria-label={lang === "de" ? "Video abspielen" : "Play video"}
        >
          <ImageCms image={item.illustrativeImage} alt={altText} />
          <div className="moduleVideoGallery__play-button" aria-hidden="true">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="30" fill="white" fillOpacity="0.9"/>
              <path d="M24 18L24 42L42 30L24 18Z" fill="black"/>
            </svg>
          </div>
        </button>
      )}
      {isPlaying && (
        <div className="moduleVideoGallery__iframe-wrapper">
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
  );
};

const ImageItem = ({ item, lang }) => {
  if (!item.image) return null;

  const altText = item.image?.alt && typeof item.image.alt === "object"
    ? item.image.alt[lang] || item.image.alt.en || ""
    : item.image?.alt || "Gallery image"

  return (
    <div className="moduleVideoGallery__item moduleVideoGallery__item--image">
      <ImageCms image={item.image} alt={altText} />
    </div>
  );
};

export default ModuleVideoGallery;

