import * as actionTypes from '../actions';

const initialState = {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    ifWhiteSideBoard: true,
    iAm: 'w',
    selectedPiece: -1,
    possibleMoves: [],
};

const game = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_FEN:
            return {
                ...state,
                fen: null
            }
        case actionTypes.UPDATE_IF_WHITE_SIDE_BOARD:
            return {
                ...state,
                ifWhiteSideBoard: null
            }
        case actionTypes.UPDATE_I_AM:
            return {
                ...state,
                iAm: null
            }
        case actionTypes.UPDATE_SELECTED_PIECE:
            return {
                ...state,
                selectedPiece: null
            }
        case actionTypes.UPDATE_POSSIBLE_MOVES:
            return {
                ...state,
                possibleMoves: null
            }
        
        default:
            return state;    
    }
};

export default game;