import React from 'react';
import {
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const getPiece = (piece) => { 
    if(!piece) return null;

    const pieceImg = (piece.type + piece.color).toLowerCase();

    switch(pieceImg) {
      
      //whites
      case 'kw': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/kW.png')} 
        />;

      case 'qw': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/qW.png')} 
        />;

      case 'pw': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/pW.png')} 
        />;
      
      case 'rw': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/rW.png')} 
        />; 

      case 'bw': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/bW.png')} 
        />;
      
      case 'nw': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/nW.png')} 
        />;


      //blacks
      case 'kb': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/kB.png')} 
        />;

      case 'qb': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/qB.png')} 
        />;

      case 'pb': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/pB.png')} 
        />;
      
      case 'rb': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/rB.png')} 
        />; 

      case 'bb': 
        return <Image 
            style={styles.piece} 
            source={require('../../Resources/Themes/Classic/bB.png')} 
        />;
      
      case 'nb': 
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