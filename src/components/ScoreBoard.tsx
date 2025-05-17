import React from "react";
import { useGameStore } from '../store/gameStore';


const ScoreBoard: React.FC = () => {
    const gameStore = useGameStore();

    return (
        <div className="score-board" data-testid="score-board">
            <span>Score:</span>
            <span>{gameStore.score}</span>
        </div>
    )
}


export default ScoreBoard;