import React, { Component } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, AsyncStorage } from 'react-native'
import { Input, Item, Form, Text, Content, Button, Spinner, Icon, ListItem, Thumbnail } from 'native-base'
import { ImagePicker, Permissions } from "expo";
import Stepper from 'react-native-js-stepper'

import { user, verifyEmail, GetBlob } from "../../const"
import TextField from "../../components/textfield"
import IconBoy from '../../../assets/network2.png'
import IconWoman from '../../../assets/photo.png'
import IconSalon from '../../../assets/icons/user.png'
import IconDefault from '../../../assets/icons/user.png'
import styles from '../../styles'

const Page1 = (props) => {
    return <View style={styles.RegisterViews} >
        <Image source={IconBoy} style={styles.RegisterIconsSize} />
        <Text style={styles.textTitle}>
            Conecta con tus amigos
    </Text>
        <Text style={styles.textBody}>
            Tú nombre no aparecerá en la búsqueda a menos que compartas exactamente tú nombre de usuario. Así mantenemos un ambiente privado con tus amigos cercanos 
    </Text>
    </View>
}

const Page2 = () => {
    return <View style={styles.RegisterViews} >
        <Image source={IconWoman} style={styles.RegisterIconsSize} />
        <Text style={styles.textTitle}>
            Publica tus fotos en el momento
    </Text>
        <Text style={styles.textBody}>
            Comparte únicamente los momentos que estás viviendo. No es posible compartir fotos de la galería, muéstrale a las personas tú realidad y comenta en los momentos de tus amigos.
    </Text>
    </View>
}

const Page3 = () => {

    return <View style={styles.RegisterViews} >
        <Image source={IconSalon} style={styles.RegisterIconsSize} />
        <Text style={styles.textTitle}>
            Bienvenido a LogoNetwork
    </Text>
        <Text style={styles.textBody}>
            Publica tus mejores momentos con tus amigos más cercanos, comenta, comparte, disfruta.
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
                {/* <Item rounded style={styles.RegisterItemsForm} >
                    <Input keyboardType="email-address" returnKeyType="next" onSubmitEditing={() => this.NextInput("inputUsuario")} onChangeText={(text) => handleForm("email", text)} placeholder="Correo" autoCapitalize="none" />
                </Item> */}
                <Item rounded style={styles.RegisterItemsForm} >
                    <Input ref="inputUsuario" returnKeyType="next" onSubmitEditing={() => this.NextInput("inputClave")} onChangeText={(text) => handleForm("user", text)} value={form.user} placeholder="Usuario" autoCapitalize="none" />
                </Item>
                <Item rounded style={styles.RegisterItemsForm} >
                    <Input ref="inputClave" returnKeyType="next" onSubmitEditing={() => this.NextInput("inputClave2")} secureTextEntry onChangeText={(text) => handleForm("pass1", text)} value={form.pass1} placeholder="Clave" autoCapitalize="none" />
                </Item>
                <Item rounded style={styles.RegisterItemsForm} >
                    <Input ref="inputClave2" returnKeyType="next" onSubmitEditing={OnRegister} secureTextEntry onChangeText={(text) => handleForm("pass2", text)} value={form.pass2} placeholder="Confirmar clave" autoCapitalize="none" />
                </Item>

                <Button style={[styles.RegisterItemsSpacing, styles.buttonPrimary]} rounded bordered block disabled={uploadingData} onPress={OnRegister} >
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
        console.log(form)
        if ((form.user.length >= 6)) {
            //USAR FUNCION DE VALIDAR CORREO REAL
            // if (verifyEmail(form.email)) {
            if (form.pass1.length >= 6) {
                if (form.pass1 == form.pass2) {
                    //Todo validado
                    

                    //VERIFICAR SI EL CORREO EXISTE
                    const refUsuario = auth.app.database().ref("/USUARIOS");
                    //VERIFICANDO SI EL CORREO EXISTE
                    refUsuario.orderByChild("user").equalTo(form.user).once("value", async (snapshot) => {
                        if (snapshot.exists()) {
                            alert("Este usuario ya ha sido registrado");
                            this.setState({ uploadingData: false });
                        } else {
                            //SI NO EXISTE, SUBIR LA FOTO SI EXISTE
                            if (Object.keys(form.mainPhoto).length > 0) {
                                GetBlob(form.mainPhoto.uri)
                                    .then(async blob => {
                                        const refFoto = auth.app.storage().ref("/USUARIOS").child(form.user);
                                        const snapshot = await refFoto.put(blob);
                                        blob.close();
                                        snapshot.ref.getDownloadURL()
                                            .then(url => {
                                                form.mainPhoto = url;
                                                //SUBIR DATA
                                                auth.createUserWithEmailAndPassword(`${form.user}@gmail.com`, form.pass1)
                                                    .then(res => {
                                                        console.log(res);
                                                        delete form.pass1;
                                                        delete form.pass2;
                                                        form.email = `${form.user}@gmail.com`;
                                                        refUsuario.child(form.user).set(form, (err) => {
                                                            console.log(err)
                                                            if (!err) {
                                                                alert("Usuario registrado");
                                                                this.props.StopLoading();
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
                                auth.createUserWithEmailAndPassword(`${form.user}@gmail.com`, form.pass1)
                                    .then(res => {
                                        delete form.pass1;
                                        delete form.pass2;
                                        form.email = `${form.user}@gmail.com`;
                                        refUsuario.child(form.user).set(form, (err) => {
                                            if (!err) {
                                                //INICIAR SESIÓN CON EL NUEVO USUARIO
                                                alert("Usuario registrado");
                                                this.setState({ uploadingData: false });
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
                                        this.setState({ uploadingData: false });
                                        alert("Ha ocurrido un error")
                                    })
                            }
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
            alert("El usuario debe tener al menos 6 carácteres");
            this.setState({ uploadingData: false });
        }
    }



    handleForm = (name, value) => {
        let { form } = this.state;        
        if (value[value.length-1] != " ") {
            if(value.search(/[`~,.<>;':"\/\[\]\|{}()=_+-]/) == -1)
            {
                form[name] = value.toLocaleLowerCase();
                this.setState({ form })
            }
        }
        // form[name] = text.toLowerCase();
        // console.log("FORMULARIO: ", form)
        // this.setState({ form })
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
                    form.mainPhoto = res
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
        const fotoPrincipal = form.mainPhoto == "" ? IconDefault : form.mainPhoto;
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