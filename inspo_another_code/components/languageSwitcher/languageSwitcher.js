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
    <div className="languageSwitcher">
      <button onClick={switchLanguage} aria-label={`Switch to ${lang === "en" ? "German" : "English"}`}>
        {lang === "en" ? "DE" : "EN"}
      </button>
    </div>
  )
}

export default LanguageSwitcher
