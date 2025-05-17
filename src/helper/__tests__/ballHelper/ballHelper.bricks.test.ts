import { BallHelper } from '../../ballHelper';
import { moveBallProps } from '../../../models/gameModels';
import { Gamestate } from '../../../models/gameModels';
import { getBrickDimensions } from '../../brickHelper';


jest.mock('../../brickHelper', () => ({
    getBrickDimensions: jest.fn(),
}));


describe('BallHelper collision with bricks', () => {
    let ballRef: React.RefObject<HTMLDivElement>;
    let paddleRef: React.RefObject<HTMLDivElement>;
    let brickRefs: React.RefObject<(HTMLDivElement | null)[]>;
    let gameStore: Gamestate;
    let ballHelper: BallHelper;
    let brickPoint = 10

    // Mock play area dimensions
    const playAreaDims = {
        leftEdge: 600,
        rightEdge: 1400,
        topEdge: 100,
        bottomEdge: 700,
        width: 800,
        height: 600,
    }

    const mockBrickDims = {
        width: 60,
        height: 30,
        leftEdge: 200,
        rightEdge: 260,
        topEdge: 40,
        bottomEdge: 70,
    }

    beforeEach(() => {
        // Mock DOM elements
        ballRef = { current: document.createElement('div') };
        paddleRef = { current: document.createElement('div') };
        brickRefs = { current: [document.createElement('div')] };

        // Create a single brick reference
        const brick = document.createElement('div');
        brick.style.width = `${mockBrickDims.width}px`;
        brick.style.height = `${mockBrickDims.height}px`;
        brick.style.left = `${mockBrickDims.leftEdge}px`;
        brick.style.top = `${mockBrickDims.topEdge}px`;

        // Assign a point value to the brick using the dataset property
        brick.dataset.score = `${brickPoint}`; // Assign the score to the brick

        brickRefs = { current: [brick] };

        // Mock the getBrickDimensions function to return the mock dimensions
        (getBrickDimensions as jest.Mock).mockReturnValue(mockBrickDims);

        // Mock gameStore
        gameStore = {
            endGame: jest.fn(),
            setScore: jest.fn(),
        } as unknown as Gamestate;

        jest.useFakeTimers(); // Use Jest's fake timers
    });

    afterEach(() => {
        jest.useRealTimers(); // Restore real timers
    });

    it.each([
        // Test cases for different ball dimensions
        { ballDims: { width: 20, leftEdge: 200, rightEdge: 220, topEdge: 70, bottomEdge: 90 }, expectedX: 2, expectedY: 2 },
        { ballDims: { width: 20, leftEdge: 260, rightEdge: 280, topEdge: 70, bottomEdge: 90 }, expectedX: 2, expectedY: 2 },
    ])
        ('ball collision with brick bottom edge', ({ ballDims, expectedX, expectedY }) => {
            const brickCount = { current: 10 };
            let velocity = { current: { x: 2, y: -2 } }; // Ball moving NE

            const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
            // Create BallHelper instance
            ballHelper = new BallHelper(moveBallProps);
            ballHelper.handleBallCollisionWithBricks(playAreaDims, ballDims, brickRefs, brickCount);

            // Fast-forward time to allow setTimeout to execute
            jest.runAllTimers();

            // Assert the new velocity
            expect(velocity.current.x).toBe(expectedX); // Horizontal direction
            expect(velocity.current.y).toBe(expectedY); // Vertical direction

            // Assert that the brick is hidden
            expect(brickRefs.current[0]?.style.visibility).toBe('hidden');

            // Assert that the brickCount is decremented
            expect(brickCount.current).toBe(9);

            // Assert that the score is updated
            expect(gameStore.setScore).toHaveBeenCalledWith(brickPoint);
        });

    it.each([
        // Test cases for different ball dimensions
        { ballDims: { width: 20, leftEdge: 200, rightEdge: 220, topEdge: 20, bottomEdge: 40 }, expectedX: 2, expectedY: -2 },
        { ballDims: { width: 20, leftEdge: 260, rightEdge: 280, topEdge: 20, bottomEdge: 40 }, expectedX: 2, expectedY: -2 },
    ])
        ('ball collision with brick top edge', ({ ballDims, expectedX, expectedY }) => {
            const brickCount = { current: 10 };
            let velocity = { current: { x: 2, y: 2 } }; // Ball moving SE

            const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
            // Create BallHelper instance
            ballHelper = new BallHelper(moveBallProps);
            ballHelper.handleBallCollisionWithBricks(playAreaDims, ballDims, brickRefs, brickCount);

            // Fast-forward time to allow setTimeout to execute
            jest.runAllTimers();

            // Assert the new velocity
            expect(velocity.current.x).toBe(expectedX); // Horizontal direction
            expect(velocity.current.y).toBe(expectedY); // Vertical direction

            // Assert that the brick is hidden
            expect(brickRefs.current[0]?.style.visibility).toBe('hidden');

            // Assert that the brickCount is decremented
            expect(brickCount.current).toBe(9);

            // Assert that the score is updated
            expect(gameStore.setScore).toHaveBeenCalledWith(brickPoint);
        });

    it.each([
        // Test cases for different ball dimensions
        { ballDims: { width: 20, leftEdge: 181, rightEdge: 201, topEdge: 40, bottomEdge: 60 }, expectedX: -2, expectedY: -2 },
        { ballDims: { width: 20, leftEdge: 180, rightEdge: 200, topEdge: 65, bottomEdge: 85 }, expectedX: -2, expectedY: -2 },
    ])
        ('ball collision with brick left edge', ({ ballDims, expectedX, expectedY }) => {
            const brickCount = { current: 10 };
            let velocity = { current: { x: 2, y: -2 } }; // Ball moving NE

            // (getBrickDimensions as jest.Mock).mockReturnValue(mockBrickDims);

            const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
            ballHelper = new BallHelper(moveBallProps);
            ballHelper.handleBallCollisionWithBricks(playAreaDims, ballDims, brickRefs, brickCount);

            // Fast-forward time to allow setTimeout to execute
            jest.runAllTimers();

            // Assert the new velocity
            expect(velocity.current.x).toBe(expectedX); // Horizontal direction
            expect(velocity.current.y).toBe(expectedY); // Vertical direction

            // Assert that the brick is hidden
            expect(brickRefs.current[0]?.style.visibility).toBe('hidden');

            // Assert that the brickCount is decremented
            expect(brickCount.current).toBe(9);

            // Assert that the score is updated
            expect(gameStore.setScore).toHaveBeenCalledWith(brickPoint);

        });

    it.each([
        // Test cases for different ball dimensions
        { ballDims: { width: 20, leftEdge: 260, rightEdge: 280, topEdge: 40, bottomEdge: 60 }, expectedX: 2, expectedY: -2 },
        { ballDims: { width: 20, leftEdge: 260, rightEdge: 280, topEdge: 65, bottomEdge: 85 }, expectedX: 2, expectedY: -2 },
    ])
        ('ball collision with brick right edge', ({ ballDims, expectedX, expectedY }) => {
            const brickCount = { current: 10 };
            let velocity = { current: { x: -2, y: -2 } }; // Ball moving NE

            const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
            // Create BallHelper instance
            ballHelper = new BallHelper(moveBallProps);
            ballHelper.handleBallCollisionWithBricks(playAreaDims, ballDims, brickRefs, brickCount);

            // Fast-forward time to allow setTimeout to execute
            jest.runAllTimers();

            // Assert the new velocity
            expect(velocity.current.x).toBe(expectedX); // Horizontal direction
            expect(velocity.current.y).toBe(expectedY); // Vertical direction

            // Assert that the brick is hidden
            expect(brickRefs.current[0]?.style.visibility).toBe('hidden');

            // Assert that the brickCount is decremented
            expect(brickCount.current).toBe(9);

            // Assert that the score is updated
            expect(gameStore.setScore).toHaveBeenCalledWith(brickPoint);
        });

    it.each([
        // Test cases for different ball dimensions
        { ballDims: { width: 20, leftEdge: 260, rightEdge: 280, topEdge: 40, bottomEdge: 60 }, expectedX: 2, expectedY: -2 },
        { ballDims: { width: 20, leftEdge: 260, rightEdge: 280, topEdge: 65, bottomEdge: 85 }, expectedX: 2, expectedY: -2 },
    ])
        ('ball collision last brick destroyed', ({ ballDims, expectedX, expectedY }) => {
            let brickCount = { current: 1 };
            let velocity = { current: { x: -2, y: -2 } }; // Ball moving NE

            const moveBallProps: moveBallProps = { ballRef, paddleRef, brickCount, brickRefs, playAreaDims, velocity, gameStore };
            // Create BallHelper instance
            ballHelper = new BallHelper(moveBallProps);
            ballHelper.handleBallCollisionWithBricks(playAreaDims, ballDims, brickRefs, brickCount);

            // Fast-forward time to allow setTimeout to execute
            jest.runAllTimers();

            // Assert the new velocity
            expect(velocity.current.x).toBe(expectedX); // Horizontal direction
            expect(velocity.current.y).toBe(expectedY); // Vertical direction

            expect(gameStore.endGame).toHaveBeenCalledWith(true);

            // Assert that the brick is marked as destroyed
            expect(brickRefs.current[0]?.classList.contains('brick-exit')).toBe(true);

            // Assert that the brick is hidden
            expect(brickRefs.current[0]?.style.visibility).toBe('hidden');

            // Assert that the brickCount is decremented
            expect(brickCount.current).toBe(0);

            // Assert that the score is updated
            expect(gameStore.setScore).toHaveBeenCalledWith(brickPoint);
        });

});