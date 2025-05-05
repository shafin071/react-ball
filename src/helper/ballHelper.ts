import { Gamestate, PlayAreaDimensions, PaddleDimensions, BallDimensions, moveBallProps } from "../models/gameModels";
import { getPaddleDimensions } from './paddleHelper';
import { getBrickAreaDimensions, getBrickDimensions } from "./brickHelper";


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
            currentTop <= paddleDims.topEdge + paddleDims.paddleHeight &&
            currentRight >= paddleDims.leftEdge &&
            currentLeft <= paddleDims.rightEdge
        ) {
            // Reverse vertical direction
            this.velocity.current.y *= -1;

            // Calculate the paddle center and ball center
            const paddleCenter = paddleDims.leftEdge + (paddleDims.rightEdge - paddleDims.leftEdge) / 2;
            const ballCenter = currentLeft + (currentRight - currentLeft) / 2;
            console.log('paddleDims.leftEdge:', paddleDims.leftEdge, 'Paddle center:', paddleCenter, ' paddleDims.rightEdge:', paddleDims.rightEdge, ' Ball center:', ballCenter);

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

            console.log('A:', A, ' B:', B, ' C:', C, ' D:', D, ' E:', E, ' F:', F, ' currentLeft:', currentLeft, ' currentRight:', currentRight, ' ballCenter:', ballCenter);

            if (currentRight >= A && ballCenter <= B) {
                // Ball hit Left Zone 1
                console.log('Ball hit Left Zone 1');
                this.velocity.current.x = -3;
            }
            else if (ballCenter > B && ballCenter <= C) {
                // Ball hit Left Zone 2
                console.log('Ball hit Left Zone 2');
                this.velocity.current.x = -2;
            }
            else if (ballCenter > C && ballCenter <= D) {
                // Ball hit Center Zone
                console.log('Ball hit Center Zone');
                this.velocity.current.x = 0;
            }
            else if (ballCenter > D && ballCenter <= E) {
                // Ball hit Right Zone 2
                console.log('Ball hit Right Zone 2');
                this.velocity.current.x = 2;
            }
            else if (ballCenter > E && currentLeft <= F) {
                // Ball hit Right Zone 1
                console.log('Ball hit Right Zone 1');
                this.velocity.current.x = 3;
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
    }
}

export { setInitialBallPosition, BallHelper };