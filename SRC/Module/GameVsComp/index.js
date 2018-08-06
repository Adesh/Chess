import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';

import { 
  StackActions, 
  NavigationActions 
} from 'react-navigation';

import { connect } from 'react-redux';
import PlayerInfo from './PlayerInfo';
import TopMenu from './TopMenu';
import GLOBAL from '../../Globals';
import ChessBoard from '../../Helper/ChessBoard';
import ChessState from '../../Helper/ChessState';
import { Chess } from 'chess.js/chess';
import Sound from 'react-native-sound';
import * as actionTypes from '../../actions';

const { width } = Dimensions.get('window');

class GameVsComp extends Component { 
  
  chess = new Chess();
  
  FX = new Sound(
    (Platform.OS !== 'ios') ?
      'movesound.wav' :
      '../../Resources/moveSound.wav', 
    Sound.MAIN_BUNDLE,
    error => console.log('Sound not loaded: ',error) 
  );

  componentDidUpdate = async () => {
    let {fen,iAm} = this.props.game;
    let {difficulty} = this.props.settings;

    this.chess.load(fen);

    console.log("componentDidUpdate",iAm, difficulty);
    
    if( this.chess.game_over() || 
        this.chess.in_threefold_repetition()) {
          const status = ChessState.gameStatus(this.chess,iAm);
          return ChessState.leaveGame(status, 'Play Again?')
    }
    
    if( this.chess.turn() !== iAm) {
        console.log('computer turn');
        const suggestion = await ChessState.suggestion(difficulty, fen);
        console.log(suggestion);
        return ChessState.makeMove(this.chess,suggestion,this.notify,this.updateGame);   
    }      
  }
  
  render() {
    this.chess.load(this.props.game.fen);
    let {
      possibleMoves,
      selectedPiece,
      iAm,
      difficulty,
      fen
    } = this.props.game;
    const ifWhiteSideBoard = true;//iAm == 'w';
    return (
        <View style={[styles.maincontainer,{backgroundColor: GLOBAL.COLOR.THEME['swan'].defaultPrimary}]}>
          
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content" 
          />

          <TopMenu  
            leaveGame = {() => ChessState.leaveGame('Leave Game', 'Are you sure about leaving the game?')}
            hint = {async () => ChessState.makeMove(this.chess,await ChessState.suggestion(difficulty, fen),this.notify,this.updateGame)}
            undo = {() => ChessState.undo(this.chess,iAm,this.updateGame)}
            navigate = {this.props.navigation.navigate}
          />  

          <PlayerInfo 
            turn = {this.chess.turn()} 
            iAm = {iAm} 
            fen = {this.props.game.fen}
            opponentSide = {true} 
          />
          
          <View style={styles.gameBoard}>
            {ChessBoard(
                this.chess, 
                {
                  possibleMoves,
                  selectedPiece, 
                  iAm, 
                  updateGame:this.updateGame,     
                  makeMove: (suggestion) => ChessState.makeMove(this.chess,suggestion,this.notify,this.updateGame)
                }, 
                ifWhiteSideBoard
            )}
          </View>
            
          <PlayerInfo 
            turn = {this.chess.turn()} 
            iAm = {iAm} 
            fen = {this.props.game.fen}
            opponentSide={false} 
          />
          
        </View>  
    );
  }

  notify = (vibration,sound,FX) => {
    try{
      if(vibration === true) 
        Vibration.vibrate();
      if(sound === true)
        FX.play(); 
    } catch(err) {
    }    
  };

  resetToHome = (navigation) => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Welcome' })],
    });

    return navigation.dispatch(resetAction);
  };

  updateGame = this.props.onUpdateGame;

}

const mapStateToProps = state => {
  return {
    settings: state.settings,
    game: state.game
  };
};

const mapDispatchToProps = dispatch => {
  return {

    onUpdateIfWhiteSideBoard : val => dispatch({
      type: actionTypes.UPDATE_IF_WHITE_SIDE_BOARD,
      val,
    }),

    onUpdateGame : (selectedPiece, possibleMoves, fen, turn) => dispatch({
      type: actionTypes.UPDATE_GAME,
      selectedPiece, 
      possibleMoves, 
      fen,
      turn
    }),
  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameVsComp);

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  },
  gameBoard:{
    width:width,
    height:width+2,
    flexDirection:'row',
    flexWrap:'wrap',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:GLOBAL.COLOR.DEVIDER
  },
});