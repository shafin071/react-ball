import { useRef } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import PlayArea from './components/PlayArea';
// import Paddle from './components/Paddle';


function App() {
	const width = 600
    const height = 500

	const playAreaContainerStyle: React.CSSProperties = {
		width: width,
		height: height,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	}

	return (
		<div className='play-area-container' style={playAreaContainerStyle}>
			<PlayArea />
		</div>
	)
}

export default App;
