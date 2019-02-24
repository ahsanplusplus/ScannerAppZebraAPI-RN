/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import StartView from './app/StartView';
import ArrivalView from './app/ArrivalView';
import AddArrivalView from './app/AddArrivalView';
import { Root } from 'native-base';
import {createSwitchNavigator, createAppContainer} from 'react-navigation'
import SplashView from './app/SplashView';
import DepartureView from './app/DepartureView';
import AddDepartureView from './app/AddDepartureView';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
const AppNav = createSwitchNavigator({
  AddArrival: {
    screen: AddArrivalView
  },
  AddDeparture: {
    screen: AddDepartureView
  },
  Arrivals: {
    screen: ArrivalView
  },
  Departures: {
    screen: DepartureView
  },
  Splash: {
    screen: SplashView
  },
  Start: {
    screen: StartView
  },
}, {
  initialRouteName: 'Splash',
  resetOnBlur: false
});
const AppContainer = createAppContainer(AppNav);
export default class App extends Component<Props> {
  render() {
    return (
      <Root>
        <AppContainer/>
      </Root>
      // {/* <View style={styles.container}>
      //   <Text style={styles.welcome}>Welcome to React Native!</Text>
      //   <Text style={styles.instructions}>To get started, edit App.js</Text>
      //   <Text style={styles.instructions}>{instructions}</Text>
      // </View> */}
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
