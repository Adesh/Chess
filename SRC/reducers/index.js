import { combineReducers } from 'redux';
import theme from './theme';
import settings from './settings';
import game from './game';

export default combineReducers({
    theme,
    settings,
    game
});