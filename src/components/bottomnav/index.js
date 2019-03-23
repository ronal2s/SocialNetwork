import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import styles from '../../styles'
export default class FooterTabsIconTextExample extends Component {
  render() {
      const {page, handlePages, OnCameraOpen, OnTakePicture, camera, flipCamera, isCameraOpen, OnCloseCamera} = this.props;
      const styleOpt1 = page == "home"? styles.PageSelected:styles.PageNoSelected;      
      const styleOpt2 = page == "employees"? styles.PageSelected:styles.PageNoSelected;      
      const styleOpt3 = page == "camera"? styles.PageSelected:styles.PageNoSelected;      
      const styleOpt4 = page == "navigate"? styles.PageSelected:styles.PageNoSelected;    
      console.log(this.props.camera)  
    return (
      
        <Footer  >
          <FooterTab style={styles.DarkColorBackground}>
            {isCameraOpen && <Button vertical style={styleOpt1} onPress={OnCloseCamera} >
              <Icon name="camera" type="MaterialCommunityIcons" style={styleOpt1}/>
              <Text style={styleOpt1}>Cerrar</Text>
            </Button>}
            {/* <Button vertical style={styleOpt1} onPress={() => OnCameraOpen(camera) } > */}
            <Button vertical style={styleOpt1} onPress={OnCameraOpen } >
              <Icon name="camera" type="MaterialCommunityIcons" style={styleOpt2}/>
              <Text style={styleOpt1}>Cámara</Text>
            </Button>
             {isCameraOpen && <Button vertical style={styleOpt2} onPress={flipCamera}>
              <Icon name="star" type="MaterialCommunityIcons" style={styleOpt3}/>
              <Text style={styleOpt2} >Girar</Text>
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