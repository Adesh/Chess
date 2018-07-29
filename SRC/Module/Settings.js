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

import GLOBAL from '../Globals';
import Button from '../Helper/Button';
import * as actionTypes from '../store/actions';

const {width} = Dimensions.get('window');

class Settings extends Component {

  
  render() {
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
      				  selectedValue={this.props.settings.difficulty.toString()}
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
              onValueChange={val => this.updateSetting('showPossMove',val)}
              style={{marginBottom: 10}}
              value={this.props.settings.showPossMove} 
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

        </ScrollView>

        <View style={{justifyContent:'flex-end',alignItems:'center'}}>
          {Button(
            <Text style={{fontWeight:'bold'}}>Clear States & Data</Text>,
            this._clearAllData,
            {margin:10,padding:10,backgroundColor:'#f6f6f6'}
          )}
        </View>
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
    const settings = [ 'difficulty', 'sound', 'vibration', 'showPossMove', 'showLastMove' ];
    
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