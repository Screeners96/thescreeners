"use client"

import { useRouter } from "next/router"
import { useState, useEffect } from "react"

const LanguageSwitcher = ({ lang }) => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchLanguage = () => {
    if (!mounted) return

    const newLang = lang === "en" ? "de" : "en"

    const currentUrl = window.location.href
    const currentHash = window.location.hash

    const newUrl = currentUrl.replace(/(\/)(en|de)(\/|$)/, `$1${newLang}$3`)

    window.location.href = newUrl
  }

  return (
    <nav className="languageSwitcher" aria-label={lang === "de" ? "Sprachauswahl" : "Language selection"}>
      <button 
        type="button"
        className={lang === "en" ? "active" : ""}
        onClick={() => {
          const newUrl = window.location.href.replace(/(\/)(en|de)(\/|$)/, `$1en$3`)
          window.location.href = newUrl
        }}
        aria-label={lang === "de" ? "Zu Englisch wechseln" : "Switch to English"}
        aria-current={lang === "en" ? "page" : undefined}
      >
        EN
      </button>
      <button 
        type="button"
        className={lang === "de" ? "active" : ""}
        onClick={() => {
          const newUrl = window.location.href.replace(/(\/)(en|de)(\/|$)/, `$1de$3`)
          window.location.href = newUrl
        }}
        aria-label={lang === "de" ? "Zu Deutsch wechseln" : "Switch to German"}
        aria-current={lang === "de" ? "page" : undefined}
      >
        DE
      </button>
    </nav>
  )
}

export default LanguageSwitcher
