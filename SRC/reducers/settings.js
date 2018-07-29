import * as actionTypes from '../actions';
import GLOBAL    from '../Globals';

const initialState = {
   settings: {
        difficulty: GLOBAL.APP_SETTING.DEFAULT.difficulty, //'8', // Beginer:5, Pro:8, GrandMaster: 10
  		sound: GLOBAL.APP_SETTING.DEFAULT.sound, //true,
  		vibration: GLOBAL.APP_SETTING.DEFAULT.vibration, //true,
        showPossMove: GLOBAL.APP_SETTING.DEFAULT.showPossMove, //true,
        showLastMove: GLOBAL.APP_SETTING.DEFAULT.showLastMove //false
    },
};

const settings = (state = initialState, action) => {
    switch (action.type) {
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

export default settings;