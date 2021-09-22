export declare enum ALIGNMENT {
    AUTO = "auto",
    START = "start",
    CENTER = "center",
    END = "end",
}
export declare enum DIRECTION {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical",
}
export declare enum SCROLL_CHANGE_REASON {
    OBSERVED = "observed",
    REQUESTED = "requested",
}
export declare const scrollProp: {
    [DIRECTION.VERTICAL]: string;
    [DIRECTION.HORIZONTAL]: string;
};
export declare const sizeProp: {
    [DIRECTION.VERTICAL]: string;
    [DIRECTION.HORIZONTAL]: string;
};
export declare const positionProp: {
    [DIRECTION.VERTICAL]: string;
    [DIRECTION.HORIZONTAL]: string;
};
export declare const marginProp: {
    [DIRECTION.VERTICAL]: string;
    [DIRECTION.HORIZONTAL]: string;
};
export declare const oppositeMarginProp: {
    [DIRECTION.VERTICAL]: string;
    [DIRECTION.HORIZONTAL]: string;
};
