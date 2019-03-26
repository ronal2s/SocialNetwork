import React, { Component } from "react";
import { TouchableOpacity, ScrollView } from "react-native"
import { List, ListItem, Left, Right, Body, Thumbnail, Text, InputGroup } from "native-base";
import Modal from "react-native-modal";
import DefaultPhoto from "../../../assets/icons/user.png"
import styles from "../../styles"
class Requests extends Component {
    render() {
        const { open, close_modal, data } = this.props;
        let image = null;
        return (
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight" swipeDirection="right"
                onSwipe={close_modal} onBackButtonPress={close_modal} onBackdropPress={close_modal} style={styles.modal} >
                <ScrollView>
                    <List>
                        {data.map((v, i) => {
                            image = v.mainPhoto == ""? DefaultPhoto: v.mainPhoto;
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
                                            <TouchableOpacity>
                                                <Text style={{ color: "green", paddingRight: 10 }}>
                                                    Aceptar
                                            </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity>
                                                <Text style={{ color: "red" }}>
                                                    Cancelar
                                            </Text>
                                            </TouchableOpacity>
                                        </InputGroup>
                                    </Body>
                                </ListItem>
                            )
                        })}
                    </List>
                </ScrollView>
            </Modal>
        )
    }
}

export default Requests;