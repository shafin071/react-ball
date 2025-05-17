import { motion } from 'framer-motion';
import { getPlayAreaDimensions } from '../helper/playAreaHelper';

interface ConfettiProps {
    playAreaRef: React.RefObject<HTMLDivElement | null>;
}

const Confetti: React.FC<ConfettiProps> = ({ playAreaRef }) => {
    const confettiColors = ['#ff4500', '#ff7f50', '#ffd700', '#32cd32', '#1e90ff', '#ff69b4'];

     const playAreaDims = getPlayAreaDimensions(playAreaRef);

    // Generate an array of confetti pieces
    const confettiPieces = Array.from({ length: 100 }).map((_, index) => ({
        id: index,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        x: Math.random() * playAreaDims.width + playAreaDims.leftEdge, // Random horizontal position within playArea
        y: playAreaDims.topEdge, // Start above the playArea
        size: Math.random() * 10 + 5, // Random size
        delay: Math.random() * 2, // Random animation delay
    }));

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
            {confettiPieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    initial={{
                        x: piece.x,
                        y: piece.y,
                        opacity: 1,
                        rotate: 0,
                    }}
                    animate={{
                        y: window.innerHeight + 100, // Fall below the viewport
                        rotate: 360,
                        opacity: 0,
                    }}
                    transition={{
                        duration: 3, // Duration of the fall
                        delay: piece.delay,
                        ease: 'easeOut',
                    }}
                    style={{
                        position: 'absolute',
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                        backgroundColor: piece.color,
                        borderRadius: '50%', // Make it circular
                    }}
                />
            ))}
        </div>
    );
};

export default Confetti;