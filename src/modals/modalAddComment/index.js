import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Item, Textarea, Form, Button } from 'native-base'
import Modal from 'react-native-modal'


const ModalContent = (props) => {
    return <View style={styles.modal_filter}>
        <Text style={styles.title} >Agregar comentario</Text>
        <Form style={{ marginTop: 10, marginBottom: 10 }} >
            <Item rounded>
                <Textarea rowSpan={5} value={props.text} placeholder="Ej: Muy responsable con mis niños" onChangeText={(text) => props.handleText(text, "comment")} />
            </Item>
        </Form>
        <Button style={styles.button} block bordered rounded>
            <Text style={styles.textButton} >Agregar</Text>
        </Button>
    </View>
}



class Employees extends Component {

    state = {
        form: { comment: "" }
    }

    handlePicker = (value: string) => {
        this.setState({ valueFilter: value })
    }


    handleText = (text, name) => {
        let { form } = this.state;
        form[name] = text;
        this.setState({ form })
    }

    render() {        
        const { open_modal, close_modal, onSearch } = this.props;
        return (
            <Modal isVisible={open_modal} animationIn="slideInLeft" animationOut="slideOutRight" onBackButtonPress={close_modal} swipeDirection="right" onSwipe={close_modal}
                onBackdropPress={close_modal} >
                <ModalContent handleText={this.handleText} />
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
modal_filter: {
        ////// flex: 1,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 22
    },
    button: {
        // borderColor: "#9b27af"
        borderColor: "#0086c3"
    },
    textButton: {
        // color: "#9b27af"
        color: "#0086c3"
    },
    title: {
        fontWeight: "bold", 
        fontSize: 22, 
        textAlign: "center",
        // color: "#9b27af"
        color: "#0086c3"
    }
})

export default Employees;