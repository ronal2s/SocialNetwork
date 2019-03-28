import React, { PureComponent } from "react"
import Modal from "react-native-modal"
import { Image, StyleSheet } from "react-native"
import { Button, View, Text, Item, Content, Form, Textarea, Input, Spinner, ListItem, Left, Thumbnail, Right, Body, Footer, FooterTab } from "native-base"
import { POST, GetBlob, ROUTES, DEFAULTPHOTO } from "../../const"
import styles from "../../styles"
const MaxChars = 200;
class Preview extends PureComponent {
    state =
        {
            description: "",
            uploadingComment: false
        }

    HandleDescription = (value: string) => {
        let { description } = this.state;
        description = value;
        this.setState({ description })
    }

    OnReplyComment = () => {
        let { auth, actualComment, post, currentUser } = this.props;
        let { description } = this.state;
        let ref = auth.app.database().ref(ROUTES.Comentarios).child(post.user).child(post.date)
        this.setState({uploadingComment: true})
        ref.orderByChild("date").equalTo(actualComment.date).once("value", snapshot => {
            //Ya aqui me dan el comentario actual
            // let updates = {}
            let key = Object.keys(snapshot.val())[0]
            let updates = {...snapshot.val()[key]}
            updates.comments = updates.comments instanceof Array? updates.comments: []
            updates.comments.push({...currentUser, comment: description})

            
            ref.child(key).set(updates, err => {
                if(err)
                {
                    console.log(err);
                    alert("Ha ocurrido un error")
                } else
                {
                    this.setState({uploadingComment: false}, () => this.props.OnCloseModal())
                }
            })
            // ref.child(key).push(updates, err => {
            //     if(err)
            //     {
            //         console.log("ERRORRRR: ", err)
            //     } else
            //     {
            //         alert("HECHO")   
            //     }
            // })
            // ref.set(updates)
            
        })

    }







    render() {
        const { open, imageURL, post, OnCloseModal, currentUser, auth, actualComment } = this.props;
        const { description, uploadingComment } = this.state;
        const imageProfile = actualComment.mainPhoto == "" ? DEFAULTPHOTO : { uri: actualComment.mainPhoto }
        console.log(post)
        console.log(actualComment)
        return (
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight" onBackButtonPress={OnCloseModal} swipeDirection="right" onSwipe={OnCloseModal}
                onBackdropPress={OnCloseModal} >
                <View style={[styles.modal, { height: 280 }]}>

                    <ListItem avatar>
                        <Left>
                            <Thumbnail source={imageProfile} />
                        </Left>
                        <Body>
                            <Text style={styles.textDark}>{`${actualComment.user}`}</Text>
                            <Text note>{actualComment.comment}</Text>
                        </Body>
                    </ListItem>
                    <Form>
                        <Textarea bordered value={description} placeholder="Respuesta" rowSpan={4} onChangeText={this.HandleDescription}/>
                        {/* <Input placeholder="Responder comentario" onChangeText={this.HandleDescription} value={description} returnKeyType="send" onSubmitEditing={this.OnReplyComment} /> */}
                    </Form>
                    <Button block style={[styles.buttonPrimary, { marginTop: 5 }]} onPress={this.OnReplyComment} >
                        {uploadingComment ? <Spinner color="white" /> :
                            <Text style={styles.textWhite} >ACEPTAR</Text>
                        }
                    </Button>

                </View>
            </Modal>
        )
    }
}

export default Preview;