import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange';
import { cmsClient } from "../../../utils/sanity"
import imageUrlBuilder from '@sanity/image-url'

const ImageCms = ({ image, imgClass, className, alt, onLoad }) => {
    if (!image) return null;

    const stableId = image.asset?._ref || image.asset?._id || '';

    const builder = imageUrlBuilder(cmsClient)
    const urlFor = (source) => {
        return builder.image(source) 
    }

    const imageAlt = alt || image.alt || image.caption || '';

    let w320 = `${urlFor(image).width(320).quality(100).url()} 320w`
    let w640 = `${urlFor(image).width(640).quality(100).url()} 640w`
    let w768 = `${urlFor(image).width(768).quality(100).url()} 768w`
    let w1024 = `${urlFor(image).width(1024).quality(100).url()} 1024w`
    let w1366 = `${urlFor(image).width(1366).quality(100).url()} 1366w`
    let w1600 = `${urlFor(image).width(1600).quality(100).url()} 1600w`
    let w1920 = `${urlFor(image).width(1920).quality(100).url()} 1920w`

    const placeholderSrc = urlFor(image).width(20).quality(20).url()
    const actualSrc = urlFor(image).width(320).quality(100).url()
    const srcset = [w320, w640, w768, w1024, w1366, w1600, w1920].join(', ')

    // Handle className properly (filter out undefined/null values)
    // Support both imgClass and className props for backwards compatibility
    const classNames = ["lazyload", imgClass, className].filter(Boolean).join(' ')

    return (
    <img 
        key={stableId} 
        src={placeholderSrc}
        data-src={actualSrc}
        data-sizes="auto"
        data-expand="1000"
        data-srcset={srcset}
        className={classNames}
        alt={imageAlt}
        loading="lazy"
        onLoad={onLoad}
    />
    )
}

export default ImageCms