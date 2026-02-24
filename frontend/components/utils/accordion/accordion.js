"use client"

import { useEffect, useRef } from "react"

const Accordion = ({ title, children, isOpen, toggle }) => {
  const accordionRef = useRef(null)

  useEffect(() => {
    if (isOpen && accordionRef.current) {
      setTimeout(() => {
        const headerHeight = 100 
        const mobileMenuHeight = window.innerWidth <= 800 ? 150 : 0 
        const totalOffset = headerHeight + mobileMenuHeight + 20 

        const elementTop = accordionRef.current.offsetTop
        const scrollToPosition = elementTop - totalOffset

        window.scrollTo({
          top: Math.max(0, scrollToPosition), 
          behavior: "smooth",
        })
      }, 50) 
    }
  }, [isOpen])

  return (
    <div ref={accordionRef} className={["accordion", isOpen].join(" ")}>
      <h2 className="accordion__header" onClick={toggle}>
        {title}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {isOpen ? (
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </h2>
      <div className="accordion__inner">{children}</div>
    </div>
  )
}

export default Accordion
