import { PlayAreaDimensions } from "../models/gameModels";


const getPlayAreaDimensions = (playAreaRef: React.RefObject<HTMLDivElement | null>): PlayAreaDimensions => {
    const boundingClientRect = playAreaRef.current?.getBoundingClientRect();
    if (boundingClientRect) {
        const leftEdge = boundingClientRect.left;
        const rightEdge = boundingClientRect.right;
        const topEdge = boundingClientRect.top;
        const bottomEdge = boundingClientRect.bottom;
        const width = boundingClientRect.width;
        const height = boundingClientRect.height;
        return { leftEdge, rightEdge, topEdge, bottomEdge, width, height };
    }
    return { leftEdge: 0, rightEdge: 0, topEdge: 0, bottomEdge: 0, width: 0, height: 0 };
};


export { getPlayAreaDimensions };