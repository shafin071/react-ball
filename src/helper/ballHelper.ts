import { Gamestate, PlayAreaDimensions, PaddleDimensions, BallDimensions, moveBallProps } from "../models/gameModels";
import { getPaddleDimensions } from './paddleHelper';
import { getBrickDimensions } from "./brickHelper";


const setInitialBallPosition = (ballRef: React.RefObject<HTMLDivElement | null>, playAreaDims: PlayAreaDimensions, paddleDims: PaddleDimensions) => {
    if (ballRef.current) {
        ballRef.current.style.left = `${(playAreaDims.width) / 2}px`; // Center horizontally
        ballRef.current.style.top = `${paddleDims.topEdge - parseFloat(ballRef.current.style.width)}px`; // 40px from bottom edge
    }
}

class BallHelper {
    private ballRef: React.RefObject<HTMLDivElement | null>;
    private paddleRef: React.RefObject<HTMLDivElement | null>;
    // private brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
    private velocity: { current: { x: number; y: number } };
    private gameStore: Gamestate;

    constructor(moveBallProps: moveBallProps) {
        this.ballRef = moveBallProps.ballRef;
        this.paddleRef = moveBallProps.paddleRef;
        // this.brickRefs = moveBallProps.brickRefs;
        this.velocity = moveBallProps.velocity;
        this.gameStore = moveBallProps.gameStore;
    }

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

    // handleBallCollisionWithBoundaries(ballDims: BallDimensions, playAreaDims: PlayAreaDimensions): void {
    //     // Check for collisions with left-right boundaries
    //     if (ballDims.leftEdge <= 0 || ballDims.rightEdge >= playAreaDims.width) {
    //         this.velocity.current.x *= -1; // Reverse horizontal direction
    //     }

    //     // Check for collisions with top boundary
    //     if (ballDims.topEdge <= 0) {
    //         this.velocity.current.y *= -1; // Reverse vertical direction
    //     }

