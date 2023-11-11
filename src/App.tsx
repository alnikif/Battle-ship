import React from 'react';
import './App.scss';
import Header from './components/Header';
import Board from './components/Board/Board';
import Providers from './Providers';
import {PlayerType} from "./redux/battleShip/battleShip-types";

function App() {
  return (
      <Providers>
        <div>
          <Header />
          <Board type={PlayerType.computer} />
          <Board type={PlayerType.user} />
        </div>
      </Providers>
  );
}

export default App;


