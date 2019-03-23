import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableNativeFeedback,
  Image
} from 'react-native';
import { Constants } from 'expo';
import GridView from 'react-native-super-grid';
import {Icon, Thumbnail} from 'native-base'

const { width } = Dimensions.get('window');

const RippleColor = (...args) =>
  Platform.Version >= 21 ? TouchableNativeFeedback.Ripple(...args) : null;

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      width: width,
    };
  }

  onLayout(e) {
    const { width } = Dimensions.get('window');
    this.setState({ width });
  }

  render() {
    console.log(!this.props.background);
    var column = !this.props.column ? 2 : this.props.column;
    var dim = this.state.width / column - 20;
    return (
      <View onLayout={this.onLayout.bind(this)} style={{ flex: 1 }}>
        <GridView
          itemDimension={dim}
          items={this.props.items}
          style={styles.gridView}
          renderItem={item => (
            <TouchableNativeFeedback
              onPress={() => {
                this.props.card(item);
              }}
              delayPressIn={0}
              delayPressOut={0}
              useForeground={true}
              background={RippleColor('#fff')}
            //   background={RippleColor(this.props.background_color)}
              >
              <View
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor: item.background,
                    //   !item.background || !this.props.background
                    //     ? '#fff'
                    //     : item.background,
                    height: dim,
                  },
                ]}>
                {/* <Icon
                  name={item.icon}
                  size={40}
                  color={
                    !item.background || !this.props.background
                      ? '#3498db'
                      : '#fff'
                  }
                /> */}
                <Thumbnail square source={item.icon}/> 
                <Text
                  style={[
                    styles.itemName,
                    {
                      color:
                        !item.background || !this.props.background
                          ? '#000'
                          : '#fff',
                    },
                  ]}>
                  {item.name}
                </Text>
              </View>
            </TouchableNativeFeedback>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
  },
});
