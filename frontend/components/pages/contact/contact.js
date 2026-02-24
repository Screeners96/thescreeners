"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Intro from "@/components/intro/intro"
import GoogleMaps from "@/components/googleMaps/googleMaps"
import BodyText from "@/components/bodyText/bodyText"

const Contact = ({ pageData, globalData, preview, lang, rawPageData }) => {
  const router = useRouter()
  const bodyTextData = pageData?.bodyText || []
  const mapRef = useRef(null)
  const wrapperRef = useRef(null)
  
  const addressItem = pageData?.infoItems?.find(item => item._type === 'infoAddress')
  const phoneItem = pageData?.infoItems?.find(item => item._type === 'infoPhone')
  const emailItem = pageData?.infoItems?.find(item => item._type === 'infoEmail')
  
  const addressTitle = addressItem?.title || null
  const addressBodyText = addressItem?.bodyText || null
  
  const phoneLabel = phoneItem?.title || null
  const phone = phoneItem?.phone || null
  
  const emailLabel = emailItem?.title || null
  const email = emailItem?.email || null
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  
  useEffect(() => {
    if (!pageData?.googleMaps) return

    const syncHeights = () => {
      if (mapRef.current && wrapperRef.current) {
        const googleMapsContainer = mapRef.current.querySelector('.google-maps__container')
        if (googleMapsContainer) {
          const containerHeight = googleMapsContainer.offsetHeight
          if (containerHeight > 0) {
            wrapperRef.current.style.height = `${containerHeight}px`
          }
        }
      }
    }

    syncHeights()

    const resizeObserver = new ResizeObserver(() => {
      syncHeights()
    })

    if (mapRef.current) {
      const googleMapsContainer = mapRef.current.querySelector('.google-maps__container')
      if (googleMapsContainer) {
        resizeObserver.observe(googleMapsContainer)
      }
      resizeObserver.observe(mapRef.current)
    }

    const handleResize = () => {
      syncHeights()
    }

    window.addEventListener('resize', handleResize)

    const intervalId = setInterval(() => {
      syncHeights()
    }, 100)

    setTimeout(() => {
      clearInterval(intervalId)
    }, 2000)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      clearInterval(intervalId)
    }
  }, [pageData?.googleMaps])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    console.log('Form data:', formData)
    
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', reason: '', message: '' })
    }, 1000)
  }
  
  return (
    <>
      <main id="main-content" className="main page--contact content" data-readable="true" role="main">
      {(pageData?.title || (pageData?.bodyText && bodyTextData.length > 0)) && (
        <Intro title={pageData?.title} data={bodyTextData} lang={lang} />
      )}

      <div className="page--contact__container">
        <div className="page--contact__wrapper" ref={wrapperRef}>
            <section className="page--contact__form-section" aria-labelledby="contact-form-title">
              <h2 id="contact-form-title" className="page--contact__form-title">
                {lang === "de" ? "Kontaktieren Sie uns!" : "Get in touch!"}
              </h2>
              <form className="page--contact__form" onSubmit={handleSubmit} noValidate>
              <div className="page--contact__form-field">
                  <label htmlFor="name" className="page--contact__label">
                  </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                    placeholder={lang === "de" ? "Name" : "Name"}
                  required
                    aria-required="true"
                  className="page--contact__input"
                    aria-describedby="name-error"
                />
                  <span id="name-error" className="sr-only" role="alert"></span>
              </div>
              
              <div className="page--contact__form-field">
                  <label htmlFor="email" className="page--contact__label">
                  </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                    placeholder={lang === "de" ? "E-Mail" : "Email"}
                  required
                    aria-required="true"
                  className="page--contact__input"
                    aria-describedby="email-error"
                />
                  <span id="email-error" className="sr-only" role="alert"></span>
              </div>
              
              <div className="page--contact__form-field">
                  <label htmlFor="reason" className="page--contact__label">
                  </label>
                <input
                  type="text"
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                    placeholder={lang === "de" ? "Grund für Kontakt" : "Reason for Contact"}
                  required
                    aria-required="true"
                  className="page--contact__input"
                    aria-describedby="reason-error"
                />
                  <span id="reason-error" className="sr-only" role="alert"></span>
              </div>
              
              <div className="page--contact__form-field">
                  <label htmlFor="message" className="page--contact__label">
                  </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                    placeholder={lang === "de" ? "Nachricht" : "Message"}
                  required
                    aria-required="true"
                  rows="6"
                  className="page--contact__textarea"
                    aria-describedby="message-error"
                />
                  <span id="message-error" className="sr-only" role="alert"></span>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="page--contact__submit-button"
                  aria-label={isSubmitting ? (lang === "de" ? "Wird gesendet..." : "Sending...") : (lang === "de" ? "Nachricht senden" : "Send Message")}
              >
                  {isSubmitting ? (lang === "de" ? "Wird gesendet..." : "Sending...") : (lang === "de" ? "Nachricht senden" : "Send Message")}
              </button>
              
              {submitStatus === 'success' && (
                  <div className="page--contact__success-message" role="alert" aria-live="polite">
                    {lang === "de" ? "Vielen Dank! Ihre Nachricht wurde gesendet." : "Thank you! Your message has been sent."}
                  </div>
              )}
            </form>
            </section>

            <aside className="page--contact__address-section" aria-label={lang === "de" ? "Kontaktinformationen" : "Contact Information"}>
            {addressBodyText && addressBodyText.length > 0 && (
                <address className="page--contact__address">
                {addressTitle && <span className="page--contact__address-title">{addressTitle}: </span>}
                <div className="page--contact__address-text">
                  <BodyText data={addressBodyText} lang={lang} />
                </div>
                </address>
            )}

            {phone && (
              <p className="page--contact__phone">
                  <a href={`tel:${phone}`} className="page--contact__phone-link" aria-label={`${phoneLabel || (lang === "de" ? "Telefon" : "Phone")}: ${phone}`}>
                    {phone}
                  </a>
              </p>
            )}
            
            {email && (
              <p className="page--contact__email">
                  <a href={`mailto:${email}`} className="page--contact__email-link" aria-label={`${emailLabel || (lang === "de" ? "E-Mail" : "Email")}: ${email}`}>
                    {email}
                  </a>
              </p>
            )}
            
         
            </aside>
          </div>
        
        {pageData?.googleMaps && (
          <div className="page--contact__map" ref={mapRef}>
            <GoogleMaps
              apiKey={pageData.googleMaps.apiKey}
              latitude={pageData.googleMaps.latitude}
              longitude={pageData.googleMaps.longitude}
              title={lang === "de" ? "Karte mit Standort" : "Location Map"}
            />
          </div>
        )}
      </div>
    </main>
    </>
  )
}

export default Contact
