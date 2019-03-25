import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import styles from '../../styles'
export default class FooterTabsIconTextExample extends Component {
  render() {
    const { page, handlePages, OnCameraOpen, OnTakePicture, camera, flipCamera, isCameraOpen, OnCloseCamera } = this.props;
    const styleOpt1 = isCameraOpen ? styles.PageSelected : styles.PageNoSelected;
    const titleCamera = isCameraOpen ? "Capturar" : "Cámara"
    console.log(this.props.camera)
    return (

      <Footer  >
        <FooterTab style={styles.DarkColorBackground}>

          <Button vertical onPress={OnCameraOpen} >
            <Icon name="favorite" type="MaterialIcons" style={styleOpt1} />
          </Button>
          <Button vertical onPress={OnCameraOpen} >
            <Icon name="camera" type="MaterialCommunityIcons" style={styleOpt1} />
          </Button>
          <Button vertical onPress={() => handlePages("profile")} >
            <Icon name="image" type="MaterialCommunityIcons" style={styleOpt1} />
          </Button>


        </FooterTab>
      </Footer>

    );
  }
}