"use client"

import { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Intro from "@/components/intro/intro"
import { SectionLogos, SectionGridWrapper, SectionGridImages } from "./sections"
import GridRenderer from "./grids"
import AboutUsGridsSlider from "./AboutUsGridsSlider"

const AboutUs = ({ pageData, globalData, preview, lang }) => {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState(null)
  const [isMainPageActive, setIsMainPageActive] = useState(true)
  
  const sections = (pageData?.sectionsOrder || []).filter(section => section && section.slug)
  
  const MAIN_PAGE_SLUG = "page-about-us"
  const mainPageTitle = pageData?.title || ""
  
  // Determine which title and bodyText to show based on active section
  const currentTitle = isMainPageActive 
    ? pageData?.title || ""
    : activeSection?.title || ""
  
  const currentBodyText = isMainPageActive 
    ? pageData?.bodyText || []
    : activeSection?.bodyText || []
  
  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    
    if (hash === MAIN_PAGE_SLUG || hash === "") {
      setIsMainPageActive(true)
      setActiveSection(null)
    } else if (hash && sections.length > 0) {
      const section = sections.find(s => s.slug === hash)
      if (section) {
        setActiveSection(section)
        setIsMainPageActive(false)
      } else {
        setIsMainPageActive(true)
        setActiveSection(null)
      }
    } else {
      setIsMainPageActive(true)
      setActiveSection(null)
    }
    
    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "")
      if (newHash === MAIN_PAGE_SLUG || newHash === "") {
        setIsMainPageActive(true)
        setActiveSection(null)
      } else if (newHash) {
        const section = sections.find(s => s.slug === newHash)
        if (section) {
          setActiveSection(section)
          setIsMainPageActive(false)
        }
      }
    }
    
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [sections])
  
  const renderGrid = (grid, gridLang = lang) => {
    return <GridRenderer grid={grid} lang={gridLang} />
  }
  
  const renderSection = (section) => {
    if (!section) return null
    
    switch (section.sectionType) {
      case 'logos':
        return <SectionLogos section={section} lang={lang} />
      
      case 'gridWrapper':
        return <SectionGridWrapper section={section} lang={lang} renderGrid={renderGrid} />
      
      case 'gridImages':
        return <SectionGridImages section={section} lang={lang} />
      
      default:
        return null
    }
  }
  
  return (
    <>
      <main id="main-content" className="main page--about-us content" data-readable="true" role="main">
     {(currentTitle || (currentBodyText && currentBodyText.length > 0)) && (
        <Intro title={currentTitle} data={currentBodyText} lang={lang} />
      )}
      
      {(sections.length > 0 || pageData?.grids?.length > 0) && (
        <nav className="about-us-submenu" aria-label={lang === "de" ? "About Us Untermenü" : "About Us Submenu"}>
          <div className="about-us-submenu__grid">
            {(pageData?.grids?.length > 0 || pageData?.bodyText || pageData?.title) && (
              <div 
                className={`about-us-submenu__item ${isMainPageActive ? 'active' : ''}`}
              >
                <Link 
                  href={`/${lang}/about-us#${MAIN_PAGE_SLUG}`}
                  scroll={false}
                  aria-label={mainPageTitle}
                  aria-current={isMainPageActive ? 'page' : undefined}
                >
                  {mainPageTitle}
                </Link>
              </div>
            )}
            
            {sections.map((section) => {
              const sectionTitle = section.title || "Untitled"
              const isActive = !isMainPageActive && activeSection?.slug === section.slug
              
              return (
                <div 
                  className={`about-us-submenu__item ${isActive ? 'active' : ''}`} 
                  key={section._id || section.slug}
                >
                  <Link 
                    href={`/${lang}/about-us#${section.slug}`}
                    scroll={false}
                    aria-label={sectionTitle}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {sectionTitle}
                  </Link>
                </div>
              )
            })}
          </div>
        </nav>
      )}
      
      {isMainPageActive && pageData?.grids && pageData.grids.length > 0 && (
        <AboutUsGridsSlider grids={pageData.grids} lang={lang} />
      )}
      
      {!isMainPageActive && activeSection && (
        <>
          {renderSection(activeSection)}
        </>
      )}
      </main>
    </>
  )
}

export default AboutUs

