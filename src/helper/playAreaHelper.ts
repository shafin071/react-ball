import { PlayAreaDimensions } from "../models/gameModels";


/**
 * Retrieves the dimensions and position of the play area.
 *
 * @param {React.RefObject<HTMLDivElement | null>} playAreaRef - A reference to the play area DOM element.
 * @returns {PlayAreaDimensions} An object containing the dimensions and position of the play area:
 *   - `leftEdge`: The distance from the left edge of the viewport to the left edge of the play area.
 *   - `rightEdge`: The distance from the left edge of the viewport to the right edge of the play area.
 *   - `topEdge`: The distance from the top edge of the viewport to the top edge of the play area.
 *   - `bottomEdge`: The distance from the top edge of the viewport to the bottom edge of the play area.
 *   - `width`: The width of the play area (in pixels).
 *   - `height`: The height of the play area (in pixels).
 *
 * If the `playAreaRef` is null or the play area element is not mounted, all values in the returned object will be `0`.
 */
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