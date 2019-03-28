import React, { Component } from "react";
import { ScrollView, Image } from "react-native";
import { View, List, ListItem, Thumbnail, Text, Item, Input, Icon, Container, Content } from "native-base";

import styles from "../../styles";
import IconSearch from "../../../assets/icons/user.png";
import { ROUTES } from "../../const";
import Profile from "../../components/profile";
import ModalProfile from "../../modals/modalProfile"

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
            modalProfile: false,
            isMyFriend: false,
            currentFriend: false
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
                        if (snapshot.exists()) {
                            snapshot.forEach(item => {
                                newItem = item.val();
                                newArr.push(newItem);
                            })
                            isMyFriend = newArr.find(item => item.user == currentUser.user);
                            isMyFriend = isMyFriend instanceof Object;
                            this.setState({ isMyFriend });
                        }
                    })
                }
                //Revisar si tengo una solicitud de el
                newArr = [];
                newItem = null;
                if (!requestSent && !isMyFriend) {
                    auth.app.database().ref(ROUTES.Solicitudes).child(currentUser.user).once("value", snapshot => {
                        if (snapshot.exists()) {
                            snapshot.forEach(item => {
                                if (item.val().user == filterText) {
                                    newItem = item.val();
                                }
                            })
                            heSentMeRequest = newItem instanceof Object;
                            this.setState({ heSentMeRequest });
                        }
                    })
                }

                let key = Object.keys(snapshot.val())[0];
                searchedUser = snapshot.val()[key]
                //Tener los ultimos posts
                auth.app.database().ref(ROUTES.Posts).child(key).limitToFirst(5).once("value", (snapshot) => {
                    if (snapshot.exists()) {
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

    OnSendRequest = (user) => {
        //El parámetro user es el usuario a enviar solicitud
        let { currentUser, auth } = this.props;
        //Eliminar esta data porque no se lo mandaré en la solictud de amistad
        delete currentUser.requests;
        delete currentUser.messages;
        auth.app.database().ref(ROUTES.Solicitudes).child(user.user).push(currentUser, (err => {
            if (!err) {
                let notific = { date: 0 - new Date(), msj: `${currentUser.user} te ha mandado una solicitud`, mainPhoto: currentUser.mainPhoto }
                auth.app.database().ref(ROUTES.Notificaciones).child(user.user).push(notific, err => {
                    if (err) {
                        console.log(err)
                        alert("Ha ocurrido un error")
                    }
                })
            } else {
                console.log(err)
                alert("Ha ocurrido un error");
            }
            this.setState({ requestSent: true })
        }));
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
                                    //Enviandole la notificacion
                                    let notific = { date: 0 - new Date(), msj: `${currentUser.user} ha aceptado tu solicitud`, mainPhoto: currentUser.mainPhoto }
                                    auth.app.database().ref(ROUTES.Notificaciones).child(filterText).push(notific, err => {
                                        if (err) {
                                            alert("Ha ocurrido un error");
                                            console.log(err)
                                        } else {
                                            // Ir a su perfil...
                                            this.setState({ isMyFriend: true }, () => this.OnOpenProfile(newItem));
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
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

    OnOpenProfile = (user) => {
        let { currentFriend, modalProfile } = this.state;
        currentFriend = user;
        console.log("CURRENT USER: ", currentFriend)
        this.setState({ currentFriend, modalProfile: true })
    }

    OnCloseProfile = () => {
        this.setState({ modalProfile: false })
    }

    render() {
        const { auth, currentUser } = this.props;
        const { searchedUser, filterText, modalProfile, lastPosts, requestSent, isMyFriend, currentFriend, heSentMeRequest } = this.state;
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
                {searchedUser && <Profile OnPressPerfil={(user) => this.OnOpenProfile(user)} OnAcceptRequest={this.OnAcceptRequest} OnSendRequest={this.OnSendRequest} currentUser={currentUser}
                    user={searchedUser} lastPosts={lastPosts} heSentMeRequest={heSentMeRequest} requestSent={requestSent} isMyFriend={isMyFriend} />}
                <NoContent searchedUser={searchedUser} />
                <ModalProfile open={modalProfile} currentUser={currentFriend} close_modal={this.OnCloseProfile} auth={auth} />
            </ScrollView>
        )
    }
}

export default Filtering;