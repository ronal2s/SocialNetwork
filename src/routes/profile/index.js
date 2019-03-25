import React, { Component } from "react";
import { Text, Spinner, Grid, Col, Row, Button, Content } from "native-base";
import { ScrollView, Image, TouchableOpacity, View, Alert } from "react-native";
import Modal from "react-native-modal";
import { DEFAULTPHOTO, DATAMODAL } from "../../const";
import styles from "../../styles";
import Posts from "../../components/posts";



const ProfileHeader = (props) => {
    const { currentUser, OnLogout, OnModalOpen } = props;
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
                            <TouchableOpacity>
                                <Text style={[styles.textWhite, { textAlign: "center" }]} >
                                    {`${currentUser.requests}\nSolicitudes`}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity>
                                <Text style={[styles.textWhite, { textAlign: "center" }]} >
                                    {`${currentUser.posts}\nPost`}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                        <Col >
                            <TouchableOpacity>
                                <Text style={[styles.textWhite, { textAlign: "center" }]} >
                                    {`${currentUser.friends}\nAmigos`}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TouchableOpacity >
                                <Text style={styles.textWhite}>
                                    Editar perfil
                            </Text>
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity onPress={OnLogout} >
                                <Text style={{color: "red"}}>
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
    const { open, currentUser, OnCloseModal, dataModal } = props;
    const textColor1 = dataModal.buttonText1Color == "" ? "#232323" : dataModal.buttonText1Color;
    const textColor2 = dataModal.buttonText2Color == "" ? "#232323" : dataModal.buttonText2Color;
    console.log(dataModal)
    return (
        <Modal isVisible={open} style={{ justifyContent: "flex-end", margin: 0 }} animationIn="slideInLeft" animationOut="slideOutRight" onBackButtonPress={OnCloseModal} swipeDirection="right" onSwipe={OnCloseModal} onBackdropPress={OnCloseModal}>
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
            posts: [], dataModal: { ...DATAMODAL },
            loading: true,
            modalPhoto: false
        }

    async componentWillMount() {
        // this.getSnapshotBeforeUpdate()
        this.GetMyPosts();
    }

    GetMyPosts = async () => {
        const { auth, currentUser } = this.props;
        let { posts } = this.state;
        console.log("USUARIO ES: ", currentUser)
        auth.app.database().ref("/POSTS").child(currentUser.user).orderByChild("date").on("value", (snapshot) => {
            let dataFirebase = [];
            //Convirtiendo la data a un array, proque me lo da en objetos {objeto1: {}, objeto2:{}}
            var newItem = null;
            snapshot.forEach(item => {
                newItem = item.val();
                // newItem.key = item.key;
                //Agregando los actionButtons                
                dataFirebase.push(newItem);
            })
            this.setState({ posts: dataFirebase, loading: false })
        })
    }

    OnDeletePostAlert = (date) => {
        let { dataModal } = this.state;
        dataModal.buttonText1 = "eliminar";
        dataModal.buttonText2 = "cancelar";
        dataModal.buttonText1Color = "red";
        dataModal.OnPressButton1 = () => this.OnDeletePost(date);
        dataModal.OnPressButton2 = () => this.OnCloseModal();
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
            auth.app.database().ref("/USUARIOS").child(currentUser.user).set(currentUser, async (err) => {
                if (!err) {
                    this.OnCloseModal();
                    //Eliminando la foto del almacenamiento
                    await auth.app.storage().ref("/USUARIOS").child(currentUser.user).delete()
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
        this.OnCloseModal();
        auth.app.database().ref("/POSTS").child(currentUser.user).child(date).remove(async err => {
            if (!err) {
                await auth.app.storage().ref("/POSTS").child(`${currentUser.user}-${date}`).delete()
                    .then(res => {
                        //ACTUALIZANDO INFO DEL USUARIO
                        currentUser.posts -= currentUser.posts >0? -1:0;
                        auth.app.database().ref("/USUARIOS").child(currentUser.user).set(currentUser);
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

    OnCloseModal = () => {
        this.setState({ modalPhoto: false, dataModal: { ...DATAMODAL } });
    }

    render() {
        const { auth, currentUser, OnChangeProfilePhoto, OnLogout } = this.props;
        const { posts, loading, modalPhoto, dataModal } = this.state;
        return (

            <ScrollView>
                <Content>
                    <ProfileHeader currentUser={currentUser} OnModalOpen={this.OnPressPhotoProfile} OnLogout={OnLogout} />
                </Content>
                {loading && <Spinner color="white" />}
                <Posts data={posts} OnDeletePost={this.OnDeletePostAlert} />
                <ModalPhoto open={modalPhoto} OnCloseModal={this.OnCloseModal} dataModal={dataModal} />
            </ScrollView>

        )
    }
}

export default Profile;