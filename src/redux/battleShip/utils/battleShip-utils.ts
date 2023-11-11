import {Board, Cell, Direction, Ship} from "../battleShip-types";
import {SHIPS_CONFIG} from "../battleShip-constants";

export const getArrayFromNumber = (number: number) => Array.from({ length: number }, (_, i) => i + 1);

export const getRandomFromArray = <T>(itemsArray: T[]): T => itemsArray[Math.floor(Math.random() * itemsArray.length)];

export const getDirection = () => getRandomFromArray([Direction.horizontal, Direction.vertical]);

export const getBoard = () => {
    const initialArray = getArrayFromNumber(10);
    return initialArray.reduce((acc: Cell[][], item, yIndex) => {
        const axisArray = getArrayFromNumber(10).map((_, xIndex) => ({x: xIndex, y: yIndex, isHit: false}));
        return [...acc, axisArray];
    }, []);
}

export const BOARD = getBoard();

export const getCellsAround = (cell: { x: number, y: number }): Cell[] => {
    const topCells = [
        { x: cell.x - 1, y: cell.y + 1 },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x + 1, y: cell.y + 1 }
    ];
    const bottomCells = [
        { x: cell.x - 1, y: cell.y - 1 },
        { x: cell.x, y: cell.y - 1 },
        { x: cell.x + 1, y: cell.y - 1 }
    ];
    const sideCells = [
        { x: cell.x - 1, y: cell.y },
        { x: cell.x + 1, y: cell.y }
    ];
    return [...topCells, ...bottomCells, ...sideCells];
};

export const getRestrictedCells = (ships: Ship[]) => (
    ships.reduce((acc: Cell[], item: Ship) => {
        const cellsAround = item.cells.reduce((res: Cell[], cell: Cell) => ([
          ...res, cell, ...getCellsAround(cell as { x: number, y: number })
        ]), []);
        return [...acc,...cellsAround];
    }, [])
);

export const getRandomCell = (trialsCells: Cell[]) => {
    const xPositions = getArrayFromNumber(10).map((_, i) => i);
    const yPositions = getArrayFromNumber(10).map((_, i) => i);
    const randomX = getRandomFromArray(xPositions);
    const randomY = getRandomFromArray(yPositions);
    const randomCell = { x: randomX, y: randomY };
    const isAvailable = !trialsCells.find((item) => item.x === randomX && item.y === randomY);

    if (!isAvailable) getRandomCell([...trialsCells, randomCell]);
    return { randomCell, trialsCells };
};

const getIsFeatureShipCellsAvailable = (restrictedCells: Cell[], featureShipCells: Cell[] | null, shipSize: number): boolean => {
    if (!featureShipCells || featureShipCells.length !== shipSize || featureShipCells.some((item) => item === null || item.x === null || item.y === null)) return false;
    return !restrictedCells.find((item) => !!featureShipCells.find((cell) => (
      cell.x === item.x && cell.y === item.y
    )));
}

const getShipCells = (restrictedCells: Cell[], shipSize: number, trialsCells: Cell[] = []): Cell[] | null => {
    const featureCells: Cell[] = [];
    const direction = getDirection();
    const { randomCell, trialsCells: nextTrialsCells } = getRandomCell([...restrictedCells, ...trialsCells]);

    let currentX = randomCell.x;
    let currentY = randomCell.y;

    for (let i = 0; i < shipSize; i++) {
        if (currentY > 9 || currentX > 9) break;
        const cell = BOARD[currentY][currentX];
        featureCells.push(cell);
        if (direction === Direction.horizontal) currentX += 1;
        if (direction === Direction.vertical) currentY += 1;
    }

    if (!getIsFeatureShipCellsAvailable(restrictedCells, featureCells, shipSize)) {
        return getShipCells(restrictedCells, shipSize, nextTrialsCells);
    }

    return featureCells;
};

export const getShips = () => {
    const ships: Ship[] = [];

    for (const shipConfig of SHIPS_CONFIG ){
        const { id, size } = shipConfig;
        const restrictedCells = getRestrictedCells(ships);
        const shipCells = getShipCells(restrictedCells, size);
        ships.push({ id, cells: shipCells || [] })
    }

    return ships;
};

export const getIsCellAvailable = (cell: Cell, excludedCells: Cell[] = []) => {
    const isExcluded = !!excludedCells.find((item) => item.x === cell.x && item.y === cell.y);
    const isOnBoard = cell.x >= 0 && cell.x <= 9 && cell.y >= 0 && cell.y <= 9;
    return !isExcluded && isOnBoard;
};

const getRandomHitCell = (sunkenShip: Ship | null, boardHitCells: Cell[]): { x: number; y: number} => {
    const shipCells = (sunkenShip?.cells || []).filter((cell) => cell.isHit);
    const { randomCell } = getRandomCell(boardHitCells);

    if (!shipCells.length) return randomCell;

    const firstShipCell = shipCells[0];
    const lastShipCell = shipCells[shipCells.length - 1];

    if (shipCells.length === 1) {
        const availableCells = [
            {x: firstShipCell.x - 1, y: firstShipCell.y},
            {x: firstShipCell.x + 1, y: firstShipCell.y},
            {x: firstShipCell.x, y: firstShipCell.y - 1},
            {x: firstShipCell.x, y: firstShipCell.y + 1},
        ].filter((cell) => getIsCellAvailable(cell, boardHitCells));
        return getRandomFromArray(availableCells);
    }

    const shipAxis = firstShipCell.x === lastShipCell.x ? Direction.vertical : Direction.horizontal;

    if (shipAxis === Direction.horizontal) {
        const availableCells = [
            {x: firstShipCell.x - 1, y: firstShipCell.y},
            {x: lastShipCell.x + 1, y: firstShipCell.y},
        ].filter((cell) => getIsCellAvailable(cell, boardHitCells));
        return getRandomFromArray(availableCells);
    }

    if (shipAxis === Direction.vertical) {
        const availableCells = [
            {x: firstShipCell.x, y: firstShipCell.y - 1},
            {x: firstShipCell.x, y: lastShipCell.y + 1},
        ].filter((cell) => getIsCellAvailable(cell, boardHitCells));
        return getRandomFromArray(availableCells);
    }

    return randomCell;
};

export const getNextComputerHitMove = (board: Board, sunkenShip: Ship | null) => {
    const boardHitCells = board.reduce((acc, row) => ([...acc, ...row.filter((cell) => cell.isHit)]), []);
    const randomCell = getRandomHitCell(sunkenShip, boardHitCells);
    return board[randomCell?.y][randomCell?.x];
}
