import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, TouchableOpacity, CameraRoll } from 'react-native'
import { Drawer, Content, Container, Spinner, Text, Button } from 'native-base'
import Modal from "react-native-modal";
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Camera, Permissions, FileSystem } from 'expo';
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
    const { hasCameraPermission, GetCameraAccess, cameraRef, isCameraOpen, type } = props;
    if (hasCameraPermission === null && isCameraOpen) {
        alert("Para usar la cámara tiene que debe darnos acceso");
        GetCameraAccess();
        return <Text />;
    } else if (hasCameraPermission === false && isCameraOpen) {
        alert("Para usar la cámara tiene que debe darnos acceso");
        GetCameraAccess();
        return <Text />;
    }  else if (isCameraOpen) {
        return (
            <View style={{ flex: 1 }}>
                <Camera
                    // ref={(ref) => { this.camera = ref }}
                    ratio="16:9"
                    ref={cameraRef}
                    style={{ flex: 1 }} type={type}>                    
                </Camera>
            </View>
        )
    } else {
        return <Text />
    }
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
        previewVisible: false
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted', hasCameraRollPermission: status2 === 'granted' });
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

    OnCloseModal = async () =>
    {
        this.setState({previewVisible: false})
    }


    static navigationOptions = {
        header: null
    }

    //Abrir un preview de la foto con la opcion de borrar y continuar, en un modal puede ser

    render() {
        const { screen, loading, open_modal, showSearcher, hasCameraPermission, cameraType, isCameraOpen, cameraRef, previewVisible, newPhotoURL } = this.state;
        const { navigation } = this.props;
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
                    <MainCamera cameraRef={cameraRef} GetCameraAccess={this.GetCameraAccess} isCameraOpen={isCameraOpen} hasCameraPermission={hasCameraPermission} type={cameraType} />
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