"use client"

import { useState, useEffect, useRef } from "react"
import ImageCms from "../../utils/imageCms/imageCms"

const ProjectModuleVimeo = ({ module, lang = "en" }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [vimeoThumbnail, setVimeoThumbnail] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [thumbnailDimensions, setThumbnailDimensions] = useState({ width: '100%', height: '100%' })
  const [wrapperDimensions, setWrapperDimensions] = useState({ width: '100%', height: '100%' })
  const [iframeDimensions, setIframeDimensions] = useState({ width: '100%', height: '100%' })
  const [vimeoData, setVimeoData] = useState(null)
  const thumbnailRef = useRef(null)
  const iframeRef = useRef(null)

  const vimeoId = module?.vimeoId || module?.vimeoId?.toString()

  if (!vimeoId) {
    console.warn("ProjectModuleVimeo: No vimeoId found", module)
    return null
  }

  const altText = module?.alt && typeof module.alt === "object"
    ? module.alt[lang] || module.alt.en || ""
    : module?.alt || "Vimeo video"

  const vimeoUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&controls=0&muted=1`

  useEffect(() => {
    if (!module.illustrativeImage && vimeoId) {
      fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=1920`)
        .then(res => res.json())
        .then(data => {
          if (data.thumbnail_url) {
            const highQualityUrl = data.thumbnail_url.replace(/_\d+x\d+/, '_1920x1080').replace(/_\d+\./, '_1920.')
            setVimeoThumbnail(highQualityUrl)
          }
          setVimeoData(data)
        })
        .catch(err => {
          console.warn("Failed to fetch Vimeo thumbnail:", err)
        })
    }
  }, [vimeoId, module.illustrativeImage])

  useEffect(() => {
    if (isPlaying) {
      setIframeKey(prev => prev + 1)
    }
  }, [isPlaying])

  useEffect(() => {
    const handlePauseVimeo = () => {
      const iframes = document.querySelectorAll('.project-module-vimeo__iframe-wrapper iframe')
      iframes.forEach(iframe => {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage('{"method":"pause"}', '*')
        }
      })
    }

    window.addEventListener('pauseVimeo', handlePauseVimeo)
    
    return () => {
      window.removeEventListener('pauseVimeo', handlePauseVimeo)
    }
  }, [])

  useEffect(() => {
    const thumbnail = thumbnailRef.current
    if (!thumbnail) return

    const calculateDimensions = (element) => {
      const swiper = element.closest('.modal-slider__swiper')
      if (!swiper) return

      const swiperHeight = swiper.clientHeight

      let imageWidth, imageHeight

      if (vimeoData && vimeoData.width && vimeoData.height) {
        imageWidth = vimeoData.width
        imageHeight = vimeoData.height
      } else {
        const img = element.querySelector('img')
        if (img && img.naturalWidth && img.naturalHeight) {
          imageWidth = img.naturalWidth
          imageHeight = img.naturalHeight
        } else {
          return
        }
      }

      const aspectRatio = imageWidth / imageHeight
      const wrapperWidth = swiperHeight * aspectRatio
      const wrapperHeight = swiperHeight 

      const iframeWidth = wrapperWidth 
      const iframeHeight = wrapperHeight

      setThumbnailDimensions({ width: `${wrapperWidth}px`, height: `${wrapperHeight}px` })
      setWrapperDimensions({ width: `${wrapperWidth}px`, height: `${wrapperHeight}px` })
      setIframeDimensions({ width: `${iframeWidth}px`, height: `${iframeHeight}px` })

      const vimeoModule = element.closest('.project-module-vimeo')
      if (vimeoModule) {
        const offsetPx = iframeHeight * 0.03
        vimeoModule.style.transform = `translateY(${offsetPx}px) scale(1.05)`
      }

      const slideContent = element.closest('.modal-slider__slide-content')
      if (slideContent) {
        const altText = slideContent.querySelector('.modal-slider__alt')
        if (altText) {
          const offsetPx = iframeHeight * 0.07
          altText.style.transform = `translateY(${offsetPx}px)`
        }
      }
    }

    const handleImageLoad = () => {
      calculateDimensions(thumbnail)
    }

    const img = thumbnail.querySelector('img')
    if (img) {
      if (img.complete) {
        handleImageLoad()
      } else {
        img.addEventListener('load', handleImageLoad)
        return () => {
          img.removeEventListener('load', handleImageLoad)
        }
      }
    } else {
      setTimeout(() => calculateDimensions(thumbnail), 100)
    }
  }, [vimeoThumbnail, vimeoData])

  useEffect(() => {
    if (isPlaying && vimeoData && vimeoData.width && vimeoData.height) {
      const iframe = iframeRef.current
      if (!iframe) return

      const swiper = iframe.closest('.modal-slider__swiper')
      if (!swiper) return

      const swiperHeight = swiper.clientHeight
      const aspectRatio = vimeoData.width / vimeoData.height
      const wrapperWidth = swiperHeight * aspectRatio
      const wrapperHeight = swiperHeight 

      const iframeWidth = wrapperWidth * 0.82
      const iframeHeight = wrapperHeight * 0.82

      console.log('Vimeo sizing:', {
        swiperHeight,
        aspectRatio: `${vimeoData.width}/${vimeoData.height} = ${aspectRatio}`,
        wrapper: `${wrapperWidth}px × ${wrapperHeight}px`,
        iframe: `${iframeWidth}px × ${iframeHeight}px`
      })

      setWrapperDimensions({ width: `${wrapperWidth}px`, height: `${wrapperHeight}px` })
      setIframeDimensions({ width: `${iframeWidth}px`, height: `${iframeHeight}px` })

      const vimeoModule = iframe.closest('.project-module-vimeo')
      if (vimeoModule) {
        const offsetPx = iframeHeight * 0.05
        vimeoModule.style.transform = `translateY(${offsetPx}px) scale(1.2)`
      }

      const slideContent = iframe.closest('.modal-slider__slide-content')
      if (slideContent) {
        const altText = slideContent.querySelector('.modal-slider__alt')
        if (altText) {
          const offsetPx = iframeHeight * 0.08
          altText.style.transform = `translateY(${offsetPx}px)`
        }
      }
    }
  }, [isPlaying, vimeoData])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handleToggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    
    const iframe = document.querySelector('.project-module-vimeo__iframe-wrapper iframe')
    if (iframe && iframe.contentWindow) {
      const volume = newMutedState ? 0 : 1
      iframe.contentWindow.postMessage(JSON.stringify({
        method: 'setVolume',
        value: volume
      }), '*')
    }
  }

  const vimeoUrlWithMute = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&controls=0&muted=${isMuted ? 1 : 0}`

  return (
    <div className="project-module-vimeo">
      {!isPlaying && (
        <button
          type="button"
          className="project-module-vimeo__thumbnail"
          onClick={handlePlay}
          aria-label={lang === "de" ? "Video abspielen" : "Play video"}
          ref={thumbnailRef}
          style={{ width: thumbnailDimensions.width, height: thumbnailDimensions.height }}
        >
          {module.illustrativeImage ? (
            <ImageCms image={module.illustrativeImage} alt={altText} />
          ) : vimeoThumbnail ? (
            <img 
              src={vimeoThumbnail} 
              alt={altText}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "transparent" }} />
          )}
          <div className="project-module-vimeo__play-button" aria-hidden="true">
            <svg width="329" height="122" viewBox="0 0 329 122" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M317 0C323.627 7.40896e-07 329 5.37258 329 12V110C329 116.627 323.627 122 317 122H12C5.37258 122 1.28855e-07 116.627 0 110V12C1.28855e-07 5.37258 5.37258 7.85189e-08 12 0H317ZM146.086 25.7188C143.421 24.09 140 26.0084 140 29.1318V91.8682C140 94.9916 143.421 96.91 146.086 95.2812L197.415 63.9131C199.967 62.3533 199.967 58.6467 197.415 57.0869L146.086 25.7188Z" fill="white"/>
            </svg>
          </div>
        </button>
      )}
      {isPlaying && (
        <div 
          className="project-module-vimeo__iframe-wrapper"
          style={{ 
            width: wrapperDimensions.width,
            height: wrapperDimensions.height
          }}
        >
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={vimeoUrlWithMute}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={altText}
            aria-label={altText}
            style={{ 
              border: "none",
              width: iframeDimensions.width,
              height: iframeDimensions.height
            }}
          />
          <button
            type="button"
            className="project-module-vimeo__unmute"
            onClick={handleToggleMute}
            aria-label={isMuted ? (lang === "de" ? "Ton einschalten" : "Unmute") : (lang === "de" ? "Ton ausschalten" : "Mute")}
          >
            {isMuted ? (lang === "de" ? "Unmute" : "Unmute") : (lang === "de" ? "Mute" : "Mute")}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectModuleVimeo
