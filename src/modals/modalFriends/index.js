import React, { Component } from "react";
import { TouchableOpacity, ScrollView } from "react-native"
import { List, ListItem, Left, Right, Body, Thumbnail, Text, InputGroup } from "native-base";
import Modal from "react-native-modal";
import DefaultPhoto from "../../../assets/icons/user.png"
import styles from "../../styles"

const ListRequest = (props) => {
    const { data, OnOpenProfile } = props;
    let image = null;
    return (
        <List>
            {data.map((v, i) => {
                image = v.mainPhoto == "" ? DefaultPhoto : v.mainPhoto;
                return (
                    <ListItem avatar key={i} onPress={() => OnOpenProfile(v)} >
                        <Left>
                            <Thumbnail source={image} />
                        </Left>
                        <Body>
                            <Text style={styles.textDark} >
                                {v.user}
                            </Text>
                        </Body>
                    </ListItem>
                )
            })}
        </List>
    )
}

class Friends extends Component {
    render() {
        const { open, close_modal, data, OnOpenProfile } = this.props;
        return (
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight" swipeDirection="right"
                onSwipe={close_modal} onBackButtonPress={close_modal} onBackdropPress={close_modal} style={styles.modal} >
                <ScrollView>
                    <ListRequest OnOpenProfile={OnOpenProfile} data={data} />
                </ScrollView>
            </Modal>
        )
    }
}

export default Friends;