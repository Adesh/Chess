import React, {Component} from 'react';
import {
  WebView,
} from 'react-native';

class PrivacyPolicy extends Component {
  
  render() {
    return ( 
        <WebView
            source={{uri: 'https://sites.google.com/view/chess-privacypolicy/your-page-title'}}
            style={{marginTop: 20}}
        />  
    );
  }  
};

export default PrivacyPolicy;