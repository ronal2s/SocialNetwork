import React, { PureComponent } from "react"
import Modal from "react-native-modal"
import { Image, StyleSheet } from "react-native"
import { Button, View, Text, Item, Content, Form, Textarea, Spinner } from "native-base"
import { POST, GetBlob, ROUTES } from "../../const"
import styles from "../../styles"
const MaxChars = 200;
class Preview extends PureComponent {
    state =
        {
            post: { ...POST },
            description: "",
            uploadingPost: false
        }

    HandleDescription = (value: string) => {
        let { description } = this.state;
        if(description.length < MaxChars)
        {
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
                            refUser.push(post, (err) => {
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
        const { description, uploadingPost } = this.state;
        return (
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight" onBackButtonPress={OnCloseModal} swipeDirection="right" onSwipe={OnCloseModal}
                onBackdropPress={OnCloseModal}>
                <View style={[styles.modal, { flex: 0.5 }]}>
                    {/* <Image source={{ uri: `data:image/png;base64, ${imageURL}` }} style={{flex: 1, width: null,height: null}} /> */}
                    <Image source={imageURL} style={{ flex: 1, width: null, height: null }} />
                    {/* <Content padder> */}
                    <Text>
                        {`Caráceteres restantes: ${MaxChars - description.length}`}
                    </Text>
                    <Form>
                        <Textarea bordered value={description} placeholder="Descripción" rowSpan={3} onChangeText={this.HandleDescription} />
                    </Form>
                    {/* </Content> */}
                    <Button block style={[styles.buttonPrimary, { marginTop: 5 }]} onPress={this.OnPost} >
                        {uploadingPost? <Spinner color="white" />:
                        <Text style={styles.textWhite} >Aceptar</Text>
                        }
                    </Button>
                </View>
            </Modal>
        )
    }
}

export default Preview;