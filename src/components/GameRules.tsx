import React, { useRef, useState } from 'react';

import Modal from './UI/Modal';


// const GameRules: React.FC = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const openModal = () => setIsModalOpen(true);
//     const closeModal = () => setIsModalOpen(false) ;

//     return (
//         <div>
//             {/* Button to open the modal */}
//             <button onClick={openModal} className="game-btn game-rules-btn">
//                 Game Rules
//             </button>

//             {/* Modal */}
//             <Modal open={isModalOpen} onClose={closeModal}>
//                 <div className="modal-body">
//                     <h2>Game Rules</h2>
//                     <ul>
//                         <li>Use the paddle to bounce the ball and break all the bricks.</li>
//                         <li>Each brick has a score value and breaking a brick will add to the score.</li>
//                         <li>Don't let the ball fall below the paddle, or you'll the game.</li>
//                         <li>Clear all the bricks to win the game.</li>
//                     </ul>
//                     <button onClick={closeModal} className="close-modal-button game-btn">
//                         Close
//                     </button>
//                 </div>
//             </Modal>

//         </div>
//     );
// };


import type { ModalHandle } from './UI/Modal';

const GameRules: React.FC = () => {
    const modalRef = useRef<ModalHandle | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log('GameRules component rendered', modalRef.current);

    const openModal = () => {
        // console.log('Opening modal', modalRef.current);
        setIsModalOpen(true); // Set state to render the Modal
        if (modalRef.current) {
            modalRef.current.open();
        }
    };

    const closeModal = () => {
        console.log('Closing modal', modalRef.current);
        setIsModalOpen(false); // Set state to unmount the Modal
        if (modalRef.current) {
            // modalRef.current.close();
            const dialogElement = modalRef.current as unknown as HTMLDialogElement;
            console.log('Dialog element in closeModal:', dialogElement);
            dialogElement.classList.add('fade-slide-down'); // Add the fade-slide-down class

            // Wait for the animation to complete before closing the modal
            setTimeout(() => {
                console.log('Closing dialog element after timeout');
                dialogElement.close();
                dialogElement.classList.remove('fade-slide-down'); // Remove the class after closing
            }, 300); // Match the duration of the fade-slide-down animation
        }
    };

    return (
        <div>
            {/* Button to open the modal */}
            <button onClick={openModal} className="game-btn game-rules-btn">
                Game Rules
            </button>

            {/* Modal */}
            {/* <Modal ref={modalRef}>
                <div className="modal-body">
                    <h2>Game Rules</h2>
                    <ul>
                        <li>Use the paddle to bounce the ball and break all the bricks.</li>
                        <li>Each brick has a score value and breaking a brick will add to the score.</li>
                        <li>Don't let the ball fall below the paddle, or you'll the game.</li>
                        <li>Clear all the bricks to win the game.</li>
                    </ul>
                    <button onClick={closeModal} className="close-modal-button game-btn">
                        Close
                    </button>
                </div>
            </Modal> */}

            {isModalOpen && (
                <Modal ref={modalRef}>
                    <div className="modal-body">
                        <h2>Game Rules</h2>
                        <ul>
                            <li>Use the paddle to bounce the ball and break all the bricks.</li>
                            <li>Each brick has a score value and breaking a brick will add to the score.</li>
                            <li>Don't let the ball fall below the paddle, or you'll lose the game.</li>
                            <li>Clear all the bricks to win the game.</li>
                        </ul>
                        <button onClick={closeModal} className="close-modal-button game-btn">
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default GameRules;