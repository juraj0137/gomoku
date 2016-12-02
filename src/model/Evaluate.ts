export const FIELD_EMPTY = 0;
export const FIELD_OPPONENT = 1;
export const FIELD_MINE = 2;

const VECTOR_PART_ROW = 1;
const VECTOR_PART_COL = 0;

type VECTOR = [number, number];
type MATRIX = number[][];

const vectors: {[key: string]: VECTOR} = {
    left: [-1, 0],
    right: [1, 0],
    top: [0, -1],
    bottom: [0, 1],
    topleft: [-1, -1],
    topright: [-1, 1],
    bottomleft: [1, -1],
    bottomright: [1, 1]
};

export function evaluatedGameBoard(matrix: MATRIX, sameInRow: number = 5): MATRIX {
    return matrix.map((row, rowNumber) => {
        return row.map((column, columnNumber) => evaluateField(matrix, rowNumber, columnNumber, sameInRow));
    });
}

export function evaluateField(matrix: MATRIX, row: number, col: number, sameInRow: number = 5): number {

    let myVectors = [
        vectors['right'],
        vectors['bottom'],
        vectors['bottomright'],
        vectors['topright'],
    ];

    let tmpResult: EVALUATION_OF_SEQUENCE;
    let evaluation = {offensive: 0, defensive: 0, empty: 0};

    for (let i = 0; i < myVectors.length; i++) {
        tmpResult = _evaluateSequence(matrix, row, col, sameInRow, myVectors[i]);
        evaluation.empty += tmpResult.empty;
        evaluation.offensive += tmpResult.offensive;
        evaluation.defensive += tmpResult.defensive;
    }

    return _combineEvaluations(evaluation.offensive, evaluation.defensive, evaluation.empty);
}

function _isInBoundaries(matrix: MATRIX, row: number, column: number, sameInRow: number, vector: VECTOR) {
    let endOfRow = row + (sameInRow - 1) * vector[VECTOR_PART_ROW];
    let endOfColumn = column + (sameInRow - 1) * vector[VECTOR_PART_COL];

    return typeof matrix[row] != 'undefined' && typeof matrix[row][column] != 'undefined'
        && typeof matrix[endOfRow] != 'undefined' && typeof matrix[endOfRow][endOfColumn] != 'undefined';
}

type EVALUATION_OF_SEQUENCE = {offensive: number, defensive: number, empty: number};
function _evaluateSequence(matrix: MATRIX, row: number, col: number, sameInSequence: number, vector: VECTOR) {

    let result: EVALUATION_OF_SEQUENCE = {offensive: 0, defensive: 0, empty: 0};

    let emptyFields = 0;

    let opponentFields = 0;
    let opponentFieldsInRow = 0;
    let opponentFieldsInRowMax = 0;
    let opponentInRow = false;

    let mineFields = 0;
    let mineFieldsInRow = 0;
    let mineFieldsInRowMax = 0;
    let mineInRow = false;

    for (let shift = 0; shift < sameInSequence; shift++) {

        let firstRowCoordinate = row - shift * vector[VECTOR_PART_ROW];
        let firstColCoordinate = col - shift * vector[VECTOR_PART_COL];

        // check if we are in boundaries
        if (!_isInBoundaries(matrix, firstRowCoordinate, firstColCoordinate, sameInSequence, vector))
            continue;

        if (matrix[row][col] != FIELD_EMPTY) {
            result.empty = -10;
            break;
        }

        emptyFields = 0;

        opponentFields = 0;
        opponentFieldsInRow = 0;
        opponentFieldsInRowMax = 0;
        opponentInRow = false;

        mineFields = 0;
        mineFieldsInRow = 0;
        mineFieldsInRowMax = 0;
        mineInRow = false;

        for (let i = 0; i < sameInSequence; i++) {
            let currentRow = firstRowCoordinate + i * vector[VECTOR_PART_ROW];
            let currentCol = firstColCoordinate + i * vector[VECTOR_PART_COL];
            let field = matrix[currentRow][currentCol];

            if (field == FIELD_EMPTY) {
                emptyFields++;

                opponentFieldsInRow = 0;
                opponentInRow = false;

                mineFieldsInRow = 0;
                mineInRow = false;
            } else if (field == FIELD_OPPONENT) {

                opponentFields++;
                opponentFieldsInRow = opponentInRow ? opponentFieldsInRow + 1 : 1;
                opponentFieldsInRowMax = Math.max(opponentFieldsInRowMax, opponentFieldsInRow);
                opponentInRow = true;

                mineFieldsInRow = 0;
                mineInRow = false;
            } else if (field == FIELD_MINE) {

                mineFields++;
                mineFieldsInRow = mineInRow ? mineFieldsInRow + 1 : 1;
                mineFieldsInRowMax = Math.max(mineFieldsInRowMax, mineFieldsInRow);
                mineInRow = true;

                opponentFieldsInRow = 0;
                opponentInRow = false;
            }
        }

        if (mineFields == 0 && opponentFields > 0) {
            result.defensive += _evaluateOpponent(sameInSequence - opponentFieldsInRowMax, true); // same in row
            result.defensive += _evaluateOpponent(sameInSequence - opponentFields);
        }

        if (opponentFields == 0 && mineFields > 0) {
            result.offensive += _evaluateMine(sameInSequence - mineFieldsInRowMax, true); // same in row
            result.offensive += _evaluateMine(sameInSequence - mineFields);
        }

        // empty sequence
        if (emptyFields == sameInSequence) result.empty += _evaluateEmpty(1);
    }
    return result;
}

function _evaluateEmpty(count: number = 0) {
    return count / 2;
}

function _evaluateOpponent(countToLoose: number = 0, inRow: boolean = false) {
    let result = 0;

    switch (countToLoose) {
        case 1:
            result = 100;
            break;
        case 2:
            result = 50;
            break;
        case 3:
            result = 10;
            break;
        case 4:
            result = 2;
            break;
        case 5:
            result = 1;
            break;
    }

    return inRow ? result * 2 : result;
}

function _evaluateMine(countToWon: number = 0, inRow: boolean = false) {
    let result = 0;

    switch (countToWon) {
        case 1:
            result = 130;
            break;
        case 2:
            result = 50;
            break;
        case 3:
            result = 10;
            break;
        case 4:
            result = 2;
            break;
        case 5:
            result = 1;
            break;
    }

    return inRow ? result * 2 : result;
}

function _combineEvaluations(offensive: number = 0, defensive: number = 0, empty: number = 0) {
    return offensive + defensive + empty;
}
