import React, { Component } from "react";
import { TouchableOpacity, ScrollView } from "react-native"
import { List, ListItem, Left, Right, Body, Thumbnail, Text, Footer, FooterTab, View, Button } from "native-base";
import Modal from "react-native-modal";
import DefaultPhoto from "../../../assets/icons/user.png"
import styles from "../../styles"

const ListRequest = (props) => {
    const { data, OnOpenProfile, OnDeleteFriend } = props;
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
                            <TouchableOpacity onPress={() => OnDeleteFriend(v)} >
                                <Text style={{color: "red"}}>
                                    Eliminar
                                </Text>
                            </TouchableOpacity>
                        </Body>
                    </ListItem>
                )
            })}
        </List>
    )
}

class Friends extends Component {
    render() {
        const { open, close_modal, data, OnOpenProfile, OnDeleteFriend } = this.props;
        return (
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight"
                onBackButtonPress={close_modal} onBackdropPress={close_modal} >
                <View style={styles.modalDark}>
                    <ScrollView>
                        <Text style={styles.textTitle}>
                            Amigos
                        </Text>
                        <ListRequest OnOpenProfile={OnOpenProfile} OnDeleteFriend={OnDeleteFriend} data={data} />
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