import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import "./App.css";
import TileGrid from "./components/TileGrid";

const rotateLeft = (tiles, size) => {
	const newTiles = [];
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			let k = size - 1 - i;
			newTiles[j + i * size] = tiles[k + j * size];
		}
	}
	return newTiles;
};

const rotateRight = (tiles, size) => {
	const newTiles = [];
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			let k = size - 1 - j;
			newTiles[j + i * size] = tiles[i + k * size];
		}
	}
	return newTiles;
};

const compress = (tiles, callback, size) => {
	let newTiles = [];
	let score = 0;
	for (let i = 0; i < size; i++) {
		let arr = tiles.slice(i * size, i * size + size).filter((x) => x !== 0);
		while (arr.length < size) {
			arr.push(0);
		}
		for (let j = 0; j < size - 1; j++) {
			if (arr[j] === 0) {
				break;
			} else if (arr[j] === arr[j + 1]) {
				arr[j] *= 2;
				score += arr[j];
				arr[j + 1] = 0;
				arr = arr.filter((x) => x !== 0);
				while (arr.length < size) {
					arr.push(0);
				}
			}
		}
		newTiles = [...newTiles, ...arr];
	}
	callback((_score) => _score + score);
	return newTiles;
};

const checkGameOver = (tiles, size) => {
	let isGameOver = true;
	let zeroCount = tiles.reduce((a, c) => (c === 0 ? a + 1 : a), 0);
	if (zeroCount > 0) {
		return false;
	}
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size - 1; j++) {
			if (tiles[i * size + j] === tiles[i * size + j + 1]) {
				isGameOver = false;
			}
		}
	}

	for (let j = 0; j < size; j++) {
		for (let i = 0; i < size - 1; i++) {
			if (tiles[i * size + j] === tiles[(i + 1) * size + j]) {
				isGameOver = false;
			}
		}
	}
	return isGameOver;
};

const addRandomTile = (tiles) => {
	let zeroIndex = tiles
		.map((tile, ind) => (tile === 0 ? ind + 1 : 0))
		.filter((x) => x !== 0);
	let newTiles = tiles;

	if (Math.random() > 0.5) {
		newTiles[zeroIndex[Math.floor(Math.random() * zeroIndex.length)] - 1] = 2;
	} else {
		newTiles[zeroIndex[Math.floor(Math.random() * zeroIndex.length)] - 1] = 4;
	}
	return newTiles;
};

function App() {
	const [size, setSize] = useState(4);
	const [tiles, setTiles] = useState(() => {
		return addRandomTile(addRandomTile(new Array(size * size).fill(0)));
	});
	const [isGameOver, setIsGameOver] = useState(false);
	const [score, setScore] = useState(0);
	const [bestScore, setBestScore] = useState(
		localStorage.getItem("8192BEST") || 0
	);

	const handleSwipe = (e) => {
		if (checkGameOver(tiles, size)) {
			setIsGameOver(true);
		} else {
			let T = [];
			switch (e.dir) {
				case "Up":
					//left//compress//right
					T = rotateLeft(tiles, size);
					T = compress(T, setScore, size);
					T = rotateRight(T, size);
					T = addRandomTile(T);
					setTiles(T);
					break;
				case "Down":
					//right//compress//left
					T = rotateRight(tiles, size);
					T = compress(T, setScore, size);
					T = rotateLeft(T, size);
					T = addRandomTile(T);
					setTiles(T);
					break;
				case "Right":
					//right //right//compress//left //left
					T = rotateRight(tiles, size);
					T = rotateRight(T, size);
					T = compress(T, setScore, size);
					T = rotateLeft(T, size);
					T = rotateLeft(T, size);
					T = addRandomTile(T);
					setTiles(T);
					break;
				case "Left":
					//compress
					T = compress(tiles, setScore, size);
					T = addRandomTile(T);
					setTiles(T);
					break;
				default:
					break;
			}
		}
	};

	const handlers = useSwipeable({
		onSwiped: handleSwipe,
		preventDefaultTouchmoveEvent: true,
	});

	useEffect(() => {
		const vmin =
			(Math.min(window.innerHeight, window.innerWidth) * 4 * 5) / 100 / size;
		document.documentElement.style.setProperty("font-size", vmin + "px");
		setTiles((t) => {
			return addRandomTile(addRandomTile(new Array(size * size).fill(0)));
		});
	}, [size]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (checkGameOver(tiles, size)) {
				setIsGameOver(true);
			} else {
				let T = [];
				switch (e.keyCode) {
					case 38:
						//key up
						//left//compress//right
						T = rotateLeft(tiles, size);
						T = compress(T, setScore, size);
						T = rotateRight(T, size);
						T = addRandomTile(T);
						setTiles(T);
						break;
					case 40:
						//key down
						//right//compress//left
						T = rotateRight(tiles, size);
						T = compress(T, setScore, size);
						T = rotateLeft(T, size);
						T = addRandomTile(T);
						setTiles(T);
						break;
					case 39:
						//key right
						//right //right//compress//left //left
						T = rotateRight(tiles, size);
						T = rotateRight(T, size);
						T = compress(T, setScore, size);
						T = rotateLeft(T, size);
						T = rotateLeft(T, size);
						T = addRandomTile(T);
						setTiles(T);
						break;
					case 37:
						//key left
						//compress
						T = compress(tiles, setScore, size);
						T = addRandomTile(T);
						setTiles(T);
						break;
					default:
						break;
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [tiles, size]);

	const handleReplay = () => {
		setTiles(() => {
			return addRandomTile(addRandomTile(new Array(size * size).fill(0)));
		});
		if (score > bestScore) {
			setBestScore(score);
			localStorage.setItem("8192BEST", score);
		}
		setScore(0);
		setIsGameOver(false);
	};
	const handleSize = (val) => {
		if (val === -1 && size > 3) {
			setSize((size) => size + val);
		} else if (val === 1 && size < 20) {
			setSize((size) => size + val);
		}
	};

	return (
		<div className="App" {...handlers}>
			<div className="btnWrapper">
				<button
					className="sub btn"
					onClick={(e) => {
						e.preventDefault();
						handleSize(-1);
					}}
				>
					-
				</button>
				<div className="sizeDiv">{size}</div>
				<button
					className="add btn"
					onClick={(e) => {
						e.preventDefault();
						handleSize(1);
					}}
				>
					+
				</button>
			</div>
			<TileGrid tiles={tiles} size={size} />
			<div className="score">
				<div>
					<span className="small">Score: </span>
					{score}
				</div>
				<div>
					<span className="small">Best: </span>
					{bestScore}
				</div>
			</div>
			{isGameOver && (
				<div className="gameover" onClick={handleReplay}>
					GAME OVER
				</div>
			)}
		</div>
	);
}
export default App;
