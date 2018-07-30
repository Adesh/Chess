import { combineReducers } from 'redux';
import settings from './settings';
import game from './game';

export default combineReducers({
    settings,
    game
});