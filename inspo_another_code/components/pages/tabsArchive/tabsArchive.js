"use client"

import { useEffect, useState, useRef } from "react"
import Accordion from "@/components/utils/accordion/accordion"
import BodyText from "@/components/bodyText/bodyText"
import TeaserImage from "@/components/modules/moduleImage/moduleImage"
import { ModulesInner } from "@/components/modules/modules"
import { useRouter, usePathname } from "next/navigation"

const TabsArchive = ({ pageData, filtering = false, lang = "en" }) => {
  const [open, setOpen] = useState(null)
  const [filter, setFilter] = useState(() => {
    const allCategories = new Set()
    ;(pageData.items || []).forEach((item) => {
      if (item.categories) {
        if (Array.isArray(item.categories)) {
          item.categories.forEach((cat) => {
            if (cat) allCategories.add(cat)
          })
        } else if (typeof item.categories === "object" && item.categories !== null) {
          allCategories.add(JSON.stringify(item.categories))
        } else if (typeof item.categories === "string") {
          item.categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
            .forEach((cat) => {
              allCategories.add(cat)
            })
        }
      }
    })

    return Object.fromEntries([...allCategories].map((cat) => [cat, false]))
  })
  const [filtered, setFiltered] = useState(pageData.items || [])
  const router = useRouter()
  const pathname = usePathname()

  const [isStuck, setIsStuck] = useState(false)
  const [topPosition, setTopPosition] = useState(null)
  const navRef = useRef(null)

  const getItemSlug = (item) => {
    if (item.slug?.current) return item.slug.current
    const title = item.title?.[lang] || item.title?.en || item.title || ""
    return title.toLowerCase().replace(/\s+/g, "-")
  }

  const updateUrlHash = (index) => {
    if (index === null) {
      window.history.pushState({}, "", pathname)
      return
    }

    const item = filtered[index]
    if (!item) return

    const slug = getItemSlug(item)
    window.history.pushState({}, "", `${pathname}#${slug}`)
  }

  const handleTabClick = (index) => {
    const newIndex = open === index ? null : index
    setOpen(newIndex)
    updateUrlHash(newIndex)
  }

  // Handle category filter changes
  const handleCategoryToggle = (cat) => {
    const newFilter = {
      ...filter,
      [cat]: !filter[cat],
    }
    setFilter(newFilter)

    // Close any open accordion when filter changes
    setOpen(null)
    window.history.pushState({}, "", pathname)
  }

  useEffect(() => {
    if (filtered.length === 0) return

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")

      if (hash) {
        const index = filtered.findIndex((item) => getItemSlug(item) === hash)
        if (index !== -1) {
          setOpen(index)
        }
      } else {
        setOpen(null)
      }
    }

    handleHashChange()

    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [filtered])

  // Filter items based on selected categories
  useEffect(() => {
    const activeFilters = Object.keys(filter).filter((key) => filter[key])

    if (activeFilters.length === 0) {
      // No filters active, show all items
      setFiltered(pageData.items || [])
      return
    }

    // Filter items that match at least one active category
    const filteredItems = (pageData.items || []).filter((item) => {
      if (!item.categories) return false

      let itemCategories = []

      if (Array.isArray(item.categories)) {
        itemCategories = item.categories
      } else if (typeof item.categories === "object" && item.categories !== null) {
        itemCategories = [JSON.stringify(item.categories)]
      } else if (typeof item.categories === "string") {
        itemCategories = item.categories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      }

      // Check if any of the item's categories match the active filters
      return itemCategories.some((cat) => activeFilters.includes(cat))
    })

    setFiltered(filteredItems)
  }, [filter, pageData.items])

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return

      const footer = document.querySelector("footer")
      if (!footer) return

      const footerRect = footer.getBoundingClientRect()
      const navHeight = navRef.current.offsetHeight
      const windowHeight = window.innerHeight

      if (footerRect.top < windowHeight) {
        const distanceFromBottom = windowHeight - footerRect.top

        if (!isStuck) {
          const currentPosition = window.scrollY + windowHeight - navHeight
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

  const navStyle =
    isStuck && topPosition !== null
      ? { position: "absolute", top: `${topPosition}px`, bottom: "auto", left: "0" }
      : { position: "fixed", left: "0" }

  const showIntroAndModules = open === null

    const getSubtitleText = (subtitle) => {
    if (!subtitle) return ""
    if (typeof subtitle === "object") {
      return subtitle[lang] || subtitle.en || ""
    }
    return subtitle
  }

  const getCategoryText = (category) => {
    if (category && typeof category === "object" && (category[lang] || category.en)) {
      return category[lang] || category.en
    }
    return category
  }

  // Helper function to render category filters for mobile
  const renderCategoryFilters = () => {
    if (!filtering || Object.keys(filter).length === 0) return null

    return (
      <div className="mobile-categories">
        <h2 className="mobile-categories__title">{lang === "en" ? "Categories" : "Themen"}</h2>
        <ul className="mobile-categories__list">
          {Object.keys(filter).map((cat) => {
            let displayText = cat

            if (cat.startsWith("{") && cat.endsWith("}")) {
              try {
                const catObj = JSON.parse(cat)
                displayText = catObj[lang] || catObj.en || cat
              } catch (e) {}
            }

            return (
              <li
                className={`mobile-categories__item ${filter[cat] ? "active" : ""}`}
                onClick={() => handleCategoryToggle(cat)}
                key={cat}
              >
                {displayText}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <main className="main page--tabs content" data-readable="true">

      {showIntroAndModules && pageData.subtitle && (
        <section className="intro" data-readable="true">
          {getSubtitleText(pageData.subtitle)}
        </section>
      )}


      {showIntroAndModules && pageData.bodyText && pageData.bodyText.length > 0 && (
        <BodyText data={pageData.bodyText} />
      )}

      {showIntroAndModules && pageData.modules && pageData.modules.length > 0 && (
        <ModulesInner modules={pageData.modules} lang={lang} />
      )}

      <section className="tabs">
        <nav
          ref={navRef}
          className={`tabs__nav ${isStuck ? "tabs__nav--stuck" : ""}`}
          style={navStyle}
          data-skip-read="true"
          aria-label={lang === "de" ? "Inhaltsnavigation" : "Content navigation"}
          tabIndex="0"
        >
          <ul>
            {filtering && Object.keys(filter).length > 0 && (
              <li className="tabs__nav__item true">
                {lang === "en" ? "Categories" : "Themen"}
                <ul className="tabs__nav__cats">
                  {Object.keys(filter).map((cat) => {
                    let displayText = cat

                    if (cat.startsWith("{") && cat.endsWith("}")) {
                      try {
                        const catObj = JSON.parse(cat)
                        displayText = catObj[lang] || catObj.en || cat
                      } catch (e) {}
                    }

                    return (
                      <li className={filter[cat] ? "active" : ""} onClick={() => handleCategoryToggle(cat)} key={cat}>
                        {displayText}
                      </li>
                    )
                  })}
                </ul>
              </li>
            )}
            {filtered.map((item, i) => (
              <li
                className={`tabs__nav__item ${open === i ? "active" : ""}`}
                onClick={() => handleTabClick(i)}
                key={item._id || i}
              >
                {item.title?.[lang] || item.title?.en || item.title || ""}
              </li>
            ))}
          </ul>
        </nav>

        <div className="tabs__content">
          {/* Mobile categories - always visible */}
          {renderCategoryFilters()}

          {/* Content accordions - now using filtered items */}
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              <Accordion
                title={item.title?.[lang] || item.title?.en || item.title || ""}
                isOpen={open === i}
                toggle={() => handleTabClick(i)}
                key={item._id || i}
              >
                {item.subtitle && (
                <section className="intro" data-readable="true">
                  {getSubtitleText(item.subtitle)}
                </section>
                )}

                {(item.publishingDate || item.moveToArchiveDate) && (
                  <div className="article-meta">
                    {item.publishingDate && (
                      <div className="article-article-header">
                        <strong>{lang === "en" ? "Published:" : "Veröffentlicht:"}</strong>{" "}
                        {new Date(item.publishingDate).toLocaleDateString(lang === "en" ? "en-US" : "de-DE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                )}

                {item.bodyText && <BodyText data={item.bodyText} />}

                {item.teaserImage && (
                  <TeaserImage
                    image={item.teaserImage}
                    alt={item.title?.[lang] || item.title?.en || item.title || ""}
                  />
                )}

                {item.modules && <ModulesInner modules={item.modules} lang={lang} />}
              </Accordion>
            ))
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
              {lang === "en"
                ? "No archived items match the selected categories."
                : "Keine archivierten Einträge entsprechen den ausgewählten Kategorien."}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default TabsArchive
