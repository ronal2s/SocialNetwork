import React, { Component } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, AsyncStorage } from 'react-native'
import { Input, Item, Form, Text, Content, Button, Spinner, Icon, ListItem, Thumbnail } from 'native-base'
import { ImagePicker, Permissions } from "expo";
import Stepper from 'react-native-js-stepper'

import { user, verifyEmail, GetBlob } from "../../const"
import TextField from "../../components/textfield"
import IconBoy from '../../../assets/icons/barber.png'
import IconWoman from '../../../assets/icons/hair-cut.png'
import IconSalon from '../../../assets/icons/hair-salon.png'
import IconDefault from '../../../assets/icons/user.png'
import styles from '../../styles'

const Page1 = (props) => {
    return <View style={styles.RegisterViews} >
        <Image source={IconBoy} style={styles.RegisterIconsSize} />
        <Text style={styles.textTitle}>
            Lorem ipsum dolor sit amet
    </Text>
        <Text style={styles.textBody}>
            Consectetur adipiscing elit. Praesent eget odio non nibh tristique vehicula a et ex.
            Etiam nec fringilla felis. Nam facilisis aliquam lectus. Integer vulputate varius pellentesque.
            Vivamus tristique dictum erat sed dignissim.
    </Text>
    </View>
}

const Page2 = () => {
    return <View style={styles.RegisterViews} >
        <Image source={IconWoman} style={styles.RegisterIconsSize} />
        <Text style={styles.textTitle}>
            Lorem ipsum dolor sit amet
    </Text>
        <Text style={styles.textBody}>
            Consectetur adipiscing elit. Praesent eget odio non nibh tristique vehicula a et ex.
            Etiam nec fringilla felis. Nam facilisis aliquam lectus. Integer vulputate varius pellentesque.
            Vivamus tristique dictum erat sed dignissim.
    </Text>
    </View>
}

const Page3 = () => {

    return <View style={styles.RegisterViews} >
        <Image source={IconSalon} style={styles.RegisterIconsSize} />
        <Text style={styles.textTitle}>
            Lorem ipsum dolor sit amet
    </Text>
        <Text style={styles.textBody}>
            Consectetur adipiscing elit. Praesent eget odio non nibh tristique vehicula a et ex.
            Etiam nec fringilla felis. Nam facilisis aliquam lectus. Integer vulputate varius pellentesque.
            Vivamus tristique dictum erat sed dignissim.
    </Text>
    </View>
}

export class Page44 extends Component {

    NextInput = (name) => {
        this.refs[name]._root.focus();
    }

    render() {
        const { form, handleForm, navigation, OnRegister, PickerImage, fotoPrincipal, uploadingData, forceUpdate } = this.props;
        return <Content style={styles.RegisterFormContent} >
            <Form>
                {/* <ListItem avatar  > */}
                <TouchableOpacity onPress={PickerImage} >
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Thumbnail style={{ borderRadius: 100 }} source={fotoPrincipal} width={200} height={200} />
                    </View>
                </TouchableOpacity>
                {/* </ListItem> */}
                <Item rounded style={styles.RegisterItemsForm} >
                    <Input keyboardType="email-address" returnKeyType="next" onSubmitEditing={() => this.NextInput("inputUsuario")} onChangeText={(text) => handleForm("correo", text)} placeholder="Correo" autoCapitalize="none" />
                </Item>
                <Item rounded style={styles.RegisterItemsForm} >
                    <Input ref="inputUsuario" returnKeyType="next" onSubmitEditing={() => this.NextInput("inputClave")} onChangeText={(text) => handleForm("usuario", text)} placeholder="Usuario" autoCapitalize="none" />
                </Item>
                <Item rounded style={styles.RegisterItemsForm} >
                    <Input ref="inputClave" returnKeyType="next" onSubmitEditing={() => this.NextInput("inputClave2")} secureTextEntry onChangeText={(text) => handleForm("clave", text)} placeholder="Clave" autoCapitalize="none" />
                </Item>
                <Item rounded style={styles.RegisterItemsForm} >
                    <Input ref="inputClave2" returnKeyType="next" onSubmitEditing={OnRegister} secureTextEntry onChangeText={(text) => handleForm("clave2", text)} placeholder="Confirmar clave" autoCapitalize="none" />
                </Item>

                <Button style={[styles.RegisterItemsSpacing, styles.buttonPrimary]} rounded bordered block onPress={OnRegister} >
                    {uploadingData ? <Spinner color="white" /> :
                        <Text style={styles.textWhite}  >Registrarse</Text>
                    }
                </Button>
                <Button style={[styles.RegisterItemsSpacing, styles.buttonSecondary]} rounded bordered block onPress={() => navigation.goBack()} >
                    <Text style={styles.textDark} >Iniciar sesión</Text>
                </Button>
            </Form>
        </Content>
    }
}

class Register extends Component {
    state =
        {
            form: { ...user },
            uploadingData: false
        }

    async componentDidMount() {
        this.GetCameraAccess();
    }

