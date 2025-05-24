import { Gamestate, PlayAreaDimensions, PaddleDimensions, BallDimensions, BrickDimensions, moveBallProps } from "../models/gameModels";
import { getPaddleDimensions } from './paddleHelper';
import { getBrickAreaDimensions, getBrickDimensions } from "./brickHelper";
import { pre } from "motion/react-client";


/**
 * Sets the initial position of the ball within the play area.
 *
 * @param {React.RefObject<HTMLDivElement | null>} ballRef - A reference to the ball DOM element.
 * @param {PlayAreaDimensions} playAreaDims - The dimensions of the play area.
 * @param {PaddleDimensions} paddleDims - The dimensions of the paddle.
 *
 * The ball is positioned horizontally at the center of the play area and vertically just above the paddle.
 */
const setInitialBallPosition = (ballRef: React.RefObject<HTMLDivElement | null>, playAreaDims: PlayAreaDimensions, paddleDims: PaddleDimensions) => {
    if (ballRef.current) {
        ballRef.current.style.left = `${(playAreaDims.width) / 2}px`; // Center horizontally
        ballRef.current.style.top = `${paddleDims.topEdge - parseFloat(ballRef.current.style.width)}px`; // 40px from bottom edge
    }
}

/**
 * A helper class to manage ball-related operations such as movement and collision handling.
 */
class BallHelper {
    private ballRef: React.RefObject<HTMLDivElement | null>;
    private paddleRef: React.RefObject<HTMLDivElement | null>;
    private velocity: { current: { x: number; y: number } };
    private gameStore: Gamestate;
    private playAreaDims: PlayAreaDimensions;
    private brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
    private brickCount: { current: number };

    constructor(moveBallProps: moveBallProps) {
        this.ballRef = moveBallProps.ballRef;
        this.paddleRef = moveBallProps.paddleRef;
        this.velocity = moveBallProps.velocity;
        this.gameStore = moveBallProps.gameStore;
        this.playAreaDims = moveBallProps.playAreaDims;
        this.brickRefs = moveBallProps.brickRefs;
        this.brickCount = moveBallProps.brickCount;
    }

    /**
     * Retrieves the dimensions and position of the ball.
     *
     * @returns {BallDimensions} An object containing the ball's width, left edge, right edge, top edge, and bottom edge.
     */
    getBallDimensions(): BallDimensions {
        if (this.ballRef.current) {
            const width = parseFloat(this.ballRef.current.style.width || '0');
            const leftEdge = parseFloat(this.ballRef.current.style.left || '0');
            const rightEdge = leftEdge + width;
            const topEdge = parseFloat(this.ballRef.current.style.top || '0');
            const bottomEdge = topEdge + width;

            return { width, leftEdge, rightEdge, topEdge, bottomEdge };
        }
        return { width: 0, leftEdge: 0, rightEdge: 0, topEdge: 0, bottomEdge: 0 };
    }

    /**
     * Handles collisions of the ball with the play area boundaries.
     *
     * @param {BallDimensions} ballDims - The dimensions of the ball.
     * @param {PlayAreaDimensions} playAreaDims - The dimensions of the play area.
     * @returns {boolean} Returns `true` if the ball hits the bottom boundary, otherwise `false`.
     */
    handleBallCollisionWithBoundaries(ballDims: BallDimensions, playAreaDims: PlayAreaDimensions): boolean {
        // Check for collisions with left-right boundaries
        if (ballDims.leftEdge <= 0 || ballDims.rightEdge >= playAreaDims.width) {
            this.velocity.current.x *= -1; // Reverse horizontal direction
        }

        // Check for collisions with top boundary
        if (ballDims.topEdge <= 0) {
            this.velocity.current.y *= -1; // Reverse vertical direction
        }

        // Check for collisions with bottom boundary
        if (ballDims.bottomEdge >= playAreaDims.height) {
            this.gameStore.endGame(false); // Trigger game over state
            if (this.paddleRef.current) {
                this.paddleRef.current.style.animation = 'blinker 1s linear infinite';
            }
            return true; // Indicate that the ball hit the bottom boundary
        }

        return false; // No collision with the bottom boundary
    }

