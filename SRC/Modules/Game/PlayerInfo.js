import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';


const PlayerInfo = (props) => { 
    return (
        <View style={styles.container} >
            
            {(props.game.turn != props.game.iAm)?<View 
                  style={styles.subcontainer}
                >  
                
                <ActivityIndicator
                  animating={props.game.turn != props.game.iAm}
                  size="small"
                  color={'white'}  
                />
              
                <Text style={{marginLeft:5,color:'white'}} >
                  Computer is thinking {props.game.chessInstance.in_check() === true ? '- Check' : ''}
                </Text>

            </View>:null}
            
            
            {(props.game.turn === props.game.iAm && props.game.chessInstance.game_over()===false)?<View >  
              
              <Text style={{color:'white'}} >
                Your turn {props.game.chessInstance.in_check() === true ? '- Check' : ''}
              </Text>

          </View>:null}

        </View>     
    );
}

export default PlayerInfo;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    subcontainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(255,0,0,0.6)',
        padding:5,
        borderRadius:3
    }
});