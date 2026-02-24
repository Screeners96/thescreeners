const { createClient } = require('@sanity/client')

const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID || '21f3spns', 
    dataset: process.env.SANITY_DATASET || 'production',      
    token: process.env.SANITY_API_TOKEN || '',   
    apiVersion: '2023-01-01',
    useCdn: false,
})

async function fixIntro() {
    const docs = await client.fetch(`*[_type == "page" && defined(intro)]{_id, intro}`)
  
    for (const doc of docs) {
      const intro = doc.intro
  
      if (
        intro &&
        typeof intro === 'object' &&
        Object.keys(intro).length === 0
      ) {
        console.log(`Fixing ${doc._id}`)
        await client.patch(doc._id).unset(['intro']).commit()
      }
    }
    console.log('Done.')
  }
  
  fixIntro()