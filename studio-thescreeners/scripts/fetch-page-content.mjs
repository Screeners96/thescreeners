// Script to fetch page titles and body text for all pages
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Your actual project details
const projectId = process.env.SANITY_PROJECT_ID || '21f3spns'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN || ''

// Create a client
const client = createClient({
  projectId: projectId,
  dataset: dataset,
  token: token,
  useCdn: false,
  apiVersion: '2023-03-01'
})

// Helper function to convert PortableText to plain text
function portableTextToPlainText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map(child => {
            if (typeof child === 'string') {
              return child
            }
            if (child.text) {
              return child.text
            }
            return ''
          })
          .join('')
      }
      return ''
    })
    .join('\n\n')
    .trim()
}

// Fetch all pages
async function fetchAllPages() {
  try {
    console.log(`Connecting to project ${projectId}, dataset ${dataset}...`)
    
    const allPages = []
    
    // Fetch regular pages
    console.log('Fetching regular pages...')
    const regularPages = await client.fetch(`
      *[_type == "page" && defined(slug.current) && slug.current != null && slug.current != ""] {
        _id,
        _type,
        "slug": slug.current,
        title {
          en,
          de
        },
        bodyText {
          en[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          },
          de[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          }
        }
      }
    `)
    
    regularPages.forEach(page => {
      allPages.push({
        id: page._id,
        type: page._type,
        slug: page.slug,
        url: `/en/${page.slug}`,
        title: {
          en: page.title?.en || '',
          de: page.title?.de || ''
        },
        bodyText: {
          en: portableTextToPlainText(page.bodyText?.en),
          de: portableTextToPlainText(page.bodyText?.de)
        }
      })
    })
    
    console.log(`Found ${regularPages.length} regular pages`)
    
    // Fetch frontpage
    console.log('Fetching frontpage...')
    const frontpage = await client.fetch(`
      *[_type == "frontpage"][0] {
        _id,
        _type,
        title {
          en,
          de
        },
        bodyText {
          en,
          de
        }
      }
    `)
    
    if (frontpage) {
      allPages.push({
        id: frontpage._id,
        type: frontpage._type,
        slug: 'index',
        url: '/en/',
        title: {
          en: frontpage.title?.en || '',
          de: frontpage.title?.de || ''
        },
        bodyText: {
          en: typeof frontpage.bodyText?.en === 'string' 
            ? frontpage.bodyText.en 
            : portableTextToPlainText(frontpage.bodyText?.en),
          de: typeof frontpage.bodyText?.de === 'string' 
            ? frontpage.bodyText.de 
            : portableTextToPlainText(frontpage.bodyText?.de)
        }
      })
    }
    
    // Fetch aboutUs page
    console.log('Fetching aboutUs page...')
    const aboutUs = await client.fetch(`
      *[_type == "aboutUs"][0] {
        _id,
        _type,
        "slug": slug.current,
        title {
          en,
          de
        },
        sectionsOrder[]-> {
          _id,
          _type,
          title {
            en,
            de
          },
          "slug": slug.current,
          bodyText {
            en[] {
              ...,
              markDefs[] {
                ...,
                _type == "internalLink" => {
                  ...,
                  "slug": coalesce(reference->slug.current, reference->store.slug.current),
                  "docType": reference->_type,
                },
              }   
            },
            de[] {
              ...,
              markDefs[] {
                ...,
                _type == "internalLink" => {
                  ...,
                  "slug": coalesce(reference->slug.current, reference->store.slug.current),
                  "docType": reference->_type,
                },
              }   
            }
          }
        }
      }
    `)
    
    if (aboutUs) {
      allPages.push({
        id: aboutUs._id,
        type: aboutUs._type,
        slug: aboutUs.slug || 'about-us',
        url: '/en/about-us',
        title: {
          en: aboutUs.title?.en || '',
          de: aboutUs.title?.de || ''
        },
        bodyText: {
          en: '',
          de: ''
        }
      })
      
      // Add aboutUs subpages
      if (aboutUs.sectionsOrder && aboutUs.sectionsOrder.length > 0) {
        aboutUs.sectionsOrder.forEach(section => {
          allPages.push({
            id: section._id,
            type: section._type,
            slug: section.slug,
            url: `/en/about-us/${section.slug}`,
            title: {
              en: section.title?.en || '',
              de: section.title?.de || ''
            },
            bodyText: {
              en: portableTextToPlainText(section.bodyText?.en),
              de: portableTextToPlainText(section.bodyText?.de)
            }
          })
        })
      }
    }
    
    // Fetch event page
    console.log('Fetching event page...')
    const event = await client.fetch(`
      *[_type == "event"][0] {
        _id,
        _type,
        "slug": slug.current,
        title {
          en,
          de
        },
        bodyText {
          en[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          },
          de[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          }
        }
      }
    `)
    
    if (event) {
      allPages.push({
        id: event._id,
        type: event._type,
        slug: event.slug || 'event',
        url: '/en/event',
        title: {
          en: event.title?.en || '',
          de: event.title?.de || ''
        },
        bodyText: {
          en: portableTextToPlainText(event.bodyText?.en),
          de: portableTextToPlainText(event.bodyText?.de)
        }
      })
      
      // Fetch event subpages
      const eventSubpages = await client.fetch(`
        *[_type == "eventSubpage" && defined(slug.current) && slug.current != null && slug.current != ""] {
          _id,
          _type,
          "slug": slug.current,
          title {
            en,
            de
          },
          bodyText {
            en[] {
              ...,
              markDefs[] {
                ...,
                _type == "internalLink" => {
                  ...,
                  "slug": coalesce(reference->slug.current, reference->store.slug.current),
                  "docType": reference->_type,
                },
              }   
            },
            de[] {
              ...,
              markDefs[] {
                ...,
                _type == "internalLink" => {
                  ...,
                  "slug": coalesce(reference->slug.current, reference->store.slug.current),
                  "docType": reference->_type,
                },
              }   
            }
          }
        }
      `)
      
      eventSubpages.forEach(subpage => {
        allPages.push({
          id: subpage._id,
          type: subpage._type,
          slug: subpage.slug,
          url: `/en/event/${subpage.slug}`,
          title: {
            en: subpage.title?.en || '',
            de: subpage.title?.de || ''
          },
          bodyText: {
            en: portableTextToPlainText(subpage.bodyText?.en),
            de: portableTextToPlainText(subpage.bodyText?.de)
          }
        })
      })
    }
    
    // Fetch trailer page
    console.log('Fetching trailer page...')
    const trailer = await client.fetch(`
      *[_type == "trailer"][0] {
        _id,
        _type,
        "slug": slug.current,
        title {
          en,
          de
        },
        bodyText {
          en[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          },
          de[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          }
        }
      }
    `)
    
    if (trailer) {
      allPages.push({
        id: trailer._id,
        type: trailer._type,
        slug: trailer.slug || 'trailer',
        url: '/en/trailer',
        title: {
          en: trailer.title?.en || '',
          de: trailer.title?.de || ''
        },
        bodyText: {
          en: portableTextToPlainText(trailer.bodyText?.en),
          de: portableTextToPlainText(trailer.bodyText?.de)
        }
      })
      
      // Fetch trailer subpages
      const trailerSubpages = await client.fetch(`
        *[_type == "trailerSubpage" && defined(slug.current) && slug.current != null && slug.current != ""] {
          _id,
          _type,
          "slug": slug.current,
          "categorySlug": category->slug.current,
          title {
            en,
            de
          },
          bodyText {
            en[] {
              ...,
              markDefs[] {
                ...,
                _type == "internalLink" => {
                  ...,
                  "slug": coalesce(reference->slug.current, reference->store.slug.current),
                  "docType": reference->_type,
                },
              }   
            },
            de[] {
              ...,
              markDefs[] {
                ...,
                _type == "internalLink" => {
                  ...,
                  "slug": coalesce(reference->slug.current, reference->store.slug.current),
                  "docType": reference->_type,
                },
              }   
            }
          }
        }
      `)
      
      trailerSubpages.forEach(subpage => {
        const categoryPath = subpage.categorySlug ? `${subpage.categorySlug}/` : ''
        allPages.push({
          id: subpage._id,
          type: subpage._type,
          slug: subpage.slug,
          url: `/en/trailer/${categoryPath}${subpage.slug}`,
          title: {
            en: subpage.title?.en || '',
            de: subpage.title?.de || ''
          },
          bodyText: {
            en: portableTextToPlainText(subpage.bodyText?.en),
            de: portableTextToPlainText(subpage.bodyText?.de)
          }
        })
      })
    }
    
    // Fetch imagefilm page
    console.log('Fetching imagefilm page...')
    const imagefilm = await client.fetch(`
      *[_type == "imagefilm"][0] {
        _id,
        _type,
        "slug": slug.current,
        title {
          en,
          de
        },
        bodyText {
          en[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          },
          de[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          }
        }
      }
    `)
    
    if (imagefilm) {
      allPages.push({
        id: imagefilm._id,
        type: imagefilm._type,
        slug: imagefilm.slug || 'imagefilm',
        url: '/en/imagefilm',
        title: {
          en: imagefilm.title?.en || '',
          de: imagefilm.title?.de || ''
        },
        bodyText: {
          en: portableTextToPlainText(imagefilm.bodyText?.en),
          de: portableTextToPlainText(imagefilm.bodyText?.de)
        }
      })
      
      // Fetch imagefilm subpages
      const imagefilmSubpages = await client.fetch(`
        *[_type == "imagefilmSubpage" && defined(slug.current) && slug.current != null && slug.current != ""] {
          _id,
          _type,
          "slug": slug.current,
          title {
            en,
            de
          },
          bodyText {
            en[] {
              ...,
              markDefs[] {
                ...,
                _type == "internalLink" => {
                  ...,
                  "slug": coalesce(reference->slug.current, reference->store.slug.current),
                  "docType": reference->_type,
                },
              }   
            },
            de[] {
              ...,
              markDefs[] {
                ...,
                _type == "internalLink" => {
                  ...,
                  "slug": coalesce(reference->slug.current, reference->store.slug.current),
                  "docType": reference->_type,
                },
              }   
            }
          }
        }
      `)
      
      imagefilmSubpages.forEach(subpage => {
        allPages.push({
          id: subpage._id,
          type: subpage._type,
          slug: subpage.slug,
          url: `/en/imagefilm/${subpage.slug}`,
          title: {
            en: subpage.title?.en || '',
            de: subpage.title?.de || ''
          },
          bodyText: {
            en: portableTextToPlainText(subpage.bodyText?.en),
            de: portableTextToPlainText(subpage.bodyText?.de)
          }
        })
      })
    }
    
    // Fetch contact page
    console.log('Fetching contact page...')
    const contact = await client.fetch(`
      *[_type == "contact"][0] {
        _id,
        _type,
        title {
          en,
          de
        },
        bodyText {
          en[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          },
          de[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          }
        }
      }
    `)
    
    if (contact) {
      allPages.push({
        id: contact._id,
        type: contact._type,
        slug: 'contact',
        url: '/en/contact',
        title: {
          en: contact.title?.en || '',
          de: contact.title?.de || ''
        },
        bodyText: {
          en: portableTextToPlainText(contact.bodyText?.en),
          de: portableTextToPlainText(contact.bodyText?.de)
        }
      })
    }
    
    // Fetch impressum page
    console.log('Fetching impressum page...')
    const impressum = await client.fetch(`
      *[_type == "page" && slug.current == "impressum"][0] {
        _id,
        _type,
        "slug": slug.current,
        title {
          en,
          de
        },
        bodyText {
          en[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          },
          de[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          }
        }
      }
    `)
    
    if (impressum) {
      allPages.push({
        id: impressum._id,
        type: impressum._type,
        slug: impressum.slug,
        url: `/en/${impressum.slug}`,
        title: {
          en: impressum.title?.en || '',
          de: impressum.title?.de || ''
        },
        bodyText: {
          en: portableTextToPlainText(impressum.bodyText?.en),
          de: portableTextToPlainText(impressum.bodyText?.de)
        }
      })
    }
    
    // Fetch datenschutz page
    console.log('Fetching datenschutz page...')
    const datenschutz = await client.fetch(`
      *[_type == "datenschutz"][0] {
        _id,
        _type,
        title {
          en,
          de
        },
        bodyText {
          en[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          },
          de[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                ...,
                "slug": coalesce(reference->slug.current, reference->store.slug.current),
                "docType": reference->_type,
              },
            }   
          }
        }
      }
    `)
    
    if (datenschutz) {
      allPages.push({
        id: datenschutz._id,
        type: datenschutz._type,
        slug: 'datenschutz',
        url: '/en/datenschutz',
        title: {
          en: datenschutz.title?.en || '',
          de: datenschutz.title?.de || ''
        },
        bodyText: {
          en: portableTextToPlainText(datenschutz.bodyText?.en),
          de: portableTextToPlainText(datenschutz.bodyText?.de)
        }
      })
    }
    
    console.log(`\nTotal pages found: ${allPages.length}`)
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '..', '..', 'page-content-export.json')
    fs.writeFileSync(outputPath, JSON.stringify(allPages, null, 2), 'utf-8')
    console.log(`\nData saved to: ${outputPath}`)
    
    // Also create a CSV-like summary
    console.log('\n=== PAGE TITLES AND BODY TEXT SUMMARY ===\n')
    allPages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.type.toUpperCase()}: ${page.slug}`)
      console.log(`   URL: ${page.url}`)
      console.log(`   Title (EN): ${page.title.en || '(empty)'}`)
      console.log(`   Title (DE): ${page.title.de || '(empty)'}`)
      console.log(`   Body Text (EN): ${page.bodyText.en ? page.bodyText.en.substring(0, 100) + (page.bodyText.en.length > 100 ? '...' : '') : '(empty)'}`)
      console.log(`   Body Text (DE): ${page.bodyText.de ? page.bodyText.de.substring(0, 100) + (page.bodyText.de.length > 100 ? '...' : '') : '(empty)'}`)
      console.log('')
    })
    
    return allPages
    
  } catch (err) {
    console.error('Error:', err.message)
    console.error(err)
    throw err
  }
}

// Run the function
fetchAllPages()
  .then(() => {
    console.log('\n✅ Script completed successfully!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('\n❌ Script failed:', err)
    process.exit(1)
  })

