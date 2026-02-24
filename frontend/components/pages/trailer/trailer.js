"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Intro from "@/components/intro/intro"
import TrailerGridsSlider, { TrailerSliderControls, TrailerSliderDots } from "@/components/grids/TrailerGridsSlider"

const Trailer = ({ pageData, globalData, preview, lang }) => {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState(null)
  
  const categories = (pageData?.categoriesOrder || []).filter(category => category && category.slug)
  
  const currentTitle = pageData?.title || ""
  
  const currentBodyText = activeCategory
    ? activeCategory?.bodyText || []
    : pageData?.bodyText || []
  
  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash && categories.length > 0) {
      const category = categories.find(c => c.slug === hash)
      if (category) {
        setActiveCategory(category)
      } else {
        setActiveCategory(categories[0])
      }
    } else if (categories.length > 0) {
      setActiveCategory(categories[0])
    }
    
    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "")
      if (newHash && categories.length > 0) {
        const category = categories.find(c => c.slug === newHash)
        if (category) {
          setActiveCategory(category)
        } else {
          setActiveCategory(categories[0])
        }
      } else if (categories.length > 0) {
        setActiveCategory(categories[0])
      }
    }
    
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [categories])
  
  return (
    <>
      <main id="main-content" className="main page--trailer content" data-readable="true" role="main">
      {(currentTitle || (currentBodyText && currentBodyText.length > 0)) && (
        <Intro title={currentTitle} data={currentBodyText} lang={lang} />
      )}
      
      {categories.length > 0 && (
        <>
          <div className="trailer-submenu-wrapper">
            <nav className="trailer-submenu" aria-label={lang === "de" ? "Trailer Kategorien" : "Trailer Categories"}>
              <div className="trailer-submenu__grid">
                {categories.map((category) => {
                  const categoryTitle = category.title || "Untitled"
                  const isActive = activeCategory?.slug === category.slug
                  
                  return (
                    <div 
                      className={`trailer-submenu__item ${isActive ? 'active' : ''}`} 
                      key={category._id || category.slug}
                    >
                      <Link 
                        href={`/${lang}/trailer#${category.slug}`}
                        scroll={false}
                        aria-label={categoryTitle}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {categoryTitle}
                      </Link>
                    </div>
                  )
                })}
              </div>
              {activeCategory && activeCategory.grid && activeCategory.grid.length > 3 && (
                <TrailerSliderControls sliderId="trailer-slider" lang={lang} />
              )}
            </nav>
            {activeCategory && activeCategory.grid && activeCategory.grid.length > 1 && (
              <TrailerSliderDots sliderId="trailer-slider" lang={lang} />
            )}
          </div>

          <div className="trailer-content-slot">
            {activeCategory && activeCategory.grid && activeCategory.grid.length > 0 ? (
              <TrailerGridsSlider 
                grids={activeCategory.grid} 
                lang={lang} 
                pageType="trailer" 
                sliderId="trailer-slider"
              />
            ) : null}
          </div>
        </>
      )}
      </main>
    </>
  )
}

export default Trailer
