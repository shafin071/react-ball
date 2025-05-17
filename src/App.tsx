import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import PlayArea from './components/PlayArea';


function App() {
	const width = 1000
    const height = 800

	const playAreaContainerStyle: React.CSSProperties = {
		width: width,
		height: height,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '40px',
	}

	return (
		<div className='play-area-container' style={playAreaContainerStyle}>
			<PlayArea />
		</div>
	)
}

export default App;
