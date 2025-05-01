import { create } from 'zustand';
import { Gamestate } from '../models/gameModels';


export const useGameStore = create<Gamestate>((set) => ({
    score: 0,
    gameStarted: false,
    gameWon: false,
    gameLost: false,
    startGame: () => set({ gameStarted: true, gameLost: false, gameWon: false, score: 0 }),
    setScore: (brickPoint: number) => set((state) => ({ score: state.score + brickPoint })),
    endGame: (win: boolean) => set({ gameLost: !win, gameWon: win }),
    resetGame: () => set({ gameStarted: false, gameLost: false, gameWon: false, score: 0 }),
}));

