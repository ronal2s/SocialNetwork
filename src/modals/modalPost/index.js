import React, { PureComponent } from "react"
import Modal from "react-native-modal"
import { Image, StyleSheet, TouchableOpacity } from "react-native"
import { Button, View, Text, Item, Content, Form, Textarea, Spinner, CheckBox, ListItem, Body } from "native-base"
import { Constants, Location, Permissions } from 'expo';

import { POST, GetBlob, ROUTES } from "../../const"
import styles from "../../styles"
const MaxChars = 200;
class Preview extends PureComponent {
    state =
        {
            post: { ...POST },
            description: "",
            locationChecked: false,
            loadingLocation: false,
            uploadingPost: false
        }

    componentWillMount() {
        // if (Platform.OS === 'android' && !Constants.isDevice) {
        //     this.setState({
        //         errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        //     });
        // } else {
        //     this._getLocationAsync();
        // }
    }


    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        let { post } = this.state;
        this.setState({loadingLocation: true})
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        if (post.location == "") {
            await Location.getCurrentPositionAsync({})
                .then(result => {
                    post.location = result;
                    this.setState({ post, locationChecked: true, loadingLocation: false })
                })
        } else {
            post.location = "";
            this.setState({ post, locationChecked: false, loadingLocation: false });
        }
    };

    HandleDescription = (value: string) => {
        let { description } = this.state;
        if (description.length < MaxChars) {
            description = value;
            this.setState({ description })
        }
    }



    OnPost = async () => {
        const { currentUser, auth, imageURL } = this.props;
        const { post, description, uploadingPost } = this.state;
        const actualDate = 0 - new Date();
        const userPost = `${currentUser.user}-${actualDate}`;//En la data va a aparecer ronal2s--123112131
        this.setState({ uploadingPost: true });
        if (!uploadingPost) {
            GetBlob(imageURL.uri)
                .then(async blob => {
                    const refPhoto = auth.app.storage().ref(ROUTES.Posts).child(userPost);
                    // const refUser = auth.app.database().ref(ROUTES.Posts).child(currentUser.user).child(actualDate);
                    const refUser = auth.app.database().ref(ROUTES.Posts).child(currentUser.user);
                    const snapshot = await refPhoto.put(blob);
                    blob.close();
                    snapshot.ref.getDownloadURL()
                        .then(url => {
                            post.photo = url;
                            post.user = currentUser.user;
                            post.date = actualDate;
                            post.description = description;
                            refUser.child(post.date).set(post, (err) => {
                                if (!err) {
                                    this.setState({ uploadingPost: false, description: "" }, () => {
                                        this.props.OnCloseModal();
                                    });

                                } else {
                                    console.log(err);
                                    alert("Ha ocurrido un error");
                                    this.setState({ uploadingPost: false });
                                }
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            alert("Ha ocurrido un error");
                            this.setState({ uploadingPost: false });
                        })

                })
                .catch(err => {
                    console.log(err);
                    alert("Ha ocurrido un error");
                    this.setState({ uploadingPost: false });
                })
        }
    }



    render() {
        const { open, imageURL, OnCloseModal, currentUser, auth } = this.props;
        const { description, uploadingPost, post, loadingLocation } = this.state;
        console.log(post.location)
        return (
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight" onBackButtonPress={OnCloseModal} swipeDirection="right" onSwipe={OnCloseModal}
                onBackdropPress={OnCloseModal}>
                <View style={[styles.modal, { height: 500 }]}>
                    {/* <Image source={{ uri: `data:image/png;base64, ${imageURL}` }} style={{flex: 1, width: null,height: null}} /> */}
                    <Image source={imageURL} style={{ flex: 1, width: null, height: null }} />
                    {/* <Content padder> */}
                    <Text>
                        {`Caráceteres restantes: ${MaxChars - description.length}`}
                    </Text>
                    <Form>
                        <Textarea bordered value={description} placeholder="Descripción" rowSpan={3} onChangeText={this.HandleDescription} />
                        <ListItem noBorder>
                            <CheckBox color="#232323" checked={post.location instanceof Object} onPress={this._getLocationAsync} />
                            <Body>
                                {loadingLocation ? <Text note>Cargando...</Text>:
                                    <Text note>Compartir ubicación</Text>
                                }
                            </Body>
                        </ListItem>
                    </Form>
                    {/* </Content> */}
                    <Button block style={[styles.buttonPrimary, { marginTop: 5 }]} disabled={uploadingPost} onPress={this.OnPost} >
                        {uploadingPost ? <Spinner color="white" /> :
                            <Text style={styles.textWhite} >Aceptar</Text>
                        }
                    </Button>
                </View>
            </Modal>
        )
    }
}

export default Preview;