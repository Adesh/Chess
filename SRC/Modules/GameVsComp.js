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

import {Chess} from 'chess.js/chess';
import Sound from 'react-native-sound';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import TopMenu from './Game/TopMenu';
import * as actionTypes from '../store/actions';
import GLOBAL_VAR    from '../Globals';
import Button        from '../Helper/GetButton';
import API           from '../Helper/API';
import PlayerInfo from './Game/PlayerInfo';
import getPiece from './Game/getPiece';

/* promotion fen - "8/2P5/8/8/3r4/8/2K5/k7 w - - 0 1" */
const {height, width} = Dimensions.get('window');

class GameVsComp extends Component { 
  
  FX = new Sound(
    (Platform.OS !== 'ios')?
      'movesound.wav':
      '../Resources/moveSound.wav', 
    Sound.MAIN_BUNDLE, 
    error => error?
              console.log('Sound not loaded'):
              null
  );

  constructor(props) {
    super(props);
    this.state = {
      chess: new Chess(),
      turn: 'w',
      whiteSide: true, //board orientation
      iAm:'w', //or 'b',
      selectedPiece:-1,
      possMoves:[],
      lastMove:{},
      gameStatus:'',
    } 
  }

  shouldComponentUpdate() {
    let { gameStatus } = this.state;
    if( gameStatus === 'Checkmate' || 
        gameStatus === 'Draw' || 
        gameStatus === 'Stalemate' || 
        gameStatus === 'Threefold repetition') {
      return false;
    } 
    return true;
  }

  componentDidUpdate = async () => {
    let chessInstance = {...this.state.chess};
    let {turn, iAm} = this.state;
    if( chessInstance.game_over() === true || 
        chessInstance.in_threefold_repetition() === true) {
          return this.gameOver();
    }
    
    if( chessInstance.turn() !== turn && 
        chessInstance.turn() !== iAm) {
        return this.makeMove(await this.suggestion());   
    }      
  }
  
  render() {
    let {turn,iAm,whiteSide} = this.state;
    return (
        <View style={[styles.maincontainer,{backgroundColor: GLOBAL_VAR.COLOR.THEME['swan'].defaultPrimary}]}>
          
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content" 
          />

          <TopMenu  
            leaveGame = {this.leaveGame}
            hint = {async ()=>this.makeMove(await this.suggestion())}
            onBackPress = {this.onBackPress}
            navigate = {this.props.navigation.navigate}
          />  

          <PlayerInfo 
            game={{
              turn: turn, 
              iAm: iAm, 
              chessInstance:{...this.state.chess}
            }}
            opponentSide={true} 
          />
          
          <View style={styles.gameBoard}>
              {this.getChessBoard(whiteSide)}
          </View>
            
          <PlayerInfo 
            game={{
              turn: turn, 
              iAm: iAm, 
              chessInstance:{...this.state.chess}
            }}
            opponentSide={false} 
          />
          
        </View>  
    );
  }

  getGameStatus = () => {
    let {turn} = this.state;    
    if(chessInstance.in_checkmate() === true || chessInstance.turn() === turn)
      return 'Checkmate, You win!';

    if(chessInstance.in_checkmate() === true || chessInstance.turn() !== turn)
      return 'Checkmate, Computer wins!';  
    
    if(chessInstance.in_draw() === true)
      return 'Draw';
    
    if(chessInstance.in_stalemate() === true)
      return 'Stalemate';
    
    if(chessInstance.in_threefold_repetition() === true)
      return 'Threefold repetition';
  };

