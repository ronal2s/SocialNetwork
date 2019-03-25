import React, { Component } from "react";
import { Text, Spinner, Grid, Col, Row, Button } from "native-base";
import { ScrollView, Image, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { DEFAULTPHOTO } from "../../const";
import styles from "../../styles";
import Posts from "../../components/posts";

const ProfileHeader = (props) => {
    const { currentUser, OnChangeProfilePhoto, OnModalOpen } = props;
    const image = currentUser.mainPhoto == "" ? DEFAULTPHOTO : { uri: currentUser.mainPhoto }
    console.log(currentUser)
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
                                    {`1360\nMe gustas`}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity>
                                <Text style={[styles.textWhite, { textAlign: "center" }]} >
                                    {`248\nPost`}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                        <Col >
                            <TouchableOpacity>
                                <Text style={[styles.textWhite, { textAlign: "center" }]} >
                                    {`628\nAmigos`}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <Row>
                        <TouchableOpacity >
                            <Text style={styles.textWhite}>
                                Editar perfil
                            </Text>
                        </TouchableOpacity>
                    </Row>
                </Grid>
            </Row>
        </Grid>
    )
}

const ModalPhoto = (props) => {
    const { open, currentUser, OnCloseModal, OnChangeProfilePhoto, OnDeletePhoto } = props;
    return (
        <Modal isVisible={open} style={{ justifyContent: "flex-end", margin: 0 }} animationIn="slideInLeft" animationOut="slideOutRight" onBackButtonPress={OnCloseModal} swipeDirection="right" onSwipe={OnCloseModal} onBackdropPress={OnCloseModal}>
            {/* <View styles={[styles.modal, {flex: 0.5}]}> */}
            <View style={styles.modalViewBottom} >
                <TouchableOpacity style={{ paddingBottom: 10 }} onPress={OnChangeProfilePhoto} >
                    <Text style={styles.textDark}>
                        NUEVA FOTO
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={OnDeletePhoto} >
                    <Text style={styles.textDark}>
                        ELIMINAR ACTUAL
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}



class Profile extends Component {
    state =
        {
            posts: [],
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

    OnDeletePhoto = async () => {
        let { auth, currentUser } = this.props;
        currentUser.mainPhoto = "";
        //Eliminando la foto del usuario
        auth.app.database().ref("/USUARIOS").child(currentUser.user).set(currentUser, (err) => {
            if(!err)
            {
                this.handleModal();
                //Eliminando la foto del almacenamiento
                auth.app.storage().ref("/USUARIOS").child(currentUser.user).delete()
                .then(res => {
                    console.log("Eliminado del almacenamiento");
                }) 
                .catch(err => {
                    console.log(err);
                    alert("Ha ocurrido un error")
                })
            } else
            {
                console.log(err)
                alert("Ha ocurrido un error");
            }
        })
    }

    handleModal = () => {
        let { modalPhoto } = this.state;
        modalPhoto = !modalPhoto
        this.setState({ modalPhoto })
    }

    OnChangePhoto = () => {
        this.setState({modalPhoto: false}, () => this.props.OnChangeProfilePhoto())
    }

    render() {
        const { auth, currentUser, OnChangeProfilePhoto } = this.props;
        const { posts, loading, modalPhoto } = this.state;
        console.log("USUARIO ES: ", currentUser)
        return (

            <ScrollView>
                <ProfileHeader currentUser={currentUser} OnModalOpen={this.handleModal} />
                {loading && <Spinner color="white" />}
                <Posts data={posts} />
                <ModalPhoto open={modalPhoto} OnCloseModal={this.handleModal} OnChangeProfilePhoto={this.OnChangePhoto} OnDeletePhoto={this.OnDeletePhoto} />
            </ScrollView>

        )
    }
}

export default Profile;