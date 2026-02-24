"use client";

import ImageCms from "../../utils/imageCms/imageCms";
import { useState } from "react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";

SwiperCore.use([Pagination]);

const ModuleSlider = ({ module, lang = "en" }) => {
  const [index, setIndex] = useState(0);

  if (!module?.slides || module.slides.length === 0) return null;

  const bannerLabel = lang === "de" ? "Slider-Bild" : "Slider image";

  const moduleTitle =
    typeof module.title === "object"
      ? module.title[lang] || module.title.en || ""
      : module.title || "";

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
      <Swiper
        className="slider"
        onRealIndexChange={({ realIndex }) => setIndex(realIndex)}
        loop={true}
      >
        {module.slides.map(({ imageDesktop, _key }, i) => {
          const filename = getFilenameFromAsset(imageDesktop?.asset);
          // (${filename})

          return (
            <SwiperSlide className="slide" key={_key || i}>
              <ImageCms
                image={imageDesktop}
                alt={`${moduleTitle || bannerLabel} ${i + 1}${
                  filename ? `` : ""
                }`}
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
