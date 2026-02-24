import Link from "next/link"

const PreviewBanner = () => <div className="previewbanner">You are in preview mode.  <Link href="/api/exitPreview">Exit here.</Link></div>

export default PreviewBanner