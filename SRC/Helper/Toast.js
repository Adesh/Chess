import {
  NativeModules,
  ToastAndroid,
  Platform
} from 'react-native';

const Toast = (message, duration = 'short') => {

	if(Platform.OS == 'android'){
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