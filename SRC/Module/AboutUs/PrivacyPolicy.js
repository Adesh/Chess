import React, {Component} from 'react';
import {
  WebView,
} from 'react-native';
import firebase from 'react-native-firebase';

import GLOBAL from '../../Globals';

class PrivacyPolicy extends Component {
  componentDidMount() {
    let analytics = firebase.analytics()
    analytics.setCurrentScreen('PrivacyPolicy');
  }

  render() {  
    return ( 
        <WebView
            source={{uri: GLOBAL.PRIVACY_POLICY_URL}}
            style={{marginTop: 20}}
        />  
    );
  }  
};

export default PrivacyPolicy;