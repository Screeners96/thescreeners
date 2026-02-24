// This script will reset ALL rich text fields across ALL document types
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

// Fields that might be causing issues (add any other rich text fields you have)
const problematicFields = ['intro', 'footerInfo', 'content', 'text', 'body'];

// Reset the problematic fields
async function resetAllRTEFields() {
  try {
    console.log(`Connecting to project ${projectId}, dataset ${dataset}...`);
    
    // Get all document types
    const types = await client.fetch(`array::unique(*._type)`);
    console.log(`Found ${types.length} document types`);
    
    // Process each document type
    for (const docType of types) {
      console.log(`Processing document type: ${docType}...`);
      
      // Find all documents of this type
      const documents = await client.fetch(`*[_type == "${docType}"]`);
      
      console.log(`Found ${documents.length} ${docType} documents`);
      
      // Process each document
      for (const doc of documents) {
        console.log(`Checking document: ${doc._id}`);
        
        // Check which problematic fields exist in this document
        const fieldsToReset = [];
        for (const field of problematicFields) {
          if (doc[field] !== undefined) {
            fieldsToReset.push(field);
          }
        }
        
        if (fieldsToReset.length > 0) {
          console.log(`Resetting fields ${fieldsToReset.join(', ')} for document: ${doc._id}`);
          
          try {
            // Reset the fields
            await client
              .patch(doc._id)
              .unset(fieldsToReset)
              .commit();
            
            console.log(`Successfully reset fields for document: ${doc._id}`);
          } catch (err) {
            console.error(`Error resetting fields for document ${doc._id}:`, err.message);
          }
        } else {
          console.log(`No problematic fields found in document: ${doc._id}`);
        }
      }
    }
    
    console.log('All documents processed');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Run the function
resetAllRTEFields();