import React, { Component } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Text, Right, Left, Body, List, ListItem, Button, Thumbnail, Footer, FooterTab, Textarea, Form, Input, Spinner } from 'native-base'
import Modal from 'react-native-modal'
import styles from "../../styles"
import { ROUTES } from '../../const';

//Nuevas fotos
const ModalContent = (props) => {
    const { data, loading } = props;
    if(!loading)
    {
        if(data.length > 0)
        {
            return data.map((v, i) => {
                return <ListItem key={i} avatar>
                    <Left>
                        <Thumbnail source={{ uri: v.mainPhoto }} />
                    </Left>
                    <Body>
                        <Text style={styles.textWhite}>{`${v.user}`}</Text>
                        <Text note>{v.comment}</Text>
                    </Body>
                    {/* <Right>
                        <Text note>{v.date}</Text>
                    </Right> */}
                </ListItem>
            })
        }
         else
         {
             return <Text style={[styles.textWhite, {textAlign: "center"}]} >Sin comentarios</Text>
         }
    }

    return <Spinner color="white"/>


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
        this.setState({loading: true})
        
        auth.app.database().ref(ROUTES.Comentarios).child(post.user).child(post.date).on("value", snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(item => {
                    comments.push(item.val())
                })
                this.setState({comments, loading: false})
            } else
            {
                this.setState({loading: false, comments: []})
            }
        })

    }

    handleText = (text) => {
        this.setState({ newComment: text })
    }

    OnSendComment = () => {
        let { newComment } = this.state;
        let { auth, currentUser, post } = this.props;
        if(str.replace(/\s/g, '').length)
        {
            let data = {user: currentUser.user, mainPhoto: currentUser.mainPhoto, comment: newComment}
            auth.app.database().ref(ROUTES.Comentarios).child(post.user).child(post.date).push(data, err => {
                if(!err)
                {
                    alert("Comentario enviado");
                    this.setState({newComment: ""})
                } else
                {
                    alert("Ha ocurrido un error")
                }
            })
        }
    }

    render() {
        const { open, close_modal, auth, post } = this.props;
        const { comments, newComment, loading } = this.state;
        return (
            <Modal isVisible={open} onModalShow={this.getData} animationIn="slideInLeft" animationOut="slideOutRight"
                onBackButtonPress={close_modal} onBackdropPress={close_modal} style={[styles.modalDark, { margin: 0 }]} >
                <ScrollView>
                    <ModalContent data={comments}loading={loading} />
                </ScrollView>
                <Footer style={{backgroundColor: "white"}} >
                    <Form style={{width: "100%"}} >
                    {/* <Textarea rowSpan={3} onChangeText={this.handleText} value={newComment} returnKeyLabel="Enviar" onSubmitEditing={this.OnSendComment} /> */}
                    <Input multiline placeholder="Agregar comentario" onChangeText={this.handleText} value={newComment} returnKeyType="send" onSubmitEditing={this.OnSendComment} />
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