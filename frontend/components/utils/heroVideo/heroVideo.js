"use client"

import { useState, useEffect } from "react"
import ImageCms from "../imageCms/imageCms"

const HeroVideo = ({ video, lang = "en", className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  if (!video || !video.asset) return null

  const videoUrl = video.asset.url
  const posterImage = video.poster
  const autoplay = video.autoplay !== undefined ? video.autoplay : true
  const loop = video.loop !== undefined ? video.loop : true
  const muted = video.muted !== undefined ? video.muted : true

  const posterAltText = posterImage?.alt
    ? typeof posterImage.alt === 'object'
      ? posterImage.alt[lang] || posterImage.alt.en || "Video thumbnail"
      : posterImage.alt
    : "Video thumbnail"

  const videoAlt = video?.alt && typeof video.alt === "object"
    ? video.alt[lang] || video.alt.en || "Hero video"
    : video?.alt || "Hero video"

  useEffect(() => {
    if (autoplay && !hasUserInteracted) {
      setIsPlaying(true)
    }
  }, [autoplay, hasUserInteracted])

  const handlePlayClick = () => {
    setIsPlaying(true)
    setHasUserInteracted(true)
  }

  return (
    <div className={`hero-video ${className}`.trim()}>
      {!isPlaying && posterImage && (
        <button
          type="button"
          className="hero-video__poster"
          onClick={handlePlayClick}
          aria-label={lang === "de" ? "Video abspielen" : "Play video"}
        >
          <ImageCms image={posterImage} alt={posterAltText} className="hero-video__poster-image" />
          <div className="hero-video__play-button" aria-hidden="true">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="white" fillOpacity="0.9"/>
              <path d="M32 24L32 56L56 40L32 24Z" fill="black"/>
            </svg>
          </div>
        </button>
      )}
      
      {isPlaying && (
        <div className="hero-video__player">
          <video
            src={videoUrl}
            autoPlay={autoplay && !hasUserInteracted}
            loop={loop}
            muted={muted}
            playsInline
            preload="auto"
            className="hero-video__video"
            aria-label={videoAlt}
            title={videoAlt}
          >
            <track kind="captions" srcLang={lang} label={lang === "de" ? "Untertitel" : "Captions"} default />
            {lang === "de" 
              ? "Ihr Browser unterstützt das Video-Tag nicht."
              : "Your browser does not support the video tag."
            }
          </video>
        </div>
      )}
      
      {!posterImage && (
        <div className="hero-video__player">
          <video
            src={videoUrl}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline
            preload="auto"
            className="hero-video__video"
            aria-label={videoAlt}
            title={videoAlt}
          >
            <track kind="captions" srcLang={lang} label={lang === "de" ? "Untertitel" : "Captions"} default />
            {lang === "de" 
              ? "Ihr Browser unterstützt das Video-Tag nicht."
              : "Your browser does not support the video tag."
            }
          </video>
        </div>
      )}
    </div>
  )
}

export default HeroVideo

