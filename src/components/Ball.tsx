import React, { useEffect, useRef } from 'react';
import { getPlayAreaDimensions } from '../helper/playAreaHelper';
import { getPaddleDimensions } from '../helper/paddleHelper';
import { setInitialBallPosition, BallHelper } from '../helper/ballHelper';
import { moveBallProps } from '../models/gameModels';
import { useGameStore } from '../store/gameStore';


interface BallProps {
    paddleRef: React.RefObject<HTMLDivElement | null>;
    ballRef: React.RefObject<HTMLDivElement | null>;
    playAreaRef: React.RefObject<HTMLDivElement | null>;
    brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

const Ball: React.FC<BallProps> = ({ playAreaRef, paddleRef, ballRef, brickRefs }) => {
    const diameter = 15; // Width of the ball
    const velocity = useRef({ x: 6, y: 6 }); // Ball's velocity (speed and direction)
    const gameStore = useGameStore();
    const brickCount = useRef(0);

    const playAreaDims = getPlayAreaDimensions(playAreaRef);

    const intervalRef = useRef<number | null>(null); // Persist intervalId across renders

    // Reset intervalRef to null every time Ball mounts
    intervalRef.current = null;

    // Dynamically update brickCount when brickRefs.current changes
    useEffect(() => {
        if (brickRefs.current) {
            brickCount.current = brickRefs.current.filter((brick) => brick !== null).length;
        }
    }, [brickRefs.current]);

    useEffect(() => {
        // console.log('in ball useEffect')
        let animationFrameId: number;
        let frameCount = 0; // Counter for requestAnimationFrame calls

        const moveBallAnimation = () => {
            frameCount++; // Increment the counter on each call
            // console.log('in moveBallAnimation');
            if (gameStore.gameLost) {
                // console.log('game lost... canceling animation frame');
                cancelAnimationFrame(animationFrameId);
                return; // Exit the animation loop if the game is over
            }

            if (!ballRef.current || !paddleRef.current || !brickRefs.current) return;

            const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
            const ballHelper = new BallHelper(moveBallProps);
            ballHelper.moveBall(playAreaDims, brickRefs, brickCount);

            // Schedule the next frame
            animationFrameId = requestAnimationFrame(moveBallAnimation);
            // console.log('animationFrameId in Ball:', animationFrameId);
        };

        // Log the frame count every second
        intervalRef.current = window.setInterval(() => {
            // console.log(`requestAnimationFrame called ${frameCount} times in the last second`);
            frameCount = 0; // Reset the counter
        }, 1000);
        console.log('intervalRef.current in Ball:', intervalRef.current);

        // Initialize ball position
        if (gameStore.gameLost) {
            // console.log('if gamelost if loop:', gameStore.gameLost);
            return;
        } // Don't set initial position if the game is lost. ball position will be initialized when the game restarts.
        const paddleDims = getPaddleDimensions(paddleRef);
        setInitialBallPosition(ballRef, playAreaDims, paddleDims);

        // Start the animation
        animationFrameId = requestAnimationFrame(moveBallAnimation);

        // Cleanup on component unmount
        return () => {
            console.log('Cleaning up animation frame in Ball', animationFrameId);
            cancelAnimationFrame(animationFrameId);
            console.log('Cleaning up intervalRef.current in Ball', intervalRef.current);
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current); // Clear the interval
            }
        };
    }, [gameStore.gameLost]);

    const ballStyle: React.CSSProperties = {
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius: '50%',
        backgroundColor: '#6063d0',
        position: 'absolute',
        // transform: `translate(${velocity.current.x}px, ${velocity.current.y}px)`, 
    };

    return (
        <div
            ref={ballRef}
            style={ballStyle}
            data-testid="ball" // for testing purposes
        ></div>
    );
};

export default Ball;