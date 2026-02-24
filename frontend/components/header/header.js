"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Logo from "../logo/logo"
import LanguageSwitcher from "../languageSwitcher/languageSwitcher"
import imageUrlBuilder from '@sanity/image-url'
import { cmsClient } from "../../utils/sanity"

const Header = ({ title, colors, navLinks, lang = "en", impressumTitle, footerGetInTouch, socialLinks, contactEmail }) => {
  const navRef = useRef(null)
  const burger = useRef(null)
  const router = useRouter()
  const isMenuOpen = useRef(false)
  const [activeTabTitle, setActiveTabTitle] = useState(null)
  const prevIsLandingPageRef = useRef(null)

  useEffect(() => {
    if (navLinks && navLinks.length > 0) {
      console.log('Header - navLinks:', navLinks)
      console.log('Sample navLink:', navLinks[0])
      console.log('All navLink types:', navLinks.map(link => ({ _type: link._type, title: link.title })))
    } else {
      console.warn('Header - No navLinks provided or empty array')
    }
    console.log('Header - impressumTitle:', impressumTitle)
  }, [navLinks])

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
    const modalOverlay = document.querySelector('.modal-overlay')
    if (modalOverlay) {
      const closeModalEvent = new CustomEvent('closeModal')
      window.dispatchEvent(closeModalEvent)
    }

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
    const handleClickOutside = (event) => {
      if (!isMenuOpen.current) return

      const isClickInsideNav = navRef.current && navRef.current.contains(event.target)
      const isClickOnBurger = burger.current && burger.current.contains(event.target)

      if (!isClickInsideNav && !isClickOnBurger) {
        hideNav()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
    if (link._type === "trailer") {
      return `/${lang}/trailer`
    }
    if (link._type === "event") {
      return `/${lang}/event`
    }
    if (link._type === "imagefilm") {
      return `/${lang}/imagefilm`
    }
    if (link._type === "aboutUs") {
      return `/${lang}/about-us`
    }
    if (link._type === "contact") {
      return `/${lang}/contact`
    }

    const slug = link.navSlug || link.slug?.current || link.slug
    if (!slug) {
      console.warn("No slug found for link:", link)
      return null
    }

    return `/${lang}/${slug}`
  }

  const workNavLinks = navLinks?.filter((link) => {
    if (!link || !link._type) {
      console.warn('Header - Invalid link object:', link)
      return false
    }
    const url = getNavUrl(link)
    const isWorkType = ['trailer', 'event', 'imagefilm'].includes(link._type)
    if (url === null) {
      console.warn('Header - Could not generate URL for work link:', link)
      return false
    }
    return isWorkType
  }) || []

  const otherNavLinks = navLinks?.filter((link) => {
    if (!link || !link._type) {
      return false
    }
    const url = getNavUrl(link)
    const isWorkType = ['trailer', 'event', 'imagefilm'].includes(link._type)
    if (url === null) {
      console.warn('Header - Could not generate URL for other link:', link)
      return false
    }
    return !isWorkType
  }) || []

  const firstWorkLink = workNavLinks.length > 0 ? workNavLinks[0] : null
  const firstWorkUrl = firstWorkLink ? getNavUrl(firstWorkLink) : null
  
  const currentPath = router.asPath?.split('?')[0]?.split('#')[0] || ''
  const isLandingPage = currentPath === `/${lang}` || currentPath === `/${lang}/`

  const handleSideNavHomeClick = (e, targetUrl) => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('horizontal-nav-slide-to-landing', { detail: { targetUrl } }))
  }




  const getInTouchText = footerGetInTouch 
    ? typeof footerGetInTouch === "object" 
      ? footerGetInTouch[lang] || footerGetInTouch.en || "Get in touch"
      : footerGetInTouch
    : "Get in touch"

  const getImageUrl = (image) => {
    if (!image || !image.asset) return null
    try {
      const builder = imageUrlBuilder(cmsClient)
      return builder.image(image).url()
    } catch (error) {
      console.error("Error converting image URL:", error)
      return null
    }
  }

  const getSocialIcon = (iconName) => {
    if (!iconName) return null
    
    const iconNameLower = iconName.toLowerCase()
    
    const icons = {
      vimeo: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L3.322 7.355C2.603 4.816 1.834 3.522.976 3.522c-.179 0-.806.378-1.881 1.132L0 3.228c1.185-1.044 2.351-2.084 3.501-3.128C5.08.401 6.153.029 7.096.027c1.879 0 3.074 1.115 3.576 3.35.495 2.34.839 3.791 1.028 4.352.571 2.59 1.198 3.886 1.885 3.886.533 0 1.336-.838 2.402-2.508.822-1.284 1.262-2.169 1.311-2.653.117-1.183-.34-1.776-1.375-1.776-.488 0-.989.112-1.507.336 1.001-3.28 2.912-4.877 5.732-4.787 2.088.063 3.07 1.408 2.95 4.04z"/>
        </svg>
      ),
      facebook: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      instagram: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      twitter: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      linkedin: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      youtube: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    }
    
    return icons[iconNameLower] || null
  }

  const socialLinksArray = Array.isArray(socialLinks) 
    ? socialLinks 
    : socialLinks && Object.keys(socialLinks).length > 0
    ? Object.entries(socialLinks).map(([key, url]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        url: url,
        iconType: 'name',
        iconName: key
      }))
    : []

  return (
    <header className={`header ${isLandingPage ? 'header--landing' : ''}`}>
      <div className="header__top-row">
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

        <div className="header__logo-wrapper">
          <Logo lang={lang} />
        </div>

        <div className="header__language">
          <LanguageSwitcher lang={lang} />
        </div>
      </div>

      <nav id="main-navigation" className="header__nav" ref={navRef} aria-label={lang === "de" ? "Seitennavigation" : "Side navigation"}>
        <ul className="header__nav__list">
          <li className={`header__nav__item ${isLandingPage ? 'active' : ''}`}>
            <Link
              href={`/${lang}/`}
              aria-label={lang === "de" ? "Startseite" : "Home"}
              onClick={(e) => !isLandingPage && handleSideNavHomeClick(e, `/${lang}/`)}
            >
              {lang === "de" ? "STARTSEITE" : "HOME"}
            </Link>
          </li>

          {workNavLinks.length > 0 && (
            <li className="header__nav__item header__nav__item--work">
              {firstWorkUrl ? (
                <Link href={firstWorkUrl} className="header__nav__item__label" aria-label={lang === "de" ? "ARBEIT" : "WORK"}>
                  {lang === "de" ? "ARBEIT" : "WORK"}
                </Link>
              ) : (
                <span className="header__nav__item__label">{lang === "de" ? "ARBEIT" : "WORK"}</span>
              )}
              <ul className="header__nav__sublist">
                {workNavLinks.map((link, index) => {
                  const url = getNavUrl(link)
                  const linkTitle = typeof link.title === "object" ? link.title[lang] || link.title.en : link.title
                  const isActive = currentPath === url || currentPath.startsWith(url + '/')
                  const isSubpage = index < 3

                  if (!url) {
                    console.warn('Header - Skipping work nav item with no URL:', link)
                    return null
                  }

                  return (
                    <li className={`header__nav__subitem ${isSubpage ? 'subpages' : ''} ${isActive ? 'active' : ''}`} key={link._id || link.navSlug || link.slug?.current || link._key || index}>
                      <Link href={url} aria-label={linkTitle}>
                        {linkTitle || 'Untitled'}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          )}

          {otherNavLinks.map((link, index) => {
            const url = getNavUrl(link)
            const linkTitle = typeof link.title === "object" ? link.title[lang] || link.title.en : link.title
            const isActive = currentPath === url || currentPath.startsWith(url + '/')

            if (!url) {
              console.warn('Header - Skipping other nav item with no URL:', link)
              return null
            }

            return (
              <li className={`header__nav__item ${isActive ? 'active' : ''}`} key={link._id || link.navSlug || link.slug?.current || link._key || index}>
                <Link href={url} aria-label={linkTitle}>
                  {linkTitle || 'Untitled'}
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
        
        <div className="header__nav__language">
          <LanguageSwitcher lang={lang} />
        </div>
        
        {!isLandingPage && (footerGetInTouch || (socialLinksArray && socialLinksArray.length > 0)) && (
          <div className="header__nav__footer">
            {getInTouchText && (
              contactEmail ? (
                <a 
                  href={`mailto:${contactEmail}`}
                  className="header__nav__footer__get-in-touch"
                >
                  @ {getInTouchText}
                </a>
              ) : (
                <p className="header__nav__footer__get-in-touch">@ {getInTouchText}</p>
              )
            )}

            {socialLinksArray && socialLinksArray.length > 0 && (
              <div className="header__nav__footer__social">
                {socialLinksArray.map((link, index) => {
                  if (!link.url) return null

                  const iconUrl = link.iconType === 'image' && link.iconImage
                    ? getImageUrl(link.iconImage)
                    : null

                  const ariaLabel = link.workLabel
                    ? `${link.label} - ${link.workLabel}`
                    : link.label || "Social Link"

                  const standardizedIcon = link.iconType === 'name' && link.iconName
                    ? getSocialIcon(link.iconName)
                    : null

                  const displayText = link.iconName || link.label?.charAt(0).toUpperCase() || "L"

                  return (
                    <a 
                      key={index}
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`header__nav__footer__social-link header__nav__footer__social-link--${link.iconName || link.label?.toLowerCase() || 'link'}`}
                      aria-label={ariaLabel}
                    >
                      {iconUrl ? (
                        <img 
                          src={iconUrl} 
                          alt={link.iconImage?.alt || link.label || "Social icon"}
                          className="header__nav__footer__social-icon"
                        />
                      ) : standardizedIcon ? (
                        <span className="header__nav__footer__social-icon-svg">
                          {standardizedIcon}
                        </span>
                      ) : (
                        <span className="header__nav__footer__social-icon-text">
                          {displayText}
                        </span>
                      )}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      {!isLandingPage &&
        title &&
        (() => {
          const isClickablePage = [
            `/${lang}/trailer`,
            `/${lang}/event`,
            `/${lang}/imagefilm`,
            `/${lang}/about-us`,
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