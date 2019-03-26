import React, { Component } from "react";
import { TouchableOpacity, ScrollView } from "react-native"
import { List, ListItem, Left, Footer, Body, Thumbnail, Text, InputGroup, View, FooterTab, Button } from "native-base";
import Modal from "react-native-modal";

import styles from "../../styles"
import { DEFAULTPHOTO } from "../../const";

const ListRequest = (props) => {
    const { data, OnAcceptPress, OnDeclinePress } = props;
    let image = null;
    console.log("LENGTH; ", data.length)
    return (
        <List>
            {data.map((v, i) => {
                image = v.mainPhoto == "" ? DEFAULTPHOTO : { uri: v.mainPhoto };
                return (
                    <ListItem avatar key={i} noIndent noBorder >
                        <Left>
                            <Thumbnail source={image} />
                        </Left>
                        <Body>
                            <Text style={styles.textWhite} >
                                {v.user}
                            </Text>
                            <InputGroup  >
                                <TouchableOpacity onPress={() => OnAcceptPress(v)} >
                                    <Text style={{ color: "white", paddingRight: 10 }}>
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
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight"
                onBackButtonPress={close_modal} onBackdropPress={close_modal} >
                {/* <ScrollView> */}
                <View style={styles.modalDark}>
                    <ScrollView >
                        <Text style={styles.textTitle}>
                            Solicitudes
                        </Text>
                        <ListRequest OnAcceptPress={OnAcceptPress} OnDeclinePress={OnDeclinePress} data={data} />
                    </ScrollView>
                    <Footer>
                        <FooterTab>
                            <Button style={styles.buttonPrimary} onPress={close_modal} >
                                <Text style={styles.textWhite}>
                                    Atrás
                            </Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </View>
                {/* </ScrollView> */}
            </Modal>
        )
    }
}

export default Requests;