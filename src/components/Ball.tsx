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
    const velocity = useRef({ x: 4, y: 4 }); // Ball's velocity (speed and direction)
    const gameStore = useGameStore();
    const brickCount = useRef(0);

    const playAreaDims = getPlayAreaDimensions(playAreaRef);

    // Dynamically update brickCount when brickRefs.current changes
    useEffect(() => {
        if (brickRefs.current) {
            brickCount.current = brickRefs.current.filter((brick) => brick !== null).length;
        }
    }, [brickRefs.current]);

    useEffect(() => {
        let animationFrameId: number;

        const moveBallAnimation = () => {
            if (gameStore.gameLost) {
                cancelAnimationFrame(animationFrameId);
                return; // Exit the animation loop if the game is over
            }

            if (!ballRef.current || !paddleRef.current || !brickRefs.current) return;

            const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
            const ballHelper = new BallHelper(moveBallProps);
            ballHelper.moveBall(playAreaDims, brickRefs, brickCount);

            // Schedule the next frame
            animationFrameId = requestAnimationFrame(moveBallAnimation);
        };

        // Initialize ball position
        if (gameStore.gameLost) {
            return;
        } // Don't set initial position if the game is lost. ball position will be initialized when the game restarts.
        const paddleDims = getPaddleDimensions(paddleRef);
        setInitialBallPosition(ballRef, playAreaDims, paddleDims);

        // Start the animation
        animationFrameId = requestAnimationFrame(moveBallAnimation);

        // Cleanup on component unmount
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameStore.gameLost]);

    const ballStyle: React.CSSProperties = {
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius: '50%',
        backgroundColor: '#6063d0',
        position: 'absolute',
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