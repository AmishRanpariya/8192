import React from "react";
import Tile from "./Tile";

const TileGrid = ({ tiles, size }) => {
	return (
		<div
			className="TileGrid"
			style={{
				gridTemplateColumns: `repeat(${size},1fr)`,
				gridTemplateRows: `repeat(${size},1fr)`,
			}}
		>
			{tiles.map((tile, _) => (
				<Tile key={_} id={_} val={tile} />
			))}
		</div>
	);
};
export default TileGrid;
