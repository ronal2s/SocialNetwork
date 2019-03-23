import React, { Component } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Text, Right, Left, Body, List, ListItem, Button, Thumbnail } from 'native-base'
import Modal from 'react-native-modal'

import { data } from './example'
// const data = []
//Nuevas fotos
const ModalContent = (props) => {    
    return data.map((v, i) => {
        return <ListItem key={i} avatar>
            <Left>
                <Thumbnail source={{ uri: v.photo }} />
            </Left>
            <Body>
                <Text style={styles.titles}>{`${v.first_name} ${v.last_name}`}</Text>
                <Text note>{v.comment}</Text>
            </Body>
            <Right>
                <Text note>{v.date}</Text>
            </Right>
        </ListItem>
    })


}



class MyModal extends Component {
    render() {
        const { open_modal, close_modal} = this.props;
        return (
            <Modal isVisible={open_modal} swipeDirection="right" onSwipe={close_modal} onBackButtonPress={close_modal} onBackdropPress={() => close_modal()} >
                <ScrollView style={styles.modal_style}>
                    <List>
                        <ModalContent />
                    </List>
                    <Button block transparent style={styles.cardButtons} onPress={() => close_modal()} >
                        <Text style={styles.cardButtonsText}>Cerrar</Text>
                    </Button>
                </ScrollView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({    
    modal_style: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 22
    },
    modal_titles: {
        fontWeight: "bold",
        color: "#0086c3"
    },
    cardButtons: {
        marginBottom: 15
    },
    cardButtonsText: {
        color: "#0086c3"        
    },
    modal_content: {
        paddingBottom: 50
    },
    titles: {
        color: "#0086c3"
    }
})

export default MyModal;