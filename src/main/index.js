import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, TouchableOpacity, CameraRoll, AsyncStorage, Image, YellowBox } from 'react-native'
import { Drawer, Content, Container, Spinner, Text, Button, Card, DeckSwiper, CardItem, Body, Left, Right, } from 'native-base'
import Modal from "react-native-modal";
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Camera, Permissions, FileSystem, ImagePicker } from 'expo';
import app from "firebase/app"
import _ from 'lodash';
import "firebase/auth"
import "firebase/database"
import "firebase/storage"
import { CONFIG, CURRENTUSER, GetBlob } from "../const"
import Header from '../header'
import SideBar from '../sidebar'
import BottomNav from '../components/bottomnav'
import Employees from '../routes/employees'
import Register from '../routes/register'
import Mynunus from '../routes/init'
import Login from '../routes/login'
import LoadingPage from '../routes/loading'
import PreviewPhoto from '../components/preview'
import styles from '../styles'
// import { isNullOrUndefined } from 'util';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};
const Loading = (props) => {
    const { loading } = props;
    return <Modal style={[styles.modal, { backgroundColor: "white" }]} isVisible={loading}>
        <View style={{ flex: 1 }}>
            <Spinner color="#0086c3" />
        </View>
    </Modal>
}

const Home = (props) => {
    const { screen, handlePages, loading, isCameraOpen } = props;
    if (screen == "Inicio" && !isCameraOpen) {
        return <Content style={styles.content} >
            <Mynunus handlePages={handlePages} />
            <Loading loading={loading} />
        </Content>
    }
    return <Text />
}

const Pages = (props) => {
    const { screen, isCameraOpen } = props;
    if (screen != "Inicio" && !isCameraOpen) {
        return <Container style={styles.main}>
            {screen == "employees" && <Employees />}
            {screen == "register" && <Register />}
        </Container>
    }
    return <Text />
}

const MHeader = (props) => {
    const { showSearcher, screen, open } = props;
    if (screen != "login") {
        return <Header showSearcher={showSearcher} open={open} />
    }
    return <Text />
}

const MainCamera = (props) => {
    const { hasCameraPermission, GetCameraAccess, cameraRef, isCameraOpen, type, photos } = props;
    if (hasCameraPermission === null && isCameraOpen) {
        alert("Para usar la cámara tiene que debe darnos acceso");
        GetCameraAccess();
        return <Text />;
    } else if (hasCameraPermission === false && isCameraOpen) {
        alert("Para usar la cámara tiene que debe darnos acceso");
        GetCameraAccess();
        return <Text />;
    } else if (isCameraOpen) {
        console.log("IMAGEN", photos[0])
        return (
            <View style={{ flex: 1 }}>
                <Camera
                    // ref={(ref) => { this.camera = ref }}
                    ratio="1:1"
                    ref={cameraRef}
                    style={{ flex: 0.5 }} type={type}>
                </Camera>
                <Container style={{ flex: 0.5, backgroundColor: "#282828" }}>
                    <View  >
                        <DeckSwiper dataSource={photos} renderItem={item =>
                            <Card transparent >
                                <CardItem style={styles.DarkColorBackground} >
                                    <Left>
                                        <Text style={styles.textWhite} >
                                            Fotos del carrete
                                        </Text>
                                    </Left>
                                    <Right>
                                        <Text note>
                                            {item.node.group_name}
                                        </Text>
                                    </Right>
                                </CardItem>
                                <CardItem cardBody button>
                                    <Image source={item.node.image} style={{ width: "100%", height: 300, }} />
                                </CardItem>
                            </Card>
                        } />
                    </View>
                </Container>

            </View>
        )
    } else {
        return <Text />
    }
}


