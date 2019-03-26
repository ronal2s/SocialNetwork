import React, { Component } from "react";
import { TouchableOpacity, ScrollView } from "react-native"
import { List, ListItem, Left, Right, Body, Thumbnail, Text, Footer, FooterTab, View, Button } from "native-base";
import Modal from "react-native-modal";
import DefaultPhoto from "../../../assets/icons/user.png"
import styles from "../../styles"

const ListRequest = (props) => {
    const { data, OnOpenProfile } = props;
    let image = null;
    return (
        <List>
            {data.map((v, i) => {
                image = v.mainPhoto == "" ? DefaultPhoto : { uri: v.mainPhoto };
                return (
                    <ListItem avatar key={i} onPress={() => OnOpenProfile(v)} >
                        <Left>
                            <Thumbnail source={image} />
                        </Left>
                        <Body>
                            <Text style={styles.textWhite} >
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
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight"
                onBackButtonPress={close_modal} onBackdropPress={close_modal} >
                <View style={styles.modalDark}>
                    <ScrollView>
                        <Text style={styles.textTitle}>
                            Amigos
                        </Text>
                        <ListRequest OnOpenProfile={OnOpenProfile} data={data} />
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
            </Modal>
        )
    }
}

export default Friends;