import { BallHelper } from '../../ballHelper';
import { moveBallProps } from '../../../models/gameModels';
import { Gamestate } from '../../../models/gameModels';


describe('BallHelper collision with playArea boundaries', () => {
    let ballRef: React.RefObject<HTMLDivElement>;
    let paddleRef: React.RefObject<HTMLDivElement>;
    let brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
    let velocity: { current: { x: number; y: number } };
    let gameStore: Gamestate;
    let ballHelper: BallHelper;

    const brickCount = { current: 10 }; // Mock brick count

    beforeEach(() => {
        // Mock DOM elements
        ballRef = { current: document.createElement('div') };
        paddleRef = { current: document.createElement('div') };
        brickRefs = { current: [document.createElement('div')] };

        // Mock gameStore
        gameStore = {
            endGame: jest.fn(),
            setScore: jest.fn(),
        } as unknown as Gamestate;
    });

    it('should return correct ball dimensions', () => {
        const mockBallDims = {width: 20, leftEdge: 100, rightEdge: 120, topEdge: 200, bottomEdge: 220}
        // Set initial styles for ball
        ballRef.current.style.width = `${mockBallDims.width}px`;
        ballRef.current.style.left = `${mockBallDims.leftEdge}px`;
        ballRef.current.style.top = `${mockBallDims.topEdge}px`;

        const playAreaDims = { leftEdge: 600, rightEdge: 1400, topEdge: 100, bottomEdge: 700, width: 800, height: 600 }

        let velocity = { current: { x: -2, y: -2 } };  // moving NW

        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };

        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);
        const ballDims = ballHelper.getBallDimensions();

        expect(ballDims).toEqual({
            width: mockBallDims.width,
            leftEdge: mockBallDims.leftEdge,
            rightEdge: mockBallDims.rightEdge,
            topEdge: mockBallDims.topEdge,
            bottomEdge: mockBallDims.bottomEdge,
        });
    });

    it('ball should continue current trajectory', () => {
        const playAreaDims = { leftEdge: 600, rightEdge: 1400, topEdge: 100, bottomEdge: 700, width: 800, height: 600 }
        let velocity = { current: { x: -2, y: -2 } };  // moving NW

        // Ball is at the top left corner of the play area but not touching the boundaries
        let ballDims = { width: 20, leftEdge: 1, rightEdge: 21, topEdge: 1, bottomEdge: 21 };

        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };

        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);

        ballHelper.handleBallCollisionWithBoundaries(ballDims, playAreaDims);
        expect(velocity.current.x).toBe(-2); // Reverse horizontal direction
        expect(velocity.current.y).toBe(-2); // Maintain vertical direction
    });

    it('ball collision with left boundary', () => {
        const playAreaDims = { leftEdge: 600, rightEdge: 1400, topEdge: 100, bottomEdge: 700, width: 800, height: 600 }
        let velocity = { current: { x: -2, y: -2 } };  // moving NW

        // Simulate collision with the left boundary
        let ballDims = { width: 20, leftEdge: 0, rightEdge: 20, topEdge: 200, bottomEdge: 220 };

        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };

        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);

        ballHelper.handleBallCollisionWithBoundaries(ballDims, playAreaDims);
        expect(velocity.current.x).toBe(2); // Reverse horizontal direction
        expect(velocity.current.y).toBe(-2); // Maintain vertical direction
    });

    it('ball collision with right boundary', () => {
        const playAreaDims = { leftEdge: 600, rightEdge: 1400, topEdge: 100, bottomEdge: 700, width: 800, height: 600 }
        let velocity = { current: { x: 2, y: -2 } };   // moving NE

        // Simulate collision with the right boundary
        const ballDims = { width: 20, leftEdge: 781, rightEdge: 801, topEdge: 100, bottomEdge: 120 };

        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };

        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);

        ballHelper.handleBallCollisionWithBoundaries(ballDims, playAreaDims);
        expect(velocity.current.x).toBe(-2); // Reverse horizontal direction
        expect(velocity.current.y).toBe(-2); // Maintain vertical direction
    });

    it('ball collision with top boundary', () => {
        const playAreaDims = { leftEdge: 600, rightEdge: 1400, topEdge: 100, bottomEdge: 700, width: 800, height: 600 }
        let velocity = { current: { x: 0, y: -2 } };   // moving N

        // Simulate collision with the top boundary
        const ballDims = { width: 20, leftEdge: 500, rightEdge: 520, topEdge: 0, bottomEdge: 20 };

        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
        
        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);

        ballDims.topEdge = -1;
        ballDims.bottomEdge = 20;
        ballHelper.handleBallCollisionWithBoundaries(ballDims, playAreaDims);
        expect(velocity.current.y).toBe(2); // Reverse vertical direction
        expect(velocity.current.x).toBe(0); // Maintain horizontal direction
    });

    it('ball collision with bottom boundary', () => {
        const playAreaDims = { leftEdge: 600, rightEdge: 1400, topEdge: 100, bottomEdge: 700, width: 800, height: 600 }

        // Simulate collision with the bottom boundary
        let ballDims = { width: 20, leftEdge: 100, rightEdge: 120, topEdge: 681, bottomEdge: 701 };

        let velocity = { current: { x: -2, y: 2 } };   // moving SW

        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
        
        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);

        const hitBottom = ballHelper.handleBallCollisionWithBoundaries(ballDims, playAreaDims);
        expect(hitBottom).toBe(true);
        expect(gameStore.endGame).toHaveBeenCalledWith(false); // gameWon = false, gameLost = true
    });
});