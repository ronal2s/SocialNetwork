import React from 'react';
import {  StatusBar } from 'react-native';
import { Font, AppLoading } from "expo";

import Main from './src/main'
import { View } from 'native-base';

export default class App extends React.Component {
  
  state =
  {
    loading: true
  }
  
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
    // StatusBar.setHidden(true);
  }
  render() {
    if(!this.state.loading)
    {
      return (
//         <View>
// <StatusBar barStyle="light-content" backgroundColor="#2c2c2c"/>
//         </View>
          <Main/>
      );

    } 
    return <AppLoading/>
  }
}

