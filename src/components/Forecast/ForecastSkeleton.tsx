import css from "./ForecastSkeleton.module.css";

export default function ForecastSkeleton() {
    return (
        <section className={css.forecastSection}>
            <h3 className={css.forecastTitle}>Прогноз на 5 дней</h3>
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
