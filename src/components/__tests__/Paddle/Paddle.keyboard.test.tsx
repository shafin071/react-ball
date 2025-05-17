import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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

    const mockPaddleSpeed = 60; // Mock paddle speed

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

    it('should move the paddle left when ArrowLeft key is pressed', async () => {
        render(<Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />);

        const paddle = paddleRef.current;
        const currentLeft = (mockPlayAreaDims.width - mockPaddleDims.width) / 2; // Center horizontally
        const expectedLeft = currentLeft - mockPaddleSpeed;

        // Set the initial left position of the paddle
        paddle!.style.left = `${currentLeft}px`;

        // Trigger the ArrowLeft key event
        fireEvent.keyDown(window, { key: 'ArrowLeft' });

        // Verify that requestAnimationFrame was called
        expect(requestAnimationFrameMock).toHaveBeenCalled();

        // Verify the new left position of the paddle
        expect(paddle?.style.left).toBe(`${expectedLeft}px`);
    });

    it('should move the paddle left when ArrowRight key is pressed', async () => {
        render(<Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />);

        const paddle = paddleRef.current;
        const currentLeft = (mockPlayAreaDims.width - mockPaddleDims.width) / 2; // Center horizontally
        const expectedLeft = currentLeft + mockPaddleSpeed;

        // Set the initial left position of the paddle
        paddle!.style.left = `${currentLeft}px`;

        // Trigger the ArrowLeft key event
        fireEvent.keyDown(window, { key: 'ArrowRight' });

        // Verify that requestAnimationFrame was called
        expect(requestAnimationFrameMock).toHaveBeenCalled();

        // Verify the new left position of the paddle
        expect(paddle?.style.left).toBe(`${expectedLeft}px`);
    });

    it('should not move the paddle beyond the left edge of the playArea', () => {
        render(<Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />);

        const paddle = paddleRef.current;
        const currentLeft = Math.abs(mockPaddleSpeed - mockPaddleDims.width / 2); // place paddle close to the left edge
        const expectedLeft = 0;

        // Set the initial left position of the paddle
        paddle!.style.left = `${currentLeft}px`;

        fireEvent.keyDown(window, { key: 'ArrowLeft' });

        // Verify that requestAnimationFrame was called
        expect(requestAnimationFrameMock).toHaveBeenCalled();

        // Verify the new left position of the paddle
        expect(paddle?.style.left).toBe(`${expectedLeft}px`);
    });

    it('should not move the paddle beyond the right edge of the playArea', () => {
        render(<Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />);

        const paddle = paddleRef.current;
        const currentLeft = Math.abs(mockPlayAreaDims.width - mockPaddleDims.width); // place paddle close to the left edge
        const expectedLeft = Math.abs(mockPlayAreaDims.width - mockPaddleDims.width);

        // Set the initial left position of the paddle
        paddle!.style.left = `${currentLeft}px`;

        fireEvent.keyDown(window, { key: 'ArrowRight' });

        // Verify that requestAnimationFrame was called
        expect(requestAnimationFrameMock).toHaveBeenCalled();

        // Verify the new left position of the paddle
        expect(paddle?.style.left).toBe(`${expectedLeft}px`);
    });
});