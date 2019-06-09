import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native'
import { Button, Container, Form, Item, Input, Spinner } from 'native-base'
import { Facebook } from "expo"
// const logoUrl = require("./../../../images/logo.png");///
import _Button from "../../components/_Button";
import { FACEBOOK, SCREENS } from "../../const"
import ModalForgotAccount from '../../modals/modalForgetAccount'
import styles from '../../styles'

const logoUrl = require("../../../assets/logo.png");
class Main extends Component {
    state = {
        user: { name: "", password: "" },
        modals: { forgotAccount: false },
        loading: false
    };

    handleText = (name, value: string) => {
        let { user } = this.state;
        user[name] = value.toLocaleLowerCase();
        this.setState({ user })
    }

    handleModal = (name) => {
        let { modals } = this.state;
        modals[name] = !modals[name];
        this.setState({ modals })
    }

    async logIn(onLogged) {
        try {
            const {
                type,
                token,
            } = await Facebook.logInWithReadPermissionsAsync('313711486200584', {
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`${FACEBOOK.TOKEN}=${token}&fields=id,name,birthday,picture.type(large)`);
                await response.json().then(result => {
                    AsyncStorage.setItem("facebookName", result.name);
                    AsyncStorage.setItem("facebookId", result.id);
                    AsyncStorage.setItem("facebookPhoto", result.picture.data.url);
                    AsyncStorage.setItem("facebookToken", token);
                    const currentUser = {
                        name: result.name,
                        facebookId: result.id,
                        facebookPhoto: result.picture.data.url,
                        facebookToken: token
                    }
                    onLogged(currentUser);
                })
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    }

    onLogged = (currentUser) => {
        this.setState({ loading: true });
        this.props.setUser(currentUser);
        this.props.handlePages(SCREENS.Inicio);
    }

    render() {
        const { onLogin, onLogged } = this.props;
        const { modals, loading, user } = this.state;
        return (
            <Container style={styles.centerContent}>
                <View style={styles.loginContent} >
                    <View style={styles.loginContentLogo}>
                        <Image source={logoUrl} style={{ width: 200, height: 150 }} />
                    </View>
                    <Form >
                        {/* <Item rounded bordered style={styles.loginFormItems} >
                            <Input autoCapitalize="none" keyboardType="email-address" returnKeyType="next" onSubmitEditing={() => this.refs.inputClave._root.focus()} placeholder="Correo" onChangeText={(text) => this.handleText("name", text)} />
                        </Item>
                        <Item rounded bordered style={styles.loginFormItems}>
                            <Input autoCapitalize="none" ref="inputClave" secureTextEntry placeholder="Contraseña" onChangeText={(text) => this.handleText("password", text)} />
                        </Item> */}
                        {/* <Button style={[styles.loginFormItems, styles.buttonPrimary]} rounded bordered block onPress={() => OnLogin(user.name, user.password)} >
                            {loadingUser ? <Spinner color="white" /> :
                                <Text style={styles.textWhite} >Iniciar sesión</Text>
                            }
                        </Button> */}

                        <_Button iconName="facebook" text="Iniciar sesión" color="#232323" loading={loading} marginTop={10} onPress={() => this.logIn(this.onLogged)} full iconLeft />
                        
                        {/* <Button style={[styles.loginFormItems, styles.buttonSecondary]} rounded bordered block onPress={openRegister} >
                            <Text style={styles.textDark} >Registrarse</Text>
                        </Button> */}
                        
                        {/* <TouchableOpacity block onPress={() => this.handleModal("forgotAccount")} >
                            <Text style={{ textAlign: "center" }} >
                                Se me olvidó la clave
                                </Text>
                        </TouchableOpacity> */}
                    </Form>
                    <ModalForgotAccount open_modal={modals.forgotAccount} close_modal={() => this.handleModal("forgotAccount")} />
                </View>
            </Container>
        )
    }
}


export default Main;
