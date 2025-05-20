import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Paddle from './Paddle'
import Ball from './Ball'
import Bricks from './Bricks';
import ScoreBoard from './ScoreBoard';
import Confetti from './Confetti';
import { useGameStore } from '../store/gameStore';
import GameRules from './GameRules';


const PlayArea: React.FC = () => {
    const playAreaRef = useRef<HTMLDivElement>(null);
    const gameRulesRef = useRef<HTMLDialogElement | null>(null);
    const paddleRef = useRef<HTMLDivElement>(null);
    const ballRef = useRef<HTMLDivElement>(null);
    const brickRefs = useRef<(HTMLDivElement | null)[]>([]);
    const gameStore = useGameStore();

    // const handleShowGameRules = () => {
    //     if (gameRulesRef.current) {
    //         gameRulesRef.current.showModal();
    //     }
    // }

    const handleStartGame = () => {
        gameStore.startGame();
    }

    const handleResetGame = () => {
        gameStore.resetGame();
    }

    return (
        <div className="play-area-container">
            <ScoreBoard />
            <div id="confetti-container"></div>
            <div className='play-area' ref={playAreaRef}>
                <div id='modal'></div>
                {!gameStore.gameStarted && (
                    <div className="game-intro">
                        <button className="btn btn-primary game-btn start-game-btn" onClick={handleStartGame}>
                            Start Game
                        </button>
                        <GameRules />
                    </div>
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
                            <button className="btn btn-primary game-btn" onClick={handleResetGame}>
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
                                <button className="btn btn-primary game-btn" onClick={handleResetGame}>
                                    Play again
                                </button>
                            </motion.div>
                        </div>

                    </div>

                )}
                {(gameStore.gameStarted && !gameStore.gameWon) && (
                    <>
                        <Bricks playAreaRef={playAreaRef} brickRefs={brickRefs} />
                        <Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />
                        <Ball playAreaRef={playAreaRef} paddleRef={paddleRef} ballRef={ballRef} brickRefs={brickRefs} />
                    </>
                )}
            </div>
        </div>
    )
}


export default PlayArea;