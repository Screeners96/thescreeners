export default async function handler(req, res) {
  // Verify the secret token (from query or body for webhooks)
  const secret = req.query.secret || req.body?.secret;
  if (secret !== process.env.REVALIDATION_SECRET_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const body = req.body || {};
    const pathsToRevalidate = [];

    // Handle Sanity webhook payload
    // Sanity webhooks can send the document in different formats:
    // 1. Full document: { _type, _id, slug: { current: "..." }, ... }
    // 2. Just ID: { _id: "..." } or { id: "..." }
    // 3. Project webhook format: { projectId, dataset, ids: { created: [...], updated: [...] } }
    
    let docType = body._type;
    let slug = body.slug?.current || body.slug;
    let id = body._id || body.id;

    // Handle Sanity project webhook format (batch updates)
    if (body.ids && (body.ids.created || body.ids.updated || body.ids.deleted)) {
      console.log(`🔔 Batch webhook received with ${(body.ids.created || []).length} created, ${(body.ids.updated || []).length} updated, ${(body.ids.deleted || []).length} deleted`);
      
      // For batch updates, revalidate all relevant pages
      // This is a fallback - ideally you'd process each ID individually
      pathsToRevalidate.push('/', '/en', '/de', '/en/news', '/de/news', '/en/artists', '/de/artists');
    }
    
    // If we only have an ID, fetch the document from Sanity
    if (id && !docType) {
      const { cmsClient } = await import("@/utils/sanity");
      try {
        const doc = await cmsClient.fetch(`*[_id == $id][0]{ _type, "slug": slug.current }`, { id });
        if (doc) {
          docType = doc._type;
          slug = doc.slug;
        }
      } catch (e) {
        console.warn("Could not fetch document from Sanity:", e.message);
      }
    }

    if (docType) {
      console.log(`🔔 Webhook received for document type: ${docType}, slug: ${slug || 'N/A'}, id: ${id || 'N/A'}`);

      // Get the slug from Sanity if not provided in webhook
      if (docType && !slug && id) {
        const { cmsClient } = await import("@/utils/sanity");
        try {
          const doc = await cmsClient.fetch(`*[_id == $id][0]{ "slug": slug.current }`, { id });
          if (doc?.slug) {
            slug = doc.slug;
          }
        } catch (e) {
          console.warn("Could not fetch slug from Sanity:", e.message);
        }
      }

      // Map document types to their corresponding page paths
      switch (docType) {
        case 'frontpage':
          pathsToRevalidate.push('/', '/en', '/de');
          break;
        
        case 'page':
          if (slug) {
            pathsToRevalidate.push(`/en/${slug}`, `/de/${slug}`);
          }
          // Also revalidate homepage as it may have navigation changes
          pathsToRevalidate.push('/en', '/de');
          break;
        
        case 'article':
          if (slug) {
            pathsToRevalidate.push(`/en/articles/${slug}`, `/de/articles/${slug}`);
          }
          // Revalidate news page as it lists articles
          pathsToRevalidate.push('/en/news', '/de/news');
          break;
        
        case 'artist':
          if (slug) {
            pathsToRevalidate.push(`/en/artists/${slug}`, `/de/artists/${slug}`);
          }
          // Revalidate artists listing page and homepage (shows artists)
          pathsToRevalidate.push('/en/artists', '/de/artists', '/en', '/de');
          break;
        
        case 'news':
          pathsToRevalidate.push('/en/news', '/de/news');
          break;
        
        case 'artists':
          pathsToRevalidate.push('/en/artists', '/de/artists', '/en', '/de');
          break;
        
        case 'ressourcen':
          pathsToRevalidate.push('/en/ressourcen', '/de/ressourcen');
          break;
        
        case 'netzwerke':
          pathsToRevalidate.push('/en/netzwerke', '/de/netzwerke');
          break;
        
        case 'besserePraktiken':
          pathsToRevalidate.push('/en/besserePraktiken', '/de/besserePraktiken');
          break;
        
        case 'leichteSprache':
          pathsToRevalidate.push('/en/leichte-sprache', '/de/leichte-sprache');
          break;
        
        case 'archive':
          pathsToRevalidate.push('/en/archive', '/de/archive');
          break;
        
        case 'settings':
          // Settings affect all pages (navigation, footer, etc.)
          pathsToRevalidate.push(
            '/', '/en', '/de',
            '/en/news', '/de/news',
            '/en/artists', '/de/artists',
            '/en/ressourcen', '/de/ressourcen',
            '/en/netzwerke', '/de/netzwerke',
            '/en/besserePraktiken', '/de/besserePraktiken',
            '/en/leichte-sprache', '/de/leichte-sprache',
            '/en/archive', '/de/archive'
          );
          break;
        
        default:
          console.log(`⚠️ Unknown document type: ${docType}, revalidating homepages`);
          pathsToRevalidate.push('/en', '/de');
      }
    } else if (!body.ids) {
      // Manual revalidation (no webhook payload)
      console.log("🔁 Starting manual revalidation...");
      pathsToRevalidate.push('/', '/en', '/de');
    }

    // Remove duplicates
    const uniquePaths = [...new Set(pathsToRevalidate)];

    // Revalidate all paths
    const revalidationResults = [];
    const errors = [];

    for (const path of uniquePaths) {
      try {
        console.log(`🔁 Revalidating: ${path}`);
        await res.revalidate(path);
        revalidationResults.push(path);
      } catch (err) {
        console.error(`❌ Error revalidating ${path}:`, err.message);
        errors.push({ path, error: err.message });
      }
    }

    console.log(`✅ Revalidation completed: ${revalidationResults.length} paths revalidated`);

    return res.json({ 
      revalidated: true, 
      paths: revalidationResults,
      errors: errors.length > 0 ? errors : undefined,
      message: `Revalidated ${revalidationResults.length} path(s)${errors.length > 0 ? ` with ${errors.length} error(s)` : ''}`
    });

  } catch (err) {
    console.error("❌ Revalidation error:", err);
    return res.status(500).json({ 
      message: "Error revalidating", 
      error: err.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};