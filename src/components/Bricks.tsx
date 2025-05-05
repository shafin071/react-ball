import React from 'react';
import { getPlayAreaDimensions } from '../helper/playAreaHelper';
import { getBrickAreaDimensions } from '../helper/brickHelper';
// import './Bricks.css'; // Ensure you have a CSS file for styling

interface BricksProps {
    playAreaRef: React.RefObject<HTMLDivElement | null>;
    brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

export default function Bricks({ playAreaRef, brickRefs }: BricksProps) {

    const brickWidth = 60; // Width of each brick (px)
    const brickHeight = 30; // Height of each brick (px)

    const playAreaDims = getPlayAreaDimensions(playAreaRef);
    const { brickSectionHeight, brickSectionWidth } = getBrickAreaDimensions(playAreaDims);

    let rows = Math.floor(brickSectionHeight / (brickHeight + 5));
    let bricksPerRow = Math.floor(brickSectionWidth / (brickWidth + 5));

    // const rows = 1; // Number of rows
    // const bricksPerRow = 1; // Number of bricks per row
    // console.log('playAreaDims.height: ', playAreaDims.height, 'no. of rows:', rows, 'playAreaDims.width: ', playAreaDims.width, 'bricksPerRow:', bricksPerRow);

    const brickStyle: React.CSSProperties = {
        width: `${brickWidth}px`,
        height: `${brickHeight}px`,
        backgroundColor: '#ff5733',
        background: `
        linear-gradient(to right, #ff7f50, #ff4500, #ff7f50), /* Horizontal gradient */
        linear-gradient(to bottom, #ff7f50, #ff4500, #ff7f50) /* Vertical gradient */
        `,
        border: '1px solid #d35400',
        borderRadius: '4px',
        fontSize: '20px',
        fontWeight: 'bold',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // Add a shadow for depth
    };

    return (
        <div className="brick-container">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div className="brick-row" key={rowIndex}>
                    {Array.from({ length: bricksPerRow }).map((_, brickIndex) => {
                        const brickKey = rowIndex * bricksPerRow + brickIndex;
                        return (
                            <div
                                className="brick"
                                style={brickStyle}
                                key={brickIndex}
                                ref={(el) => {
                                    if (el) {
                                        brickRefs.current[brickKey] = el;
                                        el.dataset.score = '10';
                                    }
                                }}
                                id={brickKey.toString()}
                            ></div>
                        )
                    })}
                </div>
            ))}
        </div>
    );
}