import imageUrlBuilder from '@sanity/image-url'
import { cmsClient } from "../../utils/sanity"

const Footer = ({ getInTouch, socialLinks, contactEmail, lang = "en" }) => {
  const getInTouchText = getInTouch 
    ? typeof getInTouch === "object" 
      ? getInTouch[lang] || getInTouch.en || "Get in touch"
      : getInTouch
    : "Get in touch"

  // Helper to get image URL from Sanity image
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

  // Helper to get standardized SVG icon based on iconName
  const getSocialIcon = (iconName) => {
    if (!iconName) return null
    
    const iconNameLower = iconName.toLowerCase()
    
    // Standardized SVG icons for common social media platforms
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

  // Handle both array format (new) and object format (legacy)
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
    <footer className="footer">
      <div className="footer__content">
        {contactEmail ? (
          <a 
            href={`mailto:${contactEmail}`}
            className="footer__get-in-touch"
          >
            @ {getInTouchText}
          </a>
        ) : (
          <p className="footer__get-in-touch">@ {getInTouchText}</p>
        )}

        {socialLinksArray && socialLinksArray.length > 0 && (
          <div className="footer__social">
            {socialLinksArray.map((link, index) => {
              if (!link.url) return null

              const iconUrl = link.iconType === 'image' && link.iconImage
                ? getImageUrl(link.iconImage)
                : null

              const ariaLabel = link.workLabel
                ? `${link.label} - ${link.workLabel}`
                : link.label || "Social Link"

              // Get standardized icon or use first letter as fallback
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
                  className={`footer__social-link footer__social-link--${link.iconName || link.label?.toLowerCase() || 'link'}`}
                  aria-label={ariaLabel}
                >
                  {iconUrl ? (
                    <img 
                      src={iconUrl} 
                      alt={link.iconImage?.alt || link.label || "Social icon"}
                      className="footer__social-icon"
                      loading="lazy"
                    />
                  ) : standardizedIcon ? (
                    <span className="footer__social-icon-svg">
                      {standardizedIcon}
                    </span>
                  ) : (
                    <span className="footer__social-icon-text">
                      {displayText}
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </footer>
  )
}

export default Footer
