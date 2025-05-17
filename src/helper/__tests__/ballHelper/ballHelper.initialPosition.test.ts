import { setInitialBallPosition } from '../../ballHelper';


describe('setInitialBallPosition', () => {
    it('should set the initial position of the ball', () => {
        const ballRef = { current: document.createElement('div') };
        const playAreaDims = { leftEdge: 600, rightEdge: 1400, topEdge: 100, bottomEdge: 700, width: 800, height: 600 }
        const paddleDims = { width: 100, leftEdge: 150, rightEdge: 250, topEdge: 570, height: 10 };

        ballRef.current.style.width = '20px';

        setInitialBallPosition(ballRef, playAreaDims, paddleDims);

        expect(ballRef.current.style.left).toBe('400px'); // Centered horizontally
        expect(ballRef.current.style.top).toBe('550px'); // Positioned above the paddle
    });
});