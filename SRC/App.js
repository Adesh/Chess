import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import codePush from "react-native-code-push";

import reducer from './store/reducer';
import Welcome      from './Modules/Welcome';
import GameVsComp   from './Modules/GameVsComp';
import Settings   from './Modules/Settings';

const store = createStore(reducer);

const RootStack = createStackNavigator(
  {
    Welcome: Welcome,
    GameVsComp: GameVsComp,
    Settings: Settings
  },
  {
    initialRouteName: 'Welcome',
    headerMode: 'none'
  }
);

class App extends React.Component {
  render() {
    return (
      <Provider store={store} >
        <RootStack />
      </Provider>
    );
  }
}

export default codePush(App)