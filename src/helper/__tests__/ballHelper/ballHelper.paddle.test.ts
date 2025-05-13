import { BallHelper } from '../../ballHelper';
import { getPaddleDimensions } from '../../paddleHelper';
import { moveBallProps } from '../../../models/gameModels';
import { Gamestate } from '../../../models/gameModels';


jest.mock('../../paddleHelper', () => ({
    getPaddleDimensions: jest.fn(),
}));


describe('BallHelper collision with paddle', () => {
    let ballRef: React.RefObject<HTMLDivElement>;
    let paddleRef: React.RefObject<HTMLDivElement>;
    let brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
    let velocity: { current: { x: number; y: number } };
    let gameStore: Gamestate;
    let ballHelper: BallHelper;

    // Mock play area dimensions
    const playAreaDims = {
        leftEdge: 600,
        rightEdge: 1400,
        topEdge: 100,
        bottomEdge: 700,
        width: 800,
        height: 600,
    }

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

    // For these tests, refer to the paddle zone illustrated in ballHelper.handleBallCollisionWithPaddle

    it.each([
        // Test cases for different ball dimensions
        { ballDims: { width: 20, leftEdge: 200, rightEdge: 220, topEdge: 550, bottomEdge: 570 }, expectedX: 0, expectedY: -2 }, 
        { ballDims: { width: 20, leftEdge: 188, rightEdge: 208, topEdge: 550, bottomEdge: 570 }, expectedX: 0, expectedY: -2 },
    ])
    ('ball collision with paddle center zone', ({ ballDims, expectedX, expectedY }) => {
        const paddleDims = { width: 100, leftEdge: 150, rightEdge: 250, topEdge: 570, height: 10 };
        let velocity = { current: { x: 2, y: 2 } }; // Ball moving SW
    
        (getPaddleDimensions as jest.Mock).mockReturnValue(paddleDims);
    
        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
    
        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);
    
        ballHelper.handleBallCollisionWithPaddle(ballDims);
    
        // Assert the new velocity
        expect(velocity.current.x).toBe(expectedX); // Horizontal direction
        expect(velocity.current.y).toBe(expectedY); // Vertical direction
    });

    it.each([
        // Test cases for different ball dimensions
        { ballDims: { width: 20, leftEdge: 130, rightEdge: 150, topEdge: 550, bottomEdge: 570 }, expectedX: -3, expectedY: -2 }, 
        { ballDims: { width: 20, leftEdge: 149, rightEdge: 169, topEdge: 550, bottomEdge: 570 }, expectedX: -3, expectedY: -2 }, 
    ])
    ('ball collision with paddle left zone 1', ({ ballDims, expectedX, expectedY }) => {
        const paddleDims = { width: 100, leftEdge: 150, rightEdge: 250, topEdge: 570, height: 10 };
        let velocity = { current: { x: 2, y: 2 } }; // Ball moving SW
    
        (getPaddleDimensions as jest.Mock).mockReturnValue(paddleDims);
    
        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
    
        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);
    
        ballHelper.handleBallCollisionWithPaddle(ballDims);
    
        // Assert the new velocity
        expect(velocity.current.x).toBe(expectedX); // Horizontal direction
        expect(velocity.current.y).toBe(expectedY); // Vertical direction
    });

    it.each([
        // Test cases for different ball dimensions
        { ballDims: { width: 20, leftEdge: 150, rightEdge: 170, topEdge: 550, bottomEdge: 570 }, expectedX: -2, expectedY: -2 }, 
        { ballDims: { width: 20, leftEdge: 177, rightEdge: 197, topEdge: 550, bottomEdge: 570 }, expectedX: -2, expectedY: -2 }, 
    ])
    ('ball collision with paddle left zone 2', ({ ballDims, expectedX, expectedY }) => {
        const paddleDims = { width: 100, leftEdge: 150, rightEdge: 250, topEdge: 570, height: 10 };
        let velocity = { current: { x: 2, y: 2 } }; // Ball moving SW
    
        (getPaddleDimensions as jest.Mock).mockReturnValue(paddleDims);
    
        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
    
        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);
    
        ballHelper.handleBallCollisionWithPaddle(ballDims);
    
        // Assert the new velocity
        expect(velocity.current.x).toBe(expectedX); // Horizontal direction
        expect(velocity.current.y).toBe(expectedY); // Vertical direction
    });

    it.each([
        // Test cases for different ball dimensions
        { ballDims: { width: 20, leftEdge: 231, rightEdge: 251, topEdge: 550, bottomEdge: 570 }, expectedX: 3, expectedY: -2 }, 
        { ballDims: { width: 20, leftEdge: 250, rightEdge: 270, topEdge: 550, bottomEdge: 570 }, expectedX: 3, expectedY: -2 }, 
    ])
    ('ball collision with paddle right zone 1', ({ ballDims, expectedX, expectedY }) => {
        const paddleDims = { width: 100, leftEdge: 150, rightEdge: 250, topEdge: 570, height: 10 };
        let velocity = { current: { x: -2, y: 2 } }; // Ball moving SE
    
        (getPaddleDimensions as jest.Mock).mockReturnValue(paddleDims);
    
        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
    
        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);
    
        ballHelper.handleBallCollisionWithPaddle(ballDims);
    
        // Assert the new velocity
        expect(velocity.current.x).toBe(expectedX); // Horizontal direction
        expect(velocity.current.y).toBe(expectedY); // Vertical direction
    });

    it.each([
        // Test cases for different ball dimensions
        { ballDims: { width: 20, leftEdge: 203, rightEdge: 223, topEdge: 550, bottomEdge: 570 }, expectedX: 2, expectedY: -2 }, 
        { ballDims: { width: 20, leftEdge: 230, rightEdge: 250, topEdge: 550, bottomEdge: 570 }, expectedX: 2, expectedY: -2 }, 
    ])
    ('ball collision with paddle right zone 2', ({ ballDims, expectedX, expectedY }) => {
        const paddleDims = { width: 100, leftEdge: 150, rightEdge: 250, topEdge: 570, height: 10 };
        let velocity = { current: { x: -2, y: 2 } }; // Ball moving SE
    
        (getPaddleDimensions as jest.Mock).mockReturnValue(paddleDims);
    
        const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
    
        // Create BallHelper instance
        ballHelper = new BallHelper(moveBallProps);
    
        ballHelper.handleBallCollisionWithPaddle(ballDims);
    
        // Assert the new velocity
        expect(velocity.current.x).toBe(expectedX); // Horizontal direction
        expect(velocity.current.y).toBe(expectedY); // Vertical direction
    });
});