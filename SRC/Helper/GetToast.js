import React from 'react';
import {
  NativeModules,
  ToastAndroid
} from 'react-native';

var GLOBAL_VAR = require('../Globals');
var ToastiOS = require('NativeModules').ToastModule;

module.exports = function(msg, duration) {
	var newDuration = duration;
	if(newDuration != 'short' || newDuration != 'long'){
		newDuration = 'short';
	}

	if(GLOBAL_VAR.PLATFORM == 'ANDROID'){
		ToastAndroid.show(msg, (newDuration == 'short')?ToastAndroid.SHORT:ToastAndroid.LONG);
		/*
		if(newDuration == 'short'){
			return NativeModules.AndroidMethods.getappversion((m)=>{ToastAndroid.show(msg,ToastAndroid.SHORT)});
		}
		else{
			return NativeModules.AndroidMethods.getappversion((m)=>{ToastAndroid.show(msg,ToastAndroid.LONG)});
		}
		*/
	}
	else{
		var data = {
            message:msg,
            duration: newDuration, 
            position: 'bottom',
            addPixelsY: 0,
        }
		return ToastiOS.showToast(data);
	}
}