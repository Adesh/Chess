import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Vibration,
  Platform,
  Alert
} from 'react-native';

import { 
  StackActions, 
  NavigationActions 
} from 'react-navigation';

import {Chess} from 'chess.js/chess';
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
    error => console.log('Sound not loaded ',error) 
  );

  constructor(props) {
    super(props);
    this.state = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      ifWhiteSideBoard: true,
      iAm: 'w', //or 'b',
      selectedPiece: -1,
      possibleMoves: [],
    } 
  }

  componentDidUpdate = async () => {
    this.chess.load(this.state.fen);
    let iAm = this.state.iAm;
    
    if( this.chess.game_over() || 
        this.chess.in_threefold_repetition()) {
          return this.gameOver();
    }
    
    if( this.chess.turn() !== iAm) {
        return this.makeMove(await this.suggestion());   
    }      
  }
  
  render() {
    this.chess.load(this.state.fen);
    let iAm = this.state.iAm;

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
            fen = {this.state.fen}
            opponentSide = {true} 
          />
          
          <View style={styles.gameBoard}>
              {this.getChessBoard()}
          </View>
            
          <PlayerInfo 
            turn = {this.chess.turn()} 
            iAm = {iAm} 
            fen = {this.state.fen}
            opponentSide={false} 
          />
          
        </View>  
    );
  }

  getGameStatus = () => {
    this.chess.load(this.state.fen);
    let iAm = this.state.iAm;    
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
    const urlLink = `?d=${this.props.settings.difficulty}&fen=${encodeURIComponent(this.state.fen)}`
    let res = await API(urlLink);
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
    let { from, to, promotion } = suggestion;
    this.chess.load(this.state.fen);
    this.chess.move({ from, to, promotion });
    this.notify();
    
    return this.setState({
      selectedPiece: -1,
      possibleMoves: [],
      fen: this.chess.fen()
    });
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
    this.chess.load(this.state.fen);
    if(this.chess.turn() === this.state.iAm){
      this.chess.undo();
      this.chess.undo();
      return this.setState({
        selectedPiece: -1,//deselect if any
        possibleMoves: [],
        fen: this.chess.fen()
      });
    }
  }

  getChessBoard = () => {
    let ifWhiteSideBoard = this.state.ifWhiteSideBoard;
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
    this.chess.load(this.state.fen);
    return (
      <View key={(i*8) + (j)} style={styles.btn}>
        {Button(
          <View style={[styles.btnView,{backgroundColor:this.getCellColor(i,j,tempCell)}]}>
            {getPiece(this.chess.get(tempCell))}          
          </View>,
          () => {
              const selectedPiece = this.state.selectedPiece;
              const iAm = this.state.iAm;
              const possibleMoves = this.state.possibleMoves; 
        
              if(selectedPiece === -1){
                  if( this.chess.get(tempCell) === null ||
                      this.chess.get(tempCell).color !== iAm )
                    return;
                    
                  return this.setState({
                      selectedPiece: tempCell,
                      possibleMoves: this._cleanCellName(this.chess.moves({square: tempCell}))
                  });
              }
              else{ //something already selected
                    
                    //deselect it
                    if( selectedPiece === tempCell ||
                        possibleMoves.indexOf(tempCell) === -1){
                      return this.setState({
                        selectedPiece: -1,
                        possibleMoves: []
                      });
                    }
                    
                    //or deselect and select new
                    if(this.chess.get(tempCell) && this.chess.get(tempCell).color === iAm){                        
                        return this.setState({
                          selectedPiece: tempCell,
                          possibleMoves: this._cleanCellName(this.chess.moves({square: tempCell}))
                        });
                    }  
                    
                    //move and deselect
                    if(possibleMoves.indexOf(tempCell) != -1){
                      var tSelectedPiece = this.chess.get(selectedPiece);
                      var promotion = '';
                      if(tSelectedPiece.type === 'p'){
                          if(tSelectedPiece.color === 'w' && i===8){
                            promotion = 'q';
                          }
                          else if(tSelectedPiece.color === 'b' && i===1){
                            promotion = 'q';
                          }
                      }
                      
                      return this.makeMove({
                        from: selectedPiece, 
                        to: tempCell,
                        promotion
                      }); 
                    }
              }
          },
          styles.btn
        )}
      </View>
    );
  }
  
  getCell = (_i,_j) => {
    return {
      1:'a', 2:'b', 3:'c', 4:'d', 5:'e', 6:'f', 7:'g', 8:'h'
    }[_j]+_i.toString();
  }

  getCellColor = (_i,_j,_cell) => {    
    let clr;
    this.chess.load(this.state.fen);
    let lastMove = this.chess.history()[0];
    let possibleMoves = this.state.possibleMoves;
    let selectedPiece = this.state.selectedPiece;

    if((_i%2===0 && _j%2===0) || (_i%2!==0 && _j%2!==0)){
      clr = GLOBAL.COLOR.CELL_DARK;
    }
    
    if((_i%2===0 && _j%2!==0) || (_i%2!==0 && _j%2===0)){
      clr = GLOBAL.COLOR.CELL_LIGHT;
    }

    if(this.props.settings.showLastMove === true && lastMove){
      if(lastMove.from && lastMove.to && lastMove.color !== this.state.iAm){
        if(possibleMoves.indexOf(_cell) !== -1){
          clr = '#FF9419';
        }
      }
    }

    if(this.props.settings.showPossMove === true){
      if(selectedPiece !== -1){
        if(possibleMoves.indexOf(_cell) !== -1){
          clr = '#FF9419';
        }
      }
    }

    return clr;
  }
  
  _cleanCellName = (moves) => {
    //let moves = [...moves];
    let iAm = this.state.iAm;
    for (let move of moves){
      if(move === 'O-O'){
        if(iAm === 'w'){
          move = 'g1'; //e1 -> g1 
        }
      }
      else if(move === 'O-O-O'){
        if(iAm === 'w'){ 
          move = 'c1';  //e1 -> c1
        }
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
      }  
    }

    return moves;
  }

}

const mapStateToProps = state => {
  return {
    theme: state.theme,
    settings: state.settings
  };
};

const mapDispatchToProps = dispatch => {
  return {
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
});