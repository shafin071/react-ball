import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';


// interface ModalProps {
//     children: React.ReactNode;
//     open: boolean;
//     onClose: () => void;
//     className?: string;
// }

// const Modal: React.FC<ModalProps> = ({ children, open, onClose, className = '' }) => {
//     const dialog = useRef<HTMLDialogElement | null>(null);
//     const modalRoot = document.getElementById('modal');
//     console.log('Rendering Modal:', open, dialog.current);

//     useEffect(() => {
//         const modal = dialog.current;
//         if (open && modal) {
//             modal.showModal();
//         }
//         return () => {
//             if (modal) {
//                 console.log('Closing modal');
//                 modal.close();
//             };
//         }
//     }, [open]);

//     // if (!modalRoot || !open) {
//     //     console.log('Modal root not found or modal not open');
//     //     return null; // Do not render anything if the modal is not open
//     // }

//     if (!modalRoot) {
//         return null; // Do not render anything if the modal is not open
//     }

//     if (!open) {
//         console.log('Modal root not found or modal not open');
//         return null; // Do not render anything if the modal is not open
//     }



//     return createPortal(
//         <dialog ref={dialog} className={`modal ${className} ${!open ? 'fade-slide-down' : ''}`}>
//             {children}
//         </dialog>,
//         modalRoot!
//     );
// }


// import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
// import { createPortal } from 'react-dom';

interface ModalProps {
    children: React.ReactNode;
    className?: string;
}

interface ModalHandle {
    open: () => void;
    close: () => void;
}

const Modal = forwardRef<ModalHandle, ModalProps>(({ children, className='' }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    // const modalRoot = document.getElementById('modal');

    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    // console.log('Modal root:', modalRoot);

    useEffect(() => {
        const modalElement = document.getElementById('modal');
        if (modalElement) {
            setModalRoot(modalElement);
        } else {
            console.error('Modal root not found!');
        }
    }, []);

    useImperativeHandle(ref, () => {
        return {
            open: () => {
                if (dialogRef.current) {
                    dialogRef.current.showModal();
                }
            },
            close: () => {
                if (dialogRef.current) {
                    dialogRef.current.close();
                }
            },
        }
    });

    if (!modalRoot) {
        return null; // Wait until the modal root is available
    }

    return createPortal(
        <dialog ref={dialogRef} className={`modal ${className}`}>
            {children}
        </dialog>,
        modalRoot!
    );
});

export default Modal;
export type { ModalHandle };