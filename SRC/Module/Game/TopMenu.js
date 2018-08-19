import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import GLOBAL from '../../Globals';
import Button from '../../Helper/Button';

const { width } = Dimensions.get('window');

export default TopMenu  = (props) => { 
  return (
      <View style={styles.container}>
            
        {Button(
          <Icon 
            name={'md-home'} 
            size={30} 
            color={GLOBAL.COLOR.THEME['swan'].secondaryText}
          />,
          props.leaveGame,
          styles.btn
        )}
            
        <View style={{flex:1}} />
            
        {Button(
          <Icon 
            name={'md-help'} 
            size={30} 
            color={GLOBAL.COLOR.THEME['swan'].secondaryText}
          />,
          props.hint,
          [styles.btn, {paddingRight:20}]
        )}
            
        {Button(
          <Icon 
            name={'md-undo'} 
            size={30} 
            color={GLOBAL.COLOR.THEME['swan'].secondaryText}
          />,
          props.undo,
          [styles.btn, {paddingRight:20}]
        )}
            
            
        {Button(
          <Icon 
            name={'md-settings'} 
            size={30}
            color={GLOBAL.COLOR.THEME['swan'].secondaryText} 
          />,
          ()=>props.navigate('Settings'),
          styles.btn
        )}
      </View>
  );    
};

const styles = StyleSheet.create({
  container: {
    width:width,
    flexDirection:'row',
    padding:10,
    backgroundColor:'#efefef'
  },
  btn:{
    padding:5,
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center'
  }
});