    /**
     * Handles collisions of the ball with the paddle.
     * The angle of the ball's bounce is determined by the zone of the paddle it hits.
     *
     * @param {BallDimensions} ballDims - The dimensions of the ball.
     */
    handleBallCollisionWithPaddle(ballDims: BallDimensions): void {
        const paddleDims = getPaddleDimensions(this.paddleRef);

        // Get current position
        let currentLeft = (ballDims.leftEdge || 0);
        let currentRight = (ballDims.rightEdge || 0);
        let currentBottom = (ballDims.bottomEdge || 0);
        let currentTop = (ballDims.topEdge || 0);

        // Check if the ball is colliding with the paddle
        if (
            this.velocity.current.y > 0 && // Ensure the ball is moving downward
            currentBottom >= paddleDims.topEdge &&
            currentTop <= paddleDims.topEdge + paddleDims.height &&
            currentRight >= paddleDims.leftEdge &&
            currentLeft <= paddleDims.rightEdge
        ) {
            // Reverse vertical direction
            this.velocity.current.y *= -1;

            // Calculate the paddle center and ball center
            const paddleCenter = paddleDims.leftEdge + (paddleDims.rightEdge - paddleDims.leftEdge) / 2;
            const ballCenter = currentLeft + (currentRight - currentLeft) / 2;

            // Paddle zones/edges and corresponding x directions of the ball:
            // Note: The paddle is divided into 5 zones to determine the angle at which the ball will bounce of the paddle.

            //  x=-3      x=-2                          x=0                         x=2         x=3 
            //  ____________________________________________________________________________________
            // | LZ |  Left Zone     |              Center zone              |  Right Zone    |  RZ |
            // |__1_|______2_________|___________________|___________________|_______2________|__1__|
            // A    B                C             Paddle center             D                E     F

            //                       | <-paddleWidth/8-> | <-paddleWidth/8-> |

            const A = paddleDims.leftEdge;
            const F = paddleDims.rightEdge;

            const C = paddleCenter - (paddleDims.width / 8);
            const D = paddleCenter + (paddleDims.width / 8);

            const B = A + (C - A) / 4;
            const E = F - (F - D) / 4;

            if (currentRight >= A && ballCenter <= B) {
                // Ball hit Left Zone 1
                this.velocity.current.x = -3;
            }
            else if (ballCenter > B && ballCenter <= C) {
                // Ball hit Left Zone 2
                this.velocity.current.x = -2;
            }
            else if (ballCenter > C && ballCenter <= D) {
                // Ball hit Center Zone
                this.velocity.current.x = 0;
            }
            else if (ballCenter > D && ballCenter <= E) {
                // Ball hit Right Zone 2
                this.velocity.current.x = 2;
            }
            else if (ballCenter > E && currentLeft <= F) {
                // Ball hit Right Zone 1
                this.velocity.current.x = 3;
            }
        }

    }

    /**
     * Populates the collidingBricks array with bricks that are colliding with the ball.
     * This method checks if the ball's dimensions overlap with the brick's dimensions.
     *
     * @param {BallDimensions} ballDims - The dimensions of the ball.
     * @param {HTMLDivElement} brick - The brick element to check for collision.
     * @param {HTMLDivElement[]} collidingBricks - The array to populate with colliding bricks.
     */
    populationCollidingBricks(ballDims: BallDimensions, brick: HTMLDivElement, collidingBricks: HTMLDivElement[]) {
        // Check collision with the current position of the ball
        let brickDims = getBrickDimensions(brick, this.playAreaDims);

        const collision = (
            ballDims.rightEdge >= brickDims.leftEdge &&
            ballDims.leftEdge <= brickDims.rightEdge &&
            ballDims.bottomEdge >= brickDims.topEdge &&
            ballDims.topEdge <= brickDims.bottomEdge
        );

        // Populate collidingBricks with the bricks that are colliding with the ball.
        if (collision) {
            collidingBricks.push(brick);
        }
    }

