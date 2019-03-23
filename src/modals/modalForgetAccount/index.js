import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Item, Form, Input, Text, Button } from 'native-base'
import Modal from 'react-native-modal'
import styles from '../../styles'
class MyModal extends Component {
    state =
        {
            form: { email: "" }
        }

    handleText = (name, value) => {
        let { form } = this.state;
        form[name] = value;
        this.setState({ form })
    }

    onSendEmail = () =>
    {
        const {form} = this.state;
        alert(`Hemos enviado un correo a ${form.email}`);
        this.props.close_modal()
        
    }

    render() {
        const { form } = this.state;
        const { open_modal, close_modal } = this.props;
        return (
            <Modal animationIn="slideInLeft" animationOut="slideOutRight" avoidKeyboard={true} isVisible={open_modal} swipeDirection="right" onSwipe={close_modal} onBackButtonPress={close_modal} onBackdropPress={close_modal} >
                <View style={styles.modal} >
                    <Text style={styles.modalTitles} >Recuperar contraseña</Text>
                    <Form style={{ marginTop: 10, marginBottom: 10 }} >
                        <Item rounded>
                            <Input value={form.email} placeholder="Correo" onChangeText={(text) => this.handleText("email", text)} />
                        </Item>
                        <Button style={styles.buttonPrimary} rounded bordered block onPress={this.onSendEmail} >
                            <Text style={styles.textWhite} >Recuperar cuenta</Text>
                        </Button>
                    </Form>
                </View>
            </Modal>
        )
    }
}


export default MyModal;