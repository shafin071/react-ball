import React, { useEffect, useRef } from 'react';
import { getPlayAreaDimensions } from '../helper/playAreaHelper';
import { getPaddleDimensions } from '../helper/paddleHelper';
import { setInitialBallPosition, BallHelper } from '../helper/ballHelper';
// import {setInitialBallPosition, moveBall} from '../helper/ballHelper';
import { moveBallProps } from '../models/gameModels';
import { useGameStore } from '../store/gameStore';


interface BallProps {
    paddleRef: React.RefObject<HTMLDivElement | null>;
    ballRef: React.RefObject<HTMLDivElement | null>;
    playAreaRef: React.RefObject<HTMLDivElement | null>;
    brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

const Ball: React.FC<BallProps> = ({ playAreaRef, paddleRef, ballRef, brickRefs }) => {
    // const ballRef = useRef<HTMLDivElement>(null);
    const diameter = 15; // Width of the ball
    const velocity = useRef({ x: 4, y: 4 }); // Ball's velocity (speed and direction)
    const gameStore = useGameStore();
    // const gameLost = useGameStore((state) => state.gameLost);
    const brickCount = useRef(0);

    const playAreaDims = getPlayAreaDimensions(playAreaRef);
    // console.log('playAreaDims in Ball:', playAreaDims);
    // console.log('gameLost in Ball:', gameStore.gameLost);

    // Dynamically update brickCount when brickRefs.current changes
    useEffect(() => {
        if (brickRefs.current) {
            brickCount.current = brickRefs.current.filter((brick) => brick !== null).length;
        }
    }, [brickRefs.current]);

    useEffect(() => {
        // console.log('in ball useEffect')
        let animationFrameId: number;

        const moveBallAnimation = () => {
            // console.log('in moveBallAnimation');
            if (gameStore.gameLost) {
                // console.log('game lost... canceling animation frame');
                cancelAnimationFrame(animationFrameId);
                return; // Exit the animation loop if the game is over
            }

            if (!ballRef.current || !paddleRef.current || !brickRefs.current) return;

            // console.log('brickRefs.current in Ball:', brickRefs.current);
            const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
            const ballHelper = new BallHelper(moveBallProps);
            ballHelper.moveBall(playAreaDims, brickRefs, brickCount);
            // moveBall(moveBallProps); // Move the ball and check for collisions

            // Schedule the next frame
            animationFrameId = requestAnimationFrame(moveBallAnimation);
            // console.log('animationFrameId in Ball:', animationFrameId);
        };

        // Initialize ball position
        // console.log('gameLost in Ball useEffect:', gameLost);
        if (gameStore.gameLost) {
            // console.log('if gamelost if loop:', gameStore.gameLost);
            return;
        } // Don't set initial position if the game is lost. ball position will be initialized when the game restarts.
        const paddleDims = getPaddleDimensions(paddleRef);
        // console.log('paddleDims in Ball:', paddleDims);
        setInitialBallPosition(ballRef, playAreaDims, paddleDims);

        // Start the animation
        animationFrameId = requestAnimationFrame(moveBallAnimation);

        // Cleanup on component unmount
        return () => {
            // console.log('Cleaning up animation frame in Ball', animationFrameId);
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

    // console.log('ballRef in Ball:', ballRef.current);

    return (
        <div
            ref={ballRef}
            style={ballStyle}
            data-testid="ball" // for testing purposes
        ></div>
    );
};

export default Ball;