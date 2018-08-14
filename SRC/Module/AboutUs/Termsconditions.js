import React, {Component} from 'react';
import {
  WebView,
} from 'react-native';
import firebase from 'react-native-firebase';

class Copyrights extends Component {
  componentDidMount() {
    let analytics = firebase.analytics()
    analytics.setCurrentScreen('Termsconditions');
  }
  render() {
    return ( 
        <WebView
            source={{uri: 'https://sites.google.com/view/chess-termsconditions/home'}}
            style={{marginTop: 20}}
        />  
    );
  }  
};

export default Copyrights;