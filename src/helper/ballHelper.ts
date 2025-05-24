import { Gamestate, PlayAreaDimensions, PaddleDimensions, BallDimensions, moveBallProps } from "../models/gameModels";
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

    constructor(moveBallProps: moveBallProps) {
        this.ballRef = moveBallProps.ballRef;
        this.paddleRef = moveBallProps.paddleRef;
        this.velocity = moveBallProps.velocity;
        this.gameStore = moveBallProps.gameStore;
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
     * Handles collisions of the ball with bricks.
     * When brick count reaches zero, it triggers a game win state.
     *
     * @param {PlayAreaDimensions} playAreaDims - The dimensions of the play area.
     * @param {BallDimensions} ballDims - The dimensions of the ball.
     * @param {React.RefObject<(HTMLDivElement | null)[]>} brickRefs - References to the brick DOM elements.
     * @param {object} brickCount - An object containing the current count of bricks.
     */
    handleBallCollisionWithBricks(playAreaDims: PlayAreaDimensions, ballDims: BallDimensions, brickRefs: React.RefObject<(HTMLDivElement | null)[]>, brickCount: { current: number }): void {
        // console.log('In handleBallCollisionWithBricks...');
        const collidingBricks = [];

        // Calculate the previous position of the ball
        const previousBallDims = {
            leftEdge: ballDims.leftEdge - this.velocity.current.x,
            rightEdge: ballDims.rightEdge - this.velocity.current.x,
            topEdge: ballDims.topEdge - this.velocity.current.y,
            bottomEdge: ballDims.bottomEdge - this.velocity.current.y
        };

        for (let index = 0; index < brickRefs.current.length; index++) {
            const brick = brickRefs.current[index];

            if (brick && this.ballRef.current) {
                // Check if the brick already has the 'brick-exit' class
                if (brick.classList.contains('brick-exit')) {
                    continue; // Skip this brick if it already has the 'brick-exit' class
                }

                let brickDims = getBrickDimensions(brick, playAreaDims);

                // Check collision with the current position of the ball
                const currentCollision = (
                    ballDims.rightEdge >= brickDims.leftEdge &&
                    ballDims.leftEdge <= brickDims.rightEdge &&
                    ballDims.bottomEdge >= brickDims.topEdge &&
                    ballDims.topEdge <= brickDims.bottomEdge
                );

                // Check collision with the previous position of the ball
                // const previousCollision = (
                //     previousBallDims.rightEdge >= brickDims.leftEdge &&
                //     previousBallDims.leftEdge <= brickDims.rightEdge &&
                //     previousBallDims.bottomEdge >= brickDims.topEdge &&
                //     previousBallDims.topEdge <= brickDims.bottomEdge
                // );

                if (currentCollision) {
                    collidingBricks.push({ brick, brickDims });


                    // Collision detected. Find which side of the brick the ball hit
                    // const ballCenter = ballDims.leftEdge + (ballDims.rightEdge - ballDims.leftEdge) / 2;

                    // const ballBottomEdgeToBrickTopEdge = Math.abs(ballDims.bottomEdge - brickDims.topEdge);
                    // const ballTopEdgeToBrickBottomEdge = Math.abs(ballDims.topEdge - brickDims.bottomEdge);
                    // const ballLeftEdgeToBrickRightEdge = Math.abs(ballDims.leftEdge - brickDims.rightEdge);
                    // const ballRightEdgeToBrickLeftEdge = Math.abs(ballDims.rightEdge - brickDims.leftEdge);

                    // const BallCenterToBrickTopEdge = Math.abs(ballCenter - brickDims.topEdge);
                    // const BallCenterToBrickBottomEdge = Math.abs(ballCenter - brickDims.bottomEdge);
                    // const BallCenterToBrickLeftEdge = Math.abs(ballCenter - brickDims.leftEdge);
                    // const BallCenterToBrickRightEdge = Math.abs(ballCenter - brickDims.rightEdge);

                    // const ballFromTop = Math.min(Math.abs(ballDims.bottomEdge - brickDims.topEdge), Math.abs(ballCenter - brickDims.topEdge));
                    // const ballFromBottom = Math.min(Math.abs(ballDims.topEdge - brickDims.bottomEdge), Math.abs(ballCenter - brickDims.bottomEdge));
                    // const ballFromLeft = Math.min(Math.abs(ballDims.rightEdge - brickDims.leftEdge), Math.abs(ballCenter - brickDims.leftEdge));
                    // const ballFromRight = Math.min(Math.abs(ballDims.leftEdge - brickDims.rightEdge), Math.abs(ballCenter - brickDims.rightEdge));

                    // const ballFromBrickTopEdge = Math.min(ballBottomEdgeToBrickTopEdge, BallCenterToBrickTopEdge);
                    // const ballFromBrickBottomEdge = Math.min(ballTopEdgeToBrickBottomEdge, BallCenterToBrickBottomEdge);
                    // const ballFromBrickLeftEdge = Math.min(ballLeftEdgeToBrickRightEdge, BallCenterToBrickLeftEdge);
                    // const ballFromBrickRightEdge = Math.min(ballRightEdgeToBrickLeftEdge, BallCenterToBrickRightEdge);

                    // // Collision detected. Find which side of the brick the ball hit
                    // const ballFromBrickTopEdge = Math.abs(ballDims.bottomEdge - brickDims.topEdge);
                    // const ballFromBrickBottomEdge = Math.abs(ballDims.topEdge - brickDims.bottomEdge);
                    // const ballFromBrickLeftEdge = Math.abs(ballDims.rightEdge - brickDims.leftEdge);
                    // const ballFromBrickRightEdge = Math.abs(ballDims.leftEdge - brickDims.rightEdge);

                    // const minDistance = Math.min(ballFromBrickTopEdge, ballFromBrickBottomEdge, ballFromBrickLeftEdge, ballFromBrickRightEdge);

                    // // Update ball velocity based on collision side
                    // if (minDistance === ballFromBrickTopEdge || minDistance === ballFromBrickBottomEdge) {
                    //     // console.log('Ball hit top or bottom of the brick');
                    //     this.velocity.current.y *= -1; // Reverse vertical direction

                    // } else if (minDistance === ballFromBrickLeftEdge || minDistance === ballFromBrickRightEdge) {
                    //     // console.log('Ball hit left or right of the brick');

                    //     // console.log('ballCenter:', ballCenter, 'ballTopEdge:', ballDims.topEdge, 'ballBottomEdge:', ballDims.bottomEdge,
                    //     //     'ballLeftEdge:', ballDims.leftEdge, 'ballRightEdge:', ballDims.rightEdge,
                    //     // );

                    //     // console.log('brickTopEdge:', brickDims.topEdge, 'brickBottomEdge:', brickDims.bottomEdge,
                    //     //     'brickLeftEdge:', brickDims.leftEdge, 'brickRightEdge:', brickDims.rightEdge);

                    //     // console.log('ballBottomEdgeToBrickTopEdge:', ballBottomEdgeToBrickTopEdge, 'ballTopEdgeToBrickBottomEdge:', ballTopEdgeToBrickBottomEdge,
                    //     //     'ballLeftEdgeToBrickRightEdge:', ballLeftEdgeToBrickRightEdge, 'ballRightEdgeToBrickLeftEdge:', ballRightEdgeToBrickLeftEdge);

                    //     // console.log('BallCenterToBrickTopEdge:', BallCenterToBrickTopEdge, 'BallCenterToBrickBottomEdge:', BallCenterToBrickBottomEdge,
                    //     //     'BallCenterToBrickRightEdge:', BallCenterToBrickRightEdge, 'BallCenterToBrickLeftEdge:', BallCenterToBrickLeftEdge);

                    //     // console.log('minDistance:', minDistance);

                    //     this.velocity.current.x *= -1; // Reverse horizontal direction

                    // } else {
                    //     console.log('Ball hit the corner of the brick');
                    //     this.velocity.current.y *= -1; // Reverse vertical direction
                    //     this.velocity.current.x *= 0; // Drop the ball in straight line
                    // }

                    // // Handle brick removal
                    // brick.classList.add('brick-exit');
                    // brickCount.current -= 1;
                    // // console.log('brickCount.current: ', brickCount.current);
                    // const brickPoint = parseInt(brick.dataset.score || '0', 10);
                    // this.gameStore.setScore(brickPoint);

                    // setTimeout(() => {
                    //     brick.style.visibility = 'hidden';
                    // }, 100);

                    // if (brickCount.current <= 0) {
                    //     console.log('All bricks destroyed. Brick count is 0');
                    //     setTimeout(() => {
                    //         this.gameStore.endGame(true);
                    //         console.log('Game won');
                    //     }, 500);
                    // }
                    // console.log('current ball velocity:', this.velocity.current.x, this.velocity.current.y, '\n');
                    // break;
                }
            }

        }

        // resolve colliding with multiple bricks
        // if (collidingBricks.length > 0) {

        // }
        if (collidingBricks.length > 0) {
            let primaryBrickDims;

            if (collidingBricks.length === 2) {
                // Determine which brick the ball went into more
                const [brick1, brick2] = collidingBricks;
                const overlap1 = Math.min(ballDims.rightEdge, brick1.brickDims.rightEdge) - Math.max(ballDims.leftEdge, brick1.brickDims.leftEdge);
                const overlap2 = Math.min(ballDims.rightEdge, brick2.brickDims.rightEdge) - Math.max(ballDims.leftEdge, brick2.brickDims.leftEdge);
                const primaryBrick = overlap1 > overlap2 ? brick1 : brick2;
                primaryBrickDims = primaryBrick.brickDims;
            }
            else {
                primaryBrickDims = collidingBricks[0].brickDims;
            }

            // Check collision with the previous position of the ball
            const previousCollision = (
                previousBallDims.rightEdge >= primaryBrickDims.leftEdge &&
                previousBallDims.leftEdge <= primaryBrickDims.rightEdge &&
                previousBallDims.bottomEdge >= primaryBrickDims.topEdge &&
                previousBallDims.topEdge <= primaryBrickDims.bottomEdge
            );

            if (previousCollision) {
                // Collision detected. Find which side of the brick the ball hit
                let ballFromBrickTopEdge = Math.abs(previousBallDims.bottomEdge - primaryBrickDims.topEdge);
                let ballFromBrickBottomEdge = Math.abs(previousBallDims.topEdge - primaryBrickDims.bottomEdge);
                let ballFromBrickLeftEdge = Math.abs(previousBallDims.rightEdge - primaryBrickDims.leftEdge);
                let ballFromBrickRightEdge = Math.abs(previousBallDims.leftEdge - primaryBrickDims.rightEdge);

                const minDistance = Math.min(ballFromBrickTopEdge, ballFromBrickBottomEdge, ballFromBrickLeftEdge, ballFromBrickRightEdge);

                // Update ball velocity based on collision side
                if (minDistance === ballFromBrickTopEdge || minDistance === ballFromBrickBottomEdge) {
                    // console.log('Previous position of ball hit top or bottom of the brick');
                    this.velocity.current.y *= -1; // Reverse vertical direction

                } else if (minDistance === ballFromBrickLeftEdge || minDistance === ballFromBrickRightEdge) {
                    console.log('Previous position of ball hit left or right of the brick');

                    // console.log('ballCenter:', ballCenter, 'ballTopEdge:', ballDims.topEdge, 'ballBottomEdge:', ballDims.bottomEdge,
                    //     'ballLeftEdge:', ballDims.leftEdge, 'ballRightEdge:', ballDims.rightEdge,
                    // );

                    // console.log('brickTopEdge:', brickDims.topEdge, 'brickBottomEdge:', brickDims.bottomEdge,
                    //     'brickLeftEdge:', brickDims.leftEdge, 'brickRightEdge:', brickDims.rightEdge);

                    // console.log('ballBottomEdgeToBrickTopEdge:', ballBottomEdgeToBrickTopEdge, 'ballTopEdgeToBrickBottomEdge:', ballTopEdgeToBrickBottomEdge,
                    //     'ballLeftEdgeToBrickRightEdge:', ballLeftEdgeToBrickRightEdge, 'ballRightEdgeToBrickLeftEdge:', ballRightEdgeToBrickLeftEdge);

                    // console.log('minDistance:', minDistance);

                    this.velocity.current.x *= -1; // Reverse horizontal direction

                } else {
                    // console.log('Ball hit the corner of the brick');
                    this.velocity.current.y *= -1; // Reverse vertical direction
                    this.velocity.current.x *= 0; // Drop the ball in straight line
                }

            } else {
                // Collision detected. Find which side of the brick the ball hit
                let ballFromBrickTopEdge = Math.abs(ballDims.bottomEdge - primaryBrickDims.topEdge);
                let ballFromBrickBottomEdge = Math.abs(ballDims.topEdge - primaryBrickDims.bottomEdge);
                let ballFromBrickLeftEdge = Math.abs(ballDims.rightEdge - primaryBrickDims.leftEdge);
                let ballFromBrickRightEdge = Math.abs(ballDims.leftEdge - primaryBrickDims.rightEdge);

                const minDistance = Math.min(ballFromBrickTopEdge, ballFromBrickBottomEdge, ballFromBrickLeftEdge, ballFromBrickRightEdge);

                // Update ball velocity based on collision side
                if (minDistance === ballFromBrickTopEdge || minDistance === ballFromBrickBottomEdge) {
                    // console.log('Ball hit top or bottom of the brick');
                    this.velocity.current.y *= -1; // Reverse vertical direction

                } else if (minDistance === ballFromBrickLeftEdge || minDistance === ballFromBrickRightEdge) {
                    console.log('Ball hit left or right of the brick');

                    // console.log('ballCenter:', ballCenter, 'ballTopEdge:', ballDims.topEdge, 'ballBottomEdge:', ballDims.bottomEdge,
                    //     'ballLeftEdge:', ballDims.leftEdge, 'ballRightEdge:', ballDims.rightEdge,
                    // );

                    // console.log('brickTopEdge:', brickDims.topEdge, 'brickBottomEdge:', brickDims.bottomEdge,
                    //     'brickLeftEdge:', brickDims.leftEdge, 'brickRightEdge:', brickDims.rightEdge);

                    // console.log('ballBottomEdgeToBrickTopEdge:', ballBottomEdgeToBrickTopEdge, 'ballTopEdgeToBrickBottomEdge:', ballTopEdgeToBrickBottomEdge,
                    //     'ballLeftEdgeToBrickRightEdge:', ballLeftEdgeToBrickRightEdge, 'ballRightEdgeToBrickLeftEdge:', ballRightEdgeToBrickLeftEdge);

                    // console.log('minDistance:', minDistance);

                    this.velocity.current.x *= -1; // Reverse horizontal direction

                } else {
                    // console.log('Ball hit the corner of the brick');
                    this.velocity.current.y *= -1; // Reverse vertical direction
                    this.velocity.current.x *= 0; // Drop the ball in straight line
                }

            }


            // Handle brick removal for both bricks
            collidingBricks.forEach(({ brick }) => {
                brick.classList.add('brick-exit');
                brickCount.current -= 1;
                const brickPoint = parseInt(brick.dataset.score || '0', 10);
                this.gameStore.setScore(brickPoint);

                setTimeout(() => {
                    brick.style.visibility = 'hidden';
                }, 100);
            });

            if (brickCount.current <= 0) {
                setTimeout(() => {
                    this.gameStore.endGame(true);
                }, 500);
            }

        }

        // Check if the ball is colliding with 2 bricks at the same time
        // const collidingBricks = [];
        // for (let index = 0; index < brickRefs.current.length; index++) {
        //     const brick = brickRefs.current[index];

        //     if (brick && this.ballRef.current) {
        //         if (brick.classList.contains('brick-exit')) {
        //             continue; // Skip already destroyed bricks
        //         }

        //         const brickDims = getBrickDimensions(brick, playAreaDims);

        //         if (
        //             ballDims.rightEdge >= brickDims.leftEdge &&
        //             ballDims.leftEdge <= brickDims.rightEdge &&
        //             ballDims.bottomEdge >= brickDims.topEdge &&
        //             ballDims.topEdge <= brickDims.bottomEdge
        //         ) {
        //             collidingBricks.push({ brick, brickDims });
        //         }
        //     }
        // }

        // if (collidingBricks.length === 2) {
        //     // Determine which brick the ball went into more
        //     const [brick1, brick2] = collidingBricks;
        //     const overlap1 = Math.min(
        //         ballDims.rightEdge, brick1.brickDims.rightEdge
        //     ) - Math.max(ballDims.leftEdge, brick1.brickDims.leftEdge);
        //     const overlap2 = Math.min(
        //         ballDims.rightEdge, brick2.brickDims.rightEdge
        //     ) - Math.max(ballDims.leftEdge, brick2.brickDims.leftEdge);

        //     const primaryBrick = overlap1 > overlap2 ? brick1 : brick2;
        //     const primaryBrickDims = primaryBrick.brickDims;

        //     // Determine which edge of the primary brick the ball hit
        //     const ballFromTop = Math.abs(ballDims.bottomEdge - primaryBrickDims.topEdge);
        //     const ballFromBottom = Math.abs(ballDims.topEdge - primaryBrickDims.bottomEdge);
        //     const ballFromLeft = Math.abs(ballDims.rightEdge - primaryBrickDims.leftEdge);
        //     const ballFromRight = Math.abs(ballDims.leftEdge - primaryBrickDims.rightEdge);

        //     const minDistance = Math.min(ballFromTop, ballFromBottom, ballFromLeft, ballFromRight);

        //     if (minDistance === ballFromTop || minDistance === ballFromBottom) {
        //         this.velocity.current.y *= -1; // Reverse vertical direction
        //     } else if (minDistance === ballFromLeft || minDistance === ballFromRight) {
        //         this.velocity.current.x *= -1; // Reverse horizontal direction
        //     }

        //     // Handle brick removal for both bricks
        //     collidingBricks.forEach(({ brick }) => {
        //         brick.classList.add('brick-exit');
        //         brickCount.current -= 1;
        //         const brickPoint = parseInt(brick.dataset.score || '0', 10);
        //         this.gameStore.setScore(brickPoint);

        //         setTimeout(() => {
        //             brick.style.visibility = 'hidden';
        //         }, 100);
        //     });

        //     if (brickCount.current <= 0) {
        //         setTimeout(() => {
        //             this.gameStore.endGame(true);
        //         }, 500);
        //     }
        // }
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
     *
     * @param {PlayAreaDimensions} playAreaDims - The dimensions of the play area.
     * @param {React.RefObject<(HTMLDivElement | null)[]>} brickRefs - References to the brick DOM elements.
     * @param {object} brickCount - An object containing the current count of bricks.
     */
    moveBall(playAreaDims: PlayAreaDimensions, brickRefs: React.RefObject<(HTMLDivElement | null)[]>, brickCount: { current: number }): void {
        // Measure execution time for moveBall
        const startTime = performance.now();

        if (!this.ballRef.current || !this.paddleRef.current || !brickRefs.current) return;

        const ballDims = this.getBallDimensions();
        const paddleDims = getPaddleDimensions(this.paddleRef);

        // Handle collisions with boundaries
        const hitBottom = this.handleBallCollisionWithBoundaries(ballDims, playAreaDims);
        if (hitBottom) return; // Exit if the ball hits the bottom boundary

        // Handle collisions with paddle when the ball is near the paddle
        if (ballDims.bottomEdge >= paddleDims.topEdge - 10) {
            this.handleBallCollisionWithPaddle(ballDims);
        }

        // Handle collisions with bricks if ball is near the brick section
        const { brickSectionHeight } = getBrickAreaDimensions(playAreaDims);
        if (ballDims.topEdge <= brickSectionHeight + 10) {
            this.handleBallCollisionWithBricks(playAreaDims, ballDims, brickRefs, brickCount);
        }

        // Handle all bricks destroyed
        this.handleAllBricksDestroyed(brickCount);

        // Update ball position
        const newLeft = ballDims.leftEdge + this.velocity.current.x;
        const newTop = ballDims.topEdge + this.velocity.current.y;

        this.ballRef.current.style.left = `${newLeft}px`;
        this.ballRef.current.style.top = `${newTop}px`;



        // ...existing moveBall logic...

        const endTime = performance.now();
        // console.log(`moveBall execution time: ${endTime - startTime} ms`);
    }
}

export { setInitialBallPosition, BallHelper };