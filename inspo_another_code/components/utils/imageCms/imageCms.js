import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange';
import { cmsClient } from "../../../utils/sanity"
import imageUrlBuilder from '@sanity/image-url'

const ImageCms = ({ image, imgClass, alt }) => {
    if (!image) return null;

    const stableId = image.asset?._ref || image.asset?._id || '';

    const builder = imageUrlBuilder(cmsClient)
    const urlFor = (source) => {
        return builder.image(source) 
    }

    const imageAlt = alt || image.alt || image.caption || '';

    let w100 = `${urlFor(image).width(100).url()} 100w`
    let w320 = `${urlFor(image).width(320).url()} 320w`
    let w640 = `${urlFor(image).width(640).url()} 640w`
    let w768 = `${urlFor(image).width(768).url()} 768w`
    let w1024 = `${urlFor(image).width(1024).url()} 1024w`
    let w1366 = `${urlFor(image).width(1366).url()} 1366w`
    let w1600 = `${urlFor(image).width(1600).url()} 1600w`
    let w1920 = `${urlFor(image).width(1920).url()} 1920w`

    // Use a transparent 1x1 pixel to prevent alt text from showing before image loads
    const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    return (
    <img 
        key={stableId} 
        src={transparentPixel}
        data-src={urlFor(image).width(10).url() || "/placeholder.svg"}
        data-sizes="auto"
        data-expand="1000"
        data-srcset={[w320,w640,w768,w1024,w1366,w1600,w1920].join(', ')} 
        className={["lazyload", imgClass].join(' ')} 
        alt={imageAlt}
    />
    )
}

export default ImageCms