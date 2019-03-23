import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Input, Item, Form, Text, Content, Button, Picker, Icon } from 'native-base'
import Stepper from 'react-native-js-stepper'
import IconBoy from '../../../assets/icons/barber.png'
import IconWoman from '../../../assets/icons/hair-cut.png'
import IconSalon from '../../../assets/icons/hair-salon.png'
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
    const { form , handleForm, navigation} = props;
    return <Content style={styles.RegisterFormContent} >
        <Form>
            <Item rounded style={styles.RegisterItemsForm} >
                <Input onChangeText={(text) => handleForm("nombres", text)} placeholder="Nombres" />
            </Item>
            <Item rounded style={styles.RegisterItemsForm} >
                <Input onChangeText={(text) => handleForm("apellidos", text)} placeholder="Apellidos" />
            </Item>
            <Item rounded style={styles.RegisterItemsForm} >
                <Input onChangeText={(text) => handleForm("direccion", text)} placeholder="Dirección" />
            </Item>
            <Item rounded style={styles.RegisterItemsForm} >
                <Input onChangeText={(text) => handleForm("cedula", text)} placeholder="Cédula" />
            </Item>
            <Item rounded style={styles.RegisterItemsForm} >
                <Input onChangeText={(text) => handleForm("telefonoPersonal", text)} keyboardType="number-pad" placeholder="Teléfono personal" />
            </Item>                        
            
            <Item rounded style={styles.RegisterItemsForm}>
                <Picker mode="dropdown" placeholder="Método de pago" iosIcon={<Icon name="ios-arrow-down-outline" />}
                placeholderStyle={{ color: "#bfc6ea" }} selectedValue={form.pago}
                onValueChange={(val) => handleForm("pago", val)}>
                    <Picker.Item value={0} label="Método de pago"/>
                    <Picker.Item value={"debito"} label="Tarjeta de débito"/>
                    <Picker.Item value={"credito"} label="Tarjeta de crédito"/>
                    <Picker.Item value={"efectivo"} label="Efectivo"/>
                </Picker>
            </Item>

            <Button style={[styles.RegisterItemsSpacing, styles.buttonPrimary]} rounded bordered block onPress={() => navigation.goBack()} >
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
        form: {nombres:"", apellidos:"", direccion:"", cedula:"", telefonoPersonal:"", pago: ""}
    }

    handleForm = (name, text) =>
    {
        let {form} = this.state;
        form[name] = text;
        this.setState({form})
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
        const {handlePages, navigation} = this.props;
        const {form} = this.state;
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
                // activeStepStyle={{backgroundColor: "black"}}
                // inactiveStepStyle={styles.RegisterInactiveDot}
                // activeStepTitleStyle={styles.RegisterActiveStepTitle}
                // inactiveStepTitleStyle={styles.RegisterInactiveStepTitle}
                >
                <Page1 />
                <Page2 />
                <Page3 />
                <Page4 form={form} navigation={navigation}  handleForm={this.handleForm}/>
            </Stepper>
        )
    }
}

export default Register;