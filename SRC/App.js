import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import codePush from "react-native-code-push";
import firebase from 'react-native-firebase';

import reducer from './redux/reducers';
import Welcome      from './Module/Welcome';
import GameVsComp   from './Module/Game/GameVsComp';
import GameVsPlayer   from './Module/Game/GameVsPlayer';
import Settings   from './Module/Settings';
import PrivacyPolicy from "./Module/AboutUs/PrivacyPolicy";
import Termsconditions from "./Module/AboutUs/Termsconditions";




const store = createStore(reducer);

const RootStack = createStackNavigator(
  {
    Welcome,
    GameVsComp,
    GameVsPlayer,
    Settings,
    PrivacyPolicy,
    Termsconditions
  },
  {
    initialRouteName: 'Welcome',
    headerMode: 'none'
  }
);

const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

class App extends React.Component {
  componentDidMount() {
    let analytics = firebase.analytics()
    analytics.setAnalyticsCollectionEnabled(true);
  }
  render() {
    return (
      <Provider store={store} >
        <RootStack />
      </Provider>
    );
  }
}

export default codePush(codePushOptions)(App)