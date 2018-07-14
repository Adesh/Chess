import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Switch,
  Picker,
  AsyncStorage,
  ScrollView,
} from 'react-native';


var GLOBAL_VAR   = require('../Globals');

var Toast        = require('../Helper/GetToast');
var Button       = require('../Helper/GetButton');
var TopMenu       = require('../Helper/TopMenu');
var Modal       = require('../Helper/GetModal');

var Icon          = require('react-native-vector-icons/Ionicons');

const {height, width} = Dimensions.get('window');

module.exports = React.createClass({   
  componentWillMount: function(){
    
    this.getStorageVar('SOUND')
      .then(val=>{
        //GLOBAL_VAR.APP_SETTING.SOUND = val;
        return this.setState({_sound:(val=='true')?true:false});
      })
      .catch(e=>{});

    this.getStorageVar('VIBRATION')
      .then(val=>{
        //GLOBAL_VAR.APP_SETTING.VIBRATION = val;
        return this.setState({_vibration:(val=='true')?true:false});
      })
      .catch(e=>{});

    this.getStorageVar('STATUS_BAR')
      .then(val=>{
        //GLOBAL_VAR.APP_SETTING.STATUS_BAR = val;
        return this.setState({_statusBar:(val=='true')?true:false});
      })
      .catch(e=>{}); 

    this.getStorageVar('SHOW_POSS_MOVE')
      .then(val=>{
        //GLOBAL_VAR.APP_SETTING.SHOW_POSS_MOVE = val;
        return this.setState({_showPossMove:(val=='true')?true:false});
      })
      .catch(e=>{}); 

    this.getStorageVar('SHOW_LAST_MOVE')
      .then(val=>{
        //GLOBAL_VAR.APP_SETTING.SHOW_POSS_MOVE = val;
        return this.setState({_showLastMove:(val=='true')?true:false});
      })
      .catch(e=>{});      

    this.getStorageVar('DIFFICULTY')
      .then(val=>{
        var v = 5;
        try{
          v = parseInt(val);
        }
        catch(e){
          console.log("exc",e);
        }
        //GLOBAL_VAR.APP_SETTING.DIFFICULTY = v;
        return this.setState({_difficulty:v});
      })
      .catch(e=>{});

    this.getStorageVar('TOTAL_PLAYED')
        .then(_PLAYED=>{
            this.getStorageVar('TOTAL_WON')
                .then(_WON=>{

                    var p = 0, 
                        w = 0,
                        s = 0;

                    try{
                      p = parseInt(_PLAYED);
                      w = parseInt(_WON);
                      if(w != 0)
                        s = Math.round(w/p*100);                      
                    }catch(e){

                    }  

                    return this.setState({
                      _vsCompTotal:p,
                      _vsCompWon:w,
                      _vsCompScore:s,
                    });
                })
                .catch(error=>console.log(error));           
        })
        .catch(error=>console.log(error));       
  },
  getInitialState: function(){
  	return {
  		_difficulty:'5', // Beginer:5, Pro:8, GrandMaster: 10
  		_sound: true,
  		_vibration: true,
      _statusBar:false,
  		_showPossMove:true,
      _showLastMove:true,
      _diffPickerModal: false,
  		_clearStateModal: false,
      _themePickerModal: false,
  		//_vsHumanTotal:0,
  		//_vsHumanWon:0,
  		//_vsHumanScore:0,
  		_vsCompTotal:0,
  		_vsCompWon:0,
  		_vsCompScore:0,
  	}
  },
  render: function() {
    return (
      <View style={[styles.maincontainer,{backgroundColor: GLOBAL_VAR.COLOR.THEME[this.props.themeName].defaultPrimary}]}>
      	
      	{Modal(
            this.state._diffPickerModal,
            'Select Difficulty Level',
            <View>
              
            	<Picker
      				  selectedValue={this.state._difficulty.toString()}
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
            this.state._clearStateModal,
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

        {Modal(
            this.state._themePickerModal,
            'Select Theme',
            <ThemeSelector
              themeName={this.props.themeName}
              route={this.props.route}
              navigator={this.props.navigator}
              applyTheme={(_theme)=>{
                this.props.applyTheme(_theme);
                AsyncStorage.setItem('THEME',_theme); 
                return this.setState({_themePickerModal:false})
              }}
            />
            ,
            ()=>this.setState({_themePickerModal:false})
        )}

      	<TopMenu
      		titleLabel='Settings'
      		actionLabel=''
      		actionHandler={()=>{}}
      		route={this.props.route}
      		navigator={this.props.navigator}
          themeName={this.props.themeName}
      	/>

        <ScrollView style={{flex:1,marginTop:10}}>
        	
          <View style={{marginBottom:40}} />
  		
      		<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginBottom:20}}>
      			<Icon 
      				name='person' 
      				size={100} 
      				color={GLOBAL_VAR.COLOR.THEME[this.props.themeName].darkPrimary}  
      			/>
      		</View>

      		<View style={{flexDirection:'row',padding:10,justifyContent:'space-between'}}>
      			<View style={{flex:1}}>
      				<Text></Text>
      			</View>
      			{/*<View style={{flex:1,alignItems:'flex-end'}}>
      				<Text style={{fontWeight:'bold'}}>vs Human</Text>
      			</View>*/}
      			<View style={{flex:1,alignItems:'flex-end'}}>
      				<Text style={{fontWeight:'bold'}}>vs Computer</Text>
      			</View>
      		</View>

      		<View style={{flexDirection:'row',padding:10,justifyContent:'space-between'}}>
      			<View style={{flex:1}}>
      				<Text>Total Played: </Text>
      			</View>
      			{/*<View style={{flex:1,alignItems:'flex-end'}}>
      				<Text style={{fontWeight:'bold'}}>5</Text>
      			</View>*/}
      			<View style={{flex:1,alignItems:'flex-end'}}>
      				<Text style={{fontWeight:'bold'}}>{this.state._vsCompTotal}</Text>
      			</View>
      		</View>

      		<View style={{flexDirection:'row',padding:10,justifyContent:'space-between'}}>
      			<View style={{flex:1}}>
      				<Text>Won: </Text>
      			</View>
      			{/*<View style={{flex:1,alignItems:'flex-end'}}>
      				<Text style={{fontWeight:'bold'}}>5</Text>
      			</View>*/}
      			<View style={{flex:1,alignItems:'flex-end'}}>
      				<Text style={{fontWeight:'bold'}}>{this.state._vsCompWon}</Text>
      			</View>
      		</View>

      		<View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderColor:GLOBAL_VAR.COLOR.THEME[this.props.themeName].divider,padding:10, marginBottom:10,paddingBottom:20}}>
      			<View style={{flex:1}}>
      				<Text>Score: </Text>
      			</View>
      			{/*<View style={{flex:1,alignItems:'flex-end'}}>
      				<Text style={{fontWeight:'bold'}}>5</Text>
      			</View>*/}
      			<View style={{flex:1,alignItems:'flex-end'}}>
      				<Text style={{fontWeight:'bold'}}>{this.state._vsCompScore}%</Text>
      			</View>
      		</View>

        	<View style={styles.settingItem}>
        		<Text>Difficulty</Text>
        		{Button(
        			<Text>{this._interpreteDiff(this.state._difficulty)}</Text>,
        			()=>this.setState({_diffPickerModal: true}),
        			{marginRight:10}
        		)}
        	</View>

        	<View style={styles.settingItem}>
        		<Text>Sound</Text>
        		<Switch
  		        onValueChange={value=>this._toggleSound(value)}
  			      style={{marginBottom: 10}}
  		        value={this.state._sound} 
  		    />
        	</View>

        	<View style={styles.settingItem}>
        		<Text>Vibration</Text>
        		<Switch
  		        onValueChange={value=>this._toggleVibration(value)}
  		  	    style={{marginBottom: 10}}
  		        value={this.state._vibration} 
  		    />
        	</View>

          <View style={styles.settingItem}>
            <Text>Hide Status Bar</Text>
            <Switch
              onValueChange={value=>this._toggleStatusBar(value)}
              style={{marginBottom: 10}}
              value={this.state._statusBar} 
            />
          </View>

          <View style={styles.settingItem}>
            <Text>Show Possible Moves</Text>
            <Switch
              onValueChange={value=>this._toggleShowPossMove(value)}
              style={{marginBottom: 10}}
              value={this.state._showPossMove} 
            />
          </View>

          {/*<View style={styles.settingItem}>
            <Text>Show Last Moves</Text>
            <Switch
              onValueChange={value=>this._toggleShowLastMove(value)}
              style={{marginBottom: 10}}
              value={this.state._showLastMove} 
            />
          </View>*/}

          <View style={styles.settingItem}>
            <Text>Theme</Text>
            {Button(
              <View style={{height:30,width:30,backgroundColor: GLOBAL_VAR.COLOR.THEME[this.props.themeName].defaultPrimary}} />,
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
  }, 
  _interpreteDiff: function(d){
  	if(d == '5')
  		return 'Beginner';
  	if(d == '8')
  		return 'Pro';
  	if(d == '10')
  		return 'GrandMaster';
  	return 'Beginner';
  },
  //functions dealing with async storage
  _toggleSound: function(_value){
    AsyncStorage.setItem('SOUND',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.SOUND = _value;
    return this.setState({_sound: _value});
  },
  _toggleVibration: function(_value){
    AsyncStorage.setItem('VIBRATION',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.VIBRATION = _value;
    return this.setState({_vibration: _value});
  },
  _toggleStatusBar: function(_value){
    AsyncStorage.setItem('STATUS_BAR',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.STATUS_BAR = _value;
    this.props.hideStatusBar(_value);
    return this.setState({_statusBar: _value});
  },
  _setDifficulty: function(_value){
    AsyncStorage.setItem('DIFFICULTY',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.DIFFICULTY = _value.toString();
    return this.setState({_difficulty: _value});
  },
  _toggleShowPossMove: function(_value){
    AsyncStorage.setItem('SHOW_POSS_MOVE',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.SHOW_POSS_MOVE = _value;
    return this.setState({_showPossMove: _value});
  },
  _toggleShowLastMove: function(_value){
    AsyncStorage.setItem('SHOW_LAST_MOVE',_value.toString()); 
    GLOBAL_VAR.APP_SETTING.SHOW_LAST_MOVE = _value;
    return this.setState({_showLastMove: _value});
  },
  _clearAllData: function(){      
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
  }, 
  async getStorageVar(_str){
      try {
        return await AsyncStorage.getItem(_str); 
      } 
      catch (error) {
        console.log('AsyncStorage error: ' + error.message);
      }
  },

});

var ThemeSelector = React.createClass({

  getInitialState: function(){
    return {
      _theme:this.props.themeName
    }
  },
  render() {
    return (
      <View style={{flex:1}}>
              
          <View 
            style={{
              alignItems:'center',
              justifyContent:'center',
              flexDirection:'row',
              flexWrap:'wrap'

            }}
          >
            {this.getThemeList()}
          </View>
         

          <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:20}}>
            {Button(
              <Text style={{fontWeight:'bold'}}>Select</Text>,
              ()=>this.props.applyTheme(this.state._theme),
              {marginRight:20,padding:5}
            )}                
          </View> 

      </View>
    );  
  },
  getThemeList: function(){
    var list = [];
    for (var theme in GLOBAL_VAR.COLOR.THEME) {
        //if (GLOBAL_VAR.COLOR.THEME.hasOwnProperty(theme)){
          const themed = theme;
          list.push(
            <View key={theme}>
            {Button(
              <View 
                style={{
                  height:50,
                  width:50,
                  backgroundColor:GLOBAL_VAR.COLOR.THEME[themed].defaultPrimary,
                  borderRadius:3,
                  alignSelf:'center'
                }} 
              />,
              ()=>this.setState({_theme:themed}),
              {
                padding:3,
                borderWidth:1,
                borderColor:(this.state._theme==themed)?'red':'lightgrey',
                margin:10,
                borderRadius:3,
              }
            )}
            </View>
          );
        //}
    }

    return list;
  }
})

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