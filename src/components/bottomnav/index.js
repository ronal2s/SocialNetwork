import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import styles from '../../styles'
export default class FooterTabsIconTextExample extends Component {
  render() {
      const {page, handlePages, OnCameraOpen, OnTakePicture, camera, flipCamera, isCameraOpen, OnCloseCamera} = this.props;
      const styleOpt1 = isCameraOpen? styles.PageSelected:styles.PageNoSelected;           
      const titleCamera = isCameraOpen?"Capturar":"Cámara" 
      console.log(this.props.camera)  
    return (
      
        <Footer  >
          <FooterTab style={styles.DarkColorBackground}>
            {isCameraOpen && <Button vertical style={styles.PageNoSelected} onPress={OnCloseCamera} >
              <Icon name="camera" type="MaterialCommunityIcons" style={styles.PageNoSelected}/>
              <Text style={styles.PageNoSelected}>Cerrar</Text>
            </Button>}
            {/* <Button vertical style={styleOpt1} onPress={() => OnCameraOpen(camera) } > */}
            <Button vertical onPress={OnCameraOpen } >
              <Icon name="camera" type="MaterialCommunityIcons" style={styleOpt1} />
              <Text style={styleOpt1}>{titleCamera}</Text>
            </Button>
             {isCameraOpen && <Button vertical  onPress={flipCamera}>
              <Icon name="star" type="MaterialCommunityIcons" style={styles.PageNoSelected} />
              <Text style={styles.PageNoSelected} >Girar</Text>
            </Button>}
            {/*<Button vertical style={styleOpt3}>
              <Icon name="lock-open" type="MaterialCommunityIcons" style={styleOpt3}/>
              <Text style={styleOpt3}>Abiertos</Text>
            </Button>
            <Button vertical style={styleOpt4}>
              <Icon name="calendar-check" type="MaterialCommunityIcons" style={styleOpt4}/>
              <Text style={styleOpt4}>Historial</Text>
            </Button> */}
          </FooterTab>
        </Footer>
      
    );
  }
}