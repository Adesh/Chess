import * as actionTypes from './actions';

const initialState = {
    theme : {
        background: "black",
        color:"red",
        fontSize: 16,
    },

    settings: {
        difficulty:'5', // Beginer:5, Pro:8, GrandMaster: 10
  		sound: true,
  		vibration: true,
        statusBar:false,
  		showPossMove:true,
        showLastMove:true,
        diffPickerModal: false,
  		clearStateModal: false,
        themePickerModal: false,
  		//vsHumanTotal:0,
  		//vsHumanWon:0,
  		//vsHumanScore:0,
  		vsCompTotal:0,
  		vsCompWon:0,
  		vsCompScore:0,
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