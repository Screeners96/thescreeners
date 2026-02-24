"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"

const PageTransition = ({ children }) => {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const contentRef = useRef(null)
  const shutterRef = useRef(null)
  const isInitialMount = useRef(true)
  const currentPathRef = useRef(router.asPath)

  const isLandingPage = () => {
    const path = router.asPath?.split('?')[0]?.split('#')[0] || ''
    const lang = router.locale || 'en'
    return path === `/${lang}` || path === `/${lang}/`
  }

  const ENTER_OFFSET_PX = 56
  const ENTER_TRANSITION = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.5s ease-out'

  const animateMainContent = (isLanding) => {
    const mainElement = document.querySelector('main#main-content, main.main')
    if (!mainElement) return

    if (isLanding) {
      mainElement.style.transition = 'transform 2s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 2s ease-out'
      mainElement.style.transform = 'translateY(-100vh)'
      mainElement.style.opacity = '0'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          mainElement.style.transform = 'translateY(0)'
          mainElement.style.opacity = '1'
        })
      })
    } else {
      mainElement.style.transition = 'none'
      mainElement.style.transform = `translateY(-${ENTER_OFFSET_PX}px)`
      mainElement.style.opacity = '0.96'
      mainElement.offsetHeight
      mainElement.style.transition = ENTER_TRANSITION
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          mainElement.style.transform = 'translateY(0)'
          mainElement.style.opacity = '1'
        })
      })
    }
  }

  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      setIsTransitioning(true)
      const pathWeAreLeaving = currentPathRef.current?.split('?')[0]?.split('#')[0] || ''
      const lang = router.locale || 'en'
      const leavingLanding = pathWeAreLeaving === `/${lang}` || pathWeAreLeaving === `/${lang}/`
      const targetPath = (url ?? router.asPath)?.split('?')[0]?.split('#')[0] || ''
      const enteringLanding = targetPath === `/${lang}` || targetPath === `/${lang}/`
      const shutterBlack = leavingLanding || enteringLanding
    
      if (shutterRef.current) {
        shutterRef.current.classList.add('page-transition-shutter--open')
        if (shutterBlack) {
          shutterRef.current.classList.add('page-transition-shutter--from-landing')
        } else {
          shutterRef.current.classList.remove('page-transition-shutter--from-landing')
        }
      }

      const mainElement = document.querySelector('main#main-content, main.main')
      if (mainElement && !leavingLanding) {
        mainElement.style.transition = ENTER_TRANSITION
        mainElement.style.transform = 'translateY(-100vh)'
        mainElement.style.opacity = '0'
      }
    }

    const handleRouteChangeComplete = (url) => {
      const newPath = (url ?? router.asPath)?.split('?')[0]?.split('#')[0] || ''
      currentPathRef.current = newPath
      setTimeout(() => {
        // Set new page’s main to hidden before closing shutter so it doesn’t flash then jump
        const mainElement = document.querySelector('main#main-content, main.main')
        const isNonLanding = !isLandingPage()

        if (mainElement && isNonLanding) {
          mainElement.style.transition = 'none'
          mainElement.style.transform = `translateY(-${ENTER_OFFSET_PX}px)`
          mainElement.style.opacity = '0.96'
        }

        if (shutterRef.current) {
          shutterRef.current.classList.remove('page-transition-shutter--open', 'page-transition-shutter--from-landing')
        }

        setTimeout(() => {
          if (isNonLanding) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                animateMainContent(false)
              })
            })
          }
          setIsTransitioning(false)
        }, 120)
      }, 80)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router.events])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      setTimeout(() => {
        animateMainContent(isLandingPage())
      }, 150)
    }
  }, [router.asPath])

  return (
    <>
      <div 
        ref={shutterRef}
        className="page-transition-shutter"
      />
      <div 
        ref={contentRef}
        className="page-transition-content"
      >
        {children}
      </div>
    </>
  )
}

export default PageTransition
