import { PlayAreaDimensions, PaddleDimensions } from "../models/gameModels";


/**
 * Retrieves the dimensions and position of the paddle element for other components like the ball.
 *
 * @param {React.RefObject<HTMLDivElement | null>} paddleRef - A reference to the paddle DOM element.
 * @returns {PaddleDimensions} An object containing the paddle's width, left edge, right edge, height, and top edge.
 *
 * The returned object has the following structure:
 * - `width`: The width of the paddle (in pixels).
 * - `leftEdge`: The distance from the left edge of the play area to the left edge of the paddle (in pixels).
 * - `rightEdge`: The distance from the left edge of the play area to the right edge of the paddle (in pixels).
 * - `paddleHeight`: The height of the paddle (in pixels).
 * - `topEdge`: The distance from the top edge of the play area to the top edge of the paddle (in pixels).
 *
 * If the `paddleRef` is null or the paddle element is not mounted, all values in the returned object will be `0`.
 */
const getPaddleDimensions = (paddleRef: React.RefObject<HTMLDivElement | null>): PaddleDimensions => {
    console.log('Getting paddle dimensions', paddleRef.current);
    if (paddleRef.current) {
        const width = parseFloat(paddleRef.current.style.width || '0');
        const leftEdge = parseFloat(paddleRef.current.style.left || '0');
        const rightEdge = (leftEdge + width || 0);
        const height = parseFloat(paddleRef.current.style.height || '0');
        const topEdge = parseFloat(paddleRef.current.style.top || '0');
        
        return { width, leftEdge, rightEdge, height, topEdge };
    }
    return { width: 0, leftEdge: 0, rightEdge: 0, height: 0, topEdge: 0 };
}


/**
 * Sets the initial position of the paddle within the play area.
 *
 * @param {React.RefObject<HTMLDivElement | null>} paddleRef - A reference to the paddle DOM element.
 * @param {number} paddleWidth - The width of the paddle (in pixels).
 * @param {PlayAreaDimensions} playAreaDims - The dimensions of the play area.
 *
 * The paddle is positioned horizontally at the center of the play area and vertically {paddleBottomPadding} px from the bottom edge of play area.
 * If the `paddleRef` is null or the paddle element is not mounted, this function does nothing.
 */
const setInitialPaddlePosition = (paddleRef: React.RefObject<HTMLDivElement | null>, paddleWidth: number, playAreaDims: PlayAreaDimensions) => {
    const paddleBottomPadding = 20;
    if (paddleRef.current) {
        const initialLeft = (playAreaDims.width - paddleWidth) / 2;
        paddleRef.current.style.left = `${initialLeft}px`;

        const initialTop = playAreaDims.height - paddleBottomPadding; 
        paddleRef.current.style.top = `${initialTop}px`;
        
        // console.log('Setting initial position of paddle:', initialLeft, initialTop);
    }
}


/**
 * Moves the paddle to a new horizontal position within the play area.
 *
 * @param {React.RefObject<HTMLDivElement | null>} paddleRef - A reference to the paddle DOM element.
 * @param {number} newLeft - The new horizontal position of the paddle (in pixels).
 *
 * The function updates the `left` style property of the paddle to move it horizontally.
 * If the `paddleRef` is null or the paddle element is not mounted, this function does nothing.
 */
const movePaddle = (paddleRef: React.RefObject<HTMLDivElement | null>, newLeft: number) => {
    console.log('Moving paddle to new left position:', newLeft);
    if (paddleRef.current) {
        paddleRef.current.style.left = `${newLeft}px`;
    }
};


export { getPaddleDimensions, setInitialPaddlePosition, movePaddle };