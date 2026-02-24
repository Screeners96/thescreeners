const { createClient } = require('@sanity/client')

const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID || '21f3spns', 
    dataset: process.env.SANITY_DATASET || 'production',      
    token: process.env.SANITY_API_TOKEN || '',   
    apiVersion: '2023-01-01',
    useCdn: false,
})

function isBrokenBlockArray(arr) {
    return Array.isArray(arr) && arr.some(b => !b || typeof b !== 'object' || !b._type)
  }
  
  async function run() {
    const docs = await client.fetch(`*[_type == "page"]{_id, modules}`)
  
    for (const doc of docs) {
      const unsetFields = []
  
      if (Array.isArray(doc.modules)) {
        doc.modules.forEach((mod, i) => {
          if (mod._type === 'moduleText' && isBrokenBlockArray(mod.text)) {
            console.log(`Broken moduleText.text in ${doc._id}`)
            unsetFields.push(`modules[${i}].text`)
          }
          if (mod._type === 'moduleBanner' && isBrokenBlockArray(mod.title)) {
            console.log(`Broken moduleBanner.title in ${doc._id}`)
            unsetFields.push(`modules[${i}].title`)
          }
          if (mod._type === 'moduleSlider' && isBrokenBlockArray(mod.caption)) {
            console.log(`Broken moduleSlider.caption in ${doc._id}`)
            unsetFields.push(`modules[${i}].caption`)
          }
        })
      }
  
      if (unsetFields.length > 0) {
        await client.patch(doc._id).unset(unsetFields).commit()
      }
    }
  
    console.log('✅ ALL MODULE RTE FIELDS CLEANED.')
  }
  
  run()
  