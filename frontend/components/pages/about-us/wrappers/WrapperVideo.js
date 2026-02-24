"use client"

import { useState } from "react"
import ImageCms from "@/components/utils/imageCms/imageCms"

const WrapperVideo = ({ wrapper, lang = "en" }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!wrapper || !wrapper.video?.asset) return null

  const videoUrl = wrapper.video.asset.url
  const posterImage = wrapper.posterImage
  const autoplay = wrapper.autoplay || false
  const loop = wrapper.loop || false
  const muted = wrapper.muted !== undefined ? wrapper.muted : true

  const posterAltText = posterImage?.alt
    ? typeof posterImage.alt === 'object'
      ? posterImage.alt[lang] || posterImage.alt.en || ""
      : posterImage.alt
    : "Video thumbnail"

  const videoAlt = wrapper.video?.alt && typeof wrapper.video.alt === "object"
    ? wrapper.video.alt[lang] || wrapper.video.alt.en || ""
    : wrapper.video?.alt || "Video"

  if (autoplay && !isPlaying) {
    setIsPlaying(true)
  }

  return (
    <div className="wrapper wrapper-video">
      {!isPlaying && posterImage && (
        <div className="wrapper-video__thumbnail" onClick={() => setIsPlaying(true)}>
          <ImageCms image={posterImage} alt={posterAltText} />
          <div className="wrapper-video__play-button">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="white" fillOpacity="0.9"/>
              <path d="M32 24L32 56L56 40L32 24Z" fill="black"/>
            </svg>
          </div>
        </div>
      )}
      {isPlaying && (
        <div className="wrapper-video__player">
          <video
            src={videoUrl}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline
            preload="auto"
            className="wrapper-video__video"
            aria-label={videoAlt}
            title={videoAlt}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      {!posterImage && (
        <div className="wrapper-video__player">
          <video
            src={videoUrl}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline
            preload="auto"
            className="wrapper-video__video"
            aria-label={videoAlt}
            title={videoAlt}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  )
}

export default WrapperVideo

