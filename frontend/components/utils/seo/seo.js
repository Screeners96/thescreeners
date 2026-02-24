import Head from "next/head"
import { useRouter } from "next/router"
import imageUrlBuilder from '@sanity/image-url'
import { cmsClient } from "../../../utils/sanity"

/**
 * SEO Component
 * Handles both advanced SEO (for frontpage) and simple SEO (for other pages)
 * 
 * @param {Object} props
 * @param {Object} props.pageData - Page data with SEO fields
 * @param {Object} props.globalData - Global settings data
 * @param {string} props.lang - Current language (en/de)
 * @param {string} props.siteUrl - Base URL of the site (optional, will try to detect)
 */
const SEO = ({ pageData = {}, globalData = {}, lang = "en", siteUrl = null }) => {
  const router = useRouter()
  
  // Get base URL
  const getBaseUrl = () => {
    if (siteUrl) return siteUrl
    if (typeof window !== "undefined") {
      return `${window.location.protocol}//${window.location.host}`
    }
    return process.env.NEXT_PUBLIC_SITE_URL || "https://thescreeners.com"
  }

  const baseUrl = getBaseUrl()
  const currentPath = router?.asPath || router?.pathname || ""
  const currentUrl = `${baseUrl}${currentPath}`

  // Helper to convert Sanity image to URL
  const getImageUrl = (image, width = 1200) => {
    if (!image || !image.asset) return null
    try {
      const builder = imageUrlBuilder(cmsClient)
      return builder.image(image).width(width).quality(100).url()
    } catch (error) {
      console.error("Error converting image URL:", error)
      return null
    }
  }

  // Helper to get multilingual value
  const getMultilingual = (field, fallback = "") => {
    if (!field) return fallback
    if (typeof field === "string") return field
    return field[lang] || field.en || fallback
  }

  // Get page title
  const pageTitle = getMultilingual(pageData?.title, "")
  const siteTitle = globalData?.siteTitle || "THE SCREENERS"
  
  // Check if this is advanced SEO (frontpage with full SEO fields)
  const hasAdvancedSEO = pageData?.seoTitle || pageData?.openGraph || pageData?.schemaOrg

  // Basic SEO fields
  const seoTitle = hasAdvancedSEO 
    ? getMultilingual(pageData?.seoTitle, pageTitle)
    : pageTitle
  
  const seoDescription = hasAdvancedSEO
    ? getMultilingual(pageData?.seoDescription, getMultilingual(pageData?.description, ""))
    : getMultilingual(pageData?.description, "")
  
  const seoKeywords = hasAdvancedSEO ? getMultilingual(pageData?.seoKeywords, "") : ""
  
  // Canonical URL
  const canonicalUrl = hasAdvancedSEO && pageData?.canonicalUrl 
    ? pageData.canonicalUrl 
    : currentUrl

  // Robots meta
  const robotsMeta = hasAdvancedSEO ? pageData?.robotsMeta || {} : {}
  const robotsContent = [
    robotsMeta.noindex ? "noindex" : "index",
    robotsMeta.nofollow ? "nofollow" : "follow",
    robotsMeta.noarchive ? "noarchive" : "",
    robotsMeta.nosnippet ? "nosnippet" : ""
  ].filter(Boolean).join(", ") || "index, follow"

  // Open Graph
  const ogTitle = hasAdvancedSEO && pageData?.openGraph?.ogTitle
    ? getMultilingual(pageData.openGraph.ogTitle, seoTitle)
    : seoTitle
  
  const ogDescription = hasAdvancedSEO && pageData?.openGraph?.ogDescription
    ? getMultilingual(pageData.openGraph.ogDescription, seoDescription)
    : seoDescription
  
  const ogImage = hasAdvancedSEO && pageData?.openGraph?.ogImage
    ? getImageUrl(pageData.openGraph.ogImage, 1200)
    : null
  
  const ogType = hasAdvancedSEO ? (pageData?.openGraph?.ogType || "website") : "website"
  const ogSiteName = hasAdvancedSEO ? (pageData?.openGraph?.ogSiteName || siteTitle) : siteTitle
  const ogUrl = hasAdvancedSEO && pageData?.openGraph?.ogUrl
    ? pageData.openGraph.ogUrl
    : canonicalUrl

  // Twitter Card
  const twitterCard = hasAdvancedSEO ? pageData?.twitterCard : null
  const twitterCardType = twitterCard?.cardType || "summary_large_image"
  const twitterTitle = twitterCard?.twitterTitle
    ? getMultilingual(twitterCard.twitterTitle, ogTitle)
    : ogTitle
  const twitterDescription = twitterCard?.twitterDescription
    ? getMultilingual(twitterCard.twitterDescription, ogDescription)
    : ogDescription
  const twitterImage = twitterCard?.twitterImage
    ? getImageUrl(twitterCard.twitterImage, 1200)
    : ogImage

  // Schema.org structured data
  const schemaOrg = hasAdvancedSEO && pageData?.schemaOrg?.enableSchema
    ? pageData.schemaOrg
    : null

  // Generate Schema.org JSON-LD
  const generateSchemaOrg = () => {
    if (!schemaOrg) return null

    const schemaType = schemaOrg.schemaType || "WebPage"
    const schemaName = getMultilingual(schemaOrg.schemaName, seoTitle)
    const schemaDescription = getMultilingual(schemaOrg.schemaDescription, seoDescription)
    const schemaImage = schemaOrg.schemaImage
      ? getImageUrl(schemaOrg.schemaImage, 1200)
      : ogImage

    const baseSchema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": schemaName,
      "description": schemaDescription,
      "url": canonicalUrl,
    }

    if (schemaImage) {
      baseSchema.image = schemaImage
    }

    if (schemaOrg.schemaDatePublished) {
      baseSchema.datePublished = schemaOrg.schemaDatePublished
    }

    if (schemaOrg.schemaDateModified) {
      baseSchema.dateModified = schemaOrg.schemaDateModified
    }

    if (schemaOrg.schemaAuthor) {
      baseSchema.author = {
        "@type": "Person",
        "name": schemaOrg.schemaAuthor.name,
      }
      if (schemaOrg.schemaAuthor.url) {
        baseSchema.author.url = schemaOrg.schemaAuthor.url
      }
    }

    return baseSchema
  }

  const schemaData = generateSchemaOrg()

  // Additional meta tags
  const additionalMetaTags = hasAdvancedSEO ? (pageData?.additionalMetaTags || []) : []

  // Full title for display
  const fullTitle = seoTitle ? `${siteTitle}${seoTitle ? ` | ${seoTitle}` : ""}` : siteTitle

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      {seoDescription && <meta name="description" content={seoDescription} />}
      {seoKeywords && <meta name="keywords" content={seoKeywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Meta */}
      <meta name="robots" content={robotsContent} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content={ogSiteName} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      {twitterCard?.twitterSite && <meta name="twitter:site" content={twitterCard.twitterSite} />}
      {twitterCard?.twitterCreator && <meta name="twitter:creator" content={twitterCard.twitterCreator} />}
      
      {/* Additional Meta Tags */}
      {additionalMetaTags.map((tag, index) => (
        <meta key={index} name={tag.name} content={tag.content} />
      ))}
      
      {/* Schema.org JSON-LD */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      
      {/* Language alternates */}
      {currentPath && (
        <>
          <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${currentPath.replace(/^\/(en|de)/, "")}`} />
          <link rel="alternate" hrefLang="de" href={`${baseUrl}/de${currentPath.replace(/^\/(en|de)/, "")}`} />
        </>
      )}
    </Head>
  )
}

export default SEO

