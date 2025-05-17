import { PlayAreaDimensions, BrickAreaDimensions, BrickDimensions } from "../models/gameModels";


/**
 * Calculates the dimensions of the brick area (the section of the play area where bricks are placed).
 *
 * @param {PlayAreaDimensions} playAreaDims - An object containing the dimensions of the play area:
 *   - `width`: The width of the play area.
 *   - `height`: The height of the play area.
 * @returns {BrickAreaDimensions} An object containing the dimensions of the brick area:
 *   - `brickSectionHeight`: The height of the brick section, calculated as a ratio of the play area height.
 *   - `brickSectionWidth`: The width of the brick section, equal to the width of the play area.
 *
 * The height of the brick section is determined by dividing the play area height by a constant ratio (`brickAreaHeightRatio`).
 */
const getBrickAreaDimensions = (playAreaDims: PlayAreaDimensions): BrickAreaDimensions => {
    const brickAreaHeightRatio = 6; // Ratio of the height of the brick section to the height of the play area
        const brickSectionHeight = playAreaDims.height / brickAreaHeightRatio // 3
        const brickSectionWidth = playAreaDims.width
        return {brickSectionHeight, brickSectionWidth}
}


/**
 * Calculates the position and dimensions of a specific brick relative to the play area.
 *
 * @param {HTMLDivElement} brick - A reference to the brick DOM element.
 * @param {PlayAreaDimensions} playAreaDims - An object containing the dimensions of the play area:
 *   - `leftEdge`: The left edge of the play area.
 *   - `topEdge`: The top edge of the play area.
 * @returns {BrickDimensions} An object containing the position and dimensions of the brick:
 *   - `leftEdge`: The distance from the left edge of the play area to the left edge of the brick.
 *   - `rightEdge`: The distance from the left edge of the play area to the right edge of the brick.
 *   - `topEdge`: The distance from the top edge of the play area to the top edge of the brick.
 *   - `bottomEdge`: The distance from the top edge of the play area to the bottom edge of the brick.
 *
 * The function uses the `getBoundingClientRect()` method to get the brick's position and size relative to the viewport,
 * and adjusts the position relative to the play area using the play area dimensions.
 */
const getBrickDimensions = (brick: HTMLDivElement, playAreaDims: PlayAreaDimensions): BrickDimensions => {
    const brickRect = brick.getBoundingClientRect();
    const leftEdge = brickRect.left - playAreaDims.leftEdge;
    const rightEdge = leftEdge + brickRect.width;
    const topEdge = brickRect.top - playAreaDims.topEdge;
    const bottomEdge = topEdge + brickRect.height;

    return {leftEdge, rightEdge, topEdge, bottomEdge};
}


export { getBrickAreaDimensions, getBrickDimensions };