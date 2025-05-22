import React, { useState } from 'react';

import Modal from './UI/Modal';


const GameRules: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div data-testid="game-rules">
            {/* Button to open the modal */}
            <button onClick={openModal} className="game-btn game-rules-btn"
                data-testid="game-rules-btn">
                Game Rules
            </button>

            {/* Modal */}
            <Modal open={isModalOpen} onClose={closeModal}>
                <div className="modal-body" data-testid="modal-body">
                    <h2>Game Rules</h2>
                    <ul>
                        <li>Use the paddle to bounce the ball and break all the bricks.</li>
                        <li>Move the paddle with your mouse/mousepad or &#x21E6; &#x21E8; keys.</li>
                        <li>Each brick has a score value and breaking a brick will add to the score.</li>
                        <li>Don't let the ball fall below the paddle &#9760;</li>
                        <li>Clear all the bricks to win the game &#127881;</li>
                    </ul>
                    <h3>Hint:</h3>
                    <ul>
                        <li>The bounce direction of the ball will depend on where it hit the paddle. </li>
                        <li>Use this information wisely &#128540;</li>
                    </ul>
                    <button onClick={closeModal} className="close-modal-button game-btn"
                        data-testid="close-modal-btn">
                        Close
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default GameRules;