import Layout from "../components/layout/layout"

// CSS
// Vendor
import 'swiper/css';

// Setup
import '../components/_setup/reset.scss'
import '../components/_setup/breakpoints.scss'
import '../components/_setup/fonts.scss'
import '../components/_setup/vars.scss'
import '../components/_setup/setup.scss'
import '../components/_setup/rte.scss'

// Pages
import '../components/pages/frontpage/frontpage.scss'
import '../components/pages/tabs/tabs.scss'
import "../components/pages/tabsArchive/tabsArchive.scss" 
import '../components/pages/news/news.scss'
import '../components/pages/artists/artists.scss'
import '../components/pages/article/article.scss'
// import '../components/pages/archive/archive.scss'

// Components
import "../components/footer/footer.scss"
import "../components/header/header.scss"
import "../components/header/header.burger.scss"
import "../components/hero/hero.scss"
import "../components/intro/intro.scss"
import "../components/bodyText/bodyText.scss"
import "../components/utils/clouds/clouds.scss"

import "../components/bottomControls/bottomControls.scss"
import "../components/languageSwitcher/languageSwitcher.scss"
import "../components/readAloud/readAloud.scss"
import "../components/artistSlideshow/artistSlideshow.scss"

// Modules
import "../components/modules/modules.scss"
import "../components/modules/moduleImage/moduleImage.scss"
import "../components/modules/moduleBanner/moduleBanner.scss"
import "../components/modules/moduleLink/moduleLink.scss"
import "../components/modules/moduleSlider/moduleSlider.scss"
import "../components/modules/moduleText/moduleText.scss"

// Utils
import "../components/utils/accordion/accordion.scss"
import "../components/utils/previewbanner/previewbanner.scss"


export default function App({ Component, pageProps, router }) {
    return (
        <Layout {...pageProps} >
            <Component {...pageProps} key={router.asPath} />
        </Layout>
    )
}
