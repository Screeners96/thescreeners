"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { Navigation, Pagination } from "swiper"
import ProjectModuleImage from "../../modules/projectModuleImage/projectModuleImage"
import ProjectModuleVimeo from "../../modules/projectModuleVimeo/projectModuleVimeo"
import ProjectModuleVideo from "../../modules/projectModuleVideo/projectModuleVideo"
import BodyText from "../../bodyText/bodyText"

SwiperCore.use([Navigation, Pagination])

const ModalSlider = ({ modules = [], title = "", bodyText = [], lang = "en" }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [swiperKey, setSwiperKey] = useState(Date.now())
  const [swiperInstance, setSwiperInstance] = useState(null)

  useEffect(() => {
    setActiveIndex(0)
    setSwiperKey(Date.now())
  }, [modules])

  useEffect(() => {
    if (swiperInstance) {
      setTimeout(() => {
        swiperInstance.slideTo(0, 0)
      }, 0)
    }
  }, [swiperInstance])

  if (!modules || modules.length === 0) return null

  const flattenedModules = []

  modules.forEach((module) => {
    if (module._type === "projectModuleSlider") {
      const images = module?.images || module?.slides || []
      images.forEach((item, index) => {
        flattenedModules.push({
          _type: "projectModuleImage",
          _key: `${module._key || 'slider'}-${index}`,
          image: item?.image || item
        })
      })
    } else {
      flattenedModules.push(module)
    }
  })

  if (flattenedModules.length === 0) return null

  const renderModule = (module) => {
    switch (module._type) {
      case "projectModuleImage":
        return <ProjectModuleImage module={module} lang={lang} />
      case "projectModuleVimeo":
        if (!module.vimeoId) {
          console.warn("ModalSlider: projectModuleVimeo missing vimeoId", module)
        }
        return <ProjectModuleVimeo module={module} lang={lang} key={module._key} />
      case "projectModuleVideo":
        return <ProjectModuleVideo module={module} lang={lang} />
      default:
        return null
    }
  }

  const getModuleAlt = (module) => {
    if (module._type === "projectModuleImage") {
      const altText = module.image?.alt || module.alt || ""
      if (typeof altText === "object" && altText !== null) {
        return altText[lang] || altText.en || ""
      }
      return altText
    }
    if (module._type === "projectModuleVideo") {
      const altText = module.video?.alt || module.alt || ""
      if (typeof altText === "object" && altText !== null) {
        return altText[lang] || altText.en || ""
      }
      return altText
    }
    if (module._type === "projectModuleVimeo") {
      const altText = module.alt || ""
      if (typeof altText === "object" && altText !== null) {
        return altText[lang] || altText.en || ""
      }
      return altText
    }
    return ""
  }

  const displayTitle = typeof title === "object" && title !== null && !Array.isArray(title)
    ? title[lang] || title.en || ""
    : title || ""

  const displayBodyText = Array.isArray(bodyText) ? bodyText : []

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkClipPath = () => {
        console.log("=== CLIP-PATH DEBUG ===")
        
        const vimeoModule = document.querySelector(".project-module-vimeo")
        const vimeoThumbnail = document.querySelector(".project-module-vimeo__thumbnail")
        const vimeoThumbnailImg = document.querySelector(".project-module-vimeo__thumbnail img")
        const vimeoIframeWrapper = document.querySelector(".project-module-vimeo__iframe-wrapper")
        const vimeoIframe = document.querySelector(".project-module-vimeo__iframe-wrapper iframe")
        const imageModule = document.querySelector(".project-module-image")
        const imageImg = document.querySelector(".project-module-image img")
        
        console.log("Elements found:", {
          vimeoModule: !!vimeoModule,
          vimeoThumbnail: !!vimeoThumbnail,
          vimeoThumbnailImg: !!vimeoThumbnailImg,
          vimeoIframeWrapper: !!vimeoIframeWrapper,
          vimeoIframe: !!vimeoIframe,
          imageModule: !!imageModule,
          imageImg: !!imageImg
        })
        
        if (vimeoModule) {
          console.log("Vimeo module clip-path:", window.getComputedStyle(vimeoModule).clipPath)
        }
        
        if (vimeoThumbnail) {
          console.log("Vimeo thumbnail clip-path:", window.getComputedStyle(vimeoThumbnail).clipPath)
        }
        
        if (vimeoThumbnailImg) {
          console.log("Vimeo thumbnail img clip-path:", window.getComputedStyle(vimeoThumbnailImg).clipPath)
        }
        
        if (vimeoIframeWrapper) {
          console.log("Vimeo iframe wrapper clip-path:", window.getComputedStyle(vimeoIframeWrapper).clipPath)
          console.log("Vimeo iframe wrapper border-radius:", window.getComputedStyle(vimeoIframeWrapper).borderRadius)
        }
        
        if (vimeoIframe) {
          console.log("Vimeo iframe clip-path:", window.getComputedStyle(vimeoIframe).clipPath)
          console.log("Vimeo iframe border-radius:", window.getComputedStyle(vimeoIframe).borderRadius)
        }
        
        if (imageModule) {
          console.log("Image module clip-path:", window.getComputedStyle(imageModule).clipPath)
        }
        
        if (imageImg) {
          console.log("Image img clip-path:", window.getComputedStyle(imageImg).clipPath)
        }
        
        console.log("=== END CLIP-PATH DEBUG ===")
      }
      
      setTimeout(checkClipPath, 1000)
      setTimeout(checkClipPath, 3000)
      setTimeout(checkClipPath, 5000)
    }
  }, [flattenedModules.length])

  return (
    <div className="modal-slider">
      {(displayTitle || displayBodyText.length > 0) && (
        <div className="modal-slider__header">
          {displayTitle && <h2 className="modal-slider__title">{displayTitle}</h2>}
          {displayBodyText.length > 0 && (
            <div className="modal-slider__bodytext">
              <BodyText data={displayBodyText} lang={lang} />
            </div>
          )}
        </div>
      )}
      
      <Swiper
        key={swiperKey}
        navigation
        pagination={{ clickable: true }}
        slidesPerView="auto"
        centeredSlides={true}
        spaceBetween={-150}
        breakpoints={{
          0: { spaceBetween: -50 },
          780: { spaceBetween: -150 }
        }}
        initialSlide={0}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper)
          swiper.slideTo(0, 0)
        }}
        onRealIndexChange={(swiper) => {
          setActiveIndex(swiper.realIndex)
          
          const allSlides = swiper.slides
          allSlides.forEach((slide, index) => {
            if (index !== swiper.realIndex) {
              const videos = slide.querySelectorAll('video')
              videos.forEach(video => {
                video.pause()
              })
              
              const vimeoModules = slide.querySelectorAll('.project-module-vimeo')
              vimeoModules.forEach(() => {
                window.dispatchEvent(new CustomEvent('pauseVimeo'))
              })
            } else {
              const videos = slide.querySelectorAll('video')
              videos.forEach(video => {
                video.play().catch(err => console.log('Video autoplay prevented:', err))
              })
              
              const vimeoIframes = slide.querySelectorAll('.project-module-vimeo__iframe-wrapper iframe')
              vimeoIframes.forEach(iframe => {
                if (iframe.contentWindow) {
                  iframe.contentWindow.postMessage('{"method":"play"}', '*')
                }
              })
            }
          })
        }}
        className="modal-slider__swiper"
        speed={600}
        loop={false}
      >
        {flattenedModules.map((module, index) => {
          const alt = getModuleAlt(module)
          return (
            <SwiperSlide key={module._key || index} className="modal-slider__slide">
              <div className="modal-slider__slide-content">
                {renderModule(module)}
                {alt && <p className="modal-slider__alt">{alt}</p>}
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      {flattenedModules.length > 1 && (
        <div className="modal-slider__counter">
          <span>
          {activeIndex + 1} / {flattenedModules.length}
          </span>
        </div>
      )}
    </div>
  )
}

export default ModalSlider
