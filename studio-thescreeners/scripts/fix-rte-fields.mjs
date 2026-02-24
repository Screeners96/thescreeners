import {createClient} from '@sanity/client'

// Your project details
const projectId = process.env.SANITY_PROJECT_ID || '21f3spns';
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || ''; // Set via environment variable

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2023-03-01'
})

// This function will fix all RTE fields in a document
async function fixRteFields() {
  try {
    console.log(`Connecting to project ${projectId}, dataset ${dataset}...`);
    
    // Get all document types that might have RTE fields
    // Adjust this query to match your document types
    const docs = await client.fetch(`*[_type in ["settings", "resource", "page"]]`);
    
    console.log(`Found ${docs.length} documents to process`);
    
    for (const doc of docs) {
      console.log(`Processing document: ${doc._id} (${doc._type})`);
      
      // Create a patch object to track changes
      const patch = client.patch(doc._id);
      let hasChanges = false;
      
      // Check and fix all potential RTE fields
      // Add all your RTE field paths here
      const rteFieldPaths = [
        'intro',
        'intro.en',
        'intro.de',
        'text.en',
        'text.de',
        'bodyText.en',
        'bodyText.de',
        'footerInfo.en',
        'footerInfo.de',
        'footerContent.en',
        'footerContent.de'
      ];
      
      for (const path of rteFieldPaths) {
        // Get the value at this path
        const pathParts = path.split('.');
        let value = doc;
        let exists = true;
        
        for (const part of pathParts) {
          if (value && typeof value === 'object' && part in value) {
            value = value[part];
          } else {
            exists = false;
            break;
          }
        }
        
        // If the path exists but the value is not an array, or is null/undefined
        if (!exists || value === null || value === undefined || !Array.isArray(value)) {
          console.log(`  Fixing field: ${path}`);
          
          // Set the field to an empty array
          patch.set({[path]: []});
          hasChanges = true;
        }
      }
      
      // Commit changes if any were made
      if (hasChanges) {
        await patch.commit();
        console.log(`  Updated document: ${doc._id}`);
      } else {
        console.log(`  No changes needed for: ${doc._id}`);
      }
    }
    
    console.log('All documents processed successfully');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Run the function
fixRteFields();