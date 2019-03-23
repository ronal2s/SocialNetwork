import React, { Component } from 'react'
import { Image, StyleSheet, View, Animated } from 'react-native'
import { DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Button, Icon, Container } from 'native-base'
import iconBoy from '../../../assets/icons/boy.png'

import iconOpenNow from '../../../assets/icons/open.png'
import iconNearHome from '../../../assets/icons/near.png'
import iconFavorites from '../../../assets/icons/heart.png'
import iconCalendar from '../../../assets/icons/calendar.png'
import styles from '../../styles'
import Dashboard from '../../components/dashboard'
const DASHBOARDCARDS = "#b61827"

const items = [
  { name: 'Abiertos', background: DASHBOARDCARDS, icon: iconOpenNow },
  { name: 'Cerca', background: DASHBOARDCARDS, icon: iconNearHome },
  { name: 'Favoritos', background: DASHBOARDCARDS, icon: iconFavorites },
  { name: 'Citar', background: DASHBOARDCARDS, icon: iconCalendar },
  { name: 'Opcion6', background: DASHBOARDCARDS, icon: iconCalendar},
  { name: 'Opcion7', background: DASHBOARDCARDS, icon: iconCalendar},
];


class Employees extends Component {

    state = {
        x: new Animated.Value(100)
    }

    componentDidMount() {

        this.slide();
    }



    slide = () => {
        Animated.spring(this.state.x, {
            toValue: 0,
        }).start();
    };


    static navigationOptions = {
        header: null
    }
    _card = el => {
        console.log('Card: ' + el.name)
    };
    
    render() {
        const { total_employees, loading, mainData, actual_data, openModals, } = this.state;
        const { open_modal, close_modal, navigation, handlePages } = this.props;
        return (
            <Animated.View
                style={[{ transform: [{ translateX: this.state.x }] }]}>
                {/* <View style={styles.centerContent}> */}
                    {/* <Dashboard background="red" items={items} background={true} card={this._card} column={2} /> */}
                    <Text style={styles.textNormal}>Home</Text>
                {/* </View> */}
            </Animated.View>
        )
    }
}



export default Employees;
