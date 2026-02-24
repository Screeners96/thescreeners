import { cmsClient, fetchAllPagesQuery, globalQuery } from "@/utils/sanity"
import BodyText from "@/components/bodyText/bodyText"
import Layout from "@/components/layout/layout"
import Modules from "@/components/modules/modules"

// Helper function to extract bodyText from nested grids
const extractBodyTextFromGrids = (grids, lang) => {
  const bodyTexts = []
  
  const traverseGrid = (grid) => {
    if (!grid) return
    
    // Check if this grid item has bodyText (wrapperTextBig)
    if (grid._type === 'wrapperTextBig' && grid.bodyText) {
      const text = grid.bodyText[lang] || grid.bodyText.en
      if (text && Array.isArray(text) && text.length > 0) {
        bodyTexts.push(text)
      }
    }
    
    // Traverse nested grids
    if (grid.topLeft && Array.isArray(grid.topLeft)) {
      grid.topLeft.forEach(traverseGrid)
    }
    if (grid.topRight && Array.isArray(grid.topRight)) {
      grid.topRight.forEach(traverseGrid)
    }
    if (grid.top && Array.isArray(grid.top)) {
      grid.top.forEach(traverseGrid)
    }
    if (grid.bottom && Array.isArray(grid.bottom)) {
      grid.bottom.forEach(traverseGrid)
    }
    if (grid.bottomLeft && Array.isArray(grid.bottomLeft)) {
      grid.bottomLeft.forEach(traverseGrid)
    }
    if (grid.bottomRight && Array.isArray(grid.bottomRight)) {
      grid.bottomRight.forEach(traverseGrid)
    }
    if (grid.items && Array.isArray(grid.items)) {
      grid.items.forEach(traverseGrid)
    }
  }
  
  if (Array.isArray(grids)) {
    grids.forEach(traverseGrid)
  }
  
  return bodyTexts
}

