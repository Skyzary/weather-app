import css from "./ForecastSkeleton.module.css";
import { useTranslation } from "react-i18next";

export default function ForecastSkeleton() {
    const { t } = useTranslation();
    return (
        <section className={css.forecastSection}>
            <h3 className={css.forecastTitle}>{t('forecast5Days')}</h3>
            <div className={css.skeletonContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className={css.skeletonCard}>
                        <div className={css.skeletonDate}></div>
                        <div className={css.skeletonIcon}></div>
                        <div className={css.skeletonTemp}></div>
                        <div className={css.skeletonDesc}></div>
                    </div>
                ))}
            </div>
        </section>
    );
}