  gameOver = () => Alert.alert(
      this.getGameStatus(),
      'Play Again?',
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {text: 'Yes', onPress: this.reset },
      ],
      { cancelable: false }
  );

  suggestion = async () => {
    const urlLink = `?d=${this.props.settings.difficulty}&fen=${encodeURIComponent(this.state.chess.fen())}`
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
    let {from, to, promotion} = suggestion;
    console.log('suggestion: ', suggestion, from, to, promotion)
    let chess = {...this.state.chess};
    chess.move({ from, to, promotion });
    this.notify();
    return this.setState({
      selectedPiece: -1,
      possMoves: [],
      chess: chess,
      turn: chess.turn()
    });
  };     

  leaveGame = () => Alert.alert(
    'Leave Game',
    'Are you sure about leaving the game?',
    [
      {text: 'No', onPress: () => {}, style: 'cancel'},
      {text: 'Yes', onPress: this.reset },
    ],
    { cancelable: false }
  );

  reset = () => {
    this.setState({
      chess:{...this.state.chess}.reset()
    });

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

  onBackPress = ()=>{
    let chessInstance = {...this.state.chess};
    if(chessInstance.turn() === this.state.iAm){
      chessInstance.undo();
      chessInstance.undo();
      return this.setState({
        turn:chessInstance.turn(),
        selectedPiece: -1,//deselect if any
        possMoves: [],
        chess:chessInstance
      });
    }
  }

  getChessBoard = (whiteSide) => {
    var foo = [];

    if(whiteSide === false){
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
    const { selectedPiece, iAm, chess, possMoves } = this.state; 
    let chessInstance = {...chess}; 

    const tempCell = this.getCell(i,j);

    return (
      <View key={(i*8) + (j)} style={styles.btn}>
        {Button(
          <View style={[styles.btnView,{backgroundColor:this.getCellColor(i,j,tempCell)}]}>
            {getPiece(chessInstance.get(tempCell))}          
          </View>,
          ()=>{
              if(selectedPiece === -1){
                  if( chessInstance.get(tempCell) === null ||
                      chessInstance.get(tempCell).color !== iAm )
                    return;
                    
                  return this.setState({
                      selectedPiece: tempCell,
                      possMoves: this._cleanCellName(chessInstance.moves({square: tempCell}))
                  });
              }
              else{ //something already selected
                    
                    //deselect it
                    if(selectedPiece === tempCell){
                      return this.setState({
                        selectedPiece: -1,
                        possMoves: []
                      });
                    }
                    
                    //or deselect and select new
                    if(chessInstance.get(tempCell) !== null){
                      if(chessInstance.get(tempCell).color === iAm){
                        console.log(chessInstance.moves({square: tempCell}),this._cleanCellName(chessInstance.moves({square: tempCell})));
                        return this.setState({
                          selectedPiece: tempCell,
                          possMoves: this._cleanCellName(chessInstance.moves({square: tempCell}))
                        });
                      }
                    }  
                    
                    //move and deselect
                    if(possMoves.indexOf(tempCell) != -1){
                      console.log("Moving","tempCell",tempCell,"row",i,"col",j);

                      var tSelectedPiece = chessInstance.get(selectedPiece);
                      console.log("selectedPiece",tSelectedPiece,"iAM",iAm);

                      var promotion = undefined;
                      if(tSelectedPiece.type === 'p'){
                          if(tSelectedPiece.color === 'w' && i===8){
                            promotion = 'q';
                          }
                          else if(tSelectedPiece.color === 'b' && i===1){
                            promotion = 'q';
                          }
                      }
                      
                      if(promotion === undefined){
                          chessInstance.move({ 
                            from: selectedPiece, 
                            to: tempCell
                          });
                      }
                      else{
                          console.log('promoting');
                          chessInstance.move({ 
                            from: selectedPiece, 
                            to: tempCell,
                            promotion:promotion
                          });
                      }
                      
                      this.notify();
                      
                      return this.setState({
                        selectedPiece: -1,
                        possMoves: [],
                        chess:chessInstance
                      });
                    }
                    
                    //illeagal move
                    return this.setState({
                      selectedPiece: -1,
                      possMoves: []
                    });
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
    let { lastMove, possMoves, selectedPiece} = this.state;

    if((_i%2===0 && _j%2===0) || (_i%2!==0 && _j%2!==0)){
      clr = GLOBAL_VAR.COLOR.CELL_DARK;
    }
    
    if((_i%2===0 && _j%2!==0) || (_i%2!==0 && _j%2===0)){
      clr = GLOBAL_VAR.COLOR.CELL_LIGHT;
    }

    if(this.props.settings.showLastMove === true && lastMove){
      if(lastMove.from && lastMove.to){
        if(possMoves.indexOf(_cell) !== -1){
          clr = '#FF9419';
        }
      }
    }

    if(this.props.settings.showPossMove === true){
      if(selectedPiece !== -1){
        if(possMoves.indexOf(_cell) !== -1){
          clr = '#FF9419';
        }
      }
    }

    return clr;
  }
  
  _cleanCellName = (moves) => {
    //let moves = [...moves];
    let {iAm} = this.state;
    for (let i in moves){
      if(moves[i] === 'O-O'){
        if(iAm === 'w'){
          moves[i] = 'g1'; //e1 -> g1 
        }
      }
      else if(moves[i] === 'O-O-O'){
        if(iAm === 'w'){ 
          moves[i] = 'c1';  //e1 -> c1
        }
      }
      else{
        //console.log(moves[i].substr(-2));
        moves[i] = moves[i].replace("+", "");
        moves[i] = moves[i].replace("x", "");
        moves[i] = moves[i].replace("Q", "");
        moves[i] = moves[i].replace("N", "");

        //promotion
        if(moves[i].indexOf('=') === 2){
          moves[i] = moves[i].substr(0,2);
        }

        if(moves[i] !== null || moves[i] !== undefined){
          // "dxe6"] "Qd7+", "Qxd8+"]
          moves[i] = moves[i].substr(-2);
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
    borderColor:GLOBAL_VAR.COLOR.DEVIDER
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
  btnTxt:{
    color:GLOBAL_VAR.COLOR.TEXT_ICON,
    fontSize:GLOBAL_VAR.FONT.FONT_H1,
    fontWeight:'bold'
  },
  piece:{
    width:width/8-10,
    height:width/8-10,
  },
  modalContainerStyle:{
    height:height,
    width:width,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)'
  },

  modalStyle:{
    width:width-100,
    borderRadius:2,
    backgroundColor:'rgba(255,255,255,0.95)',
  },
});