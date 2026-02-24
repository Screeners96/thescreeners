"use client"

import { useState, useRef, useEffect } from "react"

const ProjectModuleVideo = ({ module, lang = "en" }) => {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)
  const [videoDimensions, setVideoDimensions] = useState({ width: '100%', height: '100%' })

  if (!module?.video?.asset?.url) return null

  const videoUrl = module.video.asset.url
  const posterUrl = module.poster?.asset?.url || ""

  const videoAlt = module.video?.alt && typeof module.video.alt === "object"
    ? module.video.alt[lang] || module.video.alt.en || ""
    : module.video?.alt || "Project video"

  const posterAlt = module.poster?.alt && typeof module.poster.alt === "object"
    ? module.poster.alt[lang] || module.poster.alt.en || ""
    : module.poster?.alt || ""

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      const videoWidth = video.videoWidth
      const videoHeight = video.videoHeight
      
      const slide = video.closest('.modal-slider__slide')
      if (!slide || !videoWidth || !videoHeight) return

      const slideWidth = slide.clientWidth
      const slideHeight = slide.clientHeight
      const videoRatio = videoWidth / videoHeight
      const slideRatio = slideWidth / slideHeight

      let width, height

      if (videoRatio > slideRatio) {
        width = slideWidth
        height = slideWidth / videoRatio
      } else {
        height = slideHeight
        width = slideHeight * videoRatio
      }

      setVideoDimensions({ width: `${width}px`, height: `${height}px` })
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    if (video.readyState >= 1) {
      handleLoadedMetadata()
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="project-module-video">
      <div className="project-module-video__wrapper">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          autoPlay={module.autoplay || false}
          loop={module.loop || false}
          muted={true}
          playsInline
          className="project-module-video__element"
          aria-label={videoAlt}
          title={videoAlt}
          style={{ width: videoDimensions.width, height: videoDimensions.height }}
        >
          {lang === "de" ? "Ihr Browser unterstützt das Video-Element nicht." : "Your browser does not support the video element."}
        </video>
      </div>
      <button
        type="button"
        className="project-module-video__unmute"
        onClick={handleToggleMute}
        aria-label={isMuted ? (lang === "de" ? "Ton einschalten" : "Unmute") : (lang === "de" ? "Ton ausschalten" : "Mute")}
      >
        {isMuted ? (lang === "de" ? "Unmute" : "Unmute") : (lang === "de" ? "Mute" : "Mute")}
      </button>
    </div>
  )
}

export default ProjectModuleVideo
