export enum Direction {
    horizontal = 'horizontal',
    vertical = 'vertical'
}

export enum GameMode {
    random = 'random',
    controlled = 'controlled'
}

export enum PlayerType {
    user = 'user',
    computer = 'computer'
}

export type Cell = {
    x: number;
    y: number;
    isHit?: boolean;
    shipId?: string | null;
}

export type Board = Cell[][];

export type Ship = {
    id: string;
    cells: Cell[];
}

export type PlayerStateType = {
  board: Board,
  ships: Ship[],
};

export type BattleShipState = {
    mode: GameMode;
    winner: PlayerType | null;
    user: PlayerStateType,
    computer: PlayerStateType
}
