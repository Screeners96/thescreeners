"use client";

import ImageCms from "../../utils/imageCms/imageCms";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";

SwiperCore.use([Pagination]);

const ModuleBanner = ({ module, lang = "en" }) => {
  if (!module?.logos || module.logos.length === 0) return null;

  let swiperInstance = null;

  const handleMouseEnter = () => {
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.start();
    }
  };

  const bannerLabel = lang === "de" ? "Banner-Bild" : "Banner image";

  const moduleTitle =
    module.title && typeof module.title === "object"
      ? module.title[lang] || module.title.en || ""
      : module?.title || "";


  const getFilenameFromAsset = (asset) => {
    if (!asset || typeof asset !== "object") return "";
    const id = asset._ref || asset._id || "";
    const parts = id.split("-");
    const ext = parts[2]; // e.g. jpg, png
    const name = parts[1]; // e.g. motherswarriorspoets
    return name && ext ? `${name}.${ext}` : "";
  };

  return (
    <div
      className="moduleBanner module"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Swiper
        modules={[Autoplay]}
        className="slider"
        slidesPerView="auto"
        spaceBetween={20}
        loop={true}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        speed={600}
        onSwiper={(swiper) => {
          swiperInstance = swiper;

          setTimeout(() => {
            try {
              swiper.update();
            } catch (e) {}
          }, 100);
        }}
      >
        {module.logos.map((logo, index) => {
          const filename = getFilenameFromAsset(logo.asset);
          // (${filename})

          return (
            <SwiperSlide className="slide" key={logo._key || index}>
              <ImageCms
                image={logo}
                alt={`${moduleTitle || bannerLabel} ${index + 1}${filename ? `` : ""}`}
              />

            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ModuleBanner;
