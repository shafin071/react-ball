import { PlayAreaDimensions, BrickDimensions } from "../models/gameModels";


const getBrickDimensions = (brick: HTMLDivElement, playAreaDims: PlayAreaDimensions): BrickDimensions => {
    const brickRect = brick.getBoundingClientRect();
    const leftEdge = brickRect.left - playAreaDims.leftEdge;
    const rightEdge = leftEdge + brickRect.width;
    const topEdge = brickRect.top - playAreaDims.topEdge;
    const bottomEdge = topEdge + brickRect.height;

    return {leftEdge, rightEdge, topEdge, bottomEdge};
}


export { getBrickDimensions };