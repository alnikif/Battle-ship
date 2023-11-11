import { takeEvery, put } from 'redux-saga/effects';

import { PlayerType } from './battleShip-types';
// import { hitUserCell } from './battleShip-actions';
import { hitPlayerCell } from "./battleShip-reducer";

function* hitUserCellSaga(action: ReturnType<typeof hitPlayerCell>) {
  const { x, y, isHit, shipId, type } = action.payload;
  if (type !== PlayerType.computer) return;

  // @ts-ignore
  // eslint-disable-next-line
  // yield put(hitUserCell());
}

function* battleshipSaga() {
  yield takeEvery('battleShip/hitPlayerCell', hitUserCellSaga);
}

export default battleshipSaga;
