import {
  Alert,
} from 'react-native';

import { 
  StackActions, 
  NavigationActions 
} from 'react-navigation';

import API from './API';

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
      ],
      { cancelable: false }
    );
  },
  
  makeMove: (chess,suggestion,notify,updateGame) => {
    chess.move({ ...suggestion });
    notify();
    updateGame(
      -1, 
      [], 
      chess.fen(),
      chess.turn()
    );
  },     

  undo: (chess,iAm,updateGame) => {
    if(chess.turn() === iAm){
      updateGame(
        -1, 
        [], 
        chess.undo().undo().fen(),
        chess.turn()
      );
    }
  },

};

export default ChessState;