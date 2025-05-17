// Mock the useGameStore hook
jest.mock('../../../store/gameStore', () => ({
    useGameStore: jest.fn(),
}));

jest.mock('../../../helper/playAreaHelper', () => ({
    getPlayAreaDimensions: jest.fn(),
}));