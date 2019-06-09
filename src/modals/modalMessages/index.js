import React, { Component } from "react";
import { Button, Grid, Row, Col, Text, View, List, ListItem, Thumbnail,Footer, FooterTab, Header, Left, Icon, Body, Title, Right, Spinner } from "native-base";
import { StatusBar, TouchableOpacity, ScrollView } from "react-native";
import Modal from "react-native-modal";
import styles from "../../styles";
import { ROUTES, DEFAULTPHOTO } from "../../const"
import ModalChat from "../modalChat"

const _Header = (props) => {
    const { OpenFriends } = props;
    return (
        <Header style={styles.header} noShadow>
            <Left>
                <Icon name="alpha-l-box" type="MaterialCommunityIcons" style={styles.textWhite} />
            </Left>
            <Body >
                <Title style={[styles.headerTitle]}>
                    Mensajes
                </Title>
            </Body>
            <Right>
                <TouchableOpacity onPress={OpenFriends}>
                    <Icon name="plus" type="MaterialCommunityIcons" style={styles.textWhite} />
                </TouchableOpacity>
            </Right>
        </Header>
    )
}

const NoMessages = (props) => {
    const { noMessages, loadingMessages } = props;
    if (noMessages && !loadingMessages) {
        return (
            <Text style={[styles.textWhite, { textAlign: "center" }]}>
                No hay mensajes
            </Text>
        )
    }
    else if(noMessages && loadingMessages)
    {
        return <Spinner color="white"/>
    }
    return <Text />
}

const ListRequest = (props) => {
    const { data, OnOpenProfile, OnDeleteFriend } = props;
    let image = null;
    return (
        <List>
            {data.map((v, i) => {
                image = v.mainPhoto == "" ? DEFAULTPHOTO : { uri: v.mainPhoto };
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
                                <Text style={{ color: "red" }}>
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

const ModalFriends = (props) => {
    const { open, close_modal, friends, OnOpenChat, loadingFriends } = props;
    let image = null;
    return (
        <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight"
            onBackButtonPress={close_modal} onBackdropPress={close_modal} >
            <View style={styles.modalDark}>
                <ScrollView>
                    <Text style={styles.textTitle}>
                        Amigos
                    </Text>
                    <List>
                        {friends.map((v, i) => {
                            image = v.mainPhoto == "" ? DEFAULTPHOTO : { uri: v.mainPhoto };
                            return (
                                <ListItem avatar key={i} onPress={() => OnOpenChat(v)} >
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

class Messages extends Component {

    state =
        {
            messages: [], friends: [],
            noMessages: true, loadingMessages: true,
            modalFriends: false, loadingFriends: true,
            modalChat: false, loadingChat: false,
            friendUser: null,
        }

    OnEntering = () => {
        this.GetMessages();
        this.GetMyFriends();
    }

    GetMessages = async () => {
        let { auth, currentUser } = this.props;        
        auth.app.database().ref(`${ROUTES.Mensajes}`).child(currentUser.user).on("value", snapshot => {
            if (snapshot.exists()) {
                this.setState({ noMessages: false, loadingMessages: false });
                console.log("TIENE MENSAJES")
            } else {
                console.log("No tiene mensajes");
                this.setState({ loadingMessages: false });
            }
        })
    }

    GetMyFriends = async () => {
        const { auth, currentUser } = this.props;
        let { friends } = this.state;
        friends = [];
        let newItem = null;
        auth.app.database().ref(ROUTES.Amigos).child(currentUser.user).on("value", snapshot => {
            snapshot.forEach(item => {
                newItem = item.val();
                friends.push(newItem);
            });            
            this.setState({ friends, loadingFriends: false });
        });
    }

    HandleModalFriends = () =>
    {
        let { modalFriends } = this.state;
        modalFriends = !modalFriends;
        this.setState({modalFriends});
    }

    OnOpenChat = (friendUser) =>
    {
        let { modalChat, modalFriends } = this.state;
        modalFriends = false;
        modalChat = true;
        this.setState({modalChat, modalFriends, friendUser});
    }

    Closechat = () =>
    {
        let { modalChat } = this.state;
        modalChat = false;
        this.setState({modalChat});
    }

    render() {
        const { open, close_modal, auth, data, OnOpenProfile, OnDeleteFriend, OnOpenMessages, currentUser } = this.props;
        const { noMessages, loadingFriends, loadingMessages, modalFriends, friends, modalChat, friendUser  } = this.state;
        return (
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight" onShow={this.OnEntering}
                onBackButtonPress={close_modal} onBackdropPress={close_modal} style={[styles.modalDark, { margin: 0 }]}>
                <_Header OpenFriends={this.HandleModalFriends} />
                <StatusBar barStyle="light-content" backgroundColor="#232323" />
                <View style={{ flex: 1 }}>
                    <NoMessages noMessages={noMessages} loadingMessages={loadingMessages} />
                    {/* <Text style={styles.textWhite}>
                        BLABLABALBALBALABALBALA
                    </Text> */}
                </View>
                <Footer>
                    <FooterTab>
                        <Button style={styles.buttonPrimary} onPress={close_modal} >
                            <Text style={styles.textWhite}>
                                Atrás
                            </Text>
                        </Button>
                    </FooterTab>
                </Footer>
                {/* const { open, close_modal, friends, OnOpenChat, loadingFriends } = props; */}
                <ModalChat open={modalChat} close_modal={this.Closechat} currentUser={currentUser} friendUser={friendUser} auth={auth} />
                <ModalFriends open={modalFriends} friends={friends} close_modal={this.HandleModalFriends} OnOpenChat={this.OnOpenChat} />
            </Modal>
        )
    }
}

export default Messages;