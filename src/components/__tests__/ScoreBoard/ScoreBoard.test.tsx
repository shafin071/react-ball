import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import './setupMocks';
import ScoreBoard from '../../ScoreBoard';
import { useGameStore } from '../../../store/gameStore';
import { Gamestate } from '../../../models/gameModels';


describe('ScoreBoard Component', () => {
    let mockGameStore: Gamestate;

    beforeEach(() => {
        // Mock gameStore
        mockGameStore = {
            score: 0,
            gameStarted: false,
            gameWon: false,
            gameLost: false,
            startGame: jest.fn(() => { }),
            resetGame: jest.fn(() => { }),
            endGame: jest.fn(),
            setScore: jest.fn(),
        } as Gamestate;

        jest.clearAllMocks();
    });

    it('should display the current score', () => {
        // Set the score in the mocked game store
        mockGameStore.score = 50;
        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);

        render(<ScoreBoard />);

        // Verify that the current score is displayed
        expect(screen.getByText(`${mockGameStore.score}`)).toBeInTheDocument();
    });

    it('should continue to display score when the game is lost', () => {
        // Set gameLost to true
        mockGameStore.gameLost = true;
        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);

        render(<ScoreBoard />);

        // Verify that the current score is displayed
        expect(screen.getByText(`${mockGameStore.score}`)).toBeInTheDocument();
    });

    it('should continue to display score when the game is won', () => {
        // Set gameWon to true
        mockGameStore.gameWon = true;
        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);

        render(<ScoreBoard />);

        // Verify that the current score is displayed
        expect(screen.getByText(`${mockGameStore.score}`)).toBeInTheDocument();
    });
});