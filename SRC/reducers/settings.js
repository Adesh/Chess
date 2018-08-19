import * as actionTypes from '../actions';
import GLOBAL    from '../Globals';

const initialState = {
    difficulty: GLOBAL.APP_SETTING.DEFAULT.difficulty, //'8', // Beginer:5, Pro:8, GrandMaster: 10
  	sound: GLOBAL.APP_SETTING.DEFAULT.sound, //true,
  	vibration: GLOBAL.APP_SETTING.DEFAULT.vibration, //true,
    showPossMoves: GLOBAL.APP_SETTING.DEFAULT.showPossMoves, //true,
    showLastMove: GLOBAL.APP_SETTING.DEFAULT.showLastMove, //false
    showCellId: GLOBAL.APP_SETTING.DEFAULT.showCellId, //false
};

const settings = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_SETTINGS:
            return {
                ...state,
                [action.key]: action.val
            };
        
        default:
            return state;    
    }
};

export default settings;