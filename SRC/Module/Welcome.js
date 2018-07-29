import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import * as actionTypes from '../store/actions';
import Button from '../Helper/Button';
import GLOBAL from '../Globals';

const { width } = Dimensions.get('window');

class Welcome extends Component {
  
  async componentDidMount() {
    const settings = [ 'difficulty', 'sound', 'vibration', 'showPossMove', 'showLastMove' ];
    for(let setting of settings) {
      const val = await AsyncStorage.getItem(setting);
      if(val == null) {
        await AsyncStorage.setItem(setting, GLOBAL.APP_SETTING.DEFAULT[setting])
      } else {
        let parseAuto = (val) => {
          if(val === 'true') return true;
          if(val === 'false') return false;
          if(!isNaN(val)) return parseInt(val);
          return val;
        }
        this.props.onSettingsChange(setting,parseAuto(val));
      }
    }

  }

  render() {
    return ( 
        <View style={[styles.maincontainer,{backgroundColor: GLOBAL.COLOR.THEME['swan'].defaultPrimary,}]}>
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content" 
        />
          
          <Image 
            style={styles.logo} 
            source={require('../Resources/logo.png')} 
          />
          
          <Text 
            style={[styles.headingTxt,{color: GLOBAL.COLOR.THEME['swan'].secondaryText,}]}>
            Chess
          </Text>
          <Text 
            style={[styles.subHeadingTxt,{color: GLOBAL.COLOR.THEME['swan'].secondaryText,}]}>
            Robust, RealTime & Minimal
          </Text>
          
          {Button(
            <View style={[styles.btnView,{backgroundColor: GLOBAL.COLOR.THEME['swan'].darkPrimary}]}>
              <Icon 
                name='md-person'
                size={GLOBAL.FONT.HEADER}
                color={GLOBAL.COLOR.THEME['swan'].textPrimary}
              />
              <Text style={[styles.btnTxt,{color: GLOBAL.COLOR.THEME['swan'].textPrimary}]}>vs</Text>
              <Icon 
                name='md-laptop'
                size={GLOBAL.FONT.HEADER}
                color={GLOBAL.COLOR.THEME['swan'].textPrimary}
              />
            </View>,
            ()=>this.navigate('GameVsComp'),
            styles.btn
          )}

          

          {Button(
            <Icon 
              name='md-settings'
              size={GLOBAL.FONT.HEADER}
              color={GLOBAL.COLOR.THEME['swan'].secondaryText}
            />,
            ()=>this.navigate('Settings'),
            styles.btn
          )}

        
          <View style={styles.footer}>
            <Text style={[styles.footerTxt,{color: GLOBAL.COLOR.THEME['swan'].secondaryText}]}>Euristico</Text>
          </View>
        </View>  
    );
  }

  navigate = (route)=>{
    this.props.navigation.navigate(route);
  }
  
};

const mapStateToProps = state => {
  return {
    theme: state.theme,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSettingsChange : (key, val) => dispatch({
      type: actionTypes.CHANGE_SETTINGS,
      key: key,
      val: val
    }),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);


const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  },
  headingTxt:{
    fontSize:GLOBAL.FONT.HEADER,
    color: GLOBAL.COLOR.PRIMARY,
    fontWeight:'bold'
  },
  subHeadingTxt:{
    fontSize:GLOBAL.FONT.SUB_HEADER,
    color: GLOBAL.COLOR.secondaryText,
    fontWeight:'normal'
  },
  footer:{
    position:'absolute',
    bottom:0,
    width:width,
  },
  footerTxt:{
    textAlign:'center',
    fontSize:GLOBAL.FONT.FONT_H3,
    color: GLOBAL.COLOR.secondaryText,
    fontWeight:'bold'
  },
  btn:{
    marginTop:50,
    height:80,
    alignItems:'center',
    justifyContent:'center'
  },
  btnView:{
    flex:1,
    width:width/2,
    backgroundColor:GLOBAL.COLOR.PRIMARY,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    paddingTop:20,
    paddingBottom:20,
    borderRadius:2,
  },
  btnTxt:{
    color:GLOBAL.COLOR.TEXT_ICON,
    fontSize:GLOBAL.FONT.FONT_H1,
    fontWeight:'bold'
  },
  logo: {
    marginTop: 30,
    marginBottom: 30,
    height: 120,
    width: 120
  }
});