import { RefObject, useEffect, useState } from 'react';
import ResizeObserver from "resize-observer-polyfill";

type Dimensions = {
    height: number;
    width: number;
};

const useResizeObserver = <T extends HTMLElement>(
    ref: RefObject<T>
): Dimensions | null => {
    const [dimensions, setDimensions] = useState<Dimensions | null>(null);

    useEffect(() => {
        const observeTarget = ref.current;
        if (!observeTarget) return;

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                setDimensions(entry.contentRect);
            });
        });

        resizeObserver.observe(observeTarget);

        return () => {
            resizeObserver.unobserve(observeTarget);
        };
    }, [ref]);

    return dimensions;
};

export default useResizeObserver;