    OnRegister = async (form, auth) => {
        // console.log(form)
        this.setState({ uploadingData: true });
        //VALIDANDO FORMULARIO GENERAL
        if ((form.usuario.length >= 6)) {
            //USAR FUNCION DE VALIDAR CORREO REAL
            if (verifyEmail(form.correo)) {
                if (form.clave.length >= 6) {
                    if (form.clave == form.clave2) {
                        //Todo validado


                        //VERIFICAR SI EL CORREO EXISTE
                        const refUsuario = auth.app.database().ref("/USUARIOS");
                        //VERIFICANDO SI EL CORREO EXISTE
                        refUsuario.orderByChild("correo").equalTo(form.correo).once("value", (snapshot) => {
                            if (snapshot.exists()) {
                                alert("Este correo ya ha sido registrado");
                                this.setState({ uploadingData: false });
                            } else {
                                //VERIFICANDO SI EL USUARIO EXISTE
                                refUsuario.orderByChild("usuario").equalTo(form.usuario).once("value", async (snapshot) => {
                                    if (snapshot.exists()) {
                                        alert("Este usuario ya ha sido registrado");
                                        this.setState({ uploadingData: false });
                                    } else {
                                        //SI NO EXISTE, SUBIR LA FOTO SI EXISTE
                                        if (Object.keys(form.fotoPrincipal).length > 0) {
                                            GetBlob(form.fotoPrincipal.uri)
                                                .then(async blob => {
                                                    const refFoto = auth.app.storage().ref("/USUARIOS").child(form.usuario);
                                                    const snapshot = await refFoto.put(blob);
                                                    blob.close();
                                                    snapshot.ref.getDownloadURL()
                                                        .then(url => {
                                                            form.fotoPrincipal = url;
                                                            // AsyncStorage.setItem("userPhoto", url);
                                                            // AsyncStorage.setItem("userName", form.usuario);
                                                            // AsyncStorage.setItem("userName", form.usuario);
                                                            //SUBIR DATA
                                                            auth.createUserWithEmailAndPassword(form.correo, form.clave)
                                                            .then(res => {
                                                                console.log(res);
                                                                delete form.clave;
                                                                delete form.clave2;
                                                                refUsuario.child(form.usuario).set(form, (err) => {
                                                                    console.log(err)
                                                                    if (!err) {
                                                                        alert("Usuario registrado");
                                                                        this.props.navigation.goBack();
                                                                    } else {
                                                                        alert("Ha ocurrido un error");
                                                                        this.setState({ uploadingData: false });
                                                                    }
                                                                })
                                                            })
                                                            .catch(err => {
                                                                console.log("Ha ocurrido un error");
                                                                alert("err")
                                                            })
                                                        })
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                    alert("Ha ocurrido un error");
                                                })

                                        }
                                        else {
                                            //SI NO HAY FOTO, SE SUBE SIN FOTO
                                            auth.createUserWithEmailAndPassword(form.correo, form.clave)
                                            .then(res => {
                                                delete form.clave;
                                                delete form.clave2;
                                                refUsuario.child(form.usuario).set(form, (err) => {
                                                    if (!err) {
                                                        //INICIAR SESIÓN CON EL NUEVO USUARIO
                                                        alert("Usuario registrado");
                                                        this.props.navigation.goBack();
                                                    } else {
                                                        alert("Ha ocurrido un error");
                                                        this.setState({ uploadingData: false });
                                                        console.log(err)
                                                    }
                                                })
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                alert("Ha ocurrido un error")
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        alert("Las claves no coinciden")
                        this.setState({ uploadingData: false });
                    }
                } else {
                    alert("La clave debe tener al menos 6 carácteres");
                    this.setState({ uploadingData: false });
                }
            } else {
                alert("El correo está incorrecto");
                this.setState({ uploadingData: false });
            }
        } else {
            alert("El usuario debe tener al menos 6 carácteres");
            this.setState({ uploadingData: false });
        }
    }



    handleForm = (name, text) => {
        let { form } = this.state;
        form[name] = text.toLowerCase();
        console.log("FORMULARIO: ", form)
        this.setState({ form })
    }

    GetCameraAccess = async () => {
        this.setState({ isCameraOpen: false })
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted', hasCameraRollPermission: status2 === 'granted', isCameraOpen: status === 'granted' });
    }

    PickerImage = async () => {
        // await ImagePicker.launchCameraAsync({allowsEditing: true, aspect: [4, 3]})
        await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], base64: true })
            .then(res => {
                // console.log(res);
                if (!res.cancelled) {
                    let { form } = this.state;
                    form.fotoPrincipal = res
                    this.setState({ form })
                }
            })
            .catch(err => console.log(err))
    }

    static navigationOptions = () => ({
        title: "Registro",
        // header: null
        headerStyle: {
            backgroundColor: "#232323"
        },
        headerTintColor: "white"
    })
    render() {
        const { handlePages, navigation } = this.props;
        const { form, uploadingData } = this.state;
        const OnRegister = navigation.getParam("OnRegister", () => alert("Not working"));
        const auth = navigation.getParam("auth");
        const fotoPrincipal = form.fotoPrincipal == "" ? IconDefault : form.fotoPrincipal;
        return (
            <Stepper
                ref={(ref: any) => {
                    this.stepper = ref
                }}
                validation={true}
                activeDotStyle={styles.activeDot}
                inactiveDotStyle={styles.inactiveDot}
                showTopStepper={false}
                showBottomStepper={false}
                steps={['Inicio', 'Registro']}
                backButtonTitle="Atrás"
                nextButtonTitle="Siguiente"
            >
                <Page1 />
                <Page2 />
                <Page3 />
                {/* <Page4  uploadingData={uploadingData} fotoPrincipal={fotoPrincipal} PickerImage={this.PickerImage} OnRegister={() => OnRegister(form)} form={form} navigation={navigation} handleForm={this.handleForm} /> */}
                <Page44 uploadingData={uploadingData} fotoPrincipal={fotoPrincipal} PickerImage={this.PickerImage} OnRegister={() => this.OnRegister(form, auth)} form={form} navigation={navigation} handleForm={this.handleForm} />
            </Stepper>
        )
    }
}

export default Register;