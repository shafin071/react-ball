import { PlayAreaDimensions, BrickAreaDimensions, BrickDimensions } from "../models/gameModels";


const getBrickAreaDimensions = (playAreaDims: PlayAreaDimensions): BrickAreaDimensions => {
    const brickAreaHeightRatio = 5; // Ratio of the height of the brick section to the height of the play area
        const brickSectionHeight = playAreaDims.height / brickAreaHeightRatio // 3
        const brickSectionWidth = playAreaDims.width
        return {brickSectionHeight, brickSectionWidth}
}


const getBrickDimensions = (brick: HTMLDivElement, playAreaDims: PlayAreaDimensions): BrickDimensions => {
    const brickRect = brick.getBoundingClientRect();
    const leftEdge = brickRect.left - playAreaDims.leftEdge;
    const rightEdge = leftEdge + brickRect.width;
    const topEdge = brickRect.top - playAreaDims.topEdge;
    const bottomEdge = topEdge + brickRect.height;

    return {leftEdge, rightEdge, topEdge, bottomEdge};
}


export { getBrickAreaDimensions, getBrickDimensions };