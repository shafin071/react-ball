import React, { useEffect, useRef } from 'react';
import { getPlayAreaDimensions } from '../helper/playAreaHelper';
import { getPaddleDimensions } from '../helper/paddleHelper';
import {setInitialBallPosition, BallHelper} from '../helper/ballHelper';
// import {setInitialBallPosition, moveBall} from '../helper/ballHelper';
import { moveBallProps } from '../models/gameModels';
import { useGameStore } from '../store/gameStore';


interface BallProps {
    paddleRef: React.RefObject<HTMLDivElement | null>;
    playAreaRef: React.RefObject<HTMLDivElement | null>;
    brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

const Ball: React.FC<BallProps> = ({ playAreaRef, paddleRef, brickRefs }) => {
    const ballRef = useRef<HTMLDivElement>(null);
    const diameter = 15; // Width of the ball
    const velocity = useRef({ x: 3, y: 3 }); // Ball's velocity (speed and direction)
    const gameStore = useGameStore();
    const gameLost = useGameStore((state) => state.gameLost);
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
            if (gameLost) {
                cancelAnimationFrame(animationFrameId);
                return; // Exit the animation loop if the game is over
            }

            if (!ballRef.current || !paddleRef.current || !brickRefs.current) return;
            
            // console.log('brickRefs.current in Ball:', brickRefs.current);
            const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore};
            const ballHelper = new BallHelper(moveBallProps);
            ballHelper.moveBall(playAreaDims, brickRefs, brickCount);
            // moveBall(moveBallProps); // Move the ball and check for collisions

            // Schedule the next frame
            animationFrameId = requestAnimationFrame(moveBallAnimation);
        };

        // Initialize ball position
        if(gameLost) return; // Don't set initial position if the game is lost. ball position will be initialized when the game restarts.
        const paddleDims = getPaddleDimensions(paddleRef);
        setInitialBallPosition(ballRef, playAreaDims, paddleDims);

        // Start the animation
        animationFrameId = requestAnimationFrame(moveBallAnimation);

        // Cleanup on component unmount
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameLost]);

    const ballStyle: React.CSSProperties = {
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius: '50%',
        backgroundColor: 'red',
        position: 'absolute',
    };

    return <div ref={ballRef} style={ballStyle}></div>;
};

export default Ball;