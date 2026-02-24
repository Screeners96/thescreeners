// This script will completely reset the footerInfo field in the settings document
import {createClient} from '@sanity/client'

// Your actual project details
const projectId = process.env.SANITY_PROJECT_ID || '21f3spns';
const dataset = process.env.SANITY_DATASET || 'production';

// Add your token via environment variable
const token = process.env.SANITY_API_TOKEN || ''; // Set via environment variable

// Create a client using your actual project details and token
const client = createClient({
  projectId: projectId,
  dataset: dataset,
  token: token,
  useCdn: false,
  apiVersion: '2023-03-01'
})

// Reset the footerInfo field
async function resetFooterInfo() {
  try {
    console.log(`Connecting to project ${projectId}, dataset ${dataset}...`);
    
    // Find all settings documents
    const settingsDocs = await client.fetch(`*[_type == "settings"]`);
    
    console.log(`Found ${settingsDocs.length} settings documents`);
    
    // Process each settings document
    for (const doc of settingsDocs) {
      console.log(`Resetting footerInfo for document: ${doc._id}`);
      
      try {
        // Reset the footerInfo field
        await client
          .patch(doc._id)
          .unset(['footerInfo'])
          .commit();
        
        console.log(`Successfully reset footerInfo for document: ${doc._id}`);
        
        // Create a new empty footerInfo field with the correct structure
        await client
          .patch(doc._id)
          .set({
            footerInfo: {
              en: [],
              de: []
            }
          })
          .commit();
        
        console.log(`Successfully created empty footerInfo for document: ${doc._id}`);
      } catch (err) {
        console.error(`Error processing document ${doc._id}:`, err.message);
      }
    }
    
    console.log('All settings documents processed');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Run the function
resetFooterInfo();