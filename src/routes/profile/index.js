import React, { Component } from "react";
import { Text, Spinner, Grid, Col, Row, Button, Content } from "native-base";
import { ScrollView, Image, TouchableOpacity, View, Alert, Linking } from "react-native";
import Modal from "react-native-modal";
import { DEFAULTPHOTO, DATAMODAL, ROUTES } from "../../const";
import styles from "../../styles";
import Posts from "../../components/posts";
import ModalRequests from "../../modals/modalRequests"
import ModalFriends from "../../modals/modalFriends"
import ModalProfile from "../../modals/modalProfile"
import ModalComments from "../../modals/modalComments"

const ButtonProfile = (props) => {
    const { loading, text, dataKey, OnPressButton, data } = props;
    if (!loading) {
        return (
            <TouchableOpacity onPress={OnPressButton} >
                <Text style={[styles.textWhite, { textAlign: "center" }]} >
                    {`${data[dataKey]}\n${text}`}
                </Text>
            </TouchableOpacity>
        )
    }
    return <Spinner color="white" />
}

const ProfileHeader = (props) => {
    const { currentUser, OnLogout, OnModalOpen, OnRequestsOpen, OnFriendsOpen, dataNumbers, loadingUserInfo } = props;
    const image = currentUser.mainPhoto == "" ? DEFAULTPHOTO : { uri: currentUser.mainPhoto }

    return (
        <Grid>
            <Row>
                <Col >
                    <TouchableOpacity onPress={OnModalOpen} >
                        <Image source={image} style={styles.SidebarProfileThumbnail} />
                    </TouchableOpacity>
                </Col>
                <Grid style={{ marginLeft: -150 }} >
                    <Row>
                        <Col>
                            <ButtonProfile loading={loadingUserInfo} data={dataNumbers} text="Solicitudes" dataKey="requestsNumber" OnPressButton={OnRequestsOpen} />
                        </Col>
                        <Col>
                            <ButtonProfile loading={loadingUserInfo} data={dataNumbers} text="Posts" dataKey="postsNumber" />
                        </Col>
                        <Col >
                            <ButtonProfile loading={loadingUserInfo} data={dataNumbers} text="Amigos" dataKey="friendsNumber" OnPressButton={OnFriendsOpen} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TouchableOpacity onPress={() => alert("No disponible en este demo")} >
                                <Text style={styles.textWhite}>
                                    Editar perfil
                            </Text>
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity onPress={OnLogout} >
                                <Text style={{ color: "red" }}>
                                    Cerrar sesión
                            </Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                </Grid>
            </Row>
        </Grid>
    )
}

