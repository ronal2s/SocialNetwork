import React, { Component } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Text, Right, Left, Body, List, ListItem, Button, Thumbnail, Footer, FooterTab, Textarea, Form, Input, Spinner, Icon } from 'native-base'
import Modal from 'react-native-modal'
import styles from "../../styles"
import { ROUTES, DEFAULTPHOTO } from '../../const';

//Nuevas fotos
const ModalContent = (props) => {
    const { data, loading, currentUser, post, OnDeleteComment } = props;
    let imageProfile = null;
    if (!loading) {
        if (data.length > 0) {
            return data.map((v, i) => {
                imageProfile = v.mainPhoto == ""? DEFAULTPHOTO: {uri: v.mainPhoto}
                return <ListItem key={i} avatar>
                    <Left>
                        <Thumbnail source={imageProfile} />
                    </Left>
                    <Body>
                        <Text style={styles.textWhite}>{`${v.user}`}</Text>
                        <Text note>{v.comment}</Text>
                    </Body>
                    {(currentUser.user == v.user || currentUser.user == post.user) &&
                        <Right>
                            <Button transparent onPress={() => OnDeleteComment(v)} >
                                <Icon name="delete" style={{ color: "gray" }} type="MaterialCommunityIcons" />
                            </Button>
                        </Right>
                    }

                </ListItem>
            })
        }
        else {
            return <Text style={[styles.textWhite, { textAlign: "center" }]} >Sin comentarios</Text>
        }
    }

    return <Spinner color="white" />


}



class MyModal extends Component {

    state =
        {
            comments: [],
            newComment: "",
            loading: true
        }

    getData = () => {
        let { auth, post } = this.props;
        let { comments, loading } = this.state;
        this.setState({ loading: true, newComment: "", comments: [] })

        auth.app.database().ref(ROUTES.Comentarios).child(post.user).child(post.date).on("value", snapshot => {
            if (snapshot.exists()) {
                comments = [];
                snapshot.forEach(item => {
                    comments.push(item.val())
                })
                this.setState({ comments, loading: false })
            } else {
                this.setState({ loading: false, comments: [] })
            }
        })

    }

    handleText = (text) => {
        this.setState({ newComment: text })
    }

    OnSendComment = () => {
        let { newComment } = this.state;
        let { auth, currentUser, post } = this.props;
        if (newComment.replace(/\s/g, '').length) {
            newComment = newComment.replace(/\s+/g,' ').trim(); //Reemplazando muchos espacios por uno solo
            let data = { user: currentUser.user, mainPhoto: currentUser.mainPhoto, comment: newComment, date: 0 - new Date() }
            auth.app.database().ref(ROUTES.Comentarios).child(post.user).child(post.date).push(data, err => {
                if (!err) {
                    this.setState({ newComment: "" })
                } else {
                    alert("Ha ocurrido un error")
                }
            })
        }
    }

    OnDeleteComment = (comment) =>
    {
        let { comments } = this.state;
        let { auth, post } = this.props;
        const ref = auth.app.database().ref(ROUTES.Comentarios).child(post.user).child(post.date)
        ref.orderByChild("date").equalTo(comment.date).once("value", snapshot => {
            if(snapshot.exists())
            {
                console.log(snapshot)
                // snapshot.ref.remove() //Este me elimina todos los comentarios
                //INVESTIGAR COMO ESTE METODO FUNCIONA
                const updates= {};
                snapshot.forEach(child => updates[child.key] = null);
                console.log("UPDATES: ", updates)
                ref.update(updates);
            }
        })
    }

    render() {
        const { open, close_modal, auth, post, currentUser } = this.props;
        const { comments, newComment, loading } = this.state;
        return (
            <Modal isVisible={open} onModalShow={this.getData} animationIn="slideInLeft" animationOut="slideOutRight"
                onBackButtonPress={close_modal} onBackdropPress={close_modal} style={[styles.modalDark, { margin: 0 }]} >
                <ScrollView>
                    <ModalContent data={comments} loading={loading} post={post} currentUser={currentUser} OnDeleteComment={this.OnDeleteComment}/>
                </ScrollView>
                <Footer style={{ backgroundColor: "white" }} >
                    <Form style={{ width: "100%" }} >
                        {/* <Textarea rowSpan={3} onChangeText={this.handleText} value={newComment} returnKeyLabel="Enviar" onSubmitEditing={this.OnSendComment} /> */}
                        <Input placeholder="Agregar comentario" onChangeText={this.handleText} value={newComment} returnKeyType="send" onSubmitEditing={this.OnSendComment} />
                    </Form>
                </Footer>
                <Footer>
                    <FooterTab>
                        <Button style={styles.buttonPrimary} onPress={close_modal} >
                            <Text style={styles.textWhite}>
                                Atrás
                                </Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Modal>
        )
    }
}

export default MyModal;