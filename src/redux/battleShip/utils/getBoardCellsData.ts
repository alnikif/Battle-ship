import {Cell, PlayerStateType} from "../battleShip-types";

const getBoardCellsData = (playerState: PlayerStateType) => {
  const { board: playerBoard, ships: playerShips } = playerState;

  return playerBoard.reduce((acc: Cell[][], row) => {
    const rowWithExtendedCells = row.reduce((res: Cell[], rowCell) => {
      const { x, y, isHit } = rowCell;

      const ship = playerShips.find((playerShip) => (
        playerShip.cells.find((cell) => cell.x === x && cell.y === y)
      ));
      // TODO: next two lines it's how you get shipId from the ship. Ship can be Ship type or undefined
      // const { id: shipId, cells } = ship || { id: '', cells: [] };
      const shipId = ship ? ship.id : null;
      const extendedCell = { x, y, isHit, shipId };

      return [...res, extendedCell];
    }, []);

    return [...acc, rowWithExtendedCells];
  }, [])
}

export default getBoardCellsData;
