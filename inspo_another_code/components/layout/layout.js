import Head from "next/head"
import Header from "../header/header"
import Footer from "../footer/footer"
import Clouds from "../utils/clouds/clouds"
import PreviewBanner from "../utils/previewbanner/previewbanner"
import BottomControls from "../bottomControls/bottomControls"
import dynamic from "next/dynamic"
import { useEffect } from "react"

const ReadAloudClient = dynamic(() => import("../readAloud/readAloudClient"), {
  ssr: false,
})

const Layout = ({ children, globalData = {}, pageData = {}, preview = false, lang = "en" }) => {
  const colorsHeader = globalData.colorsHeader || ""
  const colorsMain = globalData.colorsMain || ""

  const ch = [...(colorsHeader.matchAll?.(/#[0-9a-f]{6}/gi) || [])].map((match) => match[0])
  const cb = [...(colorsMain.matchAll?.(/#[0-9a-f]{6}/gi) || [])].map((match) => match[0])

  const pageTitle = pageData?.title
    ? typeof pageData.title === "object"
      ? pageData.title[lang] || pageData.title.en
      : pageData.title
    : ""

  const siteTitle = globalData?.siteTitle || "CARING CULTURE LAB" 
  const fullTitle = siteTitle ? `${siteTitle} | ${pageTitle}` : pageTitle

  const pageDescription = pageData?.description
    ? typeof pageData.description === "object"
      ? pageData.description[lang] || pageData.description.en || ""
      : pageData.description
    : ""

  const defaultDescription =
    lang === "de"
      ? "CARING CULTURE LAB - Plattform für Kultur und Gemeinschaft"
      : "CARING CULTURE LAB - Platform for Culture and Community"

  const metaDescription = pageDescription || defaultDescription

  const navLinks = globalData.nav || []
  const footerRight = globalData.footerRight || ""
  const footerInfo = globalData.footerInfo || {}
  const footerLink = globalData.footerLink || ""

  const title =
    typeof pageData?.title === "object" ? pageData?.title?.[lang] || pageData?.title?.en || "" : pageData?.title || ""

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
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header title={title} colors={ch} navLinks={navLinks} lang={lang} />
      <Clouds width="100%" height="100vh" position="fixed" colors={cb} />
      {children}
      <BottomControls lang={lang} />
      <Footer right={footerRight} info={footerInfo} link={footerLink} lang={lang} />
      {preview && <PreviewBanner />}
    </>
  )
}

export default Layout