//Hay un error con el drawer, se necesita poner mainOverlay: 0, si no aparece super oscuro. O type = displace
class Main extends Component {
    state = {
        screen: "loading",
        loading: false,
        isUploadingPhoto: false,
        loadingUser: false,
        open_modal: false,
        showSearcher: false,
        hasCameraPermission: "",
        cameraType: Camera.Constants.Type.front,
        isCameraOpen: false,
        newPhotoURL: null,
        cameraRef: React.createRef(),
        previewVisible: false,
        photos: [],
        currentUser: { ...CURRENTUSER }
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted', hasCameraRollPermission: status2 === 'granted' });
        app.initializeApp(CONFIG);
        this.auth = app.auth()
        //VALIDAR SI LA SESION SIGUE ACTIVA 
        //EN VEZ DE ESTO HACER UNA PANTALLA INTERMEDIA 
        
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ loadingUser: true })
                console.log(user.email);
                this.auth.app.database().ref("/USUARIOS").orderByChild("correo").equalTo(user.email).once("value", (snapshot) => {
                    if (snapshot.exists()) {
                        const UserKey = Object.keys(snapshot.val())[0]
                        this.setState({ currentUser: snapshot.val()[UserKey], screen: "Inicio", loadingUser: false })
                    }
                })
            } else {
                this.setState({ screen: "login", loadingUser: false })
            }
        })
        this.GetPhotosCamera();
    }



    GetPhotosCamera = async () => {
        await CameraRoll.getPhotos({ first: 50 }).then(res => {
            // console.log(res.edges)
            this.setState({ photos: res.edges });

        })
    }

    OnChangeProfilePhoto = async () => {
        // await ImagePicker.launchCameraAsync({allowsEditing: true, aspect: [4, 3]})        
        await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], base64: true })
            .then(async (res) => {
                // console.log(res);
                if (!res.cancelled) {
                    this.setState({ isUploadingPhoto: true });
                    let { currentUser } = this.state;
                    currentUser.fotoPrincipal = res;
                    //CREANDO BLOB 
                    GetBlob(currentUser.fotoPrincipal.uri)
                    .then(async blob => {
                        //SUBIR IMAGEN
                        const refFoto = this.auth.app.storage().ref("/USUARIOS").child(currentUser.usuario);
                        const refUsuario = this.auth.app.database().ref("/USUARIOS");
                        const snapshot = await refFoto.put(blob);
                        blob.close();
                        snapshot.ref.getDownloadURL()
                            .then(url => {
                                currentUser.fotoPrincipal = url;
                                //ACTUALIZAR DATA
                                refUsuario.child(currentUser.usuario).set(currentUser, (err) => {
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


    OnLogin = (email, password) => {

        this.setState({ loadingUser: true });
        this.auth.signInWithEmailAndPassword(email, password)
            .then(res => {
                // console.log(res.user.email);
                //Obtener datos del usuario
                AsyncStorage.setItem("uid", res.user.uid);
                this.auth.app.database().ref("/USUARIOS").orderByChild("correo").equalTo(res.user.email).once("value", (snapshot) => {
                    if (snapshot.exists()) {
                        const UserKey = Object.keys(snapshot.val())[0]
                        // console.log(snapshot.val()[UserKey])
                        this.setState({ currentUser: snapshot.val()[UserKey], loadingUser: false })
                        // alert("Usuario validado");
                        // this.setState({loadingUser: false});
                        this.handlePages("Inicio");
                    }
                })

            })
            .catch(err => {
                alert("Usuarios y/o clave incorrecto");
                this.setState({ loadingUser: false });
                console.log(err)
            })
    }

    OnLogout = () =>
    {
        this.auth.signOut()
        .then(res => {
            console.log(res);
            this.setState({screen: "login"});
        })
        .catch(err => {
            console.log(err);
            alert("Ha ocurrido un error");
        })
    }


    handlePages = (page) => {
        let { showSearcher, screen } = this.state;
        switch (page) {
            case "Inicio": showSearcher = false; break;
            case "employees": showSearcher = true; break;
            case "login": showSearcher = false; break;

        }
        this.setState({ loading: false, showSearcher });
        if (screen != "login") {
            this.drawer._root.close()
        }
        setTimeout(() => this.setState({ screen: page, loading: false }), 300);
    }


    OnCameraOpen = (camera) => {
        let { isCameraOpen } = this.state;
        if (!isCameraOpen) {
            isCameraOpen = true;
        } else {
            //Capturar foto
            this.OnTakePicture();
        }
        this.setState({ isCameraOpen })
    }

    flipCamera = () => {
        let { cameraType } = this.state;
        cameraType = cameraType == Camera.Constants.Type.front ? Camera.Constants.Type.back : Camera.Constants.Type.front
        this.setState({ cameraType })
    }

    OnCloseCamera = () => {
        this.setState({ isCameraOpen: false })
    }


    OnPictureSaved = async photo => {
        const urlPhoto = `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`
        // console.log(Object.keys(photo))
        let { hasCameraRollPermission, isCameraOpen } = this.state;
        // await FileSystem.moveAsync({
        //     from: photo.uri,
        //     to: urlPhoto,
        // });
        if (hasCameraRollPermission !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status === 'granted') {
                CameraRoll.saveToCameraRoll(photo.uri, "photo");
                isCameraOpen = false;
            }
        } else {
            CameraRoll.saveToCameraRoll(photo.uri, "photo");
            isCameraOpen = false;

        }
        this.setState({ newPhotoURL: photo.base64, isCameraOpen, previewVisible: true });
    }

    OnTakePicture = async () => {
        if (this.state.cameraRef) {
            this.state.cameraRef.current.takePictureAsync({ onPictureSaved: this.OnPictureSaved, base64: true });
        }
    };

    GetCameraAccess = async () => {
        this.setState({ isCameraOpen: false })
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted', hasCameraRollPermission: status2 === 'granted', isCameraOpen: status === 'granted' });
    }

    OnCloseModal = async () => {
        this.setState({ previewVisible: false })
    }


    setUser = (user) => {
        this.setState({ currentUser: user, screen: "Inicio" });
    }

    static navigationOptions = {
        header: null
    }

    //Abrir un preview de la foto con la opcion de borrar y continuar, en un modal puede ser

    render() {
        const { screen, loading, open_modal, showSearcher, hasCameraPermission, cameraType, isCameraOpen, cameraRef,
            previewVisible, newPhotoURL, photos, loadingUser, currentUser, isUploadingPhoto } = this.state;
        const { navigation, auth } = this.props;
        // console.log("USUARIO ES: ", currentUser)
        if (screen == "login") {
            return <Login loadingUser={loadingUser} OnLogin={this.OnLogin} OnRegister={this.OnRegister} openRegister={() => navigation.navigate("Register", { OnRegister: this.OnRegister, auth: this.auth })} handlePages={this.handlePages} />
        }
        if (screen == "loading") {
            return <LoadingPage />
        }
        return (
            // <View>
            <Drawer type="displace" ref={(ref) => this.drawer = ref} onClose={() => this.drawer._root.close()}
                content={<SideBar screen={screen} OnLogout={this.OnLogout} OnChangeProfilePhoto={this.OnChangeProfilePhoto} handlePages={this.handlePages} isUploadingPhoto={isUploadingPhoto} currentUser={currentUser} />} >
                <Container style={styles.main} >
                    <MHeader screen={screen} showSearcher={showSearcher} open={() => this.drawer._root.open()} />
                    <StatusBar barStyle="light-content" backgroundColor="#232323" />
                    {/* {this.MainCamera()} */}
                    <MainCamera photos={photos} cameraRef={cameraRef} GetCameraAccess={this.GetCameraAccess} isCameraOpen={isCameraOpen} hasCameraPermission={hasCameraPermission} type={cameraType} />
                    <Pages isCameraOpen={isCameraOpen} open_modal={open_modal} screen={screen} handlePages={this.handlePages} loading={loading} />
                    <Home isCameraOpen={isCameraOpen} loading={loading} screen={screen} handlePages={this.handlePages} />
                    <BottomNav page={screen} OnCloseCamera={this.OnCloseCamera} flipCamera={this.flipCamera} camera={this.camera} OnCameraOpen={this.OnCameraOpen} isCameraOpen={isCameraOpen} />
                    <PreviewPhoto open={previewVisible} imageURL={newPhotoURL} OnCloseModal={this.OnCloseModal} />
                    {/* <Loading loading={true}/> */}
                </Container>
            </Drawer>
            // {/* </View> */}
        )
    }

}

const AppNavigator = createStackNavigator({
    Home: {
        screen: Main
    },
    Prueba: {
        screen: Employees
    },
    Register: {
        screen: Register
    }
})

// export default Main;
export default createAppContainer(AppNavigator);