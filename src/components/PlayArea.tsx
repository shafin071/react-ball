import React, { useLayoutEffect, useRef, useState } from 'react';
import Paddle from './Paddle'
import Ball from './Ball'
import Bricks from './Bricks';
import ScoreBoard from './ScoreBoard';
import { useGameStore } from '../store/gameStore';


const PlayArea: React.FC = () => {
    const playAreaRef = useRef<HTMLDivElement>(null);
    const paddleRef = useRef<HTMLDivElement>(null);
    const brickRefs = useRef<(HTMLDivElement | null)[]>([]);
    const gameStore = useGameStore();

    // console.log('PlayArea component rendered!', gameStore);

    return (
        <>
            <ScoreBoard/>
            <div className='play-area' ref={playAreaRef}>
                {!gameStore.gameStarted && (
                    <button className="btn btn-primary start-game-btn" onClick={() => gameStore.startGame()}>
                        Start Game
                    </button>
                )}
                {gameStore.gameLost && (
                    <div className="game-over-message">
                        <h2>Game Over!</h2>
                        <button className="btn btn-primary" onClick={() => gameStore.resetGame()}>
                            Try again
                        </button>
                    </div>
                )}
                {gameStore.gameWon && (
                    <div className="game-won-message">
                        <h2>You Won!</h2>
                        <button className="btn btn-primary" onClick={() => gameStore.resetGame()}>
                            Play again
                        </button>
                    </div>
                )}
                {(gameStore.gameStarted && !gameStore.gameWon) && (
                    <>
                        <Bricks playAreaRef={playAreaRef} brickRefs={brickRefs} />
                        <Ball playAreaRef={playAreaRef} paddleRef={paddleRef} brickRefs={brickRefs} />
                        <Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />
                    </>
                )}
            </div>
        </>

    )
}


export default PlayArea;