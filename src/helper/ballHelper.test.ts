import { moveBall } from './ballHelper';
import { getPaddleDimensions } from './paddleHelper';
import { PlayAreaDimensions, BallDimensions, moveBallProps } from '../models/gameModels';

jest.mock('../helper/paddleHelper', () => ({
    getPaddleDimensions: jest.fn(),
}));

describe('moveBall', () => {
    let ballRef: React.RefObject<HTMLDivElement>;
    let paddleRef: React.RefObject<HTMLDivElement>;
    let playAreaDims: PlayAreaDimensions;
    let velocity: React.RefObject<{ x: number; y: number }>;
    let updateGameOver: jest.Mock;

    beforeEach(() => {
        // Mock ballRef
        ballRef = {
            current: {
                style: {
                    left: '50px',
                    top: '50px',
                    width: '20px',
                },
            } as unknown as HTMLDivElement,
        };

        // Mock paddleRef
        paddleRef = {
            current: {
                style: {
                    left: '40px',
                    top: '400px',
                    width: '100px',
                },
            } as unknown as HTMLDivElement,
        };

        // Mock playArea dimensions
        playAreaDims = {
            leftEdge: 0,
            rightEdge: 500,
            topEdge: 0,
            bottomEdge: 500,
            width: 500,
            height: 500,
        };

        // Mock velocity
        velocity = { current: { x: 2, y: 2 } };

        // Mock updateGameOver
        updateGameOver = jest.fn();

        // Mock paddle dimensions
        (getPaddleDimensions as jest.Mock).mockReturnValue({
            leftEdge: 40,
            rightEdge: 140,
            topEdge: 400,
            bottomEdge: 420,
        });
    });

    it('should reverse horizontal velocity when hitting left or right boundary', () => {
        // Ball hits the right boundary
        ballRef.current!.style.left = '480px'; // Near the right edge
        moveBall({ ballRef, paddleRef, playAreaDims, velocity, updateGameOver });
        expect(velocity.current.x).toBe(-2); // Horizontal velocity reversed

        // Ball hits the left boundary
        ballRef.current!.style.left = '0px'; // Near the left edge
        moveBall({ ballRef, paddleRef, playAreaDims, velocity, updateGameOver });
        expect(velocity.current.x).toBe(2); // Horizontal velocity reversed again
    });

    it('should reverse vertical velocity when hitting top boundary', () => {
        // Ball hits the top boundary
        ballRef.current!.style.top = '0px'; // Near the top edge
        moveBall({ ballRef, paddleRef, playAreaDims, velocity, updateGameOver });
        expect(velocity.current.y).toBe(-2); // Vertical velocity reversed
    });

    it('should call updateGameOver when ball hits the bottom boundary', () => {
        // Ball hits the bottom boundary
        ballRef.current!.style.top = '480px'; // Near the bottom edge
        moveBall({ ballRef, paddleRef, playAreaDims, velocity, updateGameOver });
        expect(updateGameOver).toHaveBeenCalledTimes(1); // Game over triggered
    });

    it('should reverse vertical velocity when colliding with the paddle', () => {
        // Ball collides with the paddle
        ballRef.current!.style.top = '390px'; // Just above the paddle
        ballRef.current!.style.left = '60px'; // Centered on the paddle
        moveBall({ ballRef, paddleRef, playAreaDims, velocity, updateGameOver });
        expect(velocity.current.y).toBe(-2); // Vertical velocity reversed
    });

    it('should not reverse velocity if no collision occurs', () => {
        // Ball is far from any boundary or paddle
        ballRef.current!.style.top = '200px';
        ballRef.current!.style.left = '200px';
        moveBall({ ballRef, paddleRef, playAreaDims, velocity, updateGameOver });
        expect(velocity.current.x).toBe(2); // Horizontal velocity unchanged
        expect(velocity.current.y).toBe(2); // Vertical velocity unchanged
    });
});