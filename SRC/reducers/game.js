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
                fen: action.val
            }
        case actionTypes.UPDATE_IF_WHITE_SIDE_BOARD:
            return {
                ...state,
                ifWhiteSideBoard: action.val
            }
        case actionTypes.UPDATE_I_AM:
            return {
                ...state,
                iAm: action.val
            }
        case actionTypes.UPDATE_SELECTED_PIECE:
            return {
                ...state,
                selectedPiece: action.val
            }
        case actionTypes.UPDATE_POSSIBLE_MOVES:
            return {
                ...state,
                possibleMoves: action.val
            }

        case actionTypes.UPDATE_GAME: 
            console.log("updateGame reducer",action);
            return {
                ...state,
                selectedPiece : action.selectedPiece, 
                possibleMoves : action.possibleMoves, 
                fen : action.fen ? action.fen : state.fen
            }    
        
        default:
            return state;    
    }
};

export default game;