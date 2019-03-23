import React, { PureComponent } from "react"
import Modal from "react-native-modal"
import { Image, StyleSheet } from "react-native"
import { Button, View, Text } from "native-base"
import styles from "../../styles"

class Preview extends PureComponent {
    render() {
        const { open, imageURL, OnCloseModal } = this.props;
        return (
            <Modal isVisible={open} animationIn="slideInLeft" animationOut="slideOutRight" onBackButtonPress={OnCloseModal} swipeDirection="right" onSwipe={OnCloseModal}
                onBackdropPress={OnCloseModal}>
                <View style={[styles.modal, { flex: 1 }]}>
                    <Image source={{ uri: `data:image/png;base64, ${imageURL}` }} style={{flex: 1,width: null,height: null}} />
                    <Button transparent success block style={{marginTop: 5}} >
                        <Text>Aceptar</Text>
                    </Button>
                </View>
            </Modal>
        )
    }
}

export default Preview;