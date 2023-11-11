import {Middleware} from '@reduxjs/toolkit';
import {hitPlayerCell} from "./redux/battleShip/battleShip-reducer";
// import {hitUserCell} from "./redux/battleShip/battleShip-actions";
import {PlayerType} from "./redux/battleShip/battleShip-types";

const customMiddleware: Middleware = (store) => (next) => (action) => {
  const { type, payload } = action;

  const result = next(action);

  if (type === hitPlayerCell.type) {
    if (payload.type === PlayerType.computer) {
      // @ts-ignore
      // eslint-disable-next-line
      // store.dispatch(hitUserCell());
    }
  }

  return result;
};

export default customMiddleware;
