import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, CameraRoll, AsyncStorage, Image, YellowBox } from 'react-native';
import { Drawer, Content, Container, Spinner, Text, Button, Card, DeckSwiper, CardItem, Body, Left, Right, } from 'native-base';
import Modal from "react-native-modal";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Camera, Permissions, FileSystem, ImagePicker, Facebook } from 'expo';
import app from "firebase/app";
import _ from 'lodash';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import { CONFIG, ROUTES, CURRENTUSER, SCREENS, POST, FACEBOOK, GetBlob } from "../const";
import Header from '../header';
import SideBar from '../sidebar';
import BottomNav from '../components/bottomnav';

import Filtering from "../routes/filtering";
import Profile from '../routes/profile';
import Register from '../routes/register';
import NewsHome from '../routes/init';
import Notifications from '../routes/notifications';
import Login from '../routes/login';
import LoadingPage from '../routes/loading';
import ModalPost from '../modals/modalPost';
import ModalChat from '../modals/modalChat';
import ModalMessages from '../modals/modalMessages';
import styles from '../styles'
// import { isNullOrUndefined } from 'util';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};

const Pages = (props) => {
    const { screen, auth, currentUser, OnChangeProfilePhoto, OnLogout } = props;
    // if (screen != "Inicio") {
    // return <Container style={styles.main}>            
    return <Container style={styles.main}>
        {screen == SCREENS.Registro && <Register />}
        {screen == SCREENS.Notificaciones && <Notifications auth={auth} currentUser={currentUser} />}
        {screen == SCREENS.Buscar && <Filtering auth={auth} currentUser={currentUser} />}
        {screen == SCREENS.Inicio && <NewsHome auth={auth} currentUser={currentUser} />}
        {screen == SCREENS.Perfil && <Profile auth={auth} currentUser={currentUser} OnLogout={OnLogout} OnChangeProfilePhoto={OnChangeProfilePhoto} />}
    </Container>
    // }
    return <Text />
}

class Main extends Component {
    state = {
        screen: SCREENS.Cargando,
        loading: false,
        isUploadingPhoto: false,
        loadingUser: false,
        open_modal: false,
        modalMessages: false,
        hasCameraPermission: "",
        cameraType: Camera.Constants.Type.front,
        isCameraOpen: false,
        newPhotoURL: null,
        cameraRef: React.createRef(),
        previewVisible: false,
        photos: [],
        currentUser: { ...CURRENTUSER },
        post: { ...POST }
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted', hasCameraRollPermission: status2 === 'granted' });
        app.initializeApp(CONFIG);
        this.auth = app.auth()
        // this.OnLogout()
        //VERIFICAR LA FECHA ONLINE PARA VER SI ES CORRECTA, SI NO LO ES NO DEJAR ENTRAR A LOS USUARIOS
        //VALIDAR SI LA SESION SIGUE ACTIVA 
        //EN VEZ DE ESTO HACER UNA PANTALLA INTERMEDIA 
        // console.log("FECHA ES: ", app.database.ServerValue.TIMESTAMP)
        AsyncStorage.getItem("facebookToken", async (err, token) => {
            console.log("Err: ", err)
            if (!err) {
                const response = await fetch(`${FACEBOOK.TOKEN}=${token}&fields=id,name,birthday,picture.type(large)`);
                await response.json().then(async result => {
                    console.log("Resultt: ", result)
                    if (result.id) {
                        const currentUser = {
                            name: result.name,
                            facebookId: result.id,
                            facebookPhoto: result.picture.data.url,
                            facebookToken: token
                        }
                        this.setState({ currentUser });
                        this.handlePages(SCREENS.Inicio);
                    } else {
                        this.handlePages(SCREENS.Login);
                    }
                });
            } else {
                this.handlePages(SCREENS.Login);
            }
        });
    }



