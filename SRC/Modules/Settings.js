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

import { StackActions, NavigationActions } from 'react-navigation';
import GLOBAL_VAR from '../Globals';
import Button from '../Helper/GetButton';
import Modal from '../Helper/GetModal';
import * as actionTypes from '../store/actions';

const {width} = Dimensions.get('window');

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diffPickerModal: false
    }
  }
  render() {
    return (
      <View style={[styles.maincontainer,{backgroundColor: GLOBAL_VAR.COLOR.THEME['swan'].defaultPrimary}]}>
      	
        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content" 
        />

      	{Modal(
            this.state.diffPickerModal,
            'Select Difficulty Level',
            <View>
              
            	<Picker
      				  selectedValue={this.props.settings.difficulty.toString()}
      				  onValueChange={d => this.updateSetting('difficulty',d)}>
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

    
        <ScrollView style={{flex:1,marginTop:50}}>
        	
        	<View style={styles.settingItem}>
        		<Text>Difficulty</Text>
        		{Button(
        			<Text>{this._interpreteDifficulty(this.props.settings.difficulty)}</Text>,
        			()=>this.setState({_diffPickerModal: true}),
        			{marginRight:10}
        		)}
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
    switch(d) {
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
      this.updateSetting(setting, GLOBAL_VAR.APP_SETTING.DEFAULT[setting]); 
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
    onChangeTheme : (key, val) => dispatch({
      type: actionTypes.CHANGE_THEME,
      key: key,
      val: val
    }),

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