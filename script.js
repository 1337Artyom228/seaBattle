let table = document.querySelector('#field');

function gamecycle() {
	table = createTable(table);
	playerPlaceShips(table);
	botPlaceShips();
	battle();
}

function createTable(table) {
	let cells = [[],[],[],[],[],[],[],[],[],[]];
	for (let i = 0; i < 10; i++) {
			let newRow = table.insertRow();
			for (let j = 0; j < 10; j++) {
				let newCell = newRow.insertCell();
				newCell.textContent = i*10 + j;
				newCell.dataset.id = i*10 + j;
				newCell.dataset.canPlaceHere = true;
				newCell.dataset.ship = false;
				newCell.className = 'blue';
				cells[i].push(newCell);
			}
		}
	console.log("table created");
	return cells;
}

function playerPlaceShips(table) {
	console.log("player placing ships");
	let shipL = 4;
	let shipStep = 0
	let numOfShips = 1;
	let curNumOfShips = numOfShips;
	
	for (let row of table) {
		for (let cell of row) {
			cell.addEventListener('click', placeShip);
		}
	}
	let lastArrOfcellsAround = 'undefined';
	let lastCell = 'undefined'
	function placeShip(event) {
		let cell = event.target;
		let cellRC = getRCbyId(cell);
		let arrOfCoolCellsAround = canPlaceShipAround(table, cell, shipL);
		//console.log(lastArrOfcellsAround);
		//console.log(cellRC);
		if (shipStep == 0 && cell.dataset.canPlaceHere === 'true' && arrOfCoolCellsAround != []) {
			lastArrOfcellsAround = arrOfCoolCellsAround;
			lastCell = cellRC;
			cellGreen(cell);
			makeAllCellsRedExept(table, arrOfCoolCellsAround);
			console.log("Ship placing from: " + cellRC);
			shipStep = 1;
		} else if (curNumOfShips > 0 && shipStep == 1 && arrConsistsCord(lastArrOfcellsAround, cellRC)) {
			makeShips(table, lastCell, cellRC);
			curNumOfShips--;
			console.log("Ship placing to: " + cellRC);
			shipStep = 0;
		} else if (curNumOfShips == 0 && shipStep == 1) {
			makeShips(table, lastCell, cellRC);
			shipL--;
			numOfShips++;
			shipStep = 0;
			curNumOfShips = numOfShips;
		}
	}
	
	function canPlaceShipAround(table, shipCell, shipL) {
		if (shipL == 1) {
			return true
		}
		shipL--;

		let [shipRow,shipColl] = getRCbyId(shipCell);
		
		let sides = {
			up    : [shipRow - shipL, shipColl],
			left  : [shipRow, shipColl - shipL],
			right : [shipRow, shipColl + shipL],
			down  : [shipRow + shipL, shipColl]
		}

		let arrOfSides = [];
		for (let side in sides) {
			let arrOfCond = [];
			let rowMove = (shipRow < sides[side][0]) ? 1 : -1;
			for (let row = shipRow; compareIDK(row, sides[side][0], rowMove) ; row = row + rowMove) {
				let collMove = (shipColl < sides[side][1]) ? 1 : -1;
				for (let coll = shipColl; compareIDK(coll, sides[side][1], collMove); coll = coll + collMove) {
					arrOfCond.push(cellExistsAnd(table, row, coll, 'blue'));
					/*console.log('------------------------------');
					console.log('canPlaceShipAround function bad logs');
					console.log(side);
					console.log(row + " : " + coll);
					console.log(cellExistsAnd(table, row, coll, 'blue'));
					console.log('------------------------------');*/
				}
			}
			if (arrOfCond.indexOf(false) == -1) {
				arrOfSides.push(sides[side]);
			}
		}
		//console.log(arrOfSides);
		return arrOfSides;
	}	
	
	function makeAllCellsRedExept(table, arrOfCells) {
		for (let row in table) {
		row = parseInt(row);
			for (let cell in table[row]) {
				cell = parseInt(cell);
				let shipNotHere = (table[row][cell].dataset.ship === 'false');
				if (shipNotHere && !arrConsistsCord(arrOfCells, [row, cell])) {
					cellRed(table[row][cell]);
				}
			}
		}
	}
	
	function cellExistsAnd(table, cellX, cellY, color) {
		if ((0 <= cellX && cellX <= 9) && (0 <= cellY && cellY <= 9)) {
			switch(color) {
				case 'blue':
					return (table[cellX][cellY].dataset.canPlaceHere === 'true');
					break;
				case 'green':
					return (table[cellX][cellY].dataset.ship === 'true');
					break;
				case 'red':
					return (table[cellX][cellY].dataset.ship === 'false' && table[cellX][cellY].dataset.canPlaceHere === 'false');
					break;
			}
			console.log("this should be newer seen");
		} else {return false}
	}

	function arrConsistsCord(arrOfCords, clickedCellCord) {
		for (let cellCords of arrOfCords) {
			/*console.log('------------------------------'); //logs
			console.log('arrConssistsCord function logs'); 
			console.log('cellCord :' + cellCords);
			console.log('clickedCellCord :' + clickedCellCord);
			console.log('------------------------------');*/
			if (cellCords[0] == clickedCellCord[0] && cellCords[1] == clickedCellCord[1]) {
				return true;
			}
		}
		return false;
	}
	function getRCbyId(cell){
		let cellRow;
		let cellColl
		if (cell.dataset.id.length > 1) {
			cellRow = parseInt(cell.dataset.id.charAt(0));
			cellColl = parseInt(cell.dataset.id.charAt(1));
		} else {
			cellRow = 0;
			cellColl = parseInt(cell.dataset.id);
		}
		return [cellRow, cellColl];
	}

	function compareIDK(arg1, arg2, num) {
			return (num > 0) ? (arg1 <= arg2) : (arg1 >= arg2);
	}

	function makeShips(table, lastCell, cell) {
		console.log('------------------------------'); //logs
		console.log('makeShips function logs');
		console.log('lastCell :' + lastCell);
		console.log('cell :' + cell);
		console.log('------------------------------');
		let rowMove = (lastCell[0] < cell[0]) ? 1 : -1;
		for (let row = lastCell[0]; compareIDK(row, cell[0], rowMove), row = row + rowMove) {
			let collMove = (lastCell[1] < cell[1]) ? 1 : -1;
			for(let coll = lastCell[1]; compareIDK(coll, cell[1], collMove); coll = coll + collMove) {
				makeGreen(table[row][coll]);
			}
		}
	}
	function cellBlue(cell) {
		cell.dataset.ship = false;
		cell.dataset.canPlaceHere = false;
		cell.textContent = cell.dataset.id;
		cell.className = 'blue';
	}

	function cellGreen(cell) {
		cell.dataset.ship = true;
		cell.dataset.canPlaceHere = false;
		cell.textContent = "ship";
		cell.className = 'green';
	}
	
	function cellRed(cell) {
		cell.dataset.ship = false;
		cell.dataset.canPlaceHere = false;
		cell.textContent = "X";
		cell.className = 'red';
	}
}

function botPlaceShips() {
	
}

function battle() {
	
}

gamecycle()