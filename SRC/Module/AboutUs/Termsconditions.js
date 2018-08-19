import React, {Component} from 'react';
import {
  WebView,
} from 'react-native';
import firebase from 'react-native-firebase';

import GLOBAL from '../../Globals';

class Copyrights extends Component {
  componentDidMount() {
    let analytics = firebase.analytics()
    analytics.setCurrentScreen('Termsconditions');
  }
  render() {
    return ( 
        <WebView
            source={{uri: GLOBAL.TERMS_URL}}
            style={{marginTop: 20}}
        />  
    );
  }  
};

export default Copyrights;