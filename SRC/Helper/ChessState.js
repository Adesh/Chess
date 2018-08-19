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

  gameStatus: (chess, iAm) => {
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

  leaveGame: (title, msg, resetToHome) => {
    return Alert.alert(
      title,
      msg,  
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {text: 'Yes', onPress: resetToHome },
      ]
    );
  },
  
  makeMove: (chess, suggestion, notify, updateGame, history, moves) => {
    chess.move({ ...suggestion });
    const fen = chess.fen();
    notify();
    history.push(fen)
    moves.push(suggestion)
    updateGame( -1, [], fen, [...history], [...moves]);
  },     

  undo: (chess, iAm, updateGame, history, moves) => {    
    setTimeout(() => {
      if(chess.turn() !== iAm)
      return Toast('Not your turn!');
      
      if(history.length < 1)
      return Toast('Not moves to undo yet!');
      
      Alert.alert(
        'Undo',
        'Do you want to undo your last move?',  
        [
            {text: 'No', onPress: () => {}, style: 'cancel'},
            {text: 'Yes', onPress: () => {
                
                let historyNew = [...history];
                historyNew.pop();
                historyNew.pop();

                let movesNew = [...moves];
                movesNew.pop();
                movesNew.pop();

                updateGame(-1, [], historyNew[historyNew.length-1], historyNew, movesNew) 
              }
            },
        ]
      );
    }, 5);

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