import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Switch,
  AsyncStorage,
  ScrollView,
  Picker,
  StatusBar
} from 'react-native';

import { connect } from 'react-redux';
import firebase from 'react-native-firebase';

import GLOBAL from '../../Globals';
import Button from '../../Helper/Button';
import * as actionTypes from '../../actions';

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();
request.addKeyword('SettingBanner');

const {width} = Dimensions.get('window');

class Settings extends Component {

  componentDidMount() {
    let analytics = firebase.analytics()
    analytics.setCurrentScreen('Settings');
  }
  render() {
    console.log(this.props.settings.difficulty);
    return (
      <View style={[styles.maincontainer,{backgroundColor: GLOBAL.COLOR.THEME['swan'].defaultPrimary}]}>
      	
        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content" 
        />
    
        <ScrollView style={{flex:1,marginTop:50}}>
        	
        	<View style={styles.settingItem}>
        		<Text>Difficulty</Text>
            <Picker
      				  selectedValue={this.props.settings.difficulty}
      				  onValueChange={d => this.updateSetting('difficulty',d)}
                style={{ height: 45, width: 130, alignItems:'flex-end',justifyContent:'flex-end' }}
            >
      				  <Picker.Item label="Beginer" value="5" />
      				  <Picker.Item label="Pro" value="8" />
      				  <Picker.Item label="GrandMaster" value="10" />
      			</Picker>
        	</View>

        	<View style={styles.settingItem}>
        		<Text>Sound</Text>
        		<Switch
  		        onValueChange={val => this.updateSetting('sound',val)}
  			      style={{marginBottom: 10}}
  		        value={this.props.settings.sound} 
  		    />
        	</View>

        	<View style={styles.settingItem}>
        		<Text>Vibration</Text>
        		<Switch
  		        onValueChange={val => this.updateSetting('vibration',val)}
  		  	    style={{marginBottom: 10}}
  		        value={this.props.settings.vibration} 
  		    />
        	</View>   

          <View style={styles.settingItem}>
            <Text>Show Possible Moves</Text>
            <Switch
              onValueChange={val => this.updateSetting('showCellId',val)}
              style={{marginBottom: 10}}
              value={this.props.settings.showCellId} 
            />
          </View>

          <View style={styles.settingItem}>
            <Text>Show Last Move</Text>
            <Switch
              onValueChange={val => this.updateSetting('showLastMove',val)}
              style={{marginBottom: 10}}
              value={this.props.settings.showLastMove} 
            />
          </View>

          <View style={styles.settingItem}>
            <Text>Show Cell Id</Text>
            <Switch
              onValueChange={val => this.updateSetting('showCellId',val)}
              style={{marginBottom: 10}}
              value={this.props.settings.showCellId} 
            />
          </View>

        </ScrollView>

        <View style={{justifyContent:'flex-end',alignItems:'center'}}>
          {Button(
            <Text style={{}}>{'Clear States & Data'}</Text>,
            this._clearAllData,
            {margin:10,padding:10,backgroundColor:'#f6f6f6'}
          )}
        </View>

        <Banner
            unitId={'ca-app-pub-8926092521677174/3039880861'}
            size={"LARGE_BANNER"}
            request={request.build()}
            onAdLoaded={() => {
              console.log('Advert loaded');
            }}
        />

      </View>
    );
  }

  _interpreteDifficulty = (d) => {
    switch(d.toString()) {
      case '5': return 'Beginner';
      case '8': return 'Pro';
      case '10': return 'GrandMaster';
      default: return 'Beginner';
    }  
  }

  updateSetting = (key, val)=>{
    AsyncStorage.setItem(key, val.toString()); 
    this.props.onSettingsChange(key, val);
  }
  
  _clearAllData = () => {        
    const settings = [ 'difficulty', 'sound', 'vibration', 'showCellId', 'showLastMove' ];
    
    for(let setting of settings) {
      this.updateSetting(setting, GLOBAL.APP_SETTING.DEFAULT[setting]); 
    }
  }

  getStorageVar = async (_str) => {
    return await AsyncStorage.getItem(_str);
  }
  
};

const mapStateToProps = state => {
  return {
    settings: state.settings
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  },
  settingItem: {
    width:width,
  	flexDirection:'row',
  	justifyContent:'space-between',
  	alignItems:'center',
  	padding:5,
  }
});