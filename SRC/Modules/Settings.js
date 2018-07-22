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


import GLOBAL_VAR from '../Globals';
import Button from '../Helper/GetButton';
import Modal from '../Helper/GetModal';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';

const {width} = Dimensions.get('window');

class Settings extends Component {
  render() {
    return (
      <View style={[styles.maincontainer,{backgroundColor: GLOBAL_VAR.COLOR.THEME['swan'].defaultPrimary}]}>
      	
        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content" 
       />

      	{Modal(
            this.props.settings.diffPickerModal,
            'Select Difficulty Level',
            <View>
              
            	<Picker
      				  selectedValue={this.props.settings.difficulty.toString()}
      				  onValueChange={d=>this._setDifficulty(d)}>
      				  <Picker.Item label="Beginer" value="5" />
      				  <Picker.Item label="Pro" value="8" />
      				  <Picker.Item label="GrandMaster" value="10" />
      				</Picker>

	            <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:20}}>
	                {Button(
	                  <Text style={{fontWeight:'bold'}}>Select</Text>,
	                  ()=>this.setState({_diffPickerModal: false}),
	                  {marginRight:20,padding:5}
	                )}                
	            </View>  
            </View>
            ,
            ()=>this.setState({_diffPickerModal:false})
        )}

      	{Modal(
            this.props.settings.clearStateModal,
            'Reset Game Data',
            <View style={{flex:1}}>
              <Text style={{flexWrap:'wrap'}}>Do you want to delete all game data and reset settings to default?</Text>
              <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:20}}>
                {Button(
                  <Text style={{fontWeight:'bold'}}>No</Text>,
                  ()=>this.setState({_clearStateModal:false}),
                  {marginRight:20,padding:5}
                )}
                {Button(
                  <Text style={{fontWeight:'bold'}}>Yes</Text>,
                  ()=>this._clearAllData(),
                  {marginRight:20,padding:5}
                )}                
              </View>  
            </View>
            ,
            ()=>this.setState({_clearStateModal:false})
        )}

    
        <ScrollView style={{flex:1,marginTop:10}}>
        	
          <View style={{marginBottom:40}} />
  		

        	<View style={styles.settingItem}>
        		<Text>Difficulty</Text>
        		{Button(
        			<Text>{this._interpreteDiff(this.props.settings.difficulty)}</Text>,
        			()=>this.setState({_diffPickerModal: true}),
        			{marginRight:10}
        		)}
        	</View>

        	<View style={styles.settingItem}>
        		<Text>Sound</Text>
        		<Switch
  		        onValueChange={value=>this._toggleSound(value)}
  			      style={{marginBottom: 10}}
  		        value={this.props.settings.sound} 
  		    />
        	</View>

        	<View style={styles.settingItem}>
        		<Text>Vibration</Text>
        		<Switch
  		        onValueChange={value=>this._toggleVibration(value)}
  		  	    style={{marginBottom: 10}}
  		        value={this.props.settings.vibration} 
  		    />
        	</View>

          <View style={styles.settingItem}>
            <Text>Hide Status Bar</Text>
            <Switch
              onValueChange={value=>this._toggleStatusBar(value)}
              style={{marginBottom: 10}}
              value={this.props.settings.statusBar} 
            />
          </View>

          <View style={styles.settingItem}>
            <Text>Show Possible Moves</Text>
            <Switch
              onValueChange={value=>this._toggleShowPossMove(value)}
              style={{marginBottom: 10}}
              value={this.props.settings.showPossMove} 
            />
          </View>

          
          <View style={styles.settingItem}>
            <Text>Theme</Text>
            {Button(
              <View style={{height:30,width:30,backgroundColor: GLOBAL_VAR.COLOR.THEME['swan'].defaultPrimary}} />,
              ()=>this.setState({_themePickerModal:true}),
              {borderWidth:1,borderRadius:3}
            )}
          </View>



        </ScrollView>

        <View style={{justifyContent:'flex-end',alignItems:'center'}}>
          {Button(
            <Text style={{fontWeight:'bold'}}>Clear States & Data</Text>,
            ()=>this.setState({_clearStateModal:true}),
            {margin:10,padding:10,backgroundColor:'#f6f6f6'}
          )}
        </View>
      </View>
    );
  }

  _interpreteDiff = (d) => {
  	if(d == '5')
  		return 'Beginner';
  	if(d == '8')
  		return 'Pro';
  	if(d == '10')
  		return 'GrandMaster';
  	return 'Beginner';
  }

  //functions dealing with async storage
  _toggleSound = (_value) => {
    AsyncStorage.setItem('SOUND',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.SOUND = _value;
    return this.setState({_sound: _value});
  }
  _toggleVibration = (_value) => {
    AsyncStorage.setItem('VIBRATION',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.VIBRATION = _value;
    return this.setState({_vibration: _value});
  }
  _toggleStatusBar = (_value) => {
    AsyncStorage.setItem('STATUS_BAR',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.STATUS_BAR = _value;
    this.props.hideStatusBar(_value);
    return this.setState({_statusBar: _value});
  }
  _setDifficulty = (_value) => {
    AsyncStorage.setItem('DIFFICULTY',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.DIFFICULTY = _value.toString();
    return this.setState({_difficulty: _value});
  }
  _toggleShowPossMove = (_value) => {
    AsyncStorage.setItem('SHOW_POSS_MOVE',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.SHOW_POSS_MOVE = _value;
    return this.setState({_showPossMove: _value});
  }
  _toggleShowLastMove = (_value) => {
    AsyncStorage.setItem('SHOW_LAST_MOVE',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.SHOW_LAST_MOVE = _value;
    return this.setState({_showLastMove: _value});
  }
  
  _clearAllData = () => {      
      GLOBAL_VAR.APP_SETTING.SOUND = true;
      GLOBAL_VAR.APP_SETTING.VIBRATION = true;
      GLOBAL_VAR.APP_SETTING.STATUS_BAR = false;
      GLOBAL_VAR.APP_SETTING.SHOW_POSS_MOVE = true;
      GLOBAL_VAR.APP_SETTING.SHOW_LAST_MOVE = false;
      GLOBAL_VAR.APP_SETTING.DIFFICULTY = 5;//5,8,10
      GLOBAL_VAR.APP_SETTING.TOTAL_PLAYED = 0;
      GLOBAL_VAR.APP_SETTING.TOTAL_WON = 0;
      GLOBAL_VAR.APP_SETTING.TOTAL_LOST = 0;
      GLOBAL_VAR.APP_SETTING.THEME  = 'swan';
      
      AsyncStorage.setItem('SOUND','true');
      AsyncStorage.setItem('VIBRATION','true'); 
      AsyncStorage.setItem('STATUS_BAR','false'); 
      AsyncStorage.setItem('SHOW_POSS_MOVE','true'); 
      AsyncStorage.setItem('SHOW_LAST_MOVE','false'); 
      AsyncStorage.setItem('DIFFICULTY','5');//5,8,10 
      AsyncStorage.setItem('TOTAL_PLAYED','0'); 
      AsyncStorage.setItem('TOTAL_LOST','0'); 
      AsyncStorage.setItem('TOTAL_WON','0');
      AsyncStorage.setItem('LAUNCH_COUNT','1');
      AsyncStorage.setItem('THEME','swan');

      setTimeout(()=>this.setState({_clearStateModal:false}),10);

      return this.props.navigator.resetTo({
        name:'welcome'
      });
  }

  getStorageVar = async (_str) => {
    try {
        return await AsyncStorage.getItem(_str); 
    } 
    catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
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
    onChangeTheme : (key, val) => dispatch({
      type: actionTypes.CHANGE_THEME,
      key: key,
      val: val
    }),

    onSettingsTheme : (key, val) => dispatch({
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