    OnChangeProfilePhoto = async () => {
        // await ImagePicker.launchCameraAsync({allowsEditing: true, aspect: [4, 3]})        
        await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], base64: true, quality: 0.5 })
            .then(async (res) => {
                // console.log(res);
                if (!res.cancelled) {
                    this.setState({ isUploadingPhoto: true });
                    let { currentUser } = this.state;
                    currentUser.mainPhoto = res;
                    //CREANDO BLOB 
                    GetBlob(currentUser.mainPhoto.uri)
                        .then(async blob => {
                            //SUBIR IMAGEN
                            const refFoto = this.auth.app.storage().ref(ROUTES.Usuarios).child(currentUser.user);
                            const refUsuario = this.auth.app.database().ref(ROUTES.Usuarios);
                            const snapshot = await refFoto.put(blob);
                            blob.close();
                            snapshot.ref.getDownloadURL()
                                .then(url => {
                                    currentUser.mainPhoto = url;
                                    //ACTUALIZAR DATA
                                    refUsuario.child(currentUser.user).set(currentUser, (err) => {
                                        console.log(err)
                                        if (!err) {
                                            this.setState({ currentUser, isUploadingPhoto: false })
                                        } else {
                                            alert("Ha ocurrido un error cambiando la imagen de perfil");
                                            this.setState({ isUploadingPhoto: false });
                                        }
                                    })
                                })
                        })
                        .catch(err => {
                            alert("Ha ocurrido un error");
                            console.log(err)
                        })

                } else {

                    this.setState({ isUploadingPhoto: false });
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({ isUploadingPhoto: false });
            })

    }


    //OLD
    OnLogin = (email, password) => {

        this.setState({ loadingUser: true });
        this.auth.signInWithEmailAndPassword(email, password)
            .then(res => {
                // console.log(res.user.email);
                //Obtener datos del usuario
                AsyncStorage.setItem("uid", res.user.uid);
                this.auth.app.database().ref(ROUTES.Usuarios).orderByChild("email").equalTo(res.user.email).once("value", (snapshot) => {
                    if (snapshot.exists()) {
                        const UserKey = Object.keys(snapshot.val())[0]
                        // console.log(snapshot.val()[UserKey])
                        this.setState({ currentUser: snapshot.val()[UserKey], loadingUser: false })
                        // alert("Usuario validado");
                        // this.setState({loadingUser: false});
                        this.handlePages(SCREENS.Inicio);
                    }
                })

            })
            .catch(err => {
                alert("Usuarios y/o clave incorrecto");
                this.setState({ loadingUser: false });
                console.log(err)
            })
    }

    OnLogout = () => {
        this.auth.signOut()
            .then(res => {
                console.log(res);
                this.setState({ screen: SCREENS.Login });
            })
            .catch(err => {
                console.log(err);
                alert("Ha ocurrido un error");
            })
    }



    handlePages = (page) => {
        this.setState({ screen: page, loading: false })
    }

    GetCameraAccess = async () => {
        this.setState({ isCameraOpen: false })
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted', hasCameraRollPermission: status2 === 'granted', isCameraOpen: status === 'granted' });
    }

    OnCloseModal = async () => {
        this.setState({ previewVisible: false })
    }

    OnCameraOpen = async () => {
        // await ImagePicker.launchCameraAsync({allowsEditing: true, aspect: [4, 3]})
        await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], base64: true, mediaTypes: "Images", quality: 0.5 })
            .then(res => {
                // console.log(res);
                if (!res.cancelled) {
                    let { post } = this.state;
                    post.photo = res;
                    this.setState({ post, newPhotoURL: res, previewVisible: true })
                }
            })
            .catch(err => console.log(err))
    }

    setUser = (user) => {
        this.setState({ currentUser: user, screen: SCREENS.Inicio });
    }

    StopLoading = () => {
        this.setState({ loadingUser: false })
    }

    static navigationOptions = {
        header: null
    }

    OnOpenMessages = () => {
        let { modalMessages } = this.state;
        modalMessages = !modalMessages;
        this.setState({ modalMessages })
    }


    //Abrir un preview de la foto con la opcion de borrar y continuar, en un modal puede ser

    render() {
        const { screen, loading, open_modal, hasCameraPermission,
            previewVisible, newPhotoURL, photos, loadingUser, currentUser, isUploadingPhoto, modalMessages } = this.state;
        const { navigation, auth } = this.props;
        // console.log("USUARIO ES: ", currentUser)
        if (screen == SCREENS.Login) {
            return <Login loadingUser={loadingUser} setUser={this.setUser} OnLogin={this.OnLogin} OnRegister={this.OnRegister} openRegister={() => navigation.navigate("Register", { OnRegister: this.OnRegister, auth: this.auth, StopLoading: this.StopLoading })} handlePages={this.handlePages} />
        }
        if (screen == SCREENS.Cargando) {
            return <LoadingPage />
        }
        return (
            <Container style={styles.main} >
                <Header screen={screen} OnOpenMessages={this.OnOpenMessages} />
                <StatusBar barStyle="light-content" backgroundColor="#232323" />

                {/* <Pages open_modal={open_modal} screen={screen} handlePages={this.handlePages} loading={loading} /> */}
                <Pages OnLogout={this.OnLogout} OnChangeProfilePhoto={this.OnChangeProfilePhoto} open_modal={open_modal} screen={screen} auth={this.auth} currentUser={currentUser} />
                {/* <Home loading={loading} screen={screen} handlePages={this.handlePages} /> */}
                <BottomNav page={screen} handlePages={this.handlePages} OnCameraOpen={this.OnCameraOpen} />
                <ModalPost open={previewVisible} imageURL={newPhotoURL} currentUser={currentUser} auth={this.auth} OnCloseModal={this.OnCloseModal} />
                <ModalMessages open={modalMessages} close_modal={this.OnOpenMessages} auth={this.auth} currentUser={currentUser} />
                {/* <Loading loading={true}/> */}
            </Container>
        )
    }

}

const AppNavigator = createStackNavigator({
    Home: {
        screen: Main
    },

    Register: {
        screen: Register
    }
})

// export default Main;
export default createAppContainer(AppNavigator);