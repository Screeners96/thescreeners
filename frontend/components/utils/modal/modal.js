"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import ImageCms from "../imageCms/imageCms"
import BodyText from "../../bodyText/bodyText"
import ModalSlider from "./modalSlider"

const Modal = ({ isOpen, onClose, content, lang = "en" }) => {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previousActiveElement = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const timeoutRef = useRef(null)
  const prevIsOpenRef = useRef(isOpen)

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current
    prevIsOpenRef.current = isOpen

    if (isOpen) {
      setIsClosing(false)
      setIsAnimating(true)
      document.body.style.overflow = "hidden"
      previousActiveElement.current = document.activeElement
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (modalRef.current) {
            modalRef.current.focus()
          }
        })
      })
    } else if (wasOpen && !isClosing) {
      setIsClosing(true)
      setIsAnimating(false)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          timeoutRef.current = setTimeout(() => {
            setIsClosing(false)
            document.body.style.overflow = ""
            if (previousActiveElement.current) {
              previousActiveElement.current.focus()
            }
          }, 600)
        })
      })
    } else if (!isClosing) {
      setIsAnimating(false)
      setIsClosing(false)
      document.body.style.overflow = ""
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      document.body.style.overflow = ""
    }
  }, [isOpen, isClosing])

  useEffect(() => {
    if (!isOpen) return

    const checkMenuState = () => {
      const menuOpen = document.body.classList.contains('menu-open')
      setIsMenuOpen(menuOpen)
    }

    checkMenuState()

    const observer = new MutationObserver(checkMenuState)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [isOpen])

  const handleClose = () => {
    if (isClosing || !isOpen) return
    
    setIsClosing(true)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(false)
        
        timeoutRef.current = setTimeout(() => {
          onClose()
          setIsClosing(false)
        }, 400)
      })
    })
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isClosing) {
        handleClose()
      }
    }
    
    const handleCloseModal = () => {
      if (isOpen && !isClosing) {
        handleClose()
      }
    }
    
    const handleTab = (e) => {
      if (!isOpen) return
      
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (!focusableElements || focusableElements.length === 0) return
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    window.addEventListener("keydown", handleEscape)
    window.addEventListener("keydown", handleTab)
    window.addEventListener("closeModal", handleCloseModal)
    
    return () => {
      window.removeEventListener("keydown", handleEscape)
      window.removeEventListener("keydown", handleTab)
      window.removeEventListener("closeModal", handleCloseModal)
    }
  }, [isOpen, onClose, isClosing])

  if ((!isOpen && !isClosing) || !content) return null

  console.log('Modal content:', content)

  const title = typeof content.title === "object" 
    ? content.title[lang] || content.title.en || "" 
    : content.title || ""

  const bodyText = typeof content.bodyText === "object" && !Array.isArray(content.bodyText)
    ? content.bodyText[lang] || content.bodyText.en || []
    : content.bodyText || []
  
  console.log('Modal bodyText:', bodyText)

  const modalId = `modal-${content._id || content._key || 'default'}`
  const titleId = `${modalId}-title`

  const modalContent = (
    <div 
      className={`modal-overlay ${isAnimating ? 'modal-overlay--open' : ''} ${isClosing ? 'modal-overlay--closing' : ''}`}
      onClick={handleClose}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <div 
        ref={modalRef}
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        <div className="modal-close-wrapper">
          <button 
            ref={closeButtonRef}
            className="modal-close" 
            onClick={handleClose} 
            aria-label={lang === "de" ? "Modal schließen" : "Close modal"}
            type="button"
          >
            <div></div>
            <div></div>
            <div></div>
          </button>
        </div>
        
        {content.projectModules && content.projectModules.length > 0 && (
          <ModalSlider 
            modules={content.projectModules} 
            title={title}
            bodyText={bodyText}
            lang={lang}
          />
        )}
      </div>
    </div>
  )

  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body)
  }

  return null
}

export default Modal

