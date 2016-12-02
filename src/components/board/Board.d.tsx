interface IBoardProps {
    onTouch: (row: number, column: number) => void;
    mappedMoves: {[key: number]: {[key: number]: TileSign}};
    lastMove: IMove;
}