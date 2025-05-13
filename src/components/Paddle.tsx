import React, { useEffect, useRef } from 'react';
import { getPlayAreaDimensions } from '../helper/playAreaHelper';
import { setInitialPaddlePosition, movePaddle } from '../helper/paddleHelper';


interface PaddleProps {
    paddleRef: React.RefObject<HTMLDivElement | null>;
    playAreaRef: React.RefObject<HTMLDivElement | null>;
}


const Paddle: React.FC<PaddleProps> = ({ playAreaRef, paddleRef }) => {

    const paddleWidth = 100; // Width of the paddle
    const paddleHeight = 10; // Height of the paddle
    const paddleSpeed = 60; // Speed of paddle movement

    const playAreaDims = getPlayAreaDimensions(playAreaRef);

    // console.log('Paddle component rendered!', playAreaDims);

    useEffect(() => {

        let animationFrameId: number | null = null;

        // Handle keyboard input for paddle movement
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!paddleRef.current) return;

            const paddle = paddleRef.current;
            const currentLeft = parseInt(paddle.style.left || '0', 10);

            if (event.key === 'ArrowLeft') {
                const newLeft = Math.max(0, currentLeft - paddleSpeed);
                // If there is an ongoing animation frame (stored in animationFrameId), it is canceled to prevent overlapping or redundant animations.
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(() => {
                    movePaddle(paddleRef, newLeft)
                    return
                });

            } else if (event.key === 'ArrowRight') {
                const newLeft = Math.min(playAreaDims.width - paddleWidth, currentLeft + paddleSpeed);
                // If there is an ongoing animation frame (stored in animationFrameId), it is canceled to prevent overlapping or redundant animations.
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(() => movePaddle(paddleRef, newLeft));
            }
        };

        // Handle mouse movement
        const handleMouseMove = (event: MouseEvent) => {
            if (!paddleRef.current || !playAreaRef.current) return;

            const mouseX = event.clientX - playAreaDims.leftEdge; // Mouse position relative to the play area
            const newLeft = Math.min(
                Math.max(0, mouseX - paddleWidth / 2), // Center the paddle on the mouse
                playAreaDims.width - paddleWidth // Ensure the paddle stays within bounds
            );

            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => movePaddle(paddleRef, newLeft));
        };

        // Add event listener for keydown
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup event listener on component unmount
        return () => {
            console.log('Cleaning up event listeners!');
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            console.log('Animation frame canceled:', animationFrameId);
        };
    }, []);

    // Set initial position of the paddle
    useEffect(() => {
        setInitialPaddlePosition(paddleRef, paddleWidth, playAreaDims);
    }, []);

    const paddleStyle: React.CSSProperties = {
        width: `${paddleWidth}px`,
        height: `${paddleHeight}px`,
        position: 'absolute',
        backgroundColor: 'black',
        borderRadius: '10px',
        transition: 'left 0.1s linear', // Smooth transition for left property
    };

    return (
        <div
            ref={paddleRef}
            className="paddle"
            style={paddleStyle}
            data-testid="paddle" // for testing purposes
        ></div>
    );

};

export default Paddle;