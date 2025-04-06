export const fadeIn = (
    direction: string,
    type: string,
    delay: number,
    duration: number,
    bounce = 0.75
) => {
    return {
        hidden: {
            x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
            y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
            opacity: 0,
        },
        show: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
                type: type,
                delay: delay,
                duration: duration,
                ease: "easeOut",
                bounce
            },
        },
    };
};

export const zoomIn = (delay: number, duration: number) => {
    return {
        hidden: {
            scale: 0,
            opacity: 0,
        },
        show: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "tween",
                delay: delay,
                duration: duration,
                ease: "easeOut",
            },
        },
    };
};

export const slideIn = (
    direction: string,
    type: string,
    delay: number,
    duration: number
) => {
    return {
        hidden: {
            x:
                direction === "left"
                    ? "-100%"
                    : direction === "right"
                    ? "100%"
                    : 0,
            y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
        },
        show: {
            x: 0,
            y: 0,
            transition: {
                type: type,
                delay: delay,
                duration: duration,
                ease: "easeOut",
            },
        },
    };
};

export const navbar = {
    show: {
        display: "block",
        opacity: 1,
        transition: {
            staggerChildren: 0.5,
            delayChildren: 0.5,
        },
    },
    hidden: {
        display: "none",
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
            when: "afterChildren",
        },
    },
};