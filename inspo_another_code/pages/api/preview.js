// pages/api/preview.js
export default async function preview(req, res) {
    const lang = req.query.lang || 'en'; // Get language from query
    
    if (req.query.secret !== process.env.CMS_PREVIEW_SECRET) {
        return res.status(401).json({ message: 'Invalid token' })
    }
    res.setPreviewData({})
    res.writeHead(307, { Location: `/${lang}` }) // Use the language parameter
    res.end()
}