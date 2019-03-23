import React from 'react';
import { StatusBar } from 'react-native';
import { Font, AppLoading } from "expo";
import Main from './src/main'
export default class App extends React.Component {

  state =
    {
      loading: true,
    }

  async componentWillMount() {

    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });


    this.setState({ loading: false,  });

  }

  render() {    
    if (!this.state.loading) {
      return (
        <Main />
      );

    }
    return <AppLoading />
  }
}

