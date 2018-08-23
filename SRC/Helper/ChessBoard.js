import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet
  } from 'react-native';
import ChessPiece from './ChessPiece';
import Button from './Button';
import { Chess } from 'chess.js';
const GLOBAL = require ('../Globals');

const { width } = Dimensions.get('window');
const COLUMNS = ['a','b','c','d','e','f','g','h'];
const ROWS = [8,7,6,5,4,3,2,1];

const WHITE_CELLS = [
    "a8", "c8", "e8", "g8",
    "b7", "d7", "f7", "h7", 
    "a6", "c6", "e6", "g6",  
    "b5", "d5", "f5", "h5", 
    "a4", "c4", "e4", "g4", 
    "b3", "d3", "f3", "h3", 
    "a2", "c2", "e2", "g2", 
    "b1", "d1", "f1", "h1"
];

const BLACK_CELLS = [
    "b8", "d8", "f8", "h8", 
    "a7", "c7", "e7", "g7", 
    "b6", "d6", "f6", "h6",
    "a5", "c5", "e5", "g5",
    "b4", "d4", "f4", "h4",
    "a3", "c3", "e3", "g3", 
    "b2", "d2", "f2", "h2", 
    "a1", "c1", "e1", "g1"
]; 

const transpose = array => array[0].map((col, i) => array.map(row => row[i]));

const ChessBoard = (chess, props, ifWhiteSideBoard, settings ) => {
    let board = [];
    for(let i of ROWS){
        for(let j of COLUMNS) {          
          const cell = j+i;
          const pieceAtCell = chess.get(cell);
          board.push(getCell(chess, props, cell, pieceAtCell, settings));
        }
    }
    
    if(ifWhiteSideBoard) 
        return board;
    
    return transpose(transpose(board));
};

const getCell = (chess, props, cell, pieceAtCell, settings) => {
    return <View key={cell}> 
        {Button(
            <View 
                style={[styles.btn, {
                    backgroundColor:getCellColor(props, cell, settings)
                }]} 
            >
                <ChessPiece piece={pieceAtCell} />   
            {!settings.showCellId ? null : <Text style={styles.cellId}>{cell}</Text>} 
            </View>,
            () => getCellHandler(chess, props, cell, pieceAtCell),
            styles.btn
        )}
    </View>;
};

const getCellColor = (props, cell, settings) => {      
    let clr;
    
    const { 
        possibleMoves, 
        selectedPiece,
        moves
    } = props;
    
    const {
        showPossMoves,
        showLastMove,
    } = settings;

    // base color
    clr = GLOBAL.COLOR[ 
        (WHITE_CELLS.indexOf(cell) > -1) ? 
        'CELL_LIGHT' : 
        'CELL_DARK' 
    ];

    // last move
    if( showLastMove && 
        moves &&
        moves[moves.length-1] && 
        (moves[moves.length-1].from == cell || moves[moves.length-1].to == cell) 
    ) clr = '#47e8c5';

    // poss move piece color
    if( showPossMoves && 
        selectedPiece !== -1 && 
        possibleMoves.indexOf(cell) > -1
    ) clr = '#74c5e8';
      
    if( selectedPiece === cell ) 
    clr = '#74c5e8';

    return clr;
};

const getCellHandler = (chess, props, cell, pieceAtCell) => {
    //if(pieceAtCell === null || pieceAtCell === undefined) 
    //    return;
    
    const { 
        selectedPiece, 
        iAm, 
        possibleMoves,
        history,
        moves 
    } = props;
   
    //not selected
    if(selectedPiece === -1){
        if( !pieceAtCell ) return;
        if( pieceAtCell && pieceAtCell.color !== iAm ) return;
        console.log("not selected");
        props.updateGame( cell, cleanCellName(chess.moves({square: cell}), iAm), null, null, null );
    }

    //something already selected     
    //or deselect and select new (clicking same color)
    if( selectedPiece !== -1 &&
        (pieceAtCell && 
        pieceAtCell.color === iAm)) {                        
          console.log("something already selected, or deselect and select new (clicking same color)");
          props.updateGame(
            cell, cleanCellName(chess.moves({square: cell})), null, null, null );
    } 

    //something already selected
    //deselect it (self click, illeagal click)
    if( selectedPiece !== -1 &&
        (selectedPiece === cell || // if clicked self
        possibleMoves.indexOf(cell) === -1)) { // if clicked illeagal move
            console.log("//something already selected, deselect it (self click, illeagal click), if clicked self, ˀif clicked illeagal move");
            props.updateGame(-1, [], null, null, null);
    }
    
    //something already selected
    //move and deselect
    if(possibleMoves.indexOf(cell) != -1){
        console.log("something already selected, move and deselect")
        let tSelectedPiece = chess.get(selectedPiece);
        let promotion = '';
        
        if( tSelectedPiece.type === 'p' && 
            ((tSelectedPiece.color === 'w' && cell.substr(1,1) === 8) ||
            (tSelectedPiece.color === 'b' && cell.substr(1,1) === 1))
        ) {
          promotion = 'q';
        }
        
        return props.makeMove({
          from: selectedPiece, 
          to: cell,
          promotion,
          history,
          moves
        }); 
    }
};    

const cleanCellName = (moves, iAm) => {
    let newMoves = [];
    
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
};

const styles = StyleSheet.create({
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

export default ChessBoard;