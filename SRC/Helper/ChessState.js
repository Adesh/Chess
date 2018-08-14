import {
  Alert,
} from 'react-native';

import { 
  StackActions, 
  NavigationActions 
} from 'react-navigation';

import API from './API';
import Toast from './Toast';

const ChessState = {
  
  suggestion: async (difficulty, fen) => {
    const urlLink = 
    `?d=${difficulty}&fen=${encodeURIComponent(fen)}`
    
    let res = await API(urlLink);
    
    res = res.split(' ');
    let from  = res[1].substr(0,2);
    let to    = res[1].substr(2,2);

    let promotion = '';
    try{
      promotion  = res[1].substr(4);
    }catch(e){}
    
    return {
      from, 
      to, 
      promotion
    };
  },

  gameStatus: (chess,iAm) => {
    if(chess.in_checkmate() && chess.turn() !== iAm)
      return 'Checkmate, You win!';

    if(chess.in_checkmate() && chess.turn() === iAm)
      return 'Checkmate, Computer wins!';  
    
    if(chess.in_draw())
      return 'Draw';
    
    if(chess.in_stalemate())
      return 'Stalemate';
    
    if(chess.in_threefold_repetition())
      return 'Threefold repetition';  
  },

  leaveGame: (title, msg) => {
    return Alert.alert(
      title,
      msg,  
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {text: 'Yes', onPress: this.resetToHome },
      ]
    );
  },
  
  makeMove: (chess,suggestion,notify,updateGame) => {
    chess.move({ ...suggestion });
    notify();
    updateGame(
      -1, 
      [], 
      chess.fen()
    );
  },     

  undo: (chess,iAm,updateGame) => {
    
    if(chess.turn() === iAm){
      Alert.alert(
        'Undo',
        'Do you want to undo your last move?',  
        [
          {text: 'No', onPress: () => {}, style: 'cancel'},
          {text: 'Yes', onPress: () => {
            chess.undo();
            chess.undo();
            updateGame(-1, [], chess.fen() )
          } },
        ]
      );
    } else {
      Toast('Not your turn!');
    }

    /*
    *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
    *   and react-navigation's lister will not get called, thus not popping the screen.
    *
    *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
    * */
    return true;
  },

};

export default ChessState;