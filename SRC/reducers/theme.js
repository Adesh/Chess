import * as actionTypes from '../actions';

const initialState = {
    theme : {
        background: "black",
        color:"red",
        fontSize: 16,
    },
};

const theme = (state = initialState, action) => {
    switch (action.type) {
        // theme
        case actionTypes.CHANGE_THEME:
            return {
                ...state,
                theme: {
                    ...state.theme,
                    [action.key]: action.val
                }
            };
        
        default:
            return state;    
    }
};

export default theme;