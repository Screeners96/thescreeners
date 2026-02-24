"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

const Logo = ({ lang = "en" }) => {
  const router = useRouter()
  const logoRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const animationTimeoutRef = useRef(null)
  const hoverTimeoutRef = useRef(null)

  useEffect(() => {
    if (logoRef.current) {
      logoRef.current.classList.add('logo--visible')
      
      setIsAnimating(true)
      logoRef.current.classList.add('logo--animate-in')
      
      animationTimeoutRef.current = setTimeout(() => {
        if (logoRef.current) {
          const isCurrentlyHovering = logoRef.current.classList.contains('logo--animate-hover')
          if (!isCurrentlyHovering) {
            logoRef.current.classList.remove('logo--animate-in')
            logoRef.current.classList.add('logo--visible')
          }
        }
      }, 1400)
      
      const fallbackTimeout = setTimeout(() => {
        if (logoRef.current && !logoRef.current.classList.contains('logo--visible')) {
          logoRef.current.classList.add('logo--visible')
        }
      }, 2000)
      
      return () => {
        clearTimeout(fallbackTimeout)
      }
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleRouteChangeStart = () => {
      if (logoRef.current && !isHovering) {
        logoRef.current.classList.add('logo--animate-out')
        setIsAnimating(false)
      }
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events, isHovering])

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (logoRef.current) {
      logoRef.current.classList.remove('logo--animate-out', 'logo--visible', 'logo--animate-hover')
      
      setTimeout(() => {
        if (logoRef.current) {
          logoRef.current.classList.add('logo--animate-hover')
          setIsAnimating(true)
        }
      }, 10)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (logoRef.current) {
      logoRef.current.classList.remove('logo--animate-hover')
      logoRef.current.classList.add('logo--animate-out')
      
      hoverTimeoutRef.current = setTimeout(() => {
        if (logoRef.current) {
          logoRef.current.classList.remove('logo--animate-out')
          logoRef.current.classList.add('logo--visible')
        }
      }, 1500)
    }
  }

  return (
    <Link 
      href={`/${lang}/`} 
      className="logo" 
      ref={logoRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg 
        className="logo__svg" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 306.99 58.579"
        preserveAspectRatio="xMidYMid meet"
        aria-label="THE SCREENERS"
        style={{ overflow: 'visible' }}
      >
        <g id="Layer_0_xA0_Image">
          <g>
              <path fill="currentColor" d="M227.103,0c2.714.872,4.311,2.448,4.565,5.37l-.011,48.056c-.299,2.967-2.627,5.089-5.622,5.153H79.488c-2.995-.023-5.47-2.414-5.634-5.381l.011-48.056c.274-2.718,2.004-4.065,4.314-5.142h148.924ZM127.084,22.93c.464-.638-1.847-3.208-2.379-3.689-5.635-5.093-14.531-3.396-18.112,3.226-5.969,11.035,4.322,25.05,16.319,18.18.955-.547,4.852-3.909,4.159-5.001-.136-.215-4.038-1.794-4.623-2.159-5.146,7.456-11.936,2.33-11.146-5.608.667-6.709,7.714-9.049,10.906-2.76.641-.268,4.719-1.973,4.877-2.189ZM101.886,21.484c.117-.204.054-.495-.08-.692-.147-.214-2.335-1.807-2.732-2.057-6.44-4.065-18.978-2.753-17.714,6.902.783,5.98,7.147,5.599,11.502,6.461,4.786.948,3.861,4.542.066,4.956-3.39.369-5.831-.713-8.349-2.832-.559.376-4.322,2.397-4.451,2.62-.413.711,2.613,3.047,3.319,3.446,5.82,3.293,17.777,2.636,18.891-5.568,1.086-8.002-7.236-7.591-12.421-8.77-1.229-.28-2.386-.607-2.316-2.127.154-3.367,5.726-2.34,7.772-1.161.468.27,1.927,1.733,2.101,1.733.265,0,4.281-2.682,4.411-2.911ZM152.281,41.596l-5.271-9.664c.708-.585,1.495-.758,2.267-1.339,3.752-2.824,3.226-9.569-.615-12.045-1.038-.669-3.468-1.575-4.655-1.575h-13.31v24.623h6.235v-8.606h3.717c1.855,2.722,3.157,5.861,5.036,8.606h6.595ZM174.584,16.973h-17.866c-.025,0-.36.333-.36.359v23.906c0,.025.334.359.36.359h19.065v-5.02h-13.19v-5.498h11.271v-5.02h-11.031v-4.064h11.751v-5.02ZM198.565,16.973h-18.226v24.623h19.425v-5.02h-13.19v-5.498h11.271v-5.02h-11.271v-4.064h11.991v-5.02ZM210.196,16.973h-5.875v24.623h5.995l-.237-14.821c.36.055.446.452.602.712,2.508,4.184,4.684,8.664,7.356,12.748.313.478.592.981,1.032,1.362h5.875v-24.623h-5.995l.12,15.063c-2.802-5.096-5.618-10.246-8.873-15.063Z"/>
              <path fill="currentColor" d="M0,16.973l18.118-.012c.246-.052.827.173.827.371v4.662h-6.475v19.363h-5.995v-19.363H0v-5.02Z"/>
              <path fill="currentColor" d="M282.259,41.357h-6.715c-.598-1.02-4.185-8.606-4.676-8.606h-3.717v8.606h-6.235v-24.145h14.509c2.334,0,5.293,2.582,5.999,4.777,1.428,4.444-.007,8.207-4.435,9.923l5.27,9.444ZM267.151,21.754v6.335c0,.025.334.359.36.359h5.036c.375,0,2.18-.758,2.502-1.091,1.057-1.092,1.053-3.876-.099-4.89-.141-.124-1.134-.712-1.204-.712h-6.595Z"/>
              <path fill="currentColor" d="M28.778,17.212v8.606h8.873v-8.606h5.995v24.145h-5.995v-9.921c0-.025-.334-.359-.36-.359h-8.513v10.279h-6.235v-24.145h6.235Z"/>
              <path fill="currentColor" d="M306.452,21.488c-.14.242-3.745,2.272-4.213,2.864-1.737-1.551-3.97-3.065-6.43-3.073-2.864-.009-5.223,3.219-2.334,4.475,1.544.671,5.313.833,7.295,1.334,4.054,1.023,6.765,2.941,6.128,7.633-1.074,7.915-12.251,8.68-18.014,5.889-.774-.375-4.524-2.988-3.976-3.783,1.552-.261,3.448-2.942,4.973-2.228.379.178.463.616.717.784,1.383.911,3.532,1.825,5.203,1.919,4.464.251,7.817-3.941,2.095-5.196-4.036-.885-10.525-.442-11.644-5.844-2.01-9.71,10.45-11.703,17.092-7.715.444.267,2.847,1.99,3.022,2.247.131.191.198.502.087.695Z"/>
              <path fill="currentColor" d="M254.921,17.212v4.781h-11.991v4.303h11.271v4.542h-11.271v5.618c0,.025.334.359.36.359h12.83v4.542h-19.185v-24.145h17.986Z"/>
              <path fill="currentColor" d="M67.627,17.212v4.423c0,.025-.334.359-.36.359h-11.631v4.303h11.271v4.542h-11.271v5.618c0,.025.334.359.36.359h12.59v4.542h-18.945v-24.145h17.986Z"/>
              <path fill="currentColor" d="M143.048,21.754c2.962.445,3.366,4.57,1.163,5.941-.149.093-1.1.514-1.163.514h-6.115v-6.454c1.888.201,4.299-.273,6.115,0Z"/>
          </g>
        </g>
      </svg>
    </Link>
  )
}

export default Logo

