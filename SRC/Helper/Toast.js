import {
  NativeModules,
  ToastAndroid
} from 'react-native';
import GLOBAL from '../Globals';

const Toast = (message, duration = 'short') => {

	if(GLOBAL.PLATFORM == 'ANDROID'){
		return ToastAndroid.show(
			message, 
			(duration == 'long') ?
				ToastAndroid.LONG :
				ToastAndroid.SHORT
		);
	}

	return NativeModules.ToastModule.showToast({
        message,
        duration, 
        position: 'bottom',
        addPixelsY: 0,
    });
};

export default Toast;