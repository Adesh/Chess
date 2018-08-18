import * as actionTypes from '../actions';

const initialState = {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    ifWhiteSideBoard: true,
    iAm: 'w',
    history: [],
    //turn: 'w',
    selectedPiece: -1,
    possibleMoves: [],
    difficulty: 5,
};

const game = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_FEN:
            return {
                ...state,
                fen: action.val
            }

        case actionTypes.UPDATE_IF_WHITE_SIDE_BOARD:
            return {
                ...state,
                ifWhiteSideBoard: action.val
            }

        case actionTypes.UPDATE_GAME: 
            return {
                ...state,
                selectedPiece : action.selectedPiece, 
                possibleMoves : action.possibleMoves, 
                fen : action.fen ? action.fen : state.fen,
                history: action.history ? [...action.history] : [...state.history] 
            }    
        
        default:
            return state;    
    }
};

export default game;