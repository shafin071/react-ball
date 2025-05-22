import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import './setupMocks';
import PlayArea from '../../PlayArea';
import { useGameStore } from '../../../store/gameStore';
import { Gamestate } from '../../../models/gameModels';
import { getPlayAreaDimensions } from '../../../helper/playAreaHelper';


describe('PlayArea Component', () => {
    let mockGameStore: Gamestate;

    // Mock play area dimensions
    const mockPlayAreaDims = {
        leftEdge: 600,
        rightEdge: 1400,
        topEdge: 100,
        bottomEdge: 700,
        width: 800,
        height: 600,
    }

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

        // Mock play area dimensions
        (getPlayAreaDimensions as jest.Mock).mockReturnValue({ ...mockPlayAreaDims });

        jest.clearAllMocks();
    });

    it('should render the start game and game rules buttons when game has not started', () => {
        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);
        render(<PlayArea />);

        // Verify that the score board and start game button are rendered and the game components are not rendered
        const scoreBoard = screen.getByTestId('score-board');
        expect(scoreBoard).toBeInTheDocument();

        const scoreElement = within(scoreBoard).getByText(`${mockGameStore.score}`);
        expect(scoreElement).toBeInTheDocument();

        const startButton = screen.getByText('Start Game');
        expect(startButton).toBeInTheDocument();

        const gameRulesButton = screen.getByTestId('game-rules-btn');
        expect(gameRulesButton).toBeInTheDocument();

        expect(screen.queryByTestId('brick')).toBeNull();
        expect(screen.queryByTestId('ball')).toBeNull();
        expect(screen.queryByTestId('paddle')).toBeNull();

        // Simulate clicking the start game button
        fireEvent.click(startButton);
        expect(mockGameStore.startGame).toHaveBeenCalled();
    });

    it('should render the game over message and current score when the game is lost', () => {
        // Set gameLost to true
        mockGameStore.gameLost = true;
        mockGameStore.score = 100;
        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);

        render(<PlayArea />);

        // Verify that the game over message is rendered
        const gameOverMessage = screen.getByText('Game Over!');
        expect(gameOverMessage).toBeInTheDocument();

        // Verify that the current score is displayed
        const scoreBoard = screen.getByTestId('score-board');
        expect(scoreBoard).toBeInTheDocument();
        const scoreElement = within(scoreBoard).getByText(`${mockGameStore.score}`);
        expect(scoreElement).toBeInTheDocument();

        // Verify that the try again button is rendered
        const tryAgainButton = screen.getByText('Try again');
        expect(tryAgainButton).toBeInTheDocument();

        // Simulate clicking the try again button
        fireEvent.click(tryAgainButton);
        expect(mockGameStore.resetGame).toHaveBeenCalled();
    });

    it('should render the game won message when the game is won', () => {
        // Set gameWon to true
        mockGameStore.gameWon = true;
        mockGameStore.score = 360;
        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);

        render(<PlayArea />);

        // Verify that the current score is displayed
        const scoreBoard = screen.getByTestId('score-board');
        expect(scoreBoard).toBeInTheDocument();
        const scoreElement = within(scoreBoard).getByText(`${mockGameStore.score}`);
        expect(scoreElement).toBeInTheDocument();

        // Verify that the game won message is rendered
        const gameWonMessage = screen.getByText('You Won!');
        expect(gameWonMessage).toBeInTheDocument();

        // Verify that the play again button is rendered
        const playAgainButton = screen.getByText('Play again');
        expect(playAgainButton).toBeInTheDocument();

        // Simulate clicking the play again button
        fireEvent.click(playAgainButton);
        expect(mockGameStore.resetGame).toHaveBeenCalled();
    });

    it('should render the game components when the game has started', () => {
        // Set gameStarted to true
        mockGameStore.gameStarted = true;
        mockGameStore.gameWon = false;
        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);

        render(<PlayArea />);

        // Verify that the current score is displayed
        const scoreBoard = screen.getByTestId('score-board');
        expect(scoreBoard).toBeInTheDocument();
        const scoreElement = within(scoreBoard).getByText(`${mockGameStore.score}`);
        expect(scoreElement).toBeInTheDocument();

        // Verify that at least one brick is rendered
        const bricks = screen.getAllByTestId('brick');
        expect(bricks.length).toBeGreaterThan(0);

        // Verify that the Ball, and Paddle components are rendered
        expect(screen.getByTestId('ball')).toBeInTheDocument();
        expect(screen.getByTestId('paddle')).toBeInTheDocument();
    });

    it('should not open the game rules modal when play area is first loaded', () => {
        // Create modal div
        const modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', 'modal');
        document.body.appendChild(modalRoot);

        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);
        render(<PlayArea />);
        const dialog = screen.getByTestId('modal');
        expect(getComputedStyle(dialog).display).toBe('none');

        document.body.removeChild(modalRoot);
    });

    it('egde case: should not render the game components when the gameStarted and gameWon are both true', () => {
        // Set gameStarted to true
        mockGameStore.gameStarted = true;
        mockGameStore.gameWon = true;
        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);

        render(<PlayArea />);

        // Verify that the current score is displayed
        const scoreBoard = screen.getByTestId('score-board');
        expect(scoreBoard).toBeInTheDocument();
        const scoreElement = within(scoreBoard).getByText(`${mockGameStore.score}`);
        expect(scoreElement).toBeInTheDocument();

        // Verify that the Bricks, Ball, and Paddle components are not rendered
        expect(screen.queryByTestId('brick')).toBeNull();
        expect(screen.queryByTestId('ball')).toBeNull();
        expect(screen.queryByTestId('paddle')).toBeNull();
    });

    it('should render the Paddle component before the Ball component', async () => {
        // Set gameStarted to true
        mockGameStore.gameStarted = true;
        mockGameStore.gameWon = false;
        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);

        render(<PlayArea />);

        // Wait for the Paddle and Ball components to render
        const paddle = await waitFor(() => screen.getByTestId('paddle'));
        const ball = await waitFor(() => screen.getByTestId('ball'));

        // Verify that the Paddle component appears before the Ball component in the DOM
        expect(paddle.compareDocumentPosition(ball) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
});