import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';


interface ModalProps {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({ children, open, onClose, className = '' }) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const modalRoot = document.getElementById('modal');

    useEffect(() => {
        const modal = dialogRef.current;

        if (open && modal) {
            modal.style.display = 'flex'; // Dynamically set display to flex
            modal.showModal(); // Open the modal
        }

        return () => {
            // Using the concept of closure, open=false and modal=null in cleanup function
            // the cleanup function will be called when the component is unmounted or when the dependencies change
            // since open is the dependency, it will be called when open changes. It's not called when the component is rendered.
            // when isModalOpen state changes in GameRules, Modal will be re-rendered and the cleanup function will be called.
            // DO NOTE: running app in strict mode causes the component to be mounted and unmounted twice. So in that case, the cleanup function will be called twice when the component is unmounted.
            if (modal) {
                if (open) {
                    setTimeout(() => {
                        modal.style.display = 'none'; // Reset display to none
                        modal.close(); // Close the modal
                    }, 300);
                }

            };
        }
    }, [open]);
    // open is needed as the deependency so that useEffect is called when open changes. 
    // This allows modal.showModal() to be called. showModal() add an 'open' property to the <dialog> which causes the modal to become visible and positions nicely in the center of the screen.
    // Without open as the dependency, when game-rules-btn is clicked, the modal will be still be rendered since Modal attaches the dialog to the modalRoot.
    // But the modal position will be off center. 

    if (!modalRoot) {
        return false; // Do not render anything if the modal is not open
    }

    return createPortal(
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className={`modal ${className} ${!open ? 'fade-slide-down' : ''}`}
            data-testid="modal"
        >
            {children}
        </dialog>,
        modalRoot!
    );
}

export default Modal;
