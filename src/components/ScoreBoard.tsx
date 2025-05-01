import React from "react";
import { useGameStore } from '../store/gameStore';



// interface ScoreBoardProps {
//     playAreaRef: React.RefObject<HTMLDivElement | null>;
// }


const ScoreBoard: React.FC = () => {
    const gameStore = useGameStore();
    // console.log('ScoreBoard component rendered!', gameStore.score);

    return (
        <div className="score-board">
            <span>Score:</span>
            <span>{gameStore.score}</span>
        </div>
    )
}


export default ScoreBoard;