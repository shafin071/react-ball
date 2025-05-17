import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import './setupMocks';
import Bricks from '../../Bricks';
import { getPlayAreaDimensions } from '../../../helper/playAreaHelper';
import { getBrickAreaDimensions } from '../../../helper/brickHelper';


describe('Bricks Component', () => {
    let playAreaRef: React.RefObject<HTMLDivElement>;
    let brickRefs: React.RefObject<(HTMLDivElement | null)[]>;

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
        // Create mock refs
        playAreaRef = { current: document.createElement('div') };
        brickRefs = { current: [document.createElement('div')] };

        // Mock play area dimensions
        (getPlayAreaDimensions as jest.Mock).mockReturnValue({ ...mockPlayAreaDims });
    });

    it('should render all bricks', () => {
        render(<Bricks playAreaRef={playAreaRef} brickRefs={brickRefs} />);

        const brickWidth = 60; // Width of each brick (px)
        const brickHeight = 30; // Height of each brick (px)
        const padding = 5; // Padding between bricks (px)

        const { brickSectionHeight, brickSectionWidth } = getBrickAreaDimensions(mockPlayAreaDims);
        const totalNumberOfBricks = Math.floor(brickSectionHeight / (brickHeight + padding)) * Math.floor(brickSectionWidth / (brickWidth + padding));

        // Verify that all bricks are rendered
        const bricks = screen.getAllByTestId('brick');
        expect(bricks).toHaveLength(totalNumberOfBricks);
    });
});