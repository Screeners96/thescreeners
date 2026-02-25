import Layout from "../components/layout/layout"
import PageTransition from "../components/utils/pageTransition/pageTransition"

// CSS
// Vendor
import 'swiper/css/bundle';

// Setup
import '../components/_setup/reset.scss'
import '../components/_setup/breakpoints.scss'
import '../components/_setup/fonts.scss'
import '../components/_setup/vars.scss'
import '../components/_setup/setup.scss'
import '../components/_setup/rte.scss'

// Pages
import '../components/pages/frontpage/frontpage.scss'
import '../components/pages/contact/contact.scss'
import '../components/pages/about-us/about-us.scss'
import '../components/pages/about-us/sections/SectionLogos.scss'
import '../components/pages/about-us/sections/SectionGridWrapper.scss'
import '../components/pages/about-us/sections/SectionGridImages.scss'
import '../components/pages/trailer/trailer.scss'
import '../components/pages/event/event.scss'
import '../components/pages/imagefilm/imagefilm.scss'
import '../components/pages/impressum-datenschutz/impressum-datenschutz.scss'
import '../components/pages/page/page.scss'

// Components
import "../components/footer/footer.scss"
import "../components/header/header.scss"
import "../components/header/header.burger.scss"
import "../components/logo/logo.scss"
import "../components/hero/hero.scss"
import "../components/intro/intro.scss"
import "../components/bodyText/bodyText.scss"
import "../components/languageSwitcher/languageSwitcher.scss"
import "../components/slideshow/slideshow.scss"
import "../components/googleMaps/googleMaps.scss"

// Modules
import "../components/modules/modules.scss"
import "../components/modules/moduleImage/moduleImage.scss"
import "../components/modules/moduleSlider/moduleSlider.scss"
import "../components/modules/moduleText/moduleText.scss"
import "../components/modules/moduleVideo/moduleVideo.scss"
import "../components/modules/moduleVideoGallery/moduleVideoGallery.scss"

// Utils
import "../components/utils/accordion/accordion.scss"
import "../components/utils/previewbanner/previewbanner.scss"
import "../components/utils/imageCms/imageCms.scss"
import "../components/utils/modal/modal.scss"
import "../components/utils/modal/modalSlider.scss"
import "../components/utils/heroImage/heroImage.scss"
import "../components/utils/heroSlider/heroSlider.scss"
import "../components/utils/heroVideo/heroVideo.scss"
import "../components/utils/pageTransition/pageTransition.scss"

// Shared Grids
import "../components/grids/grids.scss"


export default function App({ Component, pageProps, router }) {
    const isStudio = router.pathname.startsWith('/studio')
    
    if (isStudio) {
        return <Component {...pageProps} key={router.asPath} />
    }
    
    return (
        <PageTransition>
            <Layout {...pageProps} >
                <Component {...pageProps} key={router.asPath} />
            </Layout>
        </PageTransition>
    )
}
