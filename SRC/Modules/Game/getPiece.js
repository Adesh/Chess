import React from 'react';
import {
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';

const { width} = Dimensions.get('window');

const getPiece = (piece) => { 
    if(!piece) return null;

    const pieceImg = piece.type.toLowerCase() + 
                     piece.color.toUpperCase();

    console.log("getPiece: ",piece, pieceImg)

    switch(pieceImg) {
      
      //whites
      case 'kW': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/kW.png')} 
        />;

      case 'qW': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/qW.png')} 
        />;

      case 'pW': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/pW.png')} 
        />;
      
      case 'rW': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/rW.png')} 
        />; 

      case 'bW': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/bW.png')} 
        />;
      
      case 'nW': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/nW.png')} 
        />;


      //blacks
      case 'kB': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/kB.png')} 
        />;

      case 'qB': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/qB.png')} 
        />;

      case 'pB': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/pB.png')} 
        />;
      
      case 'rB': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/rB.png')} 
        />; 

      case 'bB': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/bB.png')} 
        />;
      
      case 'nB': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/nB.png')} 
        />;  

      default: 
        return null;  
    };

};

export default getPiece;

const styles = StyleSheet.create({  
    piece:{
      width:width/8-10,
      height:width/8-10,
    },
});