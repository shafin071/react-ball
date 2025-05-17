// Mock the useGameStore hook
jest.mock('../../../store/gameStore', () => ({
    useGameStore: jest.fn(),
}));