import WrapperTextBig from "./WrapperTextBig"
import WrapperSubtitle from "./WrapperSubtitle"
import WrapperTitle from "./WrapperTitle"
import WrapperImage from "./WrapperImage"
import WrapperVideo from "./WrapperVideo"

const WrapperRenderer = ({ wrapper, lang = "en" }) => {
  if (!wrapper) return null

  switch (wrapper._type) {
    case 'wrapperTextBig':
      return <WrapperTextBig wrapper={wrapper} lang={lang} />
    case 'wrapperSubtitle':
      return <WrapperSubtitle wrapper={wrapper} lang={lang} />
    case 'wrapperTitle':
      return <WrapperTitle wrapper={wrapper} lang={lang} />
    case 'wrapperImage':
      return <WrapperImage wrapper={wrapper} lang={lang} />
    case 'wrapperVideo':
      return <WrapperVideo wrapper={wrapper} lang={lang} />
    default:
      return null
  }
}

export default WrapperRenderer

export {
  WrapperTextBig,
  WrapperSubtitle,
  WrapperTitle,
  WrapperImage,
  WrapperVideo
}

