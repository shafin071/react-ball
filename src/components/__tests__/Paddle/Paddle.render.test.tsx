import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import './setupMocks'; 
import Paddle from '../../Paddle';
import { getPlayAreaDimensions } from '../../../helper/playAreaHelper';


describe('Paddle Component', () => {
    let playAreaRef: React.RefObject<HTMLDivElement>;
    let paddleRef: React.RefObject<HTMLDivElement>;
    let requestAnimationFrameMock: jest.SpyInstance;

    // Mock paddle dimensions
    const mockPaddleDims = {
        width: 100,
        leftEdge: 50,
        rightEdge: 150,
        height: 10,
        topEdge: 200,
    }

    const mockPaddleBottomPadding = 20; // Mock bottom padding

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
        // Create mock refs
        playAreaRef = { current: document.createElement('div') };
        paddleRef = { current: document.createElement('div') };

        // Mock play area dimensions
        (getPlayAreaDimensions as jest.Mock).mockReturnValue({ ...mockPlayAreaDims });


        // Mock requestAnimationFrame
        requestAnimationFrameMock = jest
            .spyOn(global, 'requestAnimationFrame')
            .mockImplementation((callback) => {
                callback(0); // Immediately invoke the callback
                return 10; // Return a mock frame ID
            });
    });

    afterEach(() => {
        // Clean up mocks
        requestAnimationFrameMock.mockRestore();
        jest.restoreAllMocks();
    });

    it('should render the paddle with correct initial styles', () => {
        render(<Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />);
        const paddle = screen.getByTestId('paddle');
        expect(paddle).toHaveStyle({
            width: `${mockPaddleDims.width}px`,
            height: `${mockPaddleDims.height}px`,
            position: 'absolute',
            backgroundColor: 'black',
        });
    });

    it('should call setInitialPaddlePosition on mount and set the paddle to the correct initial position', () => {
        render(<Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />);

        // Check if the paddle is positioned correctly in the playArea
        const paddle = paddleRef.current;
        const expectedLeft = (mockPlayAreaDims.width - mockPaddleDims.width) / 2; // Center horizontally
        const expectedTop = mockPlayAreaDims.height - mockPaddleBottomPadding; // Near the bottom of the playArea. Check for the bottom padding in setInitialPaddlePosition

        expect(paddle?.style.left).toBe(`${expectedLeft}px`);
        expect(paddle?.style.top).toBe(`${expectedTop}px`);
    });

    it('should clean up event listeners on unmount', () => {
        const { unmount } = render(
            <Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />
        );

        unmount();

        // Simulate keydown after unmount
        fireEvent.keyDown(window, { key: 'ArrowLeft' });

        // movePaddle should not be called after unmount
        expect(requestAnimationFrameMock).not.toHaveBeenCalled();

        // Simulate mouse cursor movement after unmount
        fireEvent.mouseMove(window, { clientX: 250 });

        // movePaddle should not be called after unmount
        expect(requestAnimationFrameMock).not.toHaveBeenCalled();
    });
});