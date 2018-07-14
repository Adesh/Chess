import React, {Component} from 'react';
import {
  Modal,
  View,
  Dimensions,
  Text,
  //StatusBar
} from 'react-native';


import Button from './GetButton';
const {height, width} = Dimensions.get('window');

import Icon from 'react-native-vector-icons/Ionicons';

var modalDialogLayout;

module.exports = (visibility,title,modalBody,closeModalHandler) => {

  var closeBtn;
  
  const modalContainerStyle = {
    height:height,
    width:width,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)'
  };

  const modalStyle = {
    width:width-100,
    height:'auto',
    borderRadius:2,
    backgroundColor:'rgba(255,255,255,0.95)',
  };

  return <Modal 
          animationType='fade' 
          transparent={true} 
          visible={visibility} 
          onRequestClose={closeModalHandler} 
         >
          <View 
            style={modalContainerStyle}
      	    onStartShouldSetResponder={(evt)=>true} 
            onResponderRelease={(evt)=>{ closeModal(closeModalHandler,evt.nativeEvent) }}
          >
            <View 
              style={modalStyle}
           	  onLayout={(event) => {modalDialogLayout = event.nativeEvent.layout;}}
            >
              
              <View>
                <View style={{flexDirection:'row',width:width-100,borderBottomWidth:0.5,borderBottomColor:'grey',padding:10,justifyContent:'space-between',alignItems:'center'}}>
                  <Text style={{fontWeight:'bold'}}>{title}</Text>
                  {Button(
                    <Icon name='md-close' color='grey' />,
                    closeModalHandler,
                    {padding:5}
                  )}
                </View>
                <View style={{width:width-100,padding:10}}>
                  {modalBody}
                </View>   
              </View>

              
            </View>
          </View>
          {closeBtn}
        </Modal>;
}

var closeModal  = (closeModalHandler,evtTouch)=>{
    var proceed = false;
    if(evtTouch.pageX < modalDialogLayout.x || evtTouch.pageX > (modalDialogLayout.x+modalDialogLayout.width)){
      proceed = true;
    }
    else{
    	//console.log("check y");
      if(evtTouch.pageY < modalDialogLayout.y || evtTouch.pageY > (modalDialogLayout.y + modalDialogLayout.height)){
        proceed = true;
      }   
    }

    if(proceed == true){
      //console.log('close');
      closeModalHandler(); 
      return;      
    }
    return;
};