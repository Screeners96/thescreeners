"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const ReadAloud = ({ lang }) => {
  const [isReading, setIsReading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [textBlocks, setTextBlocks] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)

  const speechSynthesisRef = useRef(null)
  const utteranceRef = useRef(null)
  const voicesLoaded = useRef(false)

  const stopRef = useRef(false)
  const currentUtteranceId = useRef(0)

  const pathname = usePathname()

  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis

    const loadVoices = () => {
      if (speechSynthesisRef.current.getVoices().length > 0) {
        voicesLoaded.current = true
      }
    }

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)
    loadVoices()

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      stopReading()
    }
  }, [])

  useEffect(() => {
    stopReading()
  }, [pathname])

  useEffect(() => {
    const handleUnload = () => stopReading()
    window.addEventListener("beforeunload", handleUnload)
    return () => window.removeEventListener("beforeunload", handleUnload)
  }, [])

  const preprocess = (text) => {
    const replacements = [
      [/\b(e\.g\.|z\.B\.)\b/g, lang === "de" ? "zum Beispiel" : "for example"],
      [/\b(i\.e\.)\b/g, lang === "de" ? "das heißt" : "that is"],
      [/\b(etc\.)\b/g, lang === "de" ? "und so weiter" : "and so on"],
      [/\b(bzw\.)\b/g, "beziehungsweise"],
      [/&/g, lang === "de" ? "und" : "and"],
      [/\+/g, "plus"],
      [/€/g, lang === "de" ? "Euro" : "euros"],
      [/\$/g, lang === "de" ? "Dollar" : "dollars"],
      [/%/g, lang === "de" ? "Prozent" : "percent"],
      [/\bDr\./g, lang === "de" ? "Doktor" : "Doctor"],
      [/\bProf\./g, lang === "de" ? "Professor" : "Professor"],
    ]

    let out = text
    for (const [pattern, replacement] of replacements) {
      out = out.replace(pattern, replacement)
    }

    return out
  }

  const getReadableBlocks = () => {
    const blocks = []
    const seen = new Set()
    const root = document.querySelector("main") || document.body
    const tagList = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "BLOCKQUOTE"]

    root.querySelectorAll(tagList.join(",")).forEach((el) => {
      if (el.closest('[data-skip-read="true"]')) return
      const text = el.textContent?.trim()
      if (!text || seen.has(el)) return
      seen.add(el)

      blocks.push({
        element: el,
        text: preprocess(text),
      })
    })

    return blocks
  }

  const getBestVoice = () => {
    const langCode = lang === "de" ? "de" : "en"
    const voices = speechSynthesisRef.current.getVoices()
    const preferred = lang === "de"
      ? ["Katja", "Anna", "Hedda", "Conrad", "Petra"]
      : ["Samantha", "Victoria", "Karen", "Aria", "Jenny"]

    for (const name of preferred) {
      const match = voices.find((v) => v.name.toLowerCase().includes(name.toLowerCase()))
      if (match && match.lang.startsWith(langCode)) return match
    }

    return voices.find((v) => v.lang.startsWith(langCode)) || voices[0]
  }

  const highlight = (index) => {
    document.querySelectorAll(".reading-highlight").forEach((el) =>
      el.classList.remove("reading-highlight")
    )
    if (index >= 0 && textBlocks[index]) {
      const el = textBlocks[index].element
      el.classList.add("reading-highlight")
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const speakBlock = (index) => {
    if (stopRef.current || !textBlocks.length || index >= textBlocks.length) {
      if (index >= textBlocks.length) {
        stopReading()
      }
      return
    }

    // Generate unique ID for this utterance
    const utteranceId = ++currentUtteranceId.current
    // console.log("[🔊 starting] index:", index, "utteranceId:", utteranceId)

    const voice = getBestVoice()
    const block = textBlocks[index]
    const utterance = new SpeechSynthesisUtterance(block.text)

    utterance.voice = voice
    utterance.lang = lang === "de" ? "de-DE" : "en-US"
    utterance.rate = lang === "de" ? 0.85 : 0.92
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      // Only process if this is still the current utterance
      if (utteranceId !== currentUtteranceId.current) {
        // console.log("[🔊 onstart] IGNORED - old utterance:", utteranceId, "current:", currentUtteranceId.current)
        return
      }
      // console.log("[🔊 onstart] index:", index, "utteranceId:", utteranceId)
      setCurrentIndex(index)
      highlight(index)
    }

    utterance.onend = () => {
      // Only process if this is still the current utterance
      if (utteranceId !== currentUtteranceId.current) {
        // console.log("[🛑 onend] IGNORED - old utterance:", utteranceId, "current:", currentUtteranceId.current)
        return
      }
      
      // console.log("[🛑 onend] index:", index, "utteranceId:", utteranceId)

      if (stopRef.current) return

      // Continue to next block
      if (!speechSynthesisRef.current.speaking && !isPaused) {
        // console.log("[➡️ continue] to", index + 1)
        speakBlock(index + 1)
      }
    }

    utterance.onerror = (event) => {
      // console.log("[❌ onerror] index:", index, "utteranceId:", utteranceId, "error:", event.error)
      if (utteranceId === currentUtteranceId.current && !stopRef.current) {
        speakBlock(index + 1)
      }
    }

    utteranceRef.current = utterance
    speechSynthesisRef.current.speak(utterance)
  }

  const toggleReading = () => {
    if (isReading) {
      if (isPaused) {
        speechSynthesisRef.current.resume()
        setIsPaused(false)
      } else {
        speechSynthesisRef.current.pause()
        setIsPaused(true)
      }
      return
    }

    const blocks = getReadableBlocks()
    if (!blocks.length) {
      alert(lang === "de" ? "Kein lesbarer Text gefunden." : "No readable text found.")
      return
    }

    setTextBlocks(blocks)
    setIsReading(true)
    setIsPaused(false)
    stopRef.current = false
    currentUtteranceId.current = 0
    speakBlock(0)
  }

  const stopReading = () => {
    // console.log("[🛑 STOP] stopping all")
    stopRef.current = true
    currentUtteranceId.current++ // Invalidate any pending utterances
    speechSynthesisRef.current.cancel()
    setIsReading(false)
    setIsPaused(false)
    setCurrentIndex(-1)
    document.querySelectorAll(".reading-highlight").forEach((el) =>
      el.classList.remove("reading-highlight")
    )
  }

  const skip = () => {
    if (currentIndex + 1 >= textBlocks.length) return
    
    // console.log("[⏩ skip] From", currentIndex, "to", currentIndex + 1)
    
    // Cancel current speech and invalidate its events
    speechSynthesisRef.current.cancel()
    
    // Immediately start next block (this will increment currentUtteranceId)
    speakBlock(currentIndex + 1)
  }

  if (typeof window === "undefined") return null

  return (
    <div className="readAloud">
      <button
        onClick={toggleReading}
        className="readAloud__button"
        aria-label={
          isReading
            ? isPaused
              ? "Resume reading"
              : "Pause reading"
            : "Read page aloud"
        }
      >
        {isReading ? (
          isPaused ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          )
        ) : (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
        )}
      </button>

      {isReading && (
        <>
          <button
            onClick={stopReading}
            className="readAloud__button readAloud__button--stop"
            aria-label="Stop reading"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z" /></svg>
          </button>

          <button
            onClick={skip}
            className="readAloud__button"
            aria-label="Skip to next paragraph"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
          </button>
        </>
      )}
    </div>
  )
}

export default ReadAloud