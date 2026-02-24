"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Clouds from "../utils/clouds/clouds"

const Header = ({ title, colors, navLinks, lang = "en", impressumTitle }) => {
  const navRef = useRef(null)
  const burger = useRef(null)
  const router = useRouter()
  const isMenuOpen = useRef(false)
  const [activeTabTitle, setActiveTabTitle] = useState(null)

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen.current) {
        if (window.innerWidth <= 800) {
          document.body.classList.add('menu-open')
        } else {
          document.body.classList.remove('menu-open')
        }
      }
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  const toggleNav = () => {
    navRef.current.classList.toggle("show")
    isMenuOpen.current = !isMenuOpen.current

    if (isMenuOpen.current) {
      burger.current.classList.add("active")

      if (window.innerWidth <= 800) {
        document.body.classList.add('menu-open')
      }
    } else {
      burger.current.classList.remove("active")

      document.body.classList.remove('menu-open')
    }
  }

  const hideNav = () => {
    navRef.current.classList.remove("show")
    burger.current.classList.remove("active")
    isMenuOpen.current = false

    document.body.classList.remove('menu-open')
  }


  const hoverNav = () => {
    if (!isMenuOpen.current) {
      burger.current.classList.add("active")
    }
  }

  const hoverNavOut = () => {
    if (!isMenuOpen.current) {
      burger.current.classList.remove("active")
    }
  }

  useEffect(() => {
    router.events.on("routeChangeComplete", hideNav)
    return () => {
      router.events.off("routeChangeComplete", hideNav)
    }
  }, [router.events])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        const tabElement = document.querySelector(`.tabs__nav__item.active`)
        if (tabElement) {
          setActiveTabTitle(tabElement.textContent.trim())
        } else {
          setActiveTabTitle(null)
        }
      } else {
        setActiveTabTitle(null)
      }
    }

    handleHashChange()

    window.addEventListener("hashchange", handleHashChange)

    const tabObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const activeTab = document.querySelector(".tabs__nav__item.active")
          if (activeTab) {
            setActiveTabTitle(activeTab.textContent.trim())
          } else {
            setActiveTabTitle(null)
          }
        }
      })
    })

    const tabItems = document.querySelectorAll(".tabs__nav__item")
    tabItems.forEach((item) => {
      tabObserver.observe(item, { attributes: true })
    })

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
      tabObserver.disconnect()
    }
  }, [router.asPath])

  const impressumPageTitle = impressumTitle
    ? typeof impressumTitle === "object"
      ? impressumTitle[lang] || impressumTitle.en
      : impressumTitle
    : lang === "de"
      ? "Impressum & Datenschutzerklärung"
      : "Imprint & Privacy Policy"

  const getNavUrl = (link) => {
    if (link._type === "besserePraktiken") {
      return `/${lang}/besserePraktiken`
    }

    const slug = link.navSlug || link.slug?.current || link.slug

    if (!slug) {
      console.warn("No slug found for link:", link)
      return null
    }

    return `/${lang}/${slug}`
  }

  return (
    <header className="header">
      <Clouds width="100%" height="100%" position="absolute" colors={colors} />
      <Link href={`/${lang}/`} className="header__logo" aria-label={`CARING CULTURE LAB Logo`}>
        <img src="/images/logo.svg" alt={lang === "de" ? "Zur Startseite" : "Go to homepage"} />
      </Link>
      <div className="header__button">
        <div
          className="header__burger"
          ref={burger}
          onClick={toggleNav}
          onMouseEnter={hoverNav}
          onMouseLeave={hoverNavOut}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <nav className="header__nav" ref={navRef} aria-label={lang === "de" ? "Hauptnavigation" : "Main navigation"}>
        <ul className="header__nav__list">
          {navLinks
            ?.filter((link) => {
              const url = getNavUrl(link)
              return url !== null 
            })
            .map((link) => {
              const url = getNavUrl(link)
              const linkTitle = typeof link.title === "object" ? link.title[lang] || link.title.en : link.title

              return (
                <li className="header__nav__item" key={link._id || link.navSlug || link.slug?.current}>
                  <Link href={url} aria-label={`${linkTitle}`}>
                    {linkTitle}
                  </Link>
                </li>
              )
            })}

          <li className="header__nav__item--imprint">
            <Link href={`/${lang}/impressum`} aria-label={impressumPageTitle}>
              {impressumPageTitle}
            </Link>
          </li>
        </ul>
      </nav>
      {!(router.asPath === `/${lang}` || router.asPath === `/${lang}/`) &&
        title &&
        (() => {
          const currentPath = router.asPath.split("#")[0]

          const isClickablePage = [
            `/${lang}/netzwerke`,
            `/${lang}/ressourcen`,
            `/${lang}/besserePraktiken`,
            `/${lang}/archive`,
          ].includes(currentPath)

          const displayTitle = activeTabTitle || (typeof title === "object" ? title[lang] || title.en : title)

          if (isClickablePage) {
            return (
              <h1 className="header__title header__title__clickable">
                <Link href={currentPath}>{displayTitle}</Link>
              </h1>
            )
          } else {
            return <h1 className="header__title">{displayTitle}</h1>
          }
        })()}
    </header>
  )
}

export default Header