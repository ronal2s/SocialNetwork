import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, TouchableOpacity, CameraRoll, AsyncStorage, Image } from 'react-native'
import { Drawer, Content, Container, Spinner, Text, Button, Card, DeckSwiper, CardItem, Body, Left, Right, } from 'native-base'
import Modal from "react-native-modal";
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Camera, Permissions, FileSystem } from 'expo';
import app from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"
import { config } from "../const"
import Header from '../header'
import SideBar from '../sidebar'
import BottomNav from '../components/bottomnav'
import Employees from '../routes/employees'
import Register from '../routes/register'
import Mynunus from '../routes/init'
import Login from '../routes/login'
import PreviewPhoto from '../components/preview'
import styles from '../styles'

const Loading = (props) => {
    const { loading } = props;
    return <Modal style={styles.modal} isVisible={loading}>
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
    const { screen, open_modal, handleModalFilter, isCameraOpen } = props;
    if (screen != "Inicio" && !isCameraOpen) {
        return <Container style={styles.main}>
            {screen == "employees" && <Employees open_modal={open_modal} close_modal={handleModalFilter} />}
            {screen == "register" && <Register />}
        </Container>
    }
    return <Text />
}

const MHeader = (props) => {
    const { showSearcher, handleModalFilter, open, screen } = props;
    if (screen != "login") {
        return <Header showSearcher={showSearcher} openModal={handleModalFilter} open={open} />
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
                <Container  style={{flex: 0.5, backgroundColor: "#282828"}}>
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

const ShowCameraRoll = (props) => {
    const { isCameraOpen, photos } = props;

}

//Hay un error con el drawer, se necesita poner mainOverlay: 0, si no aparece super oscuro. O type = displace
class Main extends Component {
    state = {
        screen: "Inicio",
        loading: false,
        open_modal: false,
        showSearcher: false,
        hasCameraPermission: "",
        cameraType: Camera.Constants.Type.front,
        isCameraOpen: false,
        newPhotoURL: null,
        cameraRef: React.createRef(),
        previewVisible: false,
        photos: []
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted', hasCameraRollPermission: status2 === 'granted' });



        app.initializeApp(config);
        this.auth = app.auth()



        // this.OnLogin("ronal2w@gmail.com", "hola123");        

        // this.auth.signInWithCustomToken()

        this.GetPhotosCamera();
    }


    GetPhotosCamera = async () => {
        await CameraRoll.getPhotos({ first: 50 }).then(res => {
            // console.log(res.edges)
            this.setState({ photos: res.edges });

        })
    }


    OnLogin = (email, password) => {

        this.auth.signInWithEmailAndPassword(email, password)
            .then(res => {
                //Datos del usuario:
                console.log(res.user.providerData[0]);

                AsyncStorage.setItem("uid", res.user.uid);
                alert("Usuario validado");
            })
            .catch(err => {
                alert("Usuarios y/o clave incorrecto");
                console.log(err)
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

    handleModalFilter = () => {
        const { open_modal } = this.state;
        this.setState({ open_modal: !open_modal });
    }

    OnCameraOpen = (camera) => {
        let { isCameraOpen } = this.state;
        if (!isCameraOpen) {
            isCameraOpen = true;
        } else {
            //Capturar foto
            console.log("WEEEY")
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
        console.log(Object.keys(photo))
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


    static navigationOptions = {
        header: null
    }

    //Abrir un preview de la foto con la opcion de borrar y continuar, en un modal puede ser

    render() {
        const { screen, loading, open_modal, showSearcher, hasCameraPermission, cameraType, isCameraOpen, cameraRef, previewVisible, newPhotoURL, photos } = this.state;
        const { navigation, auth } = this.props;
        console.log("Auth es: ", auth)
        if (screen == "login") {
            return <Login openRegister={() => navigation.navigate("Register")} handlePages={this.handlePages} />
        }
        return (
            // <View>
            <Drawer panOpenMask={5} type="displace" ref={(ref) => this.drawer = ref} onClose={() => this.drawer._root.close()}
                content={<SideBar screen={screen} handlePages={this.handlePages} />} >
                <Container style={styles.main} >
                    <MHeader screen={screen} showSearcher={showSearcher} handleModalFilter={this.handleModalFilter} open={() => this.drawer._root.open()} />
                    <StatusBar barStyle="light-content" backgroundColor="#232323" />
                    {/* {this.MainCamera()} */}
                    <MainCamera photos={photos} cameraRef={cameraRef} GetCameraAccess={this.GetCameraAccess} isCameraOpen={isCameraOpen} hasCameraPermission={hasCameraPermission} type={cameraType} />
                    <Pages isCameraOpen={isCameraOpen} open_modal={open_modal} screen={screen} handlePages={this.handlePages} loading={loading} handleModalFilter={this.handleModalFilter} />
                    <Home isCameraOpen={isCameraOpen} loading={loading} screen={screen} handlePages={this.handlePages} />
                    <BottomNav page={screen} OnCloseCamera={this.OnCloseCamera} flipCamera={this.flipCamera} camera={this.camera} OnCameraOpen={this.OnCameraOpen} isCameraOpen={isCameraOpen} />
                    <PreviewPhoto open={previewVisible} imageURL={newPhotoURL} OnCloseModal={this.OnCloseModal} />
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