// This script will reset problematic RTE fields across multiple document types
import {createClient} from '@sanity/client'

// Your actual project details
const projectId = process.env.SANITY_PROJECT_ID || '21f3spns';
const dataset = process.env.SANITY_DATASET || 'production';

const token = process.env.SANITY_API_TOKEN || ''; // Set via environment variable


// Create a client using your actual project details
const client = createClient({
  projectId: projectId,
  dataset: dataset,
  token: token,
  useCdn: false,
  apiVersion: '2023-03-01'
})

// Document types that use PAGE_FIELDS_REGULAR
const documentTypes = ['frontpage', 'page', 'trailer', 'trailerSubpage', 'event', 'eventSubpage', 'imagefilm', 'imagefilmSubpage', 'aboutUs', 'aboutUsSubpage', 'contact'];

// Reset the problematic fields
async function resetRTEFields() {
  try {
    console.log(`Connecting to project ${projectId}, dataset ${dataset}...`);
    
    // Process each document type
    for (const docType of documentTypes) {
      console.log(`Processing document type: ${docType}...`);
      
      // Find all documents of this type
      const documents = await client.fetch(`*[_type == "${docType}"]`);
      
      console.log(`Found ${documents.length} ${docType} documents`);
      
      // Process each document
      for (const doc of documents) {
        console.log(`Resetting fields for document: ${doc._id}`);
        
        try {
          // Reset the intro field
          await client
            .patch(doc._id)
            .unset(['intro'])
            .commit();
          
          console.log(`Successfully reset intro field for document: ${doc._id}`);
        } catch (err) {
          console.error(`Error resetting fields for document ${doc._id}:`, err.message);
        }
      }
    }
    
    console.log('All documents processed');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Run the function
resetRTEFields();