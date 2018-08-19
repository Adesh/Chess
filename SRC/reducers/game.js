import * as actionTypes from '../actions';

const initialState = {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    ifWhiteSideBoard: true,
    iAm: 'w',
    history: ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
    selectedPiece: -1,
    possibleMoves: [],
    moves: []
};

const game = (state = initialState, action) => {
    switch (action.type) {
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
                history: action.history ? [...action.history] : [...state.history],
                moves: action.moves ? [...action.moves] : [...state.history]  
            }    
        
        default:
            return state;    
    }
};

export default game;