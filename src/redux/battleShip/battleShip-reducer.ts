import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {BattleShipState, Cell, GameMode, PlayerType} from './battleShip-types';
import {BOARD, getRestrictedCells, getShips} from './utils/battleShip-utils';

const getInitialComputerState = () => ({
    board: BOARD,
    ships: getShips(),
});

const getInitialUserState = () => ({
    board: BOARD,
    ships: getShips(),
});

const getInitialState = (): BattleShipState  => ({
    mode: GameMode.random,
    winner: null,
    computer: getInitialComputerState(),
    user: getInitialUserState(),
});



export const battleShipSlice = createSlice({
    name: 'battleShip',
    initialState: getInitialState(),
    reducers: {
        startNewGame: () => getInitialState(),
        hitPlayerCell: (state, action: PayloadAction<Cell & { type: PlayerType }>) => {
            const { x, y, isHit, shipId, type } = action.payload;
            const { ships: playerShips, board: playerBoard } = state[type];

            const nextShips = playerShips.map((playerShip) => {
                if (playerShip.id === shipId) {
                    const nextCells = playerShip.cells.map((playerShipCell) => {
                        const isTargetCell = playerShipCell.x === x && playerShipCell.y === y;
                        return isTargetCell ? {...playerShipCell, isHit: true} : playerShipCell;
                    });
                    return { ...playerShip, cells: nextCells };
                }
                return playerShip;
            });
            const targetShip = nextShips.find((item) => item.id === shipId);
            const isShipDrowned = targetShip && !targetShip.cells.find((cell) => !cell.isHit);
            const cellsAround = shipId && isShipDrowned ? getRestrictedCells([targetShip]) : [];

            const filteredCellsAround = targetShip
              ? cellsAround.filter((cell) => (
                  !targetShip.cells.find(shipCell => shipCell.x === cell.x && shipCell.y === cell.y)
              ))
            : cellsAround;

            const hitCells = [action.payload, ...filteredCellsAround];

            const nextBoard = playerBoard.map((boarRow) => (
              boarRow.map((rowCell) => {
                  const isHitCell = !!hitCells.find((hitCell) => hitCell.x === rowCell.x && hitCell.y === rowCell.y);
                  return isHitCell ? { ...rowCell, isHit: true } : rowCell;
              })
            ));

            state[type].board = nextBoard;
            state[type].ships = nextShips;
        },
    },
})
export const {
    startNewGame,
    hitPlayerCell
} = battleShipSlice.actions;

export default battleShipSlice.reducer;
