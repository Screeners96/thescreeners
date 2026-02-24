"use client"

import { useEffect, useState, useRef } from "react"
import Accordion from "@/components/utils/accordion/accordion"
import BodyText from "@/components/bodyText/bodyText"
import TeaserImage from "@/components/modules/moduleImage/moduleImage"
import { ModulesInner } from "@/components/modules/modules"
import { useRouter, usePathname } from "next/navigation"

const Tabs = ({ pageData, itemsName = "netzwerke", filtering, lang = "en", sortAlphabetically = false }) => {
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

    const item = sortedFiltered[index]
    if (!item) return

    const slug = getItemSlug(item)
    window.history.pushState({}, "", `${pathname}#${slug}`)
  }

  const handleTabClick = (index) => {
    const newIndex = open === index ? null : index
    setOpen(newIndex)
    updateUrlHash(newIndex)
  }

  const normalizeTitle = (item) => {
    let title = ""

    if (!item.title) return ""

    if (typeof item.title === "object") {
      title = item.title[lang] || item.title.en || ""
    } else {
      title = item.title
    }

    return title
      .trim()
      .replace(/^(the |a |an )/i, "") // remove leading articles
      .toLowerCase()
  }

  const sortedFiltered = sortAlphabetically
  ? [...filtered].sort((a, b) =>
      normalizeTitle(a).localeCompare(normalizeTitle(b), lang, { sensitivity: "base" })
    )
  : filtered


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

  useEffect(() => {
    if (!filter || !Object.values(filter).includes(true)) {
      setFiltered(pageData.items || [])
      return
    }

    setFiltered(
      (pageData.items || []).filter((item) => {
        if (!item.categories) return false

        if (Array.isArray(item.categories)) {
          return item.categories.some((cat) => filter[cat])
        } else if (typeof item.categories === "object" && item.categories !== null) {
          return filter[JSON.stringify(item.categories)]
        } else if (typeof item.categories === "string") {
          return item.categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
            .some((cat) => filter[cat])
        }

        return false
      }),
    )
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
                onClick={() =>
                  setFilter({
                    ...filter,
                    [cat]: !filter[cat],
                  })
                }
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

      {showIntroAndModules && pageData.modules.length > 0 && (
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
                      <li
                        className={filter[cat] ? "active" : ""}
                        onClick={() =>
                          setFilter({
                            ...filter,
                            [cat]: !filter[cat],
                          })
                        }
                        key={cat}
                      >
                        {displayText}
                      </li>
                    )
                  })}
                </ul>
              </li>
            )}
            {sortedFiltered.map((item, i) => (
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
          {renderCategoryFilters()} 

          {sortedFiltered.map((item, i) => (
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

              {item.bodyText && <BodyText data={item.bodyText} />}

              {item.teaserImage && (
                <TeaserImage image={item.teaserImage} alt={item.title?.[lang] || item.title?.en || item.title || ""} />
              )}

              {item.modules && item.modules.length > 0 && <ModulesInner modules={item.modules} lang={lang} />}
            </Accordion>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Tabs
