import React, { useEffect, useRef } from 'react';
import { getPlayAreaDimensions } from '../helper/playAreaHelper';
// import './Bricks.css'; // Ensure you have a CSS file for styling

interface BricksProps {
    playAreaRef: React.RefObject<HTMLDivElement | null>;
    brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

export default function Bricks({ playAreaRef, brickRefs }: BricksProps) {


    const brickWidth = 60; // Width of each brick (px)
    const brickHeight = 30; // Height of each brick (px)


    const playAreaDims = getPlayAreaDimensions(playAreaRef);
    const brickSectionHeight = playAreaDims.height / 6 // 3
    const brickSectionWidth = playAreaDims.width

    let rows = Math.floor(brickSectionHeight / (brickHeight + 5));
    let bricksPerRow = Math.floor(brickSectionWidth / (brickWidth + 5));

    // const rows = 1; // Number of rows
    // const bricksPerRow = 1; // Number of bricks per row

    // let rows = 1;
    // let bricksPerRow = 1;
    // console.log('playAreaDims.height: ', playAreaDims.height, 'no. of rows:', rows, 'playAreaDims.width: ', playAreaDims.width, 'bricksPerRow:', bricksPerRow);

    // const brickRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Initialize refs array
    // useEffect(() => {
    //     // console.log('brickRefs in useEffect:', brickRefs.current);
    //     brickRefs.current = Array(rows * bricksPerRow)
    //         .fill(null)
    //         .map((_, index) => brickRefs.current[index] || null);
    //     // console.log('brickRefs in useEffect after loop:', brickRefs.current);
    // }, [rows, bricksPerRow]);

    const brickStyle: React.CSSProperties = {
        width: `${brickWidth}px`,
        height: `${brickHeight}px`,
        backgroundColor: '#ff5733',
        border: '1px solid #d35400',
        borderRadius: '4px',
        fontSize: '20px',
        fontWeight: 'bold'
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
                            > {brickKey}</div>
                        )
                    })}
                </div>
            ))}
        </div>
    );
}