import css from "./CityImage.module.css";
import { Glow, GlowCapture } from "@codaworks/react-glow";
import { useState, useEffect } from "react";

interface CityImageProps {
  imageUrl?: string;
  imageAlt?: string;
}

const FALLBACK_IMAGE = "/bg.avif";

export default function CityImage({ imageUrl, imageAlt }: CityImageProps) {
  const [src, setSrc] = useState(imageUrl || FALLBACK_IMAGE);

  useEffect(() => {
    setSrc(imageUrl || FALLBACK_IMAGE);
  }, [imageUrl]);

  const handleError = () => {
    if (src !== FALLBACK_IMAGE) {
      setSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div className={css.cardWrapper}>
      <GlowCapture>
        <Glow color="hsl(200 100% 50% / .5)">
          <div className={css.imageContainer}>
            <img 
              src={src} 
              alt={imageAlt || "City background"} 
              className={css.cityImage} 
              loading={"lazy"} 
              onError={handleError}
            />
          </div>
        </Glow>
      </GlowCapture>
    </div>
  );
}