    //     // Check for collisions with bottom boundary
    //     if (ballDims.bottomEdge >= playAreaDims.height) {
    //         console.log('Game Over! Ball hit the bottom!');
    //         this.gameStore.endGame(false); // Trigger game over state
    //         if (this.paddleRef.current) {
    //             this.paddleRef.current.style.animation = 'blinker 1s linear infinite';
    //         }
    //     }
    // }

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
            console.log('Game Over! Ball hit the bottom!');
            this.gameStore.endGame(false); // Trigger game over state
            if (this.paddleRef.current) {
                this.paddleRef.current.style.animation = 'blinker 1s linear infinite';
            }
            return true; // Indicate that the ball hit the bottom boundary
        }

        return false; // No collision with the bottom boundary
    }

    handleBallCollisionWithPaddle(ballDims: BallDimensions): void {
        // const paddleDims = getPaddleDimensions(this.paddleRef);
        // if (ballDims.bottomEdge >= paddleDims.topEdge - 10) {
        //     // Get current position
        //     let currentLeft = (ballDims.leftEdge || 0);
        //     let currentRight = (ballDims.rightEdge || 0);
        //     let currentBottom = (ballDims.bottomEdge || 0);
        //     let currentTop = (ballDims.topEdge || 0);

        //     if (
        //         this.velocity.current.y > 0 && // Ensure the ball is moving downward
        //         currentBottom >= paddleDims.topEdge &&
        //         currentTop <= paddleDims.topEdge + paddleDims.paddleHeight &&
        //         currentRight >= paddleDims.leftEdge &&
        //         currentLeft <= paddleDims.rightEdge
        //     ) {
        //         this.velocity.current.y *= -1; // Reverse vertical direction
        //         // currentTop = paddleRect.top - ballRect.height; // Position the ball on top of the paddle
        //     }
        // }

        const paddleDims = getPaddleDimensions(this.paddleRef);

        if (ballDims.bottomEdge >= paddleDims.topEdge - 10) {
            // Get current position
            let currentLeft = (ballDims.leftEdge || 0);
            let currentRight = (ballDims.rightEdge || 0);
            let currentBottom = (ballDims.bottomEdge || 0);
            let currentTop = (ballDims.topEdge || 0);

            // Check if the ball is colliding with the paddle
            if (
                this.velocity.current.y > 0 && // Ensure the ball is moving downward
                currentBottom >= paddleDims.topEdge &&
                currentTop <= paddleDims.topEdge + paddleDims.paddleHeight &&
                currentRight >= paddleDims.leftEdge &&
                currentLeft <= paddleDims.rightEdge
            ) {
                console.log('Ball collided with paddle!');
                // Reverse vertical direction
                this.velocity.current.y *= -1;

                // Calculate the paddle center and ball center
                const paddleCenter = paddleDims.leftEdge + (paddleDims.rightEdge - paddleDims.leftEdge) / 2;
                const ballCenter = currentLeft + (currentRight - currentLeft) / 2;
                console.log('paddleDims.leftEdge:', paddleDims.leftEdge, 'Paddle center:', paddleCenter, ' paddleDims.rightEdge:', paddleDims.rightEdge, ' Ball center:', ballCenter);

                // Adjust horizontal velocity based on where the ball hits the paddle
                // if (ballCenter < paddleCenter && currentRight >= paddleDims.leftEdge) {
                if (ballCenter >= paddleDims.leftEdge && ballCenter < (paddleCenter - (paddleDims.width/6))) {
                    // Ball hits the left side of the paddle
                    if (Math.abs(this.velocity.current.x) > 0) {
                        this.velocity.current.x = Math.abs(this.velocity.current.x) * -1; // Reverse direction
                    } else {
                        this.velocity.current.x = -3; // Move left
                    }
                    // this.velocity.current.x = Math.abs(this.velocity.current.x) * -1; // Move left
                    console.log('Ball hits the left side of the paddle!', this.velocity.current.x);

                // } else if (ballCenter > paddleCenter && currentLeft <= paddleDims.rightEdge) {
                } else if (ballCenter <= paddleDims.rightEdge && ballCenter > (paddleCenter + (paddleDims.width/6))) {
                    // Ball hits the right side of the paddle
                    if (Math.abs(this.velocity.current.x) > 0) {
                        this.velocity.current.x = Math.abs(this.velocity.current.x) * 1; // Reverse direction
                    } else {
                        this.velocity.current.x = 3; // Move right

                        // this.velocity.current.x = Math.abs(this.velocity.current.x); // Move right
                        console.log('Ball hits the right side of the paddle!', this.velocity.current.x);
                    }

                } else {
                    // Ball hits the center of the paddle
                    this.velocity.current.x = 0; // Move straight up
                    console.log('Ball hits the center of the paddle!', this.velocity.current.x);
                }
            }
        }

    }

    handleBallCollisionWithBricks(playAreaDims: PlayAreaDimensions, ballDims: BallDimensions, brickRefs: React.RefObject<(HTMLDivElement | null)[]>, brickCount: { current: number }): void {
        for (let index = 0; index < brickRefs.current.length; index++) {
            const brick = brickRefs.current[index];

            if (brick && this.ballRef.current) {
                // Check if the brick already has the 'brick-exit' class
                if (brick.classList.contains('brick-exit')) {
                    continue; // Skip this brick if it already has the 'brick-exit' class
                }

                const brickDims = getBrickDimensions(brick, playAreaDims);
                if (
                    ballDims.rightEdge >= brickDims.leftEdge &&
                    ballDims.leftEdge <= brickDims.rightEdge &&
                    ballDims.bottomEdge >= brickDims.topEdge &&
                    ballDims.topEdge <= brickDims.bottomEdge
                ) {
                    // Collision detected. Find which side of the brick the ball hit
                    const ballFromTop = Math.abs(ballDims.bottomEdge - brickDims.topEdge);
                    const ballFromBottom = Math.abs(ballDims.topEdge - brickDims.bottomEdge);
                    const ballFromLeft = Math.abs(ballDims.rightEdge - brickDims.leftEdge);
                    const ballFromRight = Math.abs(ballDims.leftEdge - brickDims.rightEdge);

                    const minDistance = Math.min(ballFromTop, ballFromBottom, ballFromLeft, ballFromRight);

                    if (minDistance === ballFromTop || minDistance === ballFromBottom) {
                        this.velocity.current.y *= -1; // Reverse vertical direction
                    } else {
                        this.velocity.current.x *= -1; // Reverse horizontal direction
                    }

                    // Handle brick removal
                    brick.classList.add('brick-exit');
                    brickCount.current -= 1;
                    const brickPoint = parseInt(brick.dataset.score || '0', 10);
                    this.gameStore.setScore(brickPoint);

                    setTimeout(() => {
                        brick.style.visibility = 'hidden';
                    }, 200);

                    if (brickCount.current <= 0) {
                        console.log("Game won!");
                        setTimeout(() => {
                            this.gameStore.endGame(true);
                        }, 500);
                    }
                    break;
                }
            }

        }
    }

    handleAllBricksDestroyed(brickCount: { current: number }): void {
        // Gradually slow down the ball at intervals if all bricks are destroyed
        if (brickCount.current <= 0) {
            const slowDownInterval = setInterval(() => {
                console.log('slowing down the ball!');
                this.velocity.current.x *= 0.9;
                this.velocity.current.y *= 0.9;

                // Stop slowing down when velocity is very small
                if (Math.abs(this.velocity.current.x) < 0.1 && Math.abs(this.velocity.current.y) < 0.1) {
                    clearInterval(slowDownInterval); // Stop the interval
                }
            }, 100);
        }
    }

    moveBall(playAreaDims: PlayAreaDimensions, brickRefs: React.RefObject<(HTMLDivElement | null)[]>, brickCount: { current: number }): void {
        if (!this.ballRef.current || !this.paddleRef.current || !brickRefs.current) return;

        const ballDims = this.getBallDimensions();

        // Handle collisions with boundaries
        // this.handleBallCollisionWithBoundaries(ballDims, playAreaDims);

        // Handle collisions with boundaries
        const hitBottom = this.handleBallCollisionWithBoundaries(ballDims, playAreaDims);
        if (hitBottom) return; // Exit if the ball hits the bottom boundary

        // Handle collisions with paddle
        this.handleBallCollisionWithPaddle(ballDims);

        // Handle collisions with bricks
        this.handleBallCollisionWithBricks(playAreaDims, ballDims, brickRefs, brickCount);

        // Handle all bricks destroyed
        this.handleAllBricksDestroyed(brickCount);

        // Update ball position
        const newLeft = ballDims.leftEdge + this.velocity.current.x;
        const newTop = ballDims.topEdge + this.velocity.current.y;

        this.ballRef.current.style.left = `${newLeft}px`;
        this.ballRef.current.style.top = `${newTop}px`;
    }
}

export { setInitialBallPosition, BallHelper };