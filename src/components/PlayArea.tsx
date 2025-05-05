import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Paddle from './Paddle'
import Ball from './Ball'
import Bricks from './Bricks';
import ScoreBoard from './ScoreBoard';
import Confetti from './Confetti';
import { useGameStore } from '../store/gameStore';


const PlayArea: React.FC = () => {
    const playAreaRef = useRef<HTMLDivElement>(null);
    const paddleRef = useRef<HTMLDivElement>(null);
    const brickRefs = useRef<(HTMLDivElement | null)[]>([]);
    const gameStore = useGameStore();

    // console.log('PlayArea component rendered!', gameStore);

    return (
        <>
            <ScoreBoard />
            <div id="confetti-container"></div>
            <div className='play-area' ref={playAreaRef}>
                {!gameStore.gameStarted && (
                    <button className="btn btn-primary start-game-btn" onClick={() => gameStore.startGame()}>
                        Start Game
                    </button>
                )}
                {gameStore.gameLost && (
                    <div className="game-over-message-div">
                        <motion.div className="game-over-message"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.4,
                                scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                            }}>
                            <h2>Game Over!</h2>
                            <button className="btn btn-primary" onClick={() => gameStore.resetGame()}>
                                Try again
                            </button>
                        </motion.div>
                    </div>

                )}
                {gameStore.gameWon && (
                    <div>
                        <Confetti playAreaRef={playAreaRef} />
                        <div className="game-won-message-div">
                            <motion.div className="game-won-message"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.4,
                                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                                }}>
                                <h2>You Won!</h2>
                                <button className="btn btn-primary" onClick={() => gameStore.resetGame()}>
                                    Play again
                                </button>
                            </motion.div>
                        </div>

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