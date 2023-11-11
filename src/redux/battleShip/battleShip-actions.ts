import {Cell, PlayerType} from "./battleShip-types";
import {DispatchType, ThunkType} from "../../store";
import {hitPlayerCell} from "./battleShip-reducer";
import {getNextComputerHitMove} from "./utils/battleShip-utils";
import {selectUserBoardCellsData, selectUserState} from "./battleShip-selectors";

export const hitUserCell = (): ThunkType => (dispatch: DispatchType, getState) => {
  const state = getState();

  const { ships: userShips } = selectUserState(state);
  const userBoard = selectUserBoardCellsData(state);

  const sunkenShip = userShips.find(({ cells }) => {
    const isSunken = cells.some((cell) => cell.isHit);
    const isDrowned = cells.every((cell) => cell.isHit);
    return isSunken && !isDrowned;
  }) || null;

  const nextMoveCell = getNextComputerHitMove(userBoard, sunkenShip);

  dispatch(hitPlayerCell({ ...nextMoveCell, type: PlayerType.user }));
};

export const hitComputerCell = (payload: Cell & { type: PlayerType }): ThunkType => (dispatch: DispatchType, getState) => {
  dispatch(hitPlayerCell(payload));
  dispatch(hitUserCell());
};
