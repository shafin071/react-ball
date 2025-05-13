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

    it('should move the paddle left when the mouse cursor moves left', () => {
        render(<Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />);

        const paddle = paddleRef.current;
        const currentLeft = (mockPlayAreaDims.width - mockPaddleDims.width) / 2; // Center horizontally
        const clientX = mockPlayAreaDims.leftEdge + 50; // Mock mouse position within the play area
        const mouseX = clientX - mockPlayAreaDims.leftEdge; // Mouse position relative to the play area
        const expectedLeft = Math.abs(mouseX - mockPaddleDims.width / 2);

        // Set the initial left position of the paddle
        paddle!.style.left = `${currentLeft}px`;

        fireEvent.mouseMove(window, { clientX: clientX });

        // Verify that requestAnimationFrame was called
        expect(requestAnimationFrameMock).toHaveBeenCalled();

        // Verify the new left position of the paddle
        expect(paddle?.style.left).toBe(`${expectedLeft}px`);
    });

    it('should keep the paddle within play area when mouse cursor moves left', () => {
        render(<Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />);

        const paddle = paddleRef.current;
        const currentLeft = mockPaddleDims.width / 2; // Center horizontally
        const clientX = Math.abs(mockPlayAreaDims.leftEdge - 100); // Mock mouse position within the play area
        const expectedLeft = 0;

        // Set the initial left position of the paddle
        paddle!.style.left = `${currentLeft}px`;

        fireEvent.mouseMove(window, { clientX: clientX });

        // Verify that requestAnimationFrame was called
        expect(requestAnimationFrameMock).toHaveBeenCalled();

        // Verify the new left position of the paddle
        expect(paddle?.style.left).toBe(`${expectedLeft}px`);
    });

    it('should move the paddle left when the mouse cursor moves left', () => {
        render(<Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />);

        const paddle = paddleRef.current;
        const currentLeft = (mockPlayAreaDims.width - mockPaddleDims.width) / 2; // Center horizontally
        const clientX = mockPlayAreaDims.leftEdge + 50; // Mock mouse position within the play area
        const mouseX = clientX - mockPlayAreaDims.leftEdge; // Mouse position relative to the play area
        const expectedLeft = Math.abs(mouseX - mockPaddleDims.width / 2);

        // Set the initial left position of the paddle
        paddle!.style.left = `${currentLeft}px`;

        fireEvent.mouseMove(window, { clientX: clientX });

        // Verify that requestAnimationFrame was called
        expect(requestAnimationFrameMock).toHaveBeenCalled();

        // Verify the new left position of the paddle
        expect(paddle?.style.left).toBe(`${expectedLeft}px`);
    });

    it('should keep the paddle within play area when mouse cursor moves right', () => {
        render(<Paddle playAreaRef={playAreaRef} paddleRef={paddleRef} />);

        const paddle = paddleRef.current;
        const currentLeft = Math.abs(mockPlayAreaDims.width - mockPaddleDims.width); // Center horizontally
        const clientX = Math.abs(mockPlayAreaDims.rightEdge + 100); // Mock mouse position within the play area
        const expectedLeft = Math.abs(mockPlayAreaDims.width - mockPaddleDims.width);

        // Set the initial left position of the paddle
        paddle!.style.left = `${currentLeft}px`;

        fireEvent.mouseMove(window, { clientX: clientX });

        // Verify that requestAnimationFrame was called
        expect(requestAnimationFrameMock).toHaveBeenCalled();

        // Verify the new left position of the paddle
        expect(paddle?.style.left).toBe(`${expectedLeft}px`);
    });
});