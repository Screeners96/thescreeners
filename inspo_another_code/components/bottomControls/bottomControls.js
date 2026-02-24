"use client"

import { useState, useEffect, useRef } from "react"
import LanguageSwitcher from "../languageSwitcher/languageSwitcher"
import dynamic from "next/dynamic"

const ReadAloudClient = dynamic(() => import("../readAloud/readAloudClient"), {
  ssr: false,
})

const BottomControls = ({ lang }) => {
  const [isStuck, setIsStuck] = useState(false)
  const [topPosition, setTopPosition] = useState(null)
  const controlsRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!controlsRef.current) return

      const footer = document.querySelector("footer")
      if (!footer) return

      const footerRect = footer.getBoundingClientRect()
      const controlsHeight = controlsRef.current.offsetHeight
      const windowHeight = window.innerHeight

      if (footerRect.top < windowHeight) {
        const distanceFromBottom = windowHeight - footerRect.top

        if (!isStuck) {
          const currentPosition = window.scrollY + windowHeight - controlsHeight
          setTopPosition(currentPosition - distanceFromBottom)
          setIsStuck(true)
        }
      } else {
        setIsStuck(false)
        setTopPosition(null)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isStuck])

  const style = isStuck && topPosition !== null ? { position: "absolute", top: `${topPosition}px`, bottom: "auto" } : {}

  return (
    <div ref={controlsRef} className={`bottomControls ${isStuck ? "bottomControls--stuck" : ""}`} style={style}>
      <LanguageSwitcher lang={lang} />
      <ReadAloudClient lang={lang} />
    </div>
  )
}

export default BottomControls
