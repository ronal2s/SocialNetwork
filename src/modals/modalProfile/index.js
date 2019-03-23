import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Right, Left, Body, CardItem, Button, Thumbnail, Container, Icon, Grid, Col, Row, Footer } from 'native-base'
import Modal from 'react-native-modal'


const ModalContent = (props) => {
    const { data, close_modal, openRequest } = props;
    const available = data.avaible?"Disponible":"No disponible"
    return <View style={styles.modal_filter}>
        {/* <Text style={{ fontWeight: "bold", fontSize: 22, textAlign: "center" }} >Nombre de la persona</Text> */}
        <Left>
            <Thumbnail style={styles.profileThumbnail} source={{ uri: data.photo }} />
            <Body>
                <Text style={styles.cardTextTitle} >{data.first_name + " " + data.last_name}</Text>
                <Text note>{available}</Text>
            </Body>
        </Left>
        <Container style={styles.modal_content} >
            <Text style={styles.modal_titles} >Acerca de mí:</Text>
            <Text>
                {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et arcu sed nulla faucibus tincidunt. Suspendisse a luctus arcu, eu porta augue. Vivamus eget dui bibendum, euismod augue eu, pharetra nisi. Etiam gravida elementum sapien, eu laoreet metus tempor eu. Nam lacinia eleifend nibh, nec condimentum odio dapibus ac."}
            </Text>
            <Text style={styles.modal_titles} >Trabajos realizados:</Text>
            <Text>12</Text>
            <Text style={styles.modal_titles}>Puntuación:</Text>
            <Text>{`${data.points}/4`}</Text>
        </Container>
        {/* <Content> */}
        {/* <Footer style={{ backgroundColor: "white" }} >
            <Grid>
                <Row>
                    <Col>
                        <Button transparent>
                            <Icon name="checkmark-circle" style={styles.cardButtons} />
                            <Text style={styles.cardButtons}>Solicitar</Text>
                        </Button>
                        </Col>
                        <Col>
                        <Button transparent onPress={() => close_modal()}>
                        <Icon name="close" style={styles.cardButtons}/>
                        <Text style={styles.cardButtons}>Cerrar</Text>
                        </Button>
                        </Col>
                        </Row>
                        </Grid>
                    </Footer> */}
        <Button transparent block bordered style={styles.cardBorderButtons} onPress={() => openRequest("request", data)} >
            <Icon name="checkmark-circle" style={styles.cardButtons} />
            <Text style={styles.cardButtons}>Solicitar</Text>
        </Button>
        {/* </Content> */}
        {/* <Button bordered rounded onPress={() => props.onSearch()} ><Text>Buscar</Text></Button> */}
    </View>
}



class MyModal extends Component {

    state = {
        valueFilter: "0",
        textFilter: ""
    }


    render() {
        const { textFilter, valueFilter } = this.state;
        const { open_modal, close_modal, data, onSearch, openRequest } = this.props;
        return (
            <Modal isVisible={open_modal} animationIn="slideInLeft" animationOut="slideOutRight" swipeDirection="right" onSwipe={close_modal} onBackButtonPress={close_modal} onBackdropPress={() => close_modal()} >
                <ModalContent openRequest={openRequest} data={data} close_modal={close_modal} />
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    accordion: {
        backgroundColor: "white"
    },
    modal_filter: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 22
    },
    profileThumbnail: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        // borderColor: "#ab47bc",
        borderColor: "#0086c3",
        borderWidth: 2
    },
    modal_titles: {
        fontWeight: "bold",
        // color: "#ab47bc"
        color: "#0086c3"
    },
    cardButtons: {
        // color: "#ab47bc"
        color: "#0086c3"
    },
    cardBorderButtons: {
        borderColor: "#0086c3"
    },
    modal_content: {
        paddingBottom: 50
    }
})

export default MyModal;