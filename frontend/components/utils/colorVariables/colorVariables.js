import { useEffect } from "react"

/**
 * ColorVariables Component
 * Injects CSS custom properties from Sanity settings into the document root
 * 
 * @param {Object} props
 * @param {Object} props.settings - Settings data from Sanity
 */
const ColorVariables = ({ settings = {} }) => {
  useEffect(() => {
    if (!settings) return

    const root = document.documentElement
    const variables = {}

    // Map Sanity settings color fields to CSS variables
    if (settings.colorsAccent) {
      variables['--color-accent'] = settings.colorsAccent
      variables['--color-accent-gold'] = settings.colorsAccent
    }

    if (settings.colorLightGrey) {
      variables['--color-light-gray'] = settings.colorLightGrey
      variables['--color-light-grey'] = settings.colorLightGrey // Alias
    }

    if (settings.colorGrey) {
      variables['--color-gray'] = settings.colorGrey
      variables['--color-grey'] = settings.colorGrey // Alias
      variables['--color-mid-dark'] = settings.colorGrey // Map grey to mid-dark
    }

    if (settings.colorDarkGrey) {
      variables['--color-dark-grey'] = settings.colorDarkGrey
      variables['--color-dark'] = settings.colorDarkGrey // Map dark grey to dark
    }

    // Apply variables to root
    Object.entries(variables).forEach(([property, value]) => {
      if (value) {
        root.style.setProperty(property, value)
      }
    })

    // Cleanup function to remove variables when component unmounts
    return () => {
      Object.keys(variables).forEach(property => {
        root.style.removeProperty(property)
      })
    }
  }, [settings])

  return null // This component doesn't render anything
}

export default ColorVariables

