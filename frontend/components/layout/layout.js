import Header from "../header/header"
import HorizontalNav from "../header/horizontalNav"
import Footer from "../footer/footer"
import PreviewBanner from "../utils/previewbanner/previewbanner"
import LanguageSwitcher from "../languageSwitcher/languageSwitcher"
import SEO from "../utils/seo/seo"
import ColorVariables from "../utils/colorVariables/colorVariables"
import { useEffect } from "react"
import { useRouter } from "next/router"

const Layout = ({ children, globalData = {}, pageData = {}, preview = false, lang = "en" }) => {
  const router = useRouter()
  
  const currentPath = router.asPath?.split('?')[0]?.split('#')[0] || ''
  const isLandingPage = currentPath === `/${lang}` || currentPath === `/${lang}/`
  const colorsHeader = globalData.colorsHeader || ""
  const colorsMain = globalData.colorsMain || ""

  const ch = [...(colorsHeader.matchAll?.(/#[0-9a-f]{6}/gi) || [])].map((match) => match[0])
  const cb = [...(colorsMain.matchAll?.(/#[0-9a-f]{6}/gi) || [])].map((match) => match[0])

  const navLinks = globalData.nav || []
  const footerGetInTouch = globalData.footerGetInTouch || {}
  const socialLinks = globalData.socialLinks || {}
  const contactEmail = globalData.contactEmail || null
  const impressumTitle = globalData.impressumTitle || null

  const title =
    typeof pageData?.title === "object" ? pageData?.title?.[lang] || pageData?.title?.en || "" : pageData?.title || ""

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang || 'en'
      document.documentElement.setAttribute('xml:lang', lang || 'en')
    }
  }, [lang])

  useEffect(() => {
    const handleWheel = (e) => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10

      if (isAtBottom && e.deltaY > 0) {
        e.preventDefault()
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
    }
  }, [])

  return (
    <>
      <SEO pageData={pageData} globalData={globalData} lang={lang} />
      <ColorVariables settings={globalData} />
      <Header 
        title={title} 
        colors={ch} 
        navLinks={navLinks} 
        lang={lang} 
        impressumTitle={impressumTitle}
        footerGetInTouch={footerGetInTouch}
        socialLinks={socialLinks}
        contactEmail={contactEmail}
      />
      <HorizontalNav navLinks={navLinks} lang={lang} isLandingPage={isLandingPage} />
      {children}
      {isLandingPage && (
        <Footer 
          getInTouch={footerGetInTouch} 
          socialLinks={socialLinks} 
          contactEmail={contactEmail}
          lang={lang} 
        />
      )}
      {preview && <PreviewBanner />}
    </>
  )
}

export default Layout
