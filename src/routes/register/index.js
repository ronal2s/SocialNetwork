import React, { Component } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Input, Item, Form, Text, Content, Button, Picker, Icon, ListItem, Thumbnail } from 'native-base'
import { ImagePicker, Permissions } from "expo";
import { user } from "../../const"
import Stepper from 'react-native-js-stepper'
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

const Page4 = (props) => {
    const { form, handleForm, navigation, OnRegister, PickerImage,fotoPrincipal } = props;
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
                <Input onChangeText={(text) => handleForm("correo", text)} placeholder="Correo" />
            </Item>
            <Item rounded style={styles.RegisterItemsForm} >
                <Input onChangeText={(text) => handleForm("usuario", text)} placeholder="Usuario" />
            </Item>
            <Item rounded style={styles.RegisterItemsForm} >
                <Input onChangeText={(text) => handleForm("clave", text)} placeholder="clave" />
            </Item>

            <Button style={[styles.RegisterItemsSpacing, styles.buttonPrimary]} rounded bordered block onPress={OnRegister} >
                <Text style={styles.textWhite}  >Registrarse</Text>
            </Button>
            <Button style={[styles.RegisterItemsSpacing, styles.buttonSecondary]} rounded bordered block onPress={() => navigation.goBack()} >
                <Text style={styles.textDark} >Iniciar sesión</Text>
            </Button>
        </Form>
    </Content>

}

class Register extends Component {
    state =
        {
            form: { ...user }
        }

        async componentDidMount()
        {
            this.GetCameraAccess();
        }

    handleForm = (name, text) => {
        let { form } = this.state;
        form[name] = text;
        this.setState({ form })
    }

    GetCameraAccess = async () => {
        this.setState({ isCameraOpen: false })
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted', hasCameraRollPermission: status2 === 'granted', isCameraOpen: status === 'granted' });
    }

    PickerImage = async() =>
    {
        // await ImagePicker.launchCameraAsync({allowsEditing: true, aspect: [4, 3]})
        await ImagePicker.launchImageLibraryAsync({allowsEditing: true, aspect: [4, 3], base64: true})
        .then(res => {
            // console.log(res);
            if(!res.cancelled)
            {
                let { form } = this.state;
                form.fotoPrincipal = res
                this.setState({form})
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
        const { form } = this.state;
        const OnRegister = navigation.getParam("OnRegister", () => alert("Not working"));
        const fotoPrincipal = form.fotoPrincipal == "" ? IconDefault : form.fotoPrincipal;
        console.log(Object.keys(form.fotoPrincipal))
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
                <Page4 fotoPrincipal={fotoPrincipal} PickerImage={this.PickerImage} OnRegister={() => OnRegister(form)} form={form} navigation={navigation} handleForm={this.handleForm} />
            </Stepper>
        )
    }
}

export default Register;