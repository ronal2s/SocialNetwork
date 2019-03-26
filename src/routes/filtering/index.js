import React, { Component } from "react";
import { ScrollView, Image } from "react-native";
import { View, List, ListItem, Thumbnail, Text, Item, Input, Icon, Container, Content } from "native-base";

import styles from "../../styles"
import IconSearch from "../../../assets/icons/user.png"
import { ROUTES } from "../../const"
import Profile from "../../components/profile"

const NoContent = (props) => {
    const { searchedUser } = props;
    if (!searchedUser) {
        return (
            <Container style={styles.containerCentered} >
                <View >
                    <Thumbnail style={[styles.SidebarProfileThumbnail]} source={IconSearch} />
                    <Text style={styles.textWhite} >
                        Sin contenido
                    </Text>
                </View>
            </Container>
        )
    }
    return <Text />
}

class Filtering extends Component {
    state =
        {
            searchedUser: null,
            lastPosts: [],
            filterText: "",
            requestSent: false
        }

    OnSearchPress = () => {
        const { auth, currentUser } = this.props;
        let { searchedUser, filterText } = this.state;

        auth.app.database().ref(ROUTES.Usuarios).orderByChild("user").equalTo(filterText).on("value", (snapshot) => {
            if (snapshot.exists()) {
                //Verificar si ya he enviado la solicitud antes
                auth.app.database().ref(ROUTES.Solicitudes).child(filterText).once("value", snapshot => {
                    // if(snapshot.exists)
                    let newArr = [];
                    let newItem = null;
                    snapshot.forEach(item => {
                        newItem = item.val();
                        newArr.push(newItem);
                    })
                    let requestSent = newArr.find(item => item.user == currentUser.user);
                    //Si requestSent es un objeto entonces si encontró su solicitud, si no, no lo ha enviado
                    this.setState({requestSent: requestSent instanceof Object});                    
                })

                let key = Object.keys(snapshot.val())[0];
                console.log(key)
                searchedUser = snapshot.val()[key]
                //Tener los ultimos posts
                auth.app.database().ref("/POSTS").child(key).limitToFirst(5).once("value", (snapshot) => {
                    if (snapshot.exists()) {
                        console.log("DAIRY TIENE POSTS");
                        console.log(snapshot.val())
                        //Convirtiendo sus ultimos post en arrays
                        let dataFirebase = [];
                        var newItem = null;
                        snapshot.forEach(item => {
                            newItem = item.val();
                            dataFirebase.push(newItem)
                        });
                        this.setState({lastPosts: dataFirebase})
                    }
                })
                //Verificar si somos amigos o no
            } else {
                searchedUser = null;
            }
            this.setState({ searchedUser });
        })

    }

    //Crear método que diga si este user + el nuevo son amigos o no

    handleText = (value) => {
        let { filterText, searchedUser } = this.state;
        if (value[value.length - 1] != ' ') {
            this.setState({ filterText: value, searchedUser });
        }
    }

    render() {
        const { auth, currentUser, OnSendRequest } = this.props;
        const { searchedUser, filterText, lastPosts, requestSent } = this.state;
        console.log(searchedUser)
        return (
            <ScrollView >
                {/* <Item style={{ borderBottomWidth: 0 }} > */}
                <Content padder>
                    <Item style={{ borderBottomColor: "gray" }} >
                        <Icon name="search" style={styles.textWhite} />
                        <Input value={filterText} placeholder="Buscar" autoCapitalize="none" style={styles.textWhite}
                            onChangeText={this.handleText} onSubmitEditing={this.OnSearchPress} />
                    </Item>
                </Content>
                {searchedUser && <Profile OnSendRequest={OnSendRequest} currentUser={currentUser} user={searchedUser} lastPosts={lastPosts} requestSent={requestSent}/>}
                <NoContent searchedUser={searchedUser} />
            </ScrollView>
        )
    }
}

export default Filtering;