const DebugPages = ({ allPagesData, globalData, lang }) => {
  // Flatten all pages into a single array
  const pages = []
  
  if (allPagesData.pages) {
    pages.push(...allPagesData.pages)
  }
  
  // Add other page types
  const otherPages = [
    allPagesData.frontpage,
    allPagesData.aboutUs,
    allPagesData.contact,
    allPagesData.event,
    allPagesData.imagefilm,
    allPagesData.trailer,
    allPagesData.datenschutz,
    allPagesData.impressum,
  ].filter(Boolean)
  
  pages.push(...otherPages)

  return (
    <Layout globalData={globalData} lang={lang}>
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 20px',
        minHeight: '100vh'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '60px',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          All Pages from Sanity
        </h1>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '80px'
        }}>
          {pages.map((page, index) => {
            // Handle frontpage - no title field, use "THE SCREENERS"
            const isFrontpage = page?._type === 'frontpage'
            const title = isFrontpage 
              ? 'THE SCREENERS' 
              : (page?.title?.[lang] || page?.title?.en || page?.title || 'No Title')
            
            const bodyText = page?.bodyText?.[lang] || page?.bodyText?.en || null
            const description = page?.description?.[lang] || page?.description?.en || null
            const slug = page?.slug || 'no-slug'
            const type = page?._type || 'unknown'
            
            // Get content based on page type
            const hasModules = page?.modules && Array.isArray(page.modules) && page.modules.length > 0
            const hasGrids = page?.grids && Array.isArray(page.grids) && page.grids.length > 0
            const hasSubtitle = page?.subtitle && (page.subtitle[lang] || page.subtitle.en)
            const hasInfoItems = page?.infoItems && Array.isArray(page.infoItems) && page.infoItems.length > 0
            const hasSections = page?.sections && Array.isArray(page.sections) && page.sections.length > 0
            const hasContent = page?.content && (page.content[lang] || page.content.en)

            return (
              <article
                key={page?._id || index}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '40px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div style={{
                  marginBottom: '20px',
                  paddingBottom: '20px',
                  borderBottom: '2px solid #333'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#666',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {type} • /{slug}
                  </div>
                  <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    margin: '0',
                    textAlign: 'center'
                  }}>
                    {title}
                  </h2>
                </div>

                {description && (
                  <div style={{
                    marginBottom: '30px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    color: '#555'
                  }}>
                    {description}
                  </div>
                )}

                {/* Frontpage: Show modules */}
                {isFrontpage && hasModules && (
                  <div style={{ textAlign: 'center' }}>
                    <Modules modules={page.modules} lang={lang} />
                  </div>
                )}

                {/* About Us: Show grids content */}
                {type === 'aboutUs' && hasGrids && (
                  <div style={{ textAlign: 'center' }}>
                    {extractBodyTextFromGrids(page.grids, lang).map((bodyText, textIndex) => (
                      <div key={textIndex} style={{ marginBottom: '30px' }}>
                        <BodyText data={bodyText} lang={lang} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Contact: Show subtitle and infoItems */}
                {type === 'contact' && (
                  <div style={{ textAlign: 'center' }}>
                    {hasSubtitle && (
                      <div style={{ marginBottom: '30px' }}>
                        <BodyText data={page.subtitle[lang] || page.subtitle.en} lang={lang} />
                      </div>
                    )}
                    {hasInfoItems && (
                      <div style={{ marginTop: '30px' }}>
                        {page.infoItems.map((item, itemIndex) => (
                          <div key={itemIndex} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '4px' }}>
                            {item.title && (
                              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                {item.title[lang] || item.title.en || ''}
                              </div>
                            )}
                            {item.bodyText && (
                              <BodyText data={item.bodyText[lang] || item.bodyText.en} lang={lang} />
                            )}
                            {item.email && <div>Email: {item.email}</div>}
                            {item.phone && <div>Phone: {item.phone}</div>}
                            {item.url && <div>URL: <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Datenschutz: Show sections content */}
                {type === 'datenschutz' && hasSections && (
                  <div style={{ textAlign: 'center' }}>
                    {page.sections.map((section, sectionIndex) => {
                      const sectionTitle = section?.sectionTitle?.[lang] || section?.sectionTitle?.en || ''
                      const sectionContent = section?.content?.[lang] || section?.content?.en || null
                      if (sectionContent && Array.isArray(sectionContent) && sectionContent.length > 0) {
                        return (
                          <div key={sectionIndex} style={{ marginBottom: '40px' }}>
                            {sectionTitle && (
                              <h3 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {sectionTitle}
                              </h3>
                            )}
                            <BodyText data={sectionContent} lang={lang} />
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )}

                {/* Impressum: Show content */}
                {type === 'impressum' && hasContent && (
                  <div style={{ textAlign: 'center' }}>
                    <BodyText data={page.content[lang] || page.content.en} lang={lang} />
                  </div>
                )}

                {/* Regular bodyText for pages that use PAGE_FIELDS_REGULAR (page, event, imagefilm, trailer) */}
                {!isFrontpage && type !== 'aboutUs' && type !== 'contact' && type !== 'datenschutz' && type !== 'impressum' && bodyText && (
                  <div style={{
                    textAlign: 'center'
                  }}>
                    {Array.isArray(bodyText) && bodyText.length > 0 ? (
                      <BodyText data={bodyText} lang={lang} />
                    ) : (
                      <div style={{
                        color: '#999',
                        fontStyle: 'italic'
                      }}>
                        No body text available
                      </div>
                    )}
                  </div>
                )}

                {/* Show message if no content at all */}
                {!isFrontpage && type !== 'aboutUs' && type !== 'contact' && type !== 'datenschutz' && type !== 'impressum' && !bodyText && !description && !hasModules && (
                  <div style={{
                    textAlign: 'center',
                    color: '#999',
                    fontStyle: 'italic',
                    padding: '20px'
                  }}>
                    No content available
                  </div>
                )}
                
                {type === 'datenschutz' && !hasSections && (
                  <div style={{
                    textAlign: 'center',
                    color: '#999',
                    fontStyle: 'italic',
                    padding: '20px'
                  }}>
                    No sections available
                  </div>
                )}
                
                {type === 'impressum' && !hasContent && (
                  <div style={{
                    textAlign: 'center',
                    color: '#999',
                    fontStyle: 'italic',
                    padding: '20px'
                  }}>
                    No content available
                  </div>
                )}
                
                {isFrontpage && !hasModules && (
                  <div style={{
                    textAlign: 'center',
                    color: '#999',
                    fontStyle: 'italic',
                    padding: '20px'
                  }}>
                    No modules available
                  </div>
                )}
                
                {type === 'aboutUs' && !hasGrids && (
                  <div style={{
                    textAlign: 'center',
                    color: '#999',
                    fontStyle: 'italic',
                    padding: '20px'
                  }}>
                    No grids available
                  </div>
                )}
                
                {type === 'contact' && !hasSubtitle && !hasInfoItems && (
                  <div style={{
                    textAlign: 'center',
                    color: '#999',
                    fontStyle: 'italic',
                    padding: '20px'
                  }}>
                    No content available
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {pages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <p>No pages found in Sanity.</p>
          </div>
        )}

        <div style={{
          marginTop: '80px',
          paddingTop: '40px',
          borderTop: '1px solid #ddd',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.875rem'
        }}>
          <p>Total pages: {pages.length}</p>
        </div>
      </main>
    </Layout>
  )
}

export default DebugPages

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"

    const [allPagesData, globalDataRaw] = await Promise.all([
      cmsClient.fetch(fetchAllPagesQuery),
      cmsClient.fetch(globalQuery)
    ])

    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw?.colorsHeader || "#000000",
      colorsMain: globalDataRaw?.colorsMain || "#000000",
    }

    return {
      props: { allPagesData, globalData, lang },
      revalidate: 60, // Revalidate every 60 seconds
    }
  } catch (error) {
    console.error("Error in getStaticProps:", error)
    return {
      props: {
        allPagesData: {
          pages: [],
          frontpage: null,
          aboutUs: null,
          contact: null,
          event: null,
          imagefilm: null,
          trailer: null,
          datenschutz: null,
          impressum: null,
        },
        globalData: {
          colorsHeader: "#000000",
          colorsMain: "#000000",
        },
        lang: params?.lang || "en",
        error: error.message,
      },
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { lang: "en" } }, { params: { lang: "de" } }],
    fallback: false,
  }
}

