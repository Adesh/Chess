import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import codePush from "react-native-code-push";

import reducer from './reducers';
import Welcome      from './Module/Welcome';
import GameVsComp   from './Module/Game/GameVsComp';
import GameVsPlayer   from './Module/Game/GameVsPlayer';
import Settings   from './Module/Settings';

const store = createStore(reducer);

const RootStack = createStackNavigator(
  {
    Welcome: Welcome,
    GameVsComp: GameVsComp,
    GameVsPlayer: GameVsPlayer,
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