    /**
     * Handles the change of direction of the ball after a collision with a brick.
     * This method determines which side of the brick the ball hit and updates the ball's velocity accordingly.
     *
     * @param {BallDimensions} ballDims - The dimensions of the ball.
     * @param {BrickDimensions} brickDims - The dimensions of the brick.
     */
    handleBallChangeOfDirectionAfterBrickCollision(ballDims: BallDimensions, brickDims: BrickDimensions) {
        // Collision detected. Find which side of the brick the ball hit
        let ballFromBrickTopEdge = Math.abs(ballDims.bottomEdge - brickDims.topEdge);
        let ballFromBrickBottomEdge = Math.abs(ballDims.topEdge - brickDims.bottomEdge);
        let ballFromBrickLeftEdge = Math.abs(ballDims.rightEdge - brickDims.leftEdge);
        let ballFromBrickRightEdge = Math.abs(ballDims.leftEdge - brickDims.rightEdge);

        const minDistance = Math.min(ballFromBrickTopEdge, ballFromBrickBottomEdge, ballFromBrickLeftEdge, ballFromBrickRightEdge);

        // Update ball velocity based on collision side
        if (minDistance === ballFromBrickTopEdge || minDistance === ballFromBrickBottomEdge) {
            // console.log('Previous position of ball hit top or bottom of the brick');
            this.velocity.current.y *= -1; // Reverse vertical direction

        } else if (minDistance === ballFromBrickLeftEdge || minDistance === ballFromBrickRightEdge) {
            // console.log('Previous position of ball hit left or right of the brick');
            this.velocity.current.x *= -1; // Reverse horizontal direction

        } else {
            // console.log('Ball hit the corner of the brick');
            this.velocity.current.y *= -1; // Reverse vertical direction
            this.velocity.current.x *= 0; // Drop the ball in straight line
        }
    }


    /**
     * Handles collisions of the ball with bricks.
     * When brick count reaches zero, it triggers a game win state.
     *
     * @param {BallDimensions} ballDims - The dimensions of the ball.
     */
    handleBallCollisionWithBricks(ballDims: BallDimensions): void {
        let collidingBricks: HTMLDivElement[] = [];

        // Loops through all bricks to check for collisions of the ball with brick/multiple bricks. 
        for (let index = 0; index < this.brickRefs.current.length; index++) {
            const brick = this.brickRefs.current[index];

            if (brick && this.ballRef.current) {
                // Check if the brick already has the 'brick-exit' class
                if (brick.classList.contains('brick-exit')) {
                    continue; // Skip this brick if it already has the 'brick-exit' class
                }
                this.populationCollidingBricks(ballDims, brick, collidingBricks)
            }
        }

        // Now process the bricks in collidingBricks
        if (collidingBricks.length > 0) {
            let primaryBrick;

            if (collidingBricks.length === 2) {
                // Determine which brick the ball went into more to determine which brick to bounce off of.
                // Compare the overlaps to find the primary brick
                const [brick1, brick2] = collidingBricks;

                const brick1Dims = getBrickDimensions(brick1, this.playAreaDims);
                const brick2Dims = getBrickDimensions(brick2, this.playAreaDims);

                const overlap1 = Math.min(ballDims.rightEdge, brick1Dims.rightEdge) - Math.max(ballDims.leftEdge, brick1Dims.leftEdge);
                const overlap2 = Math.min(ballDims.rightEdge, brick2Dims.rightEdge) - Math.max(ballDims.leftEdge, brick2Dims.leftEdge);
                primaryBrick = overlap1 > overlap2 ? brick1 : brick2;
            }
            else {
                primaryBrick = collidingBricks[0];
            }

            const primaryBrickDims = getBrickDimensions(primaryBrick, this.playAreaDims);

            // Calculate the previous position of the ball
            const previousBallDims = {
                width: ballDims.width,
                leftEdge: ballDims.leftEdge - this.velocity.current.x,
                rightEdge: ballDims.rightEdge - this.velocity.current.x,
                topEdge: ballDims.topEdge - this.velocity.current.y,
                bottomEdge: ballDims.bottomEdge - this.velocity.current.y
            };

            // Check collision with the previous position of the ball
            const previousCollision = (
                previousBallDims.rightEdge >= primaryBrickDims.leftEdge &&
                previousBallDims.leftEdge <= primaryBrickDims.rightEdge &&
                previousBallDims.bottomEdge >= primaryBrickDims.topEdge &&
                previousBallDims.topEdge <= primaryBrickDims.bottomEdge
            );

            const currentBallDims = (previousCollision) ? previousBallDims : ballDims;
            // Handle the change of direction of the ball after brick collision
            this.handleBallChangeOfDirectionAfterBrickCollision(currentBallDims, primaryBrickDims);

            // Remove bricks from screen and update score
            collidingBricks.forEach((brick) => {
                brick.classList.add('brick-exit');
                this.brickCount.current -= 1;
                const brickPoint = parseInt(brick.dataset.score || '0', 10);
                this.gameStore.setScore(brickPoint);

                setTimeout(() => {
                    brick.style.visibility = 'hidden';
                }, 100);
            });

            if (this.brickCount.current <= 0) {
                setTimeout(() => {
                    this.gameStore.endGame(true);
                }, 500);
            }

        }
    }

