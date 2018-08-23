import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Platform,
  Vibration,
  Alert
} from 'react-native';

import { 
  StackActions, 
  NavigationActions 
} from 'react-navigation';

import { AndroidBackHandler } from 'react-navigation-backhandler';

import { connect } from 'react-redux';
import PlayerInfo from './PlayerInfo';
import TopMenu from './TopMenu';
import GLOBAL from '../../Globals';
import ChessBoard from '../../Helper/ChessBoard';
import ChessState from '../../Helper/ChessState';
import { Chess } from 'chess.js/chess';
import Sound from 'react-native-sound';
import * as actionTypes from '../../redux/actions';
import firebase from 'react-native-firebase';
import Toast from '../../Helper/Toast';
const { width } = Dimensions.get('window');

class GameVsComp extends Component { 
  
  componentDidMount() {
    let analytics = firebase.analytics()
    analytics.setCurrentScreen('GameVsPlayer');

    let oldGameFound = false;
    let {
      fen,
      history,
    } = this.props.game;
    
    let tempChess = new Chess(fen);
    if(
      history.length > 1 && 
      !tempChess.game_over() && 
      !tempChess.in_threefold_repetition()
    ) oldGameFound = true;

    if(oldGameFound) {
      Alert.alert(
        'Game Found',
        `Do you want to load last game?`,  
        [
          {text: 'New Game', onPress: () => this.loadGame('new'), style: 'cancel'},
          {text: 'Load Old Game', onPress: () => this.loadGame('old') },
        ]
      );
    } 
  }

  chess = new Chess();
  
  FX = new Sound(
    (Platform.OS !== 'ios') ?
      'movesound.wav' :
      '../../Resources/moveSound.wav', 
    Sound.MAIN_BUNDLE,
    error => console.log('Sound not loaded: ',error) 
  );

  componentDidUpdate = async () => {
    let {
      fen,
      iAm,
      history,
      moves
    } = this.props.game;
    
    let {
      difficulty
    } = this.props.settings;

    this.chess.load(fen);

    if( this.chess.game_over() || 
        this.chess.in_threefold_repetition()) {
          const status = ChessState.gameStatus(this.chess,iAm);
          return ChessState.leaveGame(
            status, 
            'Play Again?',
            this.resetToHome
          );
    }
    
    if( this.chess.turn() !== iAm) {
        const suggestion = await ChessState.suggestion(difficulty, fen);
        return ChessState.makeMove(
          this.chess,
          suggestion,
          this.notify,
          this.updateGame,
          history,
          moves
        );   
    }      
  }

  loadGame = (newGame) => {
    if(newGame === 'new') 
    return this.props.onUpdateGame(
        -1, 
        [], 
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 
        ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'], 
        []
    );
  }

  hint = async () => {
    let {
      fen,
      history,
      moves,
      iAm
    } = this.props.game;

    let {
      difficulty
    } = this.props.settings;

    this.chess.load(fen);
    if( this.chess.turn() !== iAm)
    return Toast('Not your turn!');

    Toast('Please wait...');
    
    const suggestion = await ChessState.suggestion(difficulty, fen);
    
    Alert.alert(
      'Hint',
      `Do you want to move ${suggestion.from} to ${suggestion.to}?`,  
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {text: 'Yes', onPress: () => ChessState.makeMove(
          this.chess,
          suggestion,
          this.notify,
          this.updateGame,
          history,
          moves
        ) },
      ]
    );
  };

  render() {
    this.chess.load(this.props.game.fen);
    let {
      possibleMoves,
      selectedPiece,
      iAm,
      history,
      moves
    } = this.props.game;
    
    let {
      showCellId,
      showPossMoves,
      showLastMove
    } = this.props.settings;

    const ifWhiteSideBoard = true;//iAm == 'w';
    return (
      <AndroidBackHandler 
        onBackPress={() => ChessState.undo(
          this.chess,
          iAm,this.updateGame,
          history,
          moves
        )}>
        <View style={[styles.maincontainer,{backgroundColor: GLOBAL.COLOR.THEME['swan'].defaultPrimary}]}>
          
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content" 
          />

          <TopMenu  
            leaveGame = {() => ChessState.leaveGame(
              'Leave Game', 
              'Are you sure about leaving the game?',
              this.resetToHome
            )}
            hint = {this.hint}
            undo = {() => ChessState.undo(
              this.chess,
              iAm,
              this.updateGame,
              history,
              moves
            )}
            navigate = {this.props.navigation.navigate}
            myTurn={this.chess.turn() === iAm}
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
                { // game
                  possibleMoves,
                  selectedPiece, 
                  iAm, 
                  updateGame:this.updateGame,     
                  makeMove: (suggestion) => ChessState.makeMove(
                    this.chess,
                    suggestion,
                    this.notify,
                    this.updateGame,
                    history,
                    moves
                  ),
                  history,
                  moves
                }, 
                ifWhiteSideBoard,
                { // settings
                  showCellId,
                  showPossMoves,
                  showLastMove
                } 
            )}
          </View>
            
          <PlayerInfo 
            turn = {this.chess.turn()} 
            iAm = {iAm} 
            fen = {this.props.game.fen}
            opponentSide={false} 
          />
          
        </View> 
      </AndroidBackHandler>   
    );
  }

  notify = () => {
      const {
        vibration,
        sound
      } = this.props.settings;
      
      if(vibration) Vibration.vibrate();
      if(sound) this.FX.play();     
  };

  resetToHome = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Welcome' })],
    });

    return this.props.navigation.dispatch(resetAction);
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

    onUpdateGame : (
      selectedPiece, 
      possibleMoves, 
      fen, 
      history, 
      moves
    ) => dispatch({
      type: actionTypes.UPDATE_GAME,
      selectedPiece, 
      possibleMoves, 
      fen, 
      history,
      moves
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