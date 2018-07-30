import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Vibration,
  Platform,
  Alert,
  Text
} from 'react-native';

import { 
  StackActions, 
  NavigationActions 
} from 'react-navigation';

import { Chess } from 'chess.js/chess';
import Sound from 'react-native-sound';
import { connect } from 'react-redux';

import PlayerInfo from './PlayerInfo';
import getPiece from './getPiece';
import TopMenu from './TopMenu';
import GLOBAL from '../../Globals';
import Button from '../../Helper/Button';
import API from '../../Helper/API';
import * as actionTypes from '../../actions';

/* promotion fen - "8/2P5/8/8/3r4/8/2K5/k7 w - - 0 1" */
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

  constructor(props) {
    super(props);
    this.state = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      selectedPiece: -1,
      possibleMoves: [],
    } 
  }

  componentDidUpdate = async () => {
    this.chess.load(this.props.game.fen);
    let iAm = this.props.game.iAm;
    
    if( this.chess.game_over() || 
        this.chess.in_threefold_repetition()) {
          return this.gameOver();
    }
    
    if( this.chess.turn() !== iAm) {
        return this.makeMove(await this.suggestion());   
    }      
  }
  
  render() {
    this.chess.load(this.props.game.fen);
    let iAm = this.props.game.iAm;

    return (
        <View style={[styles.maincontainer,{backgroundColor: GLOBAL.COLOR.THEME['swan'].defaultPrimary}]}>
          
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content" 
          />

          <TopMenu  
            leaveGame = {this.leaveGame}
            hint = {async ()=>this.makeMove(await this.suggestion())}
            undo = {this.undo}
            navigate = {this.props.navigation.navigate}
          />  

          <PlayerInfo 
            turn = {this.chess.turn()} 
            iAm = {iAm} 
            fen = {this.props.game.fen}
            opponentSide = {true} 
          />
          
          <View style={styles.gameBoard}>
              {this.getChessBoard()}
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

  getGameStatus = () => {
    this.chess.load(this.props.game.fen);
    let iAm = this.props.game.iAm;    
    if(this.chess.in_checkmate() === true && this.chess.turn() !== iAm)
      return 'Checkmate, You win!';

    if(this.chess.in_checkmate() === true && this.chess.turn() === iAm)
      return 'Checkmate, Computer wins!';  
    
    if(this.chess.in_draw() === true)
      return 'Draw';
    
    if(this.chess.in_stalemate() === true)
      return 'Stalemate';
    
    if(this.chess.in_threefold_repetition() === true)
      return 'Threefold repetition';
  };

  gameOver = () => Alert.alert(
      this.getGameStatus(),
      'Play Again?',
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {text: 'Yes', onPress: this.resetToHome },
      ],
      { cancelable: false }
  );

  suggestion = async () => {
    console.log('suggestion',this.props.settings.difficulty)
    const urlLink = `?d=${this.props.settings.difficulty}&fen=${encodeURIComponent(this.props.game.fen)}`
    let res = await API(urlLink);
    console.log('res: ',urlLink,res)
    res = res.split(' ');
    let from  = res[1].substr(0,2);
    let to    = res[1].substr(2,2);

    let promotion = '';
    try{
      promotion  = res[1].substr(4);
    }catch(e){}
    
    return {from, to, promotion};
  }

  makeMove = (suggestion) => {
    this.chess.load(this.props.game.fen);
    this.chess.move({ ...suggestion });
    this.notify();
    this.updateGame(-1, [], this.chess.fen());
  };     

  leaveGame = () => Alert.alert(
    'Leave Game',
    'Are you sure about leaving the game?',
    [
      {text: 'No', onPress: () => {}, style: 'cancel'},
      {text: 'Yes', onPress: this.resetToHome },
    ],
    { cancelable: false }
  );

  resetToHome = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Welcome' })],
    });

    this.props.navigation.dispatch(resetAction);
  }

  notify = () => {
    if(this.props.settings.vibration === true) 
      Vibration.vibrate();
    if(this.props.settings.sound === true)
      this.FX.play(); 
  }
  
  undo = ()=>{
    this.chess.load(this.props.game.fen);
    if(this.chess.turn() === this.props.game.iAm){
      this.updateGame(-1, [], this.chess.undo().undo().fen());
    }
  }

  getChessBoard = () => {
    let ifWhiteSideBoard = this.props.game.ifWhiteSideBoard;
    let foo = [];

    if(ifWhiteSideBoard === false){
      for(var i=1; i<9; i++){
        for(var j=8; j>0; j--) {
          foo.push(this.renderCell(i,j));
        }
      }
    }
    else{
      for(var i=8; i>0; i--){
        for(var j=1; j<9; j++) {          
          foo.push(this.renderCell(i,j));
        }
      }
    }  

    return foo;
  }
  
  renderCell = (i,j,_cell) => {  
    const tempCell = this.getCell(i,j);
    this.chess.load(this.props.game.fen);
    return (
      <View key={(i*8)+j} style={styles.btn}>
        {Button(
          <View 
            style={[
              styles.btnView,   
              {backgroundColor:this.getCellColor(i,j,tempCell)}
            ]}
          >
            {getPiece(this.chess.get(tempCell))}  
            
            <Text style={styles.cellId}>{this.getCell(i,j)}</Text> 

          </View>,
          () => this.getCellHandler(i,j),
          styles.btn
        )}
      </View>
    );
  }
  
  getCellHandler = (i,j) => {
    const tempCell = this.getCell(i,j);
    this.chess.load(this.props.game.fen);
    
    const selectedPiece = this.props.game.selectedPiece;
    const iAm = this.props.game.iAm;
    const possibleMoves = this.props.game.possibleMoves; 
    const pieceAtTempCell = this.chess.get(tempCell);

    //not selected
    if(selectedPiece === -1){
        if( !pieceAtTempCell ) return;
        if( pieceAtTempCell.color !== iAm ) return;
        this.updateGame(
          tempCell, 
          this._cleanCellName(this.chess.moves({square: tempCell})), 
          null
        );
    }

    //something already selected     
    //or deselect and select new (clicking same color)
    if( selectedPiece !== -1 &&
        (pieceAtTempCell && 
        pieceAtTempCell.color === iAm)) {                        
          this.updateGame(
            tempCell, 
            this._cleanCellName(this.chess.moves({square: tempCell})), 
            null
          );
    }  

    //something already selected
    //deselect it (self click, illeagal click)
    if( selectedPiece !== -1 &&
        (selectedPiece === tempCell || // if clicked self
        possibleMoves.indexOf(tempCell) === -1)) { // if clicked illeagal move
          this.updateGame(-1, [], null);
    }
    
    //something already selected
    //move and deselect
    if(possibleMoves.indexOf(tempCell) != -1){
        let tSelectedPiece = this.chess.get(selectedPiece);
        let promotion = '';
        
        if( tSelectedPiece.type === 'p' && 
            ((tSelectedPiece.color === 'w' && i===8) ||
            (tSelectedPiece.color === 'b' && i===1))
        ) {
          promotion = 'q';
        }
            
        return this.makeMove({
          from: selectedPiece, 
          to: tempCell,
          promotion
        }); 
    }
  };

  getCell = (_i,_j) => {
    return {
      1:'a', 2:'b', 3:'c', 4:'d', 5:'e', 6:'f', 7:'g', 8:'h'
    }[_j]+_i.toString();
  }

  getCellColor = (_i,_j,_cell) => {    
    
    let clr;
    this.chess.load(this.props.game.fen);
    let lastMove = this.chess.history()[0];
    let possibleMoves = this.props.game.possibleMoves;
    let selectedPiece = this.props.game.selectedPiece;
    
    if((_i%2===0 && _j%2===0) || (_i%2!==0 && _j%2!==0)){
      clr = GLOBAL.COLOR.CELL_DARK;
    }
    
    if((_i%2===0 && _j%2!==0) || (_i%2!==0 && _j%2===0)){
      clr = GLOBAL.COLOR.CELL_LIGHT;
    }

    if(this.props.settings.showLastMove === true && lastMove){
      if(lastMove.from && lastMove.to && lastMove.color !== this.props.game.iAm){
        if(possibleMoves.indexOf(_cell) !== -1){
          clr = '#FF9419';
        }
      }
    }

    if(selectedPiece !== -1){
      if(possibleMoves.indexOf(_cell) !== -1){
        clr = '#FF9419';
      }
    }

    return clr;
  }
  
  _cleanCellName = moves => {
    let newMoves = [];
    let iAm = this.props.game.iAm;
    
    for (let move of moves){
      if(move === 'O-O' && iAm === 'w'){
          newMoves.push('g1')
      }
      else if(move === 'O-O-O' && iAm === 'w'){
        newMoves.push('g1')
      }
      else{
        move = move
              .replace("+", "")
              .replace("x", "")
              .replace("Q", "")
              .replace("N", "");
        //promotion
        if(move.indexOf('=') === 2){
          move = move.substr(0,2);
        }

        if(move !== null || move !== undefined){
          // "dxe6"] "Qd7+", "Qxd8+"]
          move = move.substr(-2);
        }

        newMoves.push(move)
      }  
    }
    
    return newMoves;
  }

  updateGame = (selectedPiece, possibleMoves, fen) => {
    if(selectedPiece)
      this.props.onUpdateSelectedPiece(selectedPiece);
    if(possibleMoves)
      this.props.onUpdatePossibleMoves(possibleMoves);
    if(fen)
      this.props.onUpdateFen(fen);
  };

}

const mapStateToProps = state => {
  return {
    settings: state.settings,
    game: state.game
  };
};

const mapDispatchToProps = dispatch => {
  return {

    onUpdateFen : val => dispatch({
      type: actionTypes.UPDATE_FEN,
      val,
    }),

    onUpdateIfWhiteSideBoard : val => dispatch({
      type: actionTypes.UPDATE_IF_WHITE_SIDE_BOARD,
      val,
    }),
    
    onUpdateIAm : val => dispatch({
      type: actionTypes.UPDATE_I_AM,
      val,
    }),
    
    onUpdateSelectedPiece : val => dispatch({
      type: actionTypes.UPDATE_SELECTED_PIECE,
      val,
    }),
    
    onUpdatePossibleMoves : val => dispatch({
      type: actionTypes.UPDATE_POSSIBLE_MOVES,
      val,
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
  btn:{
    alignItems:'center',
    justifyContent:'center',
    width:width/8,
    height:width/8,
  },
  btnView:{
    flex:1,
    width:width/8,
    height:width/8,
    alignItems:'center',
    justifyContent:'center',
  },
  cellId: {
    position:'absolute',
    bottom:0,
    right:0, 
    fontSize:9, 
    color:'black' 
  }
});