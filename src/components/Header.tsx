import React from "react";
import { useDispatch } from 'react-redux';
import { startNewGame } from "../redux/battleShip/battleShip-reducer";
import { DispatchType } from "../store";

const Header = () => {
  const dispatch: DispatchType = useDispatch();
  const doStartNewGame = () => dispatch(startNewGame());

    return (
        <div className='header'>
            <div>
                <h1>Battleship</h1>
            </div>
            <div>
                <button type="button" onClick={doStartNewGame}>new game</button>
            </div>
            <div>
                <label htmlFor="mode">Randome mode</label>
                <input type="radio" id='mode'  />
            </div>
            <div>
                <h3 className='winnerText'>
                    Winner:
                </h3>
            </div>
      </div>
    )
}

export default Header;
