import React from 'react';
import {
  TouchableHighlight,
} from 'react-native';

module.exports = (labelComp,handler,btnStyle) => {
  return <TouchableHighlight 
          underlayColor='rgba(0,0,0,0)' 
          onPress={handler} 
          style={btnStyle}
        >
          {labelComp}
        </TouchableHighlight>;
}