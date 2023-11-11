import { configureStore, AnyAction, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { fork, all } from 'redux-saga/effects';

import battleShipReducer from './redux/battleShip/battleShip-reducer';
import battleshipSaga from "./redux/battleShip/battleShip-saga";
import customMiddleware from "./custom-redux-middleware";

const sagaMiddleware = createSagaMiddleware();
/*
 * better to keep rootSaga in separate file
 */
function* rootSaga() {
    yield all([
        fork(battleshipSaga),
    ]);
}

/*
 * better to keep rootReducer in separate file
 */
const rootReducer = {
    battleShip: battleShipReducer,
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk, sagaMiddleware, customMiddleware],
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>
export type ThunkType<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
export type DispatchType = ThunkDispatch<RootState, unknown, AnyAction>;