    /**
     * Gradually slows down the ball when all bricks are destroyed.
     *
     * @param {object} brickCount - An object containing the current count of bricks.
     */
    handleAllBricksDestroyed(brickCount: { current: number }): void {
        // Gradually slow down the ball at intervals if all bricks are destroyed
        if (brickCount.current <= 0) {
            const slowDownInterval = setInterval(() => {
                this.velocity.current.x *= 0.9;
                this.velocity.current.y *= 0.9;

                // Stop slowing down when velocity is very small
                if (Math.abs(this.velocity.current.x) < 0.1 && Math.abs(this.velocity.current.y) < 0.1) {
                    clearInterval(slowDownInterval); // Stop the interval
                }
            }, 100);
        }
    }

    /**
     * Moves the ball within the play area, handling collisions and updating its position.
     */
    moveBall(): void {
        if (!this.ballRef.current || !this.paddleRef.current || !this.brickRefs.current) return;

        const ballDims = this.getBallDimensions();
        const paddleDims = getPaddleDimensions(this.paddleRef);

        // Handle collisions with boundaries
        const hitBottom = this.handleBallCollisionWithBoundaries(ballDims, this.playAreaDims);
        if (hitBottom) return; // Exit if the ball hits the bottom boundary

        // Handle collisions with paddle when the ball is near the paddle
        if (ballDims.bottomEdge >= paddleDims.topEdge - 10) {
            this.handleBallCollisionWithPaddle(ballDims);
        }

        // Handle collisions with bricks if ball is near the brick section
        const { brickSectionHeight } = getBrickAreaDimensions(this.playAreaDims);
        if (ballDims.topEdge <= brickSectionHeight + 10) {
            this.handleBallCollisionWithBricks(ballDims);
        }

        // Handle all bricks destroyed
        this.handleAllBricksDestroyed(this.brickCount);

        // Update ball position
        const newLeft = ballDims.leftEdge + this.velocity.current.x;
        const newTop = ballDims.topEdge + this.velocity.current.y;

        this.ballRef.current.style.left = `${newLeft}px`;
        this.ballRef.current.style.top = `${newTop}px`;
    }
}

export { setInitialBallPosition, BallHelper };