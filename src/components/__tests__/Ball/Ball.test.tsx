import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import './setupMocks';

import Ball from '../../Ball';
import { getPlayAreaDimensions } from '../../../helper/playAreaHelper';
import { getPaddleDimensions } from '../../../helper/paddleHelper';
import { useGameStore } from '../../../store/gameStore';
import { Gamestate } from '../../../models/gameModels';


describe('Ball Component', () => {
    let playAreaRef: React.RefObject<HTMLDivElement>;
    let paddleRef: React.RefObject<HTMLDivElement>;
    let brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
    let ballRef: React.RefObject<HTMLDivElement>;
    let mockGameStore: Gamestate;

    const mockPlayAreaDims = {
        width: 800,
        height: 600,
        leftEdge: 0,
        rightEdge: 800,
        topEdge: 0,
        bottomEdge: 600,
    };

    const mockPaddleDims = {
        width: 100,
        height: 10,
        leftEdge: 350,
        rightEdge: 450,
        topEdge: 580,
        bottomEdge: 590,
    };

    const mockBallDims = {
        width: 15,
        height: 15,
        leftEdge: 0,
        rightEdge: 15,
        topEdge: 0,
        bottomEdge: 15,
    };

    beforeEach(() => {
        playAreaRef = { current: document.createElement('div') };
        paddleRef = { current: document.createElement('div') };
        brickRefs = { current: [document.createElement('div')] };
        ballRef = { current: document.createElement('div') };

        (getPlayAreaDimensions as jest.Mock).mockReturnValue(mockPlayAreaDims);
        (getPaddleDimensions as jest.Mock).mockReturnValue(mockPaddleDims);

        // Mock gameStore
        mockGameStore = {
            score: 0,
            gameStarted: false,
            gameWon: false,
            gameLost: false,
            startGame: jest.fn(() => { console.log('mock startGame called') }),
            resetGame: jest.fn(() => { console.log('mock resetGame called') }),
            endGame: jest.fn(),
            setScore: jest.fn(),
        } as Gamestate;

        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the ball with correct styles', () => {
        render(<Ball playAreaRef={playAreaRef} paddleRef={paddleRef} ballRef={ballRef} brickRefs={brickRefs} />);

        const ball = screen.getByTestId('ball');
        expect(ball).toHaveStyle({
            width: `${mockBallDims.width}px`,
            height: `${mockBallDims.height}px`,
            borderRadius: '50%',
            position: 'absolute',
        });
    });

    it('should initialize the ball position on mount', () => {
        render(<Ball playAreaRef={playAreaRef} paddleRef={paddleRef} ballRef={ballRef} brickRefs={brickRefs} />);
        const ball = screen.getByTestId('ball');
        expect(ball).toBeInTheDocument();

        const expectedLeft = mockPlayAreaDims.width / 2;
        const expectedTop = mockPaddleDims.topEdge - mockBallDims.height;

        expect(ball).toHaveStyle({
            left: `${expectedLeft}px`,
            top: `${expectedTop}px`
        });
    });

    it('should start the animation loop on mount and cancel animation on unmount', () => {
        global.requestAnimationFrame = jest.fn((callback) => {
            setTimeout(() => {
                callback(0); 
            }, 0);
            return 1; // Return a mock frame ID
        });

        // Mock cancelAnimationFrame
        global.cancelAnimationFrame = jest.fn();

        const { unmount } = render(
            <Ball playAreaRef={playAreaRef} paddleRef={paddleRef} ballRef={ballRef} brickRefs={brickRefs} />
        );

        // Verify that requestAnimationFrame was called
        expect(global.requestAnimationFrame).toHaveBeenCalledTimes(1);

        // Simulate unmounting the component to trigger cancelAnimationFrame
        unmount();


        // Verify that cancelAnimationFrame was called with the correct frame ID
        expect(global.cancelAnimationFrame).toHaveBeenCalledWith(1);

        // Clean up mocks
        global.requestAnimationFrame = jest.requireActual('../../Ball').requestAnimationFrame;
        global.cancelAnimationFrame = jest.requireActual('../../Ball').cancelAnimationFrame;

    });

    it('should not call requestAnimationFrame when gameLost is true', () => {
        global.requestAnimationFrame = jest.fn((callback) => {
            setTimeout(() => {
                callback(0); 
            }, 0);
            return 1; // Return a mock frame ID
        });

        // Mock cancelAnimationFrame
        global.cancelAnimationFrame = jest.fn();

        // Set gameLost to true
        mockGameStore.gameLost = true;
        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameStore);

        render(
            <Ball
                playAreaRef={playAreaRef}
                paddleRef={paddleRef}
                ballRef={ballRef}
                brickRefs={brickRefs}
            />
        );

        // Verify that requestAnimationFrame was not called
        expect(requestAnimationFrame).not.toHaveBeenCalled();

        // Clean up mocks by restoring the original implementations
        global.requestAnimationFrame = window.requestAnimationFrame;
        global.cancelAnimationFrame = window.cancelAnimationFrame;
    });
});