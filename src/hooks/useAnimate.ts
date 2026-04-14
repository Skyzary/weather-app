import {useState, useEffect, useRef} from "react";

export const useAnimate = (targetValue: number, duration: number) => {
    const [displayValue, setDisplayValue] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const startValueRef = useRef(0);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        startValueRef.current = displayValue;
        startTimeRef.current = null;

        const animate = (time: number) => {
            if (startTimeRef.current === null) startTimeRef.current = time;
            const progress = Math.min((time - startTimeRef.current) / duration, 1);
            const easeProgress = progress * (2 - progress);

            const current = startValueRef.current + (targetValue - startValueRef.current) * easeProgress;
            setDisplayValue(Math.round(current));

            if (progress < 1) {
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [targetValue, duration]);

    return displayValue;
}