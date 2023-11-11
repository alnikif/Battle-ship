import React, {useCallback} from "react";
import RemainingBoard from "../RemainingBoard";
import {Cell, PlayerType} from "../../redux/battleShip/battleShip-types";
import {useDispatch, useSelector} from "react-redux";
import { selectComputerBoardCellsData, selectUserBoardCellsData } from "../../redux/battleShip/battleShip-selectors";
import './Board.scss';
import {hitComputerCell} from "../../redux/battleShip/battleShip-actions";
import cx from 'classnames';
import {DispatchType} from "../../store";

type BoardPropsType = {
  type: PlayerType;
}

const Board = (props: BoardPropsType) => {
    const { type } = props;

    const dispatch: DispatchType = useDispatch();

    const isComputerBoard = type === PlayerType.computer;
    const computerData = useSelector(selectComputerBoardCellsData);
    const userData = useSelector(selectUserBoardCellsData);
    const board = isComputerBoard ? computerData : userData;

    const doHitComputerCell = useCallback((payload: Cell) => (
      dispatch(hitComputerCell({...payload, type}))
    ), [type]);

    const onHitCell = (boardCell: Cell) => isComputerBoard && doHitComputerCell(boardCell);

  return (
    <div className="board-wrapper">
        <RemainingBoard/>
        <div className="board">
            {board.map((row, rowIndex)=> (
                <div key={rowIndex} className={`row row-${rowIndex}`}>
                    {row.map((boardCell, colIndex)=> {
                      const { x, y, isHit, shipId } = boardCell;
                      const boardCellClassName = cx(`col col-${colIndex}`, {
                        'shipCell': (!isComputerBoard && shipId) || (shipId && isHit),
                      });

                      return (
                        <div
                          key={`${x}${y}`}
                          className={boardCellClassName}
                          onClick={() => onHitCell(boardCell)}
                        >
                          {isHit && <div className="hitCell" />}
                        </div>
                      );
                    })}
                </div>
            ))}
        </div>
    </div>
  );
}

export default Board;
