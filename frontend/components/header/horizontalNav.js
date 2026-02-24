"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

const HorizontalNav = ({ navLinks, lang, isLandingPage }) => {
  const horizontalNavRef = useRef(null)
  const comingFromLandingRef = useRef(false)
  const router = useRouter()
  const currentPath = router.asPath?.split('?')[0]?.split('#')[0] || ''

  const getNavUrl = (link) => {
    if (!link || !link._type) return null
    if (link._type === "trailer") return `/${lang}/trailer`
    if (link._type === "event") return `/${lang}/event`
    if (link._type === "imagefilm") return `/${lang}/imagefilm`
    if (link._type === "aboutUs") return `/${lang}/about-us`
    if (link._type === "contact") return `/${lang}/contact`
    const slug = link.navSlug || link.slug?.current || link.slug
    if (!slug) return null
    return `/${lang}/${slug}`
  }

  const horizontalNavLinks = (navLinks?.filter((link) => {
    if (!link || !link._type) return false
    const isMainPage = ['trailer', 'event', 'imagefilm', 'aboutUs', 'contact'].includes(link._type)
    if (!isMainPage) return false
    return getNavUrl(link) !== null
  }) || []).slice(0, 5)

  const getMarginValues = () => {
    const viewportWidth = window.innerWidth
    let marginSide, marginMenu
    if (viewportWidth <= 780) {
      marginSide = viewportWidth * (25 * 1.2) / 393
      marginMenu = viewportWidth * (25 * 0.6) / 393
    } else if (viewportWidth <= 1040) {
      marginSide = viewportWidth * (20 * 1.5) / 1024
      marginMenu = viewportWidth * (20 * 0.7) / 1024
    } else if (viewportWidth >= 1700) {
      marginSide = viewportWidth * (25 * 0.5) / 834
      marginMenu = viewportWidth * (25 * 0.5) / 834
    } else {
      marginSide = Math.max(16, Math.min(viewportWidth * 0.045, 2.3 * 16))
      marginMenu = viewportWidth * (25 * 0.5) / 834
    }
    return { marginSide, marginMenu }
  }

  const animateLandingMenuDown = () => {
    const nav = horizontalNavRef.current
    if (!nav) return

    const { marginSide, marginMenu } = getMarginValues()
    const rect = nav.getBoundingClientRect()
    const navHeight = Math.max(rect.height, 55)
    const viewportHeight = window.innerHeight
    const targetBottom = marginMenu
    const targetTopPosition = viewportHeight - marginMenu - navHeight
    const distanceToMove = targetTopPosition - rect.top

    nav.style.position = 'fixed'
    nav.style.top = `${rect.top}px`
    nav.style.left = 'auto'
    nav.style.width = `${rect.width}px`
    nav.style.transform = 'translateY(0)'
    nav.style.transition = 'none'
    nav.style.zIndex = '9999'
    nav.style.pointerEvents = 'none'
    nav.style.marginTop = '0'

    nav.offsetHeight

    const animDuration = 900
    const ease = 'cubic-bezier(0.4, 0, 0.2, 1)'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nav.style.transition = `transform ${animDuration}ms ${ease}, width ${animDuration}ms ${ease}`
        nav.style.transform = `translateY(${distanceToMove}px)`
        nav.style.width = `calc(100vw - ${marginSide * 2}px)`

        setTimeout(() => {
          nav.style.top = 'auto'
          nav.style.bottom = `${targetBottom}px`
          nav.style.left = 'auto'
          nav.style.transform = 'translateY(0)'
          nav.style.zIndex = '998'
          nav.style.pointerEvents = 'auto'
          nav.classList.add('header__horizontal-nav--scrolled')
        }, animDuration)
      })
    })
  }

  const animateLandingContentDown = () => {
    const mainElement = document.querySelector('main#main-content, main.main')
    if (mainElement) {
      mainElement.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease-out'
      mainElement.style.transform = 'translateY(100vh)'
      mainElement.style.opacity = '0'
    }
  }

  const animateMenuUpToLanding = () => {
    const nav = horizontalNavRef.current
    if (!nav) return
    nav.classList.add('header__horizontal-nav--slide-up')
  }

  const handleHorizontalNavClick = (e, targetUrl) => {
    const targetPath = targetUrl?.split('?')[0]?.split('#')[0] || ''
    const targetIsLandingPage = targetPath === `/${lang}` || targetPath === `/${lang}/`

    if (isLandingPage && !targetIsLandingPage) {
      e.preventDefault()
      comingFromLandingRef.current = true
      window.dispatchEvent(new CustomEvent('page-transition-open-from-landing'))
      const footer = document.querySelector('.footer')
      if (footer) footer.classList.add('footer--menu-sliding-down')
      animateLandingMenuDown()
      animateLandingContentDown()
      setTimeout(() => router.push(targetUrl), 450)
    } else if (!isLandingPage && targetIsLandingPage) {
      e.preventDefault()
      animateMenuUpToLanding()
      setTimeout(() => router.push(targetUrl), 950)
    }
  }

  useEffect(() => {
    const clearAllNavStyles = (nav) => {
      if (!nav) return
      nav.style.position = ''
      nav.style.bottom = ''
      nav.style.width = ''
      nav.style.marginTop = ''
      nav.style.zIndex = ''
      nav.style.top = ''
      nav.style.left = ''
      nav.style.transform = ''
      nav.style.transition = ''
      nav.style.opacity = ''
      nav.style.visibility = ''
      nav.classList.remove('header__horizontal-nav--scrolled', 'header__horizontal-nav--slide-up')
    }

    const handleRouteChangeComplete = (url) => {
      const targetPath = url?.split('?')[0]?.split('#')[0] || ''
      const targetIsLandingPage = targetPath === `/${lang}` || targetPath === `/${lang}/`
      const nav = horizontalNavRef.current
      const fromLanding = comingFromLandingRef.current

      if (targetIsLandingPage) {
        const footer = document.querySelector('.footer')
        if (footer) footer.classList.remove('footer--menu-sliding-down')
        if (nav) clearAllNavStyles(nav)
        return
      }

      if (fromLanding) {
        if (nav) {
          nav.classList.add('header__horizontal-nav--from-landing')
          nav.style.transition = 'none'
          nav.style.marginTop = ''
          nav.style.zIndex = ''
          nav.style.transform = ''
          nav.style.opacity = ''
          nav.style.visibility = ''
          nav.classList.remove('header__horizontal-nav--scrolled', 'header__horizontal-nav--slide-up')
          /* Keep position/bottom/left/width so menu does not jump when coming from landing */
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (nav.style) nav.style.transition = ''
              nav.classList.remove('header__horizontal-nav--from-landing')
            })
          })
        }
        return
      }

      /* Other → other: clear styles so enter-bottom runs and we get the little jump (menu + content via pageTransition) */
      if (nav) clearAllNavStyles(nav)
    }

    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    return () => router.events.off('routeChangeComplete', handleRouteChangeComplete)
  }, [router.events, lang])

  useEffect(() => {
    const handleSlideToLanding = (e) => {
      const targetUrl = e.detail?.targetUrl
      if (!targetUrl) return
      animateMenuUpToLanding()
      setTimeout(() => router.push(targetUrl), 950)
    }
    window.addEventListener('horizontal-nav-slide-to-landing', handleSlideToLanding)
    return () => window.removeEventListener('horizontal-nav-slide-to-landing', handleSlideToLanding)
  }, [router])

  useEffect(() => {
    if (isLandingPage && horizontalNavRef.current) {
      const nav = horizontalNavRef.current
      nav.style.position = ''
      nav.style.bottom = ''
      nav.style.width = ''
      nav.style.marginTop = ''
      nav.style.zIndex = ''
      nav.style.top = ''
      nav.style.transform = ''
      nav.style.transition = ''
      nav.style.opacity = ''
      nav.style.visibility = ''
      nav.classList.add('header__horizontal-nav--enter-top')
      setTimeout(() => {
        if (horizontalNavRef.current) {
          horizontalNavRef.current.classList.remove('header__horizontal-nav--enter-top')
        }
      }, 600)
    }
  }, [isLandingPage])

  useEffect(() => {
    if (!isLandingPage && horizontalNavRef.current) {
      if (comingFromLandingRef.current) {
        comingFromLandingRef.current = false
        return
      }
      const nav = horizontalNavRef.current
      nav.classList.add('header__horizontal-nav--enter-bottom')
      const t = setTimeout(() => {
        if (horizontalNavRef.current) {
          horizontalNavRef.current.classList.remove('header__horizontal-nav--enter-bottom')
        }
      }, 600)
      return () => clearTimeout(t)
    }
  }, [isLandingPage, router.asPath])

  if (horizontalNavLinks.length === 0) return null

  return (
    <nav
      className={`header__horizontal-nav ${isLandingPage ? 'header__horizontal-nav--landing' : 'header__horizontal-nav--at-bottom'}`}
      ref={horizontalNavRef}
      aria-label={lang === "de" ? "Hauptnavigation" : "Main navigation"}
    >
      <div className="header__horizontal-nav__grid">
        {horizontalNavLinks.map((link) => {
          const url = getNavUrl(link)
          const linkTitle = typeof link.title === "object" ? link.title[lang] || link.title.en : link.title
          const isActive = currentPath === url || currentPath.startsWith(url + '/')

          if (!url) return null

          return (
            <div className={`header__horizontal-nav__item ${isActive ? 'active' : ''}`} key={link._id || link.navSlug || link.slug?.current || link._key}>
              <Link
                href={url}
                aria-label={linkTitle}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => handleHorizontalNavClick(e, url)}
              >
                {linkTitle || 'Untitled'}
              </Link>
            </div>
          )
        })}
      </div>
    </nav>
  )
}

export default HorizontalNav
