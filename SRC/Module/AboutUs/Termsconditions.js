import React, {Component} from 'react';
import {
  WebView,
} from 'react-native';

class Copyrights extends Component {
  
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