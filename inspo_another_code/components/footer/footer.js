import Link from "next/link"
import RTE from "../utils/rte/rte"

const Footer = ({ right, info, link, lang = "en" }) => {
  return (
    <footer className="footer">

      {info && info[lang] && info[lang].length > 0 && (
        <div className="footer__info">
          <RTE text={info[lang]} lang={lang} />
        </div>
      )}

      <p className="footer__right">
        <Link href={link?.slug?.current || "/"}>{typeof right === "object" ? right[lang] || right.en : right}</Link>
      </p>
    </footer>
  )
}

export default Footer
