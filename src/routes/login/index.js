import React, { Component } from 'react'
import {View, Text, Image, TouchableOpacity } from 'react-native'
import { Button, Container, Form, Item, Input } from 'native-base'
// const logoUrl = require("./../../../images/logo.png");///
const logoUrl = require("../../../assets/logo.png");
import ModalForgotAccount from '../../modals/modalForgetAccount'
import styles from '../../styles'
class Main extends Component {
    state = {
        user: { name: "", password: "" },
        modals: {forgotAccount: false}
    };

    handleText = (name, value: string) => {
        let { user } = this.state;
        user[name] = value;
        this.setState({ user })
    }

    handleModal = (name) =>
    {
        let{modals} = this.state;
        modals[name] = !modals[name];
        this.setState({modals})
    }

    render() {
        const { handlePages, openRegister } = this.props;
        const {modals} = this.state;
        return (
                <Container style={styles.centerContent}>
                    <View style={styles.loginContent} >
                        <View style={styles.loginContentLogo}>
                            <Image source={logoUrl} style={{ width: 200, height: 150 }} />
                        </View>
                        <Form >
                            <Item rounded bordered style={styles.loginFormItems} >
                                <Input placeholder="Usuario" onChangeText={(text) => this.handleText("name", text)} />
                            </Item>
                            <Item rounded bordered style={styles.loginFormItems}>
                                <Input secureTextEntry placeholder="Contraseña" onChangeText={(text) => this.handleText("password", text)} />
                            </Item>
                            <Button style={[styles.loginFormItems, styles.buttonPrimary]} rounded bordered block onPress={() => handlePages("home")} >
                                <Text style={styles.textWhite} >Iniciar sesión</Text>
                            </Button>
                            <Button style={[styles.loginFormItems, styles.buttonSecondary]} rounded bordered block onPress={openRegister} >
                                <Text style={styles.textDark} >Registrarse</Text>
                            </Button>                             
                            <TouchableOpacity block onPress={() => this.handleModal("forgotAccount")} >
                                <Text style={{textAlign: "center"}} >
                                    Se me olvidó la clave
                                </Text>
                            </TouchableOpacity>
                        </Form>
                        <ModalForgotAccount open_modal={modals.forgotAccount} close_modal={() => this.handleModal("forgotAccount")}/>
                    </View>
                </Container>
        )
    }
}


export default Main;
