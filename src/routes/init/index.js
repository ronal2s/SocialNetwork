import React, { Component } from 'react'
import { Image, StyleSheet, View, Animated } from 'react-native'
import { DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Button, Icon, Container } from 'native-base'
import iconBoy from '../../../assets/icons/boy.png'
import styles from '../../styles'

const CardsPhotos = (props) => {
    const { data } = props;
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => {
        return (
            <Card transparent key={i} >
                <CardItem style={{ backgroundColor: "#282828" }}>
                    <Left>
                        <Thumbnail style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: "https://firebasestorage.googleapis.com/v0/b/socialnetwork-3b7a1.appspot.com/o/USUARIOS%2FCuero123?alt=media&token=3242be22-23b1-45b2-b644-8d56c164d4f1" }} />
                        <Body>
                            <Text style={{color: "gray"}} >@ronal2s</Text>
                        </Body>
                    </Left>
                </CardItem >
                <CardItem style={{ backgroundColor: "#282828" }}>
                    <Image source={{ uri: "https://concepto.de/wp-content/uploads/2015/03/paisaje-2-e1549600987975.jpg" }} style={{ width: "100%", height: 300, }} />
                </CardItem>
                <CardItem style={{ backgroundColor: "#282828" }}>
                    <Text note>
                        Descripcion
                    </Text>
                </CardItem>
                <CardItem style={{ backgroundColor: "#282828" }}>
                    <Left>
                        <Button transparent>
                            <Icon name="favorite-border" type="MaterialIcons" style={{color: "gray"}} />
                            {/* Validar si ESTE usuario le dio like o no */}
                        </Button>
                        <Button transparent>
                            <Icon name="comment" type="MaterialCommunityIcons" style={{color: "gray"}}/>                            
                        </Button>
                    </Left>                    
                </CardItem>                
            </Card>
        )
    })
}

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
            <Animated.ScrollView
                style={[{ transform: [{ translateX: this.state.x }],  }, styles.DarkColorBackground]}>

                <CardsPhotos />

            </Animated.ScrollView>
        )
    }
}



export default Employees;
