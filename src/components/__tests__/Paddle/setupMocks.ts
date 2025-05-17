jest.mock('../../../helper/playAreaHelper', () => ({
    getPlayAreaDimensions: jest.fn(),
}));

jest.mock('../../../helper/paddleHelper', () => ({
    setInitialPaddlePosition: jest.requireActual('../../../helper/paddleHelper').setInitialPaddlePosition, // Use the real implementation
    movePaddle: jest.requireActual('../../../helper/paddleHelper').movePaddle, // Use the real implementation
}));