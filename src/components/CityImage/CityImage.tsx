import css from "./CityImage.module.css";
import { Glow, GlowCapture } from "@codaworks/react-glow";

interface CityImageProps {
  imageUrl: string;
  imageAlt: string;
}

export default function CityImage({ imageUrl, imageAlt }: CityImageProps) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className={css.cardWrapper}>
      <GlowCapture>
        <Glow color="hsl(200 100% 50% / .5)">
          <div className={css.imageContainer}>
            <img src={imageUrl} alt={imageAlt} className={css.cityImage} loading={"lazy"} />
          </div>
        </Glow>
      </GlowCapture>
    </div>
  );
}
