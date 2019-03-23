import React, { Component } from 'react'
import { RefreshControl, StyleSheet, View, Animated, Image } from 'react-native'
import { Spinner, Content, Card, CardItem, Thumbnail, Text, Left, Right, Body, Button, Icon } from 'native-base'
import styles from '../../styles'
class Employees extends Component {

    state = {
        x: new Animated.Value(-100)
    }

    componentDidMount() {
        this.slide();
    }
    slide = () => {
        Animated.spring(this.state.x, {
            toValue: 0,
        }).start();
    };

    onScroll = (e) => {
        //infinit scroll
        let scrollHeight = e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
        scrollHeight = Math.floor(scrollHeight)
        if (scrollHeight >= (Math.floor(e.nativeEvent.contentSize.height) / 1.5)) {
            this.setState({ loading2: true })
            setTimeout(() => { this.loadMoreCards(); this.setState({ loading2: false }) }, 1);
        }
    }



    static navigationOptions = {
        header: null
    }

    render() {
        return (

            <Animated.View
                style={[{ transform: [{ translateX: this.state.x }] }]}>
                {/* <Content onScroll={this.onScroll} scrollEventThrottle={100}> */}
                    <Text style={styles.textNormal} >Blabla</Text>
                {/* </Content> */}
            </Animated.View>


        )
    }
}

export default Employees;
