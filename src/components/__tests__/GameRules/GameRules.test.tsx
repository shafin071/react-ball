import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import GameRules from '../../GameRules';


describe('GameRules Component', () => {

    beforeAll(() => {
        // Mock the `showModal` and `close` methods for the <dialog> element
        HTMLDialogElement.prototype.showModal = jest.fn();
        HTMLDialogElement.prototype.close = jest.fn();
    });

    beforeEach(() => {
        const modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', 'modal');
        document.body.appendChild(modalRoot);
    });

    afterEach(() => {
        const modalRoot = document.getElementById('modal');
        if (modalRoot) {
            document.body.removeChild(modalRoot);
        }
    });

    test('renders the "Game Rules" button', () => {
        render(<GameRules />);
        const gameRules = screen.getByTestId('game-rules');
        expect(gameRules).toBeInTheDocument();
    });

    test('opens the modal when "Game Rules" button is clicked', () => {
        render(<GameRules />);
        const button = screen.getByTestId('game-rules-btn');
        fireEvent.click(button);

        const modalBody = screen.getByTestId('modal-body');
        expect(modalBody).toBeInTheDocument();
    });

    test('closes the modal when "Close" button is clicked', async () => {
        render(<GameRules />);
        const openButton = screen.getByTestId('game-rules-btn');
        fireEvent.click(openButton);

        const modalBody = screen.getByTestId('modal-body');
        expect(modalBody).toBeInTheDocument();

        const closeButton = screen.getByTestId('close-modal-btn');
        fireEvent.click(closeButton);

        // use waitFor since there's a timeout while the modal closes
        await waitFor(() => {
            const dialog = screen.getByTestId('modal');
            expect(getComputedStyle(dialog).display).toBe('none');
        }, { timeout: 500 });
    });

    test('modal is not visible initially', () => {
        render(<GameRules />);
         const dialog = screen.getByTestId('modal');
         expect(getComputedStyle(dialog).display).toBe('none');
    });
});