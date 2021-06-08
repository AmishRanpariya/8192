import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import "./App.css";
import TileGrid from "./components/TileGrid";

const SIZE = 8;
const rotateLeft = (tiles) => {
	const newTiles = [];
	for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
			let k = SIZE - 1 - i;
			newTiles[j + i * SIZE] = tiles[k + j * SIZE];
		}
	}
	return newTiles;
};

const rotateRight = (tiles) => {
	const newTiles = [];
	for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
			let k = SIZE - 1 - j;
			newTiles[j + i * SIZE] = tiles[i + k * SIZE];
		}
	}
	return newTiles;
};

const compress = (tiles, callback) => {
	let newTiles = [];
	let score = 0;
	for (let i = 0; i < SIZE; i++) {
		let arr = tiles.slice(i * SIZE, i * SIZE + SIZE).filter((x) => x !== 0);
		while (arr.length < SIZE) {
			arr.push(0);
		}
		for (let j = 0; j < SIZE - 1; j++) {
			if (arr[j] === 0) {
				break;
			} else if (arr[j] === arr[j + 1]) {
				arr[j] *= 2;
				score += arr[j];
				arr[j + 1] = 0;
				arr = arr.filter((x) => x !== 0);
				while (arr.length < SIZE) {
					arr.push(0);
				}
			}
		}
		newTiles = [...newTiles, ...arr];
	}
	callback((_score) => _score + score);
	return newTiles;
};

const checkGameOver = (tiles) => {
	let isGameOver = true;
	let zeroCount = tiles.reduce((a, c) => (c === 0 ? a + 1 : a), 0);
	if (zeroCount > 0) {
		return false;
	}
	for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE - 1; j++) {
			if (tiles[i * SIZE + j] === tiles[i * SIZE + j + 1]) {
				isGameOver = false;
			}
		}
	}

	for (let j = 0; j < SIZE; j++) {
		for (let i = 0; i < SIZE - 1; i++) {
			if (tiles[i * SIZE + j] === tiles[(i + 1) * SIZE + j]) {
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
	const [tiles, setTiles] = useState(() => {
		return addRandomTile(addRandomTile(new Array(SIZE * SIZE).fill(0)));
	});
	const [isGameOver, setIsGameOver] = useState(false);
	const [score, setScore] = useState(0);

	const handleSwipe = (e) => {
		let T = [];
		switch (e.dir) {
			case "Up":
				//left//compress//right
				T = rotateLeft(tiles);
				T = compress(T, setScore);
				T = rotateRight(T);
				T = addRandomTile(T);
				setTiles(T);
				break;
			case "Down":
				//right//compress//left
				T = rotateRight(tiles);
				T = compress(T, setScore);
				T = rotateLeft(T);
				T = addRandomTile(T);
				setTiles(T);
				break;
			case "Right":
				//right //right//compress//left //left
				T = rotateRight(tiles);
				T = rotateRight(T);
				T = compress(T, setScore);
				T = rotateLeft(T);
				T = rotateLeft(T);
				T = addRandomTile(T);
				setTiles(T);
				break;
			case "Left":
				//compress
				T = compress(tiles, setScore);
				T = addRandomTile(T);
				setTiles(T);
				break;
			default:
				break;
		}
	};

	const handlers = useSwipeable({
		onSwiped: handleSwipe,
		preventDefaultTouchmoveEvent: true,
	});
	useEffect(() => {
		document.querySelector("html").style.fontSize = `calc(5vmin /${SIZE / 4})`;
	}, []);
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (checkGameOver(tiles)) {
				setIsGameOver(true);
			} else {
				let T = [];
				switch (e.keyCode) {
					case 38:
						//key up
						//left//compress//right
						T = rotateLeft(tiles);
						T = compress(T, setScore);
						T = rotateRight(T);
						T = addRandomTile(T);
						setTiles(T);
						break;
					case 40:
						//key down
						//right//compress//left
						T = rotateRight(tiles);
						T = compress(T, setScore);
						T = rotateLeft(T);
						T = addRandomTile(T);
						setTiles(T);
						break;
					case 39:
						//key right
						//right //right//compress//left //left
						T = rotateRight(tiles);
						T = rotateRight(T);
						T = compress(T, setScore);
						T = rotateLeft(T);
						T = rotateLeft(T);
						T = addRandomTile(T);
						setTiles(T);
						break;
					case 37:
						//key left
						//compress
						T = compress(tiles, setScore);
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
	}, [tiles]);

	return (
		<div className="App" {...handlers}>
			<TileGrid tiles={tiles} size={SIZE} />
			<div className="score">{score}</div>
			{isGameOver && <div className="gameover">GAME OVER</div>}
		</div>
	);
}
export default App;