const ModalPhoto = (props) => {
    const { open, currentUser, OnCloseModalPhoto, dataModal } = props;
    const textColor1 = dataModal.buttonText1Color == "" ? "#232323" : dataModal.buttonText1Color;
    const textColor2 = dataModal.buttonText2Color == "" ? "#232323" : dataModal.buttonText2Color;

    return (
        <Modal isVisible={open} style={{ justifyContent: "flex-end", margin: 0 }} animationIn="slideInLeft" animationOut="slideOutRight" onBackButtonPress={OnCloseModalPhoto} swipeDirection="right" onSwipe={OnCloseModalPhoto} onBackdropPress={OnCloseModalPhoto}>
            {/* <View styles={[styles.modal, {flex: 0.5}]}> */}
            <View style={styles.modalViewBottom} >
                <TouchableOpacity style={{ paddingBottom: 10 }} onPress={dataModal.OnPressButton1} >
                    <Text style={{ color: textColor1 }}>
                        {dataModal.buttonText1.toUpperCase()}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={dataModal.OnPressButton2} >
                    <Text style={{ color: textColor2 }}>
                        {dataModal.buttonText2.toUpperCase()}
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}



class Profile extends Component {
    state =
        {
            posts: [], requests: [], friends: [],
            dataModal: { ...DATAMODAL },
            dataNumbers: { requestsNumber: 0, friendsNumber: 0, postsNumber: 0 },
            loading: true, loadingUserInfo: true,
            modalPhoto: false, modalRequest: false, modalFriends: false, modalProfile: false, modalComments: false,
            currentFriend: null, actualPost: null
        }

    async componentWillMount() {
        // this.getSnapshotBeforeUpdate()
        this.GetMyPosts();
        this.GetMyRequests();
        this.GetMyFriends();
    }

    GetMyPosts = async () => {
        const { auth, currentUser } = this.props;
        let { dataNumbers } = this.state;
        auth.app.database().ref(ROUTES.Posts).child(currentUser.user).orderByChild("date").on("value", (snapshot) => {
            let dataFirebase = [];
            console.log("DATA ORIGINAL: ", snapshot.val())
            //Convirtiendo la data a un array, proque me lo da en objetos {objeto1: {}, objeto2:{}}
            var newItem = null;
            snapshot.forEach(item => {
                newItem = item.val();
                // newItem.key = item.key;
                //Agregando los actionButtons                
                dataFirebase.push(newItem);
            })
            dataNumbers.postsNumber = dataFirebase.length;
            this.setState({ posts: dataFirebase, dataNumbers, loading: false })
        })
    }

    GetMyRequests = async () => {
        const { auth, currentUser } = this.props;
        let { requests, dataNumbers } = this.state;
        requests = [];
        let newItem = null;
        auth.app.database().ref(ROUTES.Solicitudes).child(currentUser.user).once("value", snapshot => {
            snapshot.forEach(item => {
                newItem = item.val();
                requests.push(newItem);
            });
            dataNumbers.requestsNumber = requests.length;
            this.setState({ requests, dataNumbers });
        });
    }

    GetMyFriends = async () => {
        const { auth, currentUser } = this.props;
        let { friends, dataNumbers } = this.state;
        friends = [];
        let newItem = null;
        auth.app.database().ref(ROUTES.Amigos).child(currentUser.user).on("value", snapshot => {
            snapshot.forEach(item => {
                newItem = item.val();
                friends.push(newItem);
            });
            dataNumbers.friendsNumber = friends.length;
            this.setState({ friends, dataNumbers, loadingUserInfo: false });
        });
    }

    OnAcceptRequest = async (user) => {
        let { auth, currentUser } = this.props;
        let newItem = null, newArray = [];
        //Obteniendo todas mis solicitudes de amistad
        let ref = auth.app.database().ref(ROUTES.Solicitudes).child(currentUser.user)
        ref.orderByKey().once("value", snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(item => {
                    newItem = item.val();
                    //Si encontramos el objeto con el usuario igual al de aceptar, no lo entramos al nuevo array
                    if (!(item.val().user == user.user)) {
                        newArray.push(newItem);
                    }
                });
                //Actualizando la lista de solicitudes
                ref.set(newArray, err => {
                    console.log(err)
                    if (!err) {
                        // Agregando el usuario a nuestra lista de amigos
                        auth.app.database().ref(ROUTES.Amigos).child(currentUser.user).push(user, err => {
                            if (err) {
                                alert("Ha ocurrido un error ")
                            } else {
                                // Agregando el usuario a su lista de amigos
                                auth.app.database().ref(ROUTES.Amigos).child(user.user).push(currentUser, err => {
                                    if (err) {
                                        alert("Ha ocurrido un error ")
                                    } else {
                                        //Enviandole la notificacion
                                        let notific = { date: 0 - new Date(), msj: `${currentUser.user} ha aceptado tu solicitud`, mainPhoto: currentUser.mainPhoto }
                                        auth.app.database().ref(ROUTES.Notificaciones).child(user.user).push(notific, err => {
                                            if (err) {
                                                alert("Ha ocurrido un error");
                                                console.log(err)
                                            } else
                                            {
                                                this.GetMyRequests();
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }



            // .then(res => {
            //     console.log("DATOS ENVIADOS: ", res)
            // })
            // .catch(err => {
            //     console.log(err)
            // })
            console.log("NUEVO ARRAY: ", newArray);
            // })
        })
    }


    OnDeclinePress = async (user) => {
        let { currentUser, auth } = this.props;
        let newArr = [];
        let ref = auth.app.database().ref(ROUTES.Solicitudes).child(currentUser.user);
        ref.once("value", snapshot => {
            snapshot.forEach(item => {
                if (item.val().user != user.user) {
                    newArr.push(item.val());
                }
            });
            console.log("NRE ARRAY: ", newArr)
            ref.set(newArr, err => {
                if (err) {
                    console.log(err);
                    alert("Ha ocurrido un error")
                } else {
                    this.GetMyRequests();
                }
            })
        })
    }

    OnDeleteFriend = async (user) => {
        let { currentUser, auth } = this.props;

        let ref1 = auth.app.database().ref(`${ROUTES.Amigos}/${user.user}`)
        let ref2 = auth.app.database().ref(`${ROUTES.Amigos}/${currentUser.user}`)

        ref1.orderByChild("user").equalTo(currentUser.user).once("value", snapshot => {
            if (snapshot.exists()) {
                // snapshot.ref.remove(); //Eliminar el valor encontrado
                console.log("SNAPSHOT1: ", snapshot)
                const updates = {}
                snapshot.forEach(child => updates[child.key] = null);
                console.log("UPDATES 1: ", updates);
                ref1.update(updates);
                ref2.orderByChild("user").equalTo(user.user).once("value", snapshot => {
                    if (snapshot.exists()) {
                        // snapshot.ref.remove();
                        console.log("SNAPSHOT2: ", snapshot)
                        const updates = {};
                        snapshot.forEach(child => updates[child.key] = null); //child.key es lo que está dentro de equalTo
                        ref2.update(updates);
                        console.log("UPDATES 2: ", updates);
                        this.GetMyFriends();
                    }
                })
            }
        })
    }

    OnDeletePostAlert = (date) => {
        let { dataModal } = this.state;
        dataModal.buttonText1 = "eliminar";
        dataModal.buttonText2 = "cancelar";
        dataModal.buttonText1Color = "red";
        dataModal.OnPressButton1 = () => this.OnDeletePost(date);
        dataModal.OnPressButton2 = () => this.OnCloseModalPhoto();
        this.setState({ dataModal, modalPhoto: true });

    }

    OnPressPhotoProfile = () => {
        let { dataModal } = this.state;
        dataModal.buttonText1 = "Nueva foto";
        dataModal.buttonText2 = "Eliminar";
        dataModal.buttonText2Color = "red";
        dataModal.OnPressButton1 = () => this.OnChangePhoto();
        dataModal.OnPressButton2 = () => this.OnDeletePhoto();
        this.setState({ dataModal, modalPhoto: true });

    }

    OnDeletePhoto = async () => {
        let { auth, currentUser } = this.props;
        //Eliminando la foto del usuario
        if (currentUser.mainPhoto != "") {
            currentUser.mainPhoto = "";
            auth.app.database().ref(ROUTES.Usuarios).child(currentUser.user).set(currentUser, async (err) => {
                if (!err) {
                    this.OnCloseModalPhoto();
                    //Eliminando la foto del almacenamiento
                    await auth.app.storage().ref(ROUTES.Usuarios).child(currentUser.user).delete()
                        .then(res => {
                            console.log("Eliminado del almacenamiento");
                        })
                        .catch(err => {
                            console.log(err);
                            alert("Ha ocurrido un error")
                        })
                } else {
                    console.log(err)
                    alert("Ha ocurrido un error");
                }
            })
        }
    }

    handleModal = (dataModal) => {
        let { modalPhoto } = this.state;
        modalPhoto = !modalPhoto
        this.setState({ modalPhoto, dataModal })
    }

    OnChangePhoto = () => {
        this.setState({ modalPhoto: false, dataModal: { ...DATAMODAL } }, () => this.props.OnChangeProfilePhoto())
    }

    OnDeletePost = async (date) => {
        const { auth, currentUser } = this.props;
        // this.setState({modalPhoto: false})
        this.OnCloseModalPhoto();
        auth.app.database().ref(ROUTES.Posts).child(currentUser.user).child(date).remove(async err => {
            if (!err) {
                await auth.app.storage().ref(ROUTES.Posts).child(`${currentUser.user}-${date}`).delete()
                    .then(res => {
                        console.log("Post eliminado")
                    })
                    .catch(err => {
                        console.log(err);
                        alert("Ha ocurrido un error");
                    })
            } else {
                alert("Ha ocurrido un error");
            }
        })
    }

    OnCloseModalPhoto = () => {
        this.setState({ modalPhoto: false, dataModal: { ...DATAMODAL } });
    }

    OnRequestsHandler = () => {
        let { modalRequest, requests } = this.state;
        modalRequest = !modalRequest;
        if (modalRequest) {
            if (!(requests.length > 0)) {
                modalRequest = false;
                alert("No hay solicitudes que mostrar")
            }
        }
        this.setState({ modalRequest });
    }

    OnFriendsHandler = () => {
        let { modalFriends, friends } = this.state;
        modalFriends = !modalFriends;
        if (modalFriends) {
            if (!(friends.length > 0)) {
                modalFriends = false;
                alert("No hay amigos que mostrar")
            }
        }
        this.setState({ modalFriends });
    }

    OnOpenProfile = (user) => {
        let { currentFriend, modalProfile } = this.state;
        currentFriend = user;
        console.log("CURRENT USER: ", currentFriend)
        this.setState({ currentFriend, modalProfile: true })
    }

    OnCloseProfile = () => {
        this.setState({ modalProfile: false })
    }

    OnOpenComments = (post) => {
        let { actualPost } = this.state;
        actualPost = post;
        this.setState({ modalComments: true, actualPost })
    }

    OnCloseComments = () => {
        this.setState({ modalComments: false })
    }

    render() {
        const { auth, currentUser, OnChangeProfilePhoto, OnLogout } = this.props;
        const { currentFriend, posts, loading, loadingUserInfo, actualPost, modalPhoto, dataModal, modalRequest, modalComments, modalFriends, modalProfile, requests, friends, dataNumbers } = this.state;
        return (

            <ScrollView>
                <Content>
                    <ProfileHeader loadingUserInfo={loadingUserInfo} dataNumbers={dataNumbers} currentUser={currentUser} OnModalOpen={this.OnPressPhotoProfile} OnRequestsOpen={this.OnRequestsHandler} OnFriendsOpen={this.OnFriendsHandler} OnLogout={OnLogout} />
                </Content>
                {loading && <Spinner color="white" />}
                <Posts data={posts} OnDeletePost={this.OnDeletePostAlert} OnOpenComments={this.OnOpenComments} />
                <ModalPhoto open={modalPhoto} OnCloseModalPhoto={this.OnCloseModalPhoto} dataModal={dataModal} />
                <ModalRequests open={modalRequest} data={requests} close_modal={this.OnRequestsHandler} OnDeclinePress={this.OnDeclinePress} OnAcceptPress={this.OnAcceptRequest} />
                <ModalFriends open={modalFriends} data={friends} close_modal={this.OnFriendsHandler} OnDeleteFriend={this.OnDeleteFriend} OnOpenProfile={(user) => this.OnOpenProfile(user)} />
                <ModalProfile open={modalProfile} currentUser={currentFriend} close_modal={this.OnCloseProfile} auth={auth} />
                <ModalComments open={modalComments} close_modal={this.OnCloseComments} auth={auth} post={actualPost} currentUser={currentUser} />
            </ScrollView >

        )
    }
}

export default Profile;