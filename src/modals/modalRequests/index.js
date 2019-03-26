import React, { Component } from "react";
import { TouchableOpacity, ScrollView } from "react-native"
import { List, ListItem, Left, Right, Body, Thumbnail, Text, InputGroup } from "native-base";
import Modal from "react-native-modal";
import DefaultPhoto from "../../../assets/icons/user.png"
import styles from "../../styles"

const ListRequest = (props) => {
    const {data, OnAcceptPress, OnDeclinePress } = props;
    let image = null;
    return (
        <List>
            {data.map((v, i) => {
                image = v.mainPhoto == "" ? DefaultPhoto : {uri: v.mainPhoto};
                return (
                    <ListItem avatar key={i} >
                        <Left>
                            <Thumbnail source={image} />
                        </Left>
                        <Body>
                            <Text style={styles.textDark} >
                                {v.user}
                            </Text>
                            <InputGroup  >
                                <TouchableOpacity onPress={() => OnAcceptPress(v)} >
                                    <Text style={{ color: "green", paddingRight: 10 }}>
                                        Aceptar
                                            </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => OnDeclinePress(v)} >
                                    <Text style={{ color: "red" }}>
                                        Rechazar
                                            </Text>
                                </TouchableOpacity>
                            </InputGroup>
                        </Body>
                    </ListItem>
                )
            })}
        </List>
    )
}

class Requests extends Component {
    render() {
        const { open, close_modal, data, OnAcceptPress, OnDeclinePress } = this.props;
        let image = null;
        return (
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight" swipeDirection="right"
                onSwipe={close_modal} onBackButtonPress={close_modal} onBackdropPress={close_modal} style={styles.modal} >
                <ScrollView>                    
                    <ListRequest OnAcceptPress={OnAcceptPress} OnDeclinePress={OnDeclinePress} data={data} />
                </ScrollView>
            </Modal>
        )
    }
}

export default Requests;