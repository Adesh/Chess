import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const PlayerInfo = (props) => { 
    const txt = getText(
        props.opponentSide,
        props.turn,
        props.iAm,
        props.chessInstance.game_over(),
        props.chessInstance.in_check()
    );

    return (
        <View style={styles.container} >
            <View style={styles.subcontainer} >       
                { txt === '' ? null : <ActivityIndicator size="small" />}
                <Text style={{marginLeft:5}} >
                    {txt}
                </Text>
            </View>
        </View>     
    );
}

const getText = (
    opponentSide,
    turn,
    iAm,
    gameOver,
    inCheck) => {
    
    const opponentTurn = turn !== iAm;
    if(gameOver) return '';
    if(opponentSide && !opponentTurn) return '';
    if(!opponentSide && opponentTurn) return '';
    return `${opponentTurn? 'Computer is thinking ' : 'Your turn '}${inCheck ? '- Check' : ''}`;       
};

export default PlayerInfo;

const styles = StyleSheet.create({
    container:{
        width: width,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    subcontainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        padding:5,
        borderRadius:3
    }
});