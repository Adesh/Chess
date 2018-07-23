import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';
import Button from '../Helper/GetButton';
import GLOBAL_VAR from '../Globals';

const { width } = Dimensions.get('window');

class Welcome extends Component {
  async componentDidMount() {
    const settings = [ 'difficulty', 'sound', 'vibration', 'showPossMove', 'showLastMove' ];
    for(let setting of settings) {
      const val = await AsyncStorage.getItem(setting);
      if(val == null) {
        await AsyncStorage.setItem(setting, GLOBAL_VAR.APP_SETTING.DEFAULT[setting])
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
        <View style={[styles.maincontainer,{backgroundColor: GLOBAL_VAR.COLOR.THEME['swan'].defaultPrimary,}]}>
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content" 
        />
          <Text 
            style={[styles.headingTxt,{color: GLOBAL_VAR.COLOR.THEME['swan'].secondaryText,}]}>
            Chess
          </Text>
          <Text 
            style={[styles.subHeadingTxt,{color: GLOBAL_VAR.COLOR.THEME['swan'].secondaryText,}]}>
            Robust, RealTime & Minimal
          </Text>
          
          {Button(
            <View style={[styles.btnView,{backgroundColor: GLOBAL_VAR.COLOR.THEME['swan'].darkPrimary}]}>
              <Icon 
                name='md-person'
                size={GLOBAL_VAR.FONT.HEADER}
                color={GLOBAL_VAR.COLOR.THEME['swan'].textPrimary}
              />
              <Text style={[styles.btnTxt,{color: GLOBAL_VAR.COLOR.THEME['swan'].textPrimary}]}>vs</Text>
              <Icon 
                name='md-laptop'
                size={GLOBAL_VAR.FONT.HEADER}
                color={GLOBAL_VAR.COLOR.THEME['swan'].textPrimary}
              />
            </View>,
            ()=>this.navigate('GameVsComp'),
            styles.btn
          )}

          

          {Button(
            <Icon 
              name='md-settings'
              size={GLOBAL_VAR.FONT.HEADER}
              color={GLOBAL_VAR.COLOR.THEME['swan'].secondaryText}
            />,
            ()=>this.navigate('Settings'),
            styles.btn
          )}

        
          <View style={styles.footer}>
            <Text style={[styles.footerTxt,{color: GLOBAL_VAR.COLOR.THEME['swan'].secondaryText}]}>Euristico</Text>
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
    settings: state.settings
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
    fontSize:GLOBAL_VAR.FONT.HEADER,
    color: GLOBAL_VAR.COLOR.PRIMARY,
    fontWeight:'bold'
  },
  subHeadingTxt:{
    fontSize:GLOBAL_VAR.FONT.SUB_HEADER,
    color: GLOBAL_VAR.COLOR.secondaryText,
    fontWeight:'normal'
  },
  footer:{
    position:'absolute',
    bottom:0,
    width:width,
  },
  footerTxt:{
    textAlign:'center',
    fontSize:GLOBAL_VAR.FONT.FONT_H3,
    color: GLOBAL_VAR.COLOR.secondaryText,
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
    backgroundColor:GLOBAL_VAR.COLOR.PRIMARY,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    paddingTop:20,
    paddingBottom:20,
    borderRadius:2,
  },
  btnTxt:{
    color:GLOBAL_VAR.COLOR.TEXT_ICON,
    fontSize:GLOBAL_VAR.FONT.FONT_H1,
    fontWeight:'bold'
  },
});