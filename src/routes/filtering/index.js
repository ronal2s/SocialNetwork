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
            requestSent: false,
            heSentMeRequest: false,
            isMyFriend: false
        }

    OnSearchPress = () => {
        const { auth, currentUser } = this.props;
        let { searchedUser, filterText, requestSent, isMyFriend, heSentMeRequest } = this.state;

        let refUsuarios = auth.app.database().ref(ROUTES.Usuarios).orderByChild("user")
        let refSolicitudes = auth.app.database().ref(ROUTES.Solicitudes).child(filterText)

        refUsuarios.equalTo(filterText).on("value", (snapshot) => {
            if (snapshot.exists()) {
                //Verificar si ya he enviado la solicitud antes
                let newArr = [];
                let newItem = null;
                refSolicitudes.once("value", snapshot => {
                    // if(snapshot.exists)
                    snapshot.forEach(item => {
                        newItem = item.val();
                        newArr.push(newItem);
                    })
                    requestSent = newArr.find(item => item.user == currentUser.user);
                    //Si requestSent es un objeto entonces si encontró su solicitud, si no, no lo ha enviado
                    requestSent = requestSent instanceof Object;
                    this.setState({ requestSent });
                })
                //En caso de no estar en sus solicitudes, revisar si estoy en su lista de amigos
                newArr = [];
                newItem = null;
                if (!requestSent) {//Si no he enviado una solicitud antes
                    auth.app.database().ref(ROUTES.Amigos).child(filterText).once("value", snapshot => {
                        snapshot.forEach(item => {
                            newItem = item.val();
                            newArr.push(newItem);
                        })
                        isMyFriend = newArr.find(item => item.user == currentUser.user);
                        isMyFriend = isMyFriend instanceof Object;
                        this.setState({ isMyFriend });
                    })
                    console.log("IS MY FRIEND: ", isMyFriend)
                }
                //Revisar si tengo una solicitud de el
                newArr = [];
                newItem = null;
                if (!requestSent) {
                    auth.app.database().ref(ROUTES.Solicitudes).child(currentUser.user).once("value", snapshot => {
                        snapshot.forEach(item => {
                            if (item.val().user == filterText) {
                                newItem = item.val();
                            }
                        })
                        heSentMeRequest = newItem instanceof Object;
                        this.setState({ heSentMeRequest });
                    })
                }

                //Revisar si ya el me envió una solicitud previamente

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
                        this.setState({ lastPosts: dataFirebase })
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

    OnAcceptRequest = async () => {
        let { filterText } = this.state;
        let { auth, currentUser } = this.props;
        let newArray = [], newItem = null;
        let ref = auth.app.database().ref(ROUTES.Solicitudes).child(currentUser.user)
        ref.orderByKey().once("value", snapshot => {
            snapshot.forEach(item => {
                if (item.val().user != filterText) {
                    newArray.push(item.val())
                } else {
                    newItem = item.val(); //Asignandole el usuario al newItem para luego agregarlo a mis amigos
                }
            })
            console.log("NUEVO ARREGLO ES: ", newArray);
            //Actualizar mis solicitudes
            ref.set(newArray, (err) => {
                if (!err) {
                    // Agregando el usuario a nuestra lista de amigos
                    ref = auth.app.database().ref(ROUTES.Amigos)
                    ref.child(currentUser.user).push(newItem, err => {
                        if (err) {
                            alert("Ha ocurrido un error ")
                        } else {
                            // Agregando el usuario a su lista de amigos
                            ref.child(newItem.user).push(currentUser, err => {
                                if (err) {
                                    alert("Ha ocurrido un error ")
                                } else {
                                    // Ir a su perfil...
                                    alert("TODO LISTO")
                                }
                            })
                        }
                    })
                } else
                {
                    alert("Ha ocurrido un error");
                    console.log(err)
                }
            })
        })
    }

    //Si al buscar una persona y resulta que es amiga mia, puedo ver todo su perfil
    //Para eso, crear un componente de perfil muy similar al del usuario
    //Verificar si se puede usar el mismo, si no, modificarlo para que sea así
    //Si no cuesta tanto, si no, crear otro

    render() {
        const { auth, currentUser, OnSendRequest } = this.props;
        const { searchedUser, filterText, lastPosts, requestSent, heSentMeRequest } = this.state;
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
                {searchedUser && <Profile OnAcceptRequest={this.OnAcceptRequest} OnSendRequest={OnSendRequest} currentUser={currentUser} user={searchedUser} lastPosts={lastPosts} heSentMeRequest={heSentMeRequest} requestSent={requestSent} />}
                <NoContent searchedUser={searchedUser} />
            </ScrollView>
        )
    }
}

export default Filtering;