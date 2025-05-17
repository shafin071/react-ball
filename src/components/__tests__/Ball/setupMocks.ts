jest.mock('../../../helper/playAreaHelper', () => ({
    getPlayAreaDimensions: jest.fn(),
}));

jest.mock('../../../helper/paddleHelper', () => ({
    getPaddleDimensions: jest.fn(),
}));

jest.mock('../../../helper/ballHelper', () => ({
    setInitialBallPosition: jest.requireActual('../../../helper/ballHelper').setInitialBallPosition, // Use the real implementation,
    moveBall: jest.requireActual('../../../helper/ballHelper').moveBall, // Use the real implementation
}));

// Mock the useGameStore hook
jest.mock('../../../store/gameStore', () => ({
    useGameStore: jest.fn(),
}));