"use client";

import ImageCms from "../../utils/imageCms/imageCms";
import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";

SwiperCore.use([Pagination]);

const ModuleSlider = ({ module, lang = "en" }) => {
  const [index, setIndex] = useState(0);

  if (!module?.slides || module.slides.length === 0) return null;

  const bannerLabel = lang === "de" ? "Slider-Bild" : "Slider image";

  const flag = module.flagTitle && typeof module.flagTitle === "object" 
    ? module.flagTitle[lang] || module.flagTitle.en || "" 
    : ""

  const getFilenameFromAsset = (asset) => {
    if (!asset || typeof asset !== "object") return "";
    const id = asset._ref || asset._id || "";
    const parts = id.split("-");
    const ext = parts[2]; // jpg, png
    const name = parts[1]; // file name
    return name && ext ? `${name}.${ext}` : "";
  };

  return (
    <div className="moduleSlider module">
      {flag && (
        <div className="module__flag" data-readable="true">
          <span>{flag}</span>
        </div>
      )}
      <Swiper
        className="slider"
        onRealIndexChange={({ realIndex }) => setIndex(realIndex)}
        loop={true}
      >
        {module.slides.map(({ image, _key }, i) => {
          const filename = getFilenameFromAsset(image?.asset);
          const slideAlt = image?.alt && typeof image.alt === "object"
            ? image.alt[lang] || image.alt.en || ""
            : image?.alt || `${bannerLabel} ${i + 1}`

          return (
            <SwiperSlide className="slide" key={_key || i}>
              <ImageCms
                image={image}
                alt={slideAlt}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="moduleSlider__pagination">
        {index + 1}/{module.slides.length}
      </div>
    </div>
  );
};

export default ModuleSlider;
