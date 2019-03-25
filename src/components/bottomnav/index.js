import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import styles from '../../styles'
import { SCREENS } from "../../const"


export default class FooterTabsIconTextExample extends Component {
  render() {
    const { page, handlePages, OnCameraOpen, OnTakePicture, camera, flipCamera, isCameraOpen, OnCloseCamera } = this.props;
    const styleOpt1 = isCameraOpen ? styles.PageSelected : styles.PageNoSelected;//CAMARA
    const styleOpt2 = page == SCREENS.Perfil ? styles.PageSelected : styles.PageNoSelected;//PERFIL
    const styleOpt3 = page == SCREENS.Notificaciones ? styles.PageSelected : styles.PageNoSelected;//NOTIFICACIONES
    const styleOpt4 = page == SCREENS.Buscar ? styles.PageSelected : styles.PageNoSelected;//BUSCAR
    const styleOpt5 = page == SCREENS.Inicio ? styles.PageSelected : styles.PageNoSelected;//INICIO
    const titleCamera = isCameraOpen ? "Capturar" : "Cámara"
    console.log(this.props.camera)
    return (

      <Footer  >
        <FooterTab style={styles.DarkColorBackground}>

          <Button vertical onPress={() => handlePages(SCREENS.option1)} >
            <Icon name="home" type="MaterialCommunityIcons" style={styleOpt5} />
          </Button>
          <Button vertical onPress={() => handlePages(SCREENS.option2)} >
            <Icon name="magnify" type="MaterialCommunityIcons" style={styleOpt4} />
          </Button>
          <Button vertical onPress={OnCameraOpen} >
            <Icon name="camera" type="MaterialCommunityIcons" style={styleOpt1} />
          </Button>
          <Button vertical onPress={() => handlePages(SCREENS.option4)} >
            <Icon name="heart" type="MaterialCommunityIcons" style={styleOpt3} />
          </Button>
          <Button vertical onPress={() => handlePages(SCREENS.option5)} >
            <Icon name="account" type="MaterialCommunityIcons" style={styleOpt2} />
          </Button>


        </FooterTab>
      </Footer>

    );
  }
}