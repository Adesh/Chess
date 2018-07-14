import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Welcome      from './Modules/Welcome';
import GameVsComp   from './Modules/Game/GameVsComp';

const RootStack = createStackNavigator(
  {
    Welcome: Welcome,
    GameVsComp: GameVsComp,
  },
  {
    initialRouteName: 'Welcome',
    headerMode: 'none'
  }
);

export default class App extends React.Component {
  render() {
    return (
      <RootStack />
    );
  }
}