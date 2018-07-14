import React from 'react';
import {
  Platform,
  Dimensions,
  Vibration
} from 'react-native';

var Sound         = require('react-native-sound');

const {height, width} = Dimensions.get('window');

module.exports = {
  APP_VERSION: '1.0.0',
  DEEP_LINK_PROTOCOL: 'chessrt://',
  BASE_URL: 'https://www.Euristico.com/Chess',
  BASE_URL_API: 'https://chess-cool.herokuapp.com/api',
  
  SOCKET_URL:'localhost:8000',

  ABOUT_US_URL:'https://www.Euristico.com/Chess/API/AboutUs',  
  PRIVACY_POLICY_URL:'https://www.Euristico.com/Chess/privacypolicy/',
  COOKIE_POLICY_URL:'https://www.Euristico.com/Chess/cookiepolicy/',
  TERMS_OF_USE_URL:'https://www.Euristico.com/Chess/termsofuse/',
  
  APP_SETTING:{
    SOUNDS: {
      MOVE_FX: new Sound((Platform.OS != 'ios')?'movesound.wav':'../../Resources/moveSound.wav', Sound.MAIN_BUNDLE, error=>(error)?console.log('Sound not loaded'):console.log('Sound loaded')),
    },
    NOTIFY: function(){
      try{
        if(this.VIBRATION == true){ 
          Vibration.vibrate();
        }
        if(this.SOUND == true){
          this.SOUNDS.MOVE_FX.play(success=>{
            //(success)?console.log('Sound Played'):console.log('Sound not played')
            this.SOUNDS.MOVE_FX.stop();
          });
        }  
      }
      catch(e){
        console.log(e);
      }  
    },
    SOUND:true,
    VIBRATION:true,
    STATUS_BAR:true,
    SHOW_POSS_MOVE:true,
    SHOW_LAST_MOVE:true,
    DIFFICULTY:5,//5,8,10
    TOTAL_PLAYED:0,
    TOTAL_LOST:0,
    TOTAL_WON:0,
    THEME:'swan'
  },

  USER_AUTH: {
	  NAME:'',
    PROFILE_PIC:'',
    UAID:'',
    ACCESSTOKEN:'',
    PASSWORD:'',
    EMAIL:''
  },

  COLOR:{
    BACKGROUND    :'#FFFFFF',
    PRIMARY_DARK  :'#1976D2',
    PRIMARY       :'#2196F3',
    PRIMARY_LIGHT :'#BBDEFB',
    TEXT_ICON     :'#FFFFFF',
    ACCENT_COLOR  :'#8BC34A',
    PRIMARY_TEXT  :'#212121',
    SECONDARY_TEXT:'#727272',
  	DEVIDER       :'#B6B6B6',

    CELL_LIGHT:'white',
    CELL_DARK:'lightgrey',
    THEME:{
      swan:{
        darkPrimary: '#2196F3',
        defaultPrimary: '#FFFFFF',
        lightPrimary: '#FFFFFF',
        textPrimary: '#f2f2f2',
        primaryText: '#212121',
        secondaryText: '#757575',
        divider:'#BDBDBD',
      },
    },
  },

  FONT:{
    HEADER:45,
    SUB_HEADER:20,
    FONT_H1:16,
    FONT_H2:15,
    FONT_H3:14,
    FONT_H4:11,
    FONT_H5:10,
  },
  
  STYLE: {
    /*modalContainer:{
      height:height,
      width:width,
      justifyContent: 'center',
      alignItems:'center',
      backgroundColor:'rgba(175,175,175,0.75)'
    },
    modal:{
      margin:5,
      borderRadius: 5,
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 10,
    },*/
  },

  PLATFORM:(Platform.OS === 'ios') ? 'IOS' : 'ANDROID',
  BACK_EXIT_TIMESTAMP:'',
  NAVIGATOR:'', /* not a good practise! used by API.js. Keep it till we figure out a better way */
  
  COLUMN_MAP: {
      COL2NUM:{
        a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8
      },
      NUM2COL: {
        1:'a', 2:'b', 3:'c', 4:'d', 5:'e', 6:'f', 7:'g', 8:'h'
      }  
  },

  HELPER_FUNC:{
    FORMAT_DATE: function(str){
        try{
          var finalstr='';
          var month = new Array();
          month[0] = "January";
          month[1] = "February";
          month[2] = "March";
          month[3] = "April";
          month[4] = "May";
          month[5] = "June";
          month[6] = "July";
          month[7] = "August";
          month[8] = "September";
          month[9] = "October";
          month[10] = "November";
          month[11] = "December";

          var res = str.split('-');          

          return `${month[parseInt(res[1]-1)]} ${parseInt(res[2])}, ${parseInt(res[0])}`;
        }
        catch(exc){
          return '';
        }
    },
    FORMAT_TIME: function(_inDateStr){
      try{
        var inDateStr = _inDateStr.substr(0,16);
        var [inDate, inTime] = inDateStr.split(' ');
        var date = new Date(),
            day = date.getDate(),
            monthIndex = date.getMonth()+1,
            year = date.getFullYear(),
            mn = date.getMinutes(),
            hr = date.getHours();

        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";


        if(monthIndex<10)
          monthIndex = '0'+monthIndex;
        if(day<10)
          day = '0'+day;
        if(mn<10)
          mn = '0'+mn;
        if(hr<10)
          hr = '0'+hr;

        var date_temp =  `${year}-${monthIndex}-${day}`;
        var time_tmep = `${hr}:${mn}`;

        if(inDate == date_temp){
          var [inHr, inMn] = inTime.split(':');
          if(inHr == hr){
            if(parseInt(mn) - parseInt(inMn) <= 5){
              return "Just now";
            }
            else{
              return `${mn - inMn} min ago`;
            }
          }
          else{
            return `Today, ${inHr}:${inMn}`;
          }
        }
        else{
          return `${month[parseInt(inDate.substring(5,7)-1)]} ${parseInt(inDate.substring(8,10))}, ${inDate.substring(0,4)}`;
        }
      }
      catch(exc){
        return '';
      }
    },
    SHORTEN_STR: function(_str,_n){
      if(_str==undefined || _str==null)
        return {str:'',modified:false};
      if(_str.length == 0)
        return {str:'',modified:false};
      if(_str.length < _n)
        return {str:_str,modified:false};

      return {str:_str.substr(0,_n),modified:true}; 
    },
  }
};