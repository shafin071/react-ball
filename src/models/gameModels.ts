import { RefObject } from "react";

type Gamestate = {
    score: number;
    gameStarted: boolean;
    gameWon: boolean;
    gameLost: boolean;
    startGame: () => void;
    setScore: (score: number) => void;
    endGame: (win: boolean) => void;
    resetGame: () => void;
}

type PlayAreaDimensions = {
    leftEdge: number;
    rightEdge: number;
    topEdge: number;
    bottomEdge: number;
    width: number;
    height: number;
}

type PaddleDimensions = {
    width: number,
    leftEdge: number,
    rightEdge: number,
    paddleHeight: number,
    topEdge: number;
}

type BallDimensions = {
    width: number,
    leftEdge: number,
    rightEdge: number,
    topEdge: number;
    bottomEdge: number;
}

type BrickDimensions = {
    leftEdge: number;
    rightEdge: number;
    topEdge: number;
    bottomEdge: number;
}


type moveBallProps = {
    ballRef: React.RefObject<HTMLDivElement | null>;
    paddleRef: React.RefObject<HTMLDivElement | null>;
    brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
    brickCount: RefObject<number>;
    playAreaDims: PlayAreaDimensions;
    velocity: React.RefObject<{ x: number; y: number }>;
    // triggerScoreChange: (score: number) => void; // Function to update score
    // triggerEndGame: (win: boolean) => void; // Function to update game over state
    gameStore: Gamestate; // Game state management
}

export type { Gamestate, PlayAreaDimensions, PaddleDimensions, BallDimensions, BrickDimensions, moveBallProps };