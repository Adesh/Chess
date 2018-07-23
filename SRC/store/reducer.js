import * as actionTypes from './actions';
import GLOBAL_VAR    from '../Globals';
const initialState = {
    theme : {
        background: "black",
        color:"red",
        fontSize: 16,
    },

    settings: {
        difficulty: GLOBAL_VAR.APP_SETTING.DEFAULT.difficulty, //'8', // Beginer:5, Pro:8, GrandMaster: 10
  		sound: GLOBAL_VAR.APP_SETTING.DEFAULT.sound, //true,
  		vibration: GLOBAL_VAR.APP_SETTING.DEFAULT.vibration, //true,
        showPossMove: GLOBAL_VAR.APP_SETTING.DEFAULT.showPossMove, //true,
        showLastMove: GLOBAL_VAR.APP_SETTING.DEFAULT.showLastMove //false
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_THEME:
            return {
                ...state,
                theme: {
                    ...state.theme,
                    [action.key]: action.val
                }
            };

        case actionTypes.CHANGE_SETTINGS:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    [action.key]: action.val
                }
            };

        default:
            return state;    
    }
};

export default reducer;