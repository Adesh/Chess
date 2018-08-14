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
import firebase from 'react-native-firebase';

import * as actionTypes from '../../actions';
import Button from '../../Helper/Button';
import GLOBAL from '../../Globals';


const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();
request.addKeyword('WelcomeBanner');

const { width } = Dimensions.get('window');

class Welcome extends Component {  
  async componentDidMount() {
    firebase.admob('ca-app-pub-8926092521677174~1925275591')
    let analytics = firebase.analytics()
    analytics.setCurrentScreen('Welcome');

    const settings = [ 'difficulty', 'sound', 'vibration', 'showCellId', 'showLastMove' ];
    for(let setting of settings) {
      const val = await AsyncStorage.getItem(setting);
      
      if(val == null) {
        await AsyncStorage.setItem(setting, GLOBAL.APP_SETTING.DEFAULT[setting].toString())
      } else {
        let parseAuˀto = (val) => {
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
          
          <View style={{flex:1}}/>

          <Image 
            style={styles.logo} 
            source={require('../../Resources/logo.png')} 
          />
          
          <Text 
            style={[styles.headingTxt,{color: GLOBAL.COLOR.THEME['swan'].secondaryText,}]}>
            {' Chess '} 
          </Text>
          <Text 
            style={[styles.subHeadingTxt,{color: GLOBAL.COLOR.THEME['swan'].secondaryText,}]}>
            {' Robust, Realtime & Minimal '}
          </Text>
          
          <View style={{flex:1}}/>

          {Button(
            <View style={styles.btnView}>
              <Icon 
                name='md-person'
                size={GLOBAL.FONT.HEADER}
                color={GLOBAL.COLOR.THEME['swan'].textPrimary}
              />
              <Text style={styles.btnTxt}>{'vs'}</Text>
              <Icon 
                name='md-laptop'
                size={GLOBAL.FONT.HEADER}
                color={GLOBAL.COLOR.THEME['swan'].textPrimary}
              />
            </View>,
            ()=>this.navigate('GameVsComp'),
            {}
          )}

          {Button(
            <View style={styles.btnView}>
              <Icon 
                name='md-person'
                size={GLOBAL.FONT.HEADER}
                color={GLOBAL.COLOR.THEME['swan'].textPrimary}
              />
              <Text style={styles.btnTxt}>{'vs'}</Text>
              <Icon 
                name='md-person'
                size={GLOBAL.FONT.HEADER}
                color={GLOBAL.COLOR.THEME['swan'].textPrimary}
              />
            </View>,
            ()=>this.navigate('GameVsPlayer'),
            {marginBottom:10}
          )}

          <View style={{flex:1}}/>

          {Button(
            <Icon 
              name='md-settings'
              size={GLOBAL.FONT.HEADER}
              color={GLOBAL.COLOR.THEME['swan'].secondaryText}
            />,
            ()=>this.navigate('Settings'),
            {marginVertical:5,paddingVertical:5}
          )}

          

          <Text style={styles.footer}>
            <Text onPress={()=>this.navigate('PrivacyPolicy')} style={styles.footerTxt}>Privacy Policy</Text>
            <Text>{', '}</Text> 
            <Text onPress={()=>this.navigate('Termsconditions')} style={styles.footerTxt}>Terms & Conditions</Text>
          </Text>
          
          <View style={{flex:1}}/>

          <Banner
            unitId={'ca-app-pub-8926092521677174/5743857831'}
            size={"LARGE_BANNER"}
            request={request.build()}
            onAdLoaded={() => {
              console.log('Advert loaded');
            }}
          />
        </View>  
    );
  }

  navigate = (route)=>{
    this.props.navigation.navigate(route);
  }
  
};

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSettingsChange : (key, val) => dispatch({
      type: actionTypes.CHANGE_SETTINGS,
      key,
      val,
    }),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);


const styles = StyleSheet.create({
  maincontainer: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  headingTxt:{
    fontSize:GLOBAL.FONT.HEADER,
    color: GLOBAL.COLOR.PRIMARY,  
  },
  subHeadingTxt:{
    fontSize:GLOBAL.FONT.SUB_HEADER,
    color: GLOBAL.COLOR.secondaryText,
  },
  footer:{
    width:width,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
  },
  footerTxt:{
    color: GLOBAL.COLOR.THEME['swan'].secondaryText,
    textAlign:'center',
    fontSize:GLOBAL.FONT.FONT_H3,
    color: GLOBAL.COLOR.secondaryText,
    marginHorizontal:5,
  },
  btnView:{
    //height:
    marginTop:15,
    backgroundColor: GLOBAL.COLOR.THEME['swan'].darkPrimary,
    //flex:1,
    width:width/2,
    //backgroundColor:GLOBAL.COLOR.PRIMARY,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    paddingVertical:5,
    borderRadius:2,
  },
  btnTxt:{
    color: GLOBAL.COLOR.THEME['swan'].textPrimary,
    color:GLOBAL.COLOR.TEXT_ICON,
  },
  logo: {
    marginVertical: 20,
    height: 100,
    width: 100
  },
  footerBtn: {
    paddingRight:3,
    paddingVertical:5,

  }
});