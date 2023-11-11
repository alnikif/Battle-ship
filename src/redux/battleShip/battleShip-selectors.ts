import { RootState } from '../../store';
import { createSelector } from "@reduxjs/toolkit";
import getBoardCellsData from "./utils/getBoardCellsData";

export const selectBattleShip = (state: RootState) => state.battleShip;
export const selectUserState = (state: RootState) => selectBattleShip(state).user;
export const selectComputerState = (state: RootState) => selectBattleShip(state).computer;

export const selectUserBoardCellsData = createSelector(
  selectUserState,
  getBoardCellsData
);

export const selectComputerBoardCellsData = createSelector(
  selectComputerState,
  getBoardCellsData
);
