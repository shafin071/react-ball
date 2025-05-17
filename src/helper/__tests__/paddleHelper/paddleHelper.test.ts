import { getPaddleDimensions, setInitialPaddlePosition, movePaddle } from '../../paddleHelper';
import { PaddleDimensions } from '../../../models/gameModels';

describe('paddleHelper', () => {
    let paddleRef: React.RefObject<HTMLDivElement>;

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
        // Create a mock paddle element
        const paddleElement = document.createElement('div');
        paddleElement.style.width = `${mockPaddleDims.width}px`;
        paddleElement.style.height = `${mockPaddleDims.height}px`;
        paddleElement.style.left = `${mockPaddleDims.leftEdge}px`;;
        paddleElement.style.top = `${mockPaddleDims.topEdge}px`;;

        // Assign the mock element to the paddleRef
        paddleRef = { current: paddleElement };
    });

    describe('getPaddleDimensions', () => {
        it('should return the correct paddle dimensions when paddleRef is valid', () => {
            const dimensions: PaddleDimensions = getPaddleDimensions(paddleRef);

            expect(dimensions).toEqual({...mockPaddleDims});
        });

        it('should return all zeros when paddleRef is null', () => {
            const dimensions: PaddleDimensions = getPaddleDimensions({ current: null });

            expect(dimensions).toEqual({
                width: 0,
                leftEdge: 0,
                rightEdge: 0,
                height: 0,
                topEdge: 0,
            });
        });
    });

    describe('setInitialPaddlePosition', () => {
        it('should set the paddle to the correct initial position', () => {

            setInitialPaddlePosition(paddleRef, mockPaddleDims.width, mockPlayAreaDims);

            const expectedPaddleLeft = (mockPlayAreaDims.width - mockPaddleDims.width) / 2;
            const expectedPaddleTop = mockPlayAreaDims.height - 20; // Check for the bottom padding in setInitialPaddlePosition

            expect(paddleRef.current?.style.left).toBe(`${expectedPaddleLeft}px`); 
            expect(paddleRef.current?.style.top).toBe(`${expectedPaddleTop}px`); 
        });

        it('should do nothing if paddleRef is null', () => {
            setInitialPaddlePosition({ current: null }, mockPaddleDims.width, mockPlayAreaDims);

            // No errors should occur, and no changes should be made
            expect(true).toBe(true);
        });
    });

    describe('movePaddle', () => {
        it('should move the paddle to the specified horizontal position', () => {
            const newLeft = 300;
            movePaddle(paddleRef, newLeft);

            expect(paddleRef.current?.style.left).toBe(`${newLeft}px`);
        });

        it('should do nothing if paddleRef is null', () => {
            movePaddle({ current: null }, 300);

            // No errors should occur, and no changes should be made
            expect(true).toBe(true);
        });
    });
});