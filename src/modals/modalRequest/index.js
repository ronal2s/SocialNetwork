import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, DatePicker, Left, Body, Item, Input, Textarea, Label, Button, Thumbnail, Container, Icon} from 'native-base'
import Modal from 'react-native-modal'


const ModalContent = (props) => {
    const { data, close_modal, form, handleText } = props;
    
    return <View style={styles.modal_filter}>
        {/* <Text style={{ fontWeight: "bold", fontSize: 22, textAlign: "center" }} >Nombre de la persona</Text> */}
        <Left>
            <Thumbnail style={styles.profileThumbnail} source={{ uri: data.photo }} />
            <Body>
                <Text style={styles.cardTextTitle} >{data.first_name + " " + data.last_name}</Text>
                <Text note>{"Hora: RD$ 250"}</Text>
            </Body>
        </Left>
        <Container style={styles.modal_content} >
            <Text style={styles.textTotal} >
                {`Subtotal: RD$${form.subtotal} | Total: RD$${form.total}`}
            </Text>
            <Item fixedLabel>
                <Label>Seleccionar el día</Label>
                <DatePicker value={form.date} placeHolderText={form.date.toString().substr(4, 12)}
                    onDateChange={date => handleText("date", date)} />
            </Item>
            <Item stackedLabel>
                <Label>Hora</Label>
                <Input keyboardType="numeric" placeholder="Ej: 8.30 AM" value={form.time} onChangeText={text => handleText("time", text)} />
            </Item>
            <Item stackedLabel>
                <Label>Dirección</Label>
                <Textarea rowSpan={2} value={"Santiago De Los Caballeros\nLa Lotería, Calle 4, #2"} />
            </Item>
            <Item fixedLabel>
                <Label>Horas</Label>
                <Input keyboardType="decimal-pad" placeholder="Escriba una cantidad" onChangeText={text => handleText("workhours", text)} />
            </Item>
            <Item fixedLabel>
                <Label>Niños</Label>
                <Input value={form.kids.toString()} keyboardType="decimal-pad" placeholder="Escriba una cantidad" onChangeText={text => handleText("kids", text)} />
            </Item>
            {/* <Text style={styles.textTotal} >
                {`Precio por hora: RD$ 250 \n${form.subtotal}`}
            </Text> */}
        </Container>

        <Button transparent block bordered style={styles.cardBorderButtons} >
            <Icon name="checkmark-circle" style={styles.cardButtons} />
            <Text style={styles.cardButtons}>Solicitar</Text>
        </Button>
        {/* </Content> */}
        {/* <Button bordered rounded onPress={() => props.onSearch()} ><Text>Buscar</Text></Button> */}
    </View>
}

///.toString().substr(4, 12)

class MyModal extends Component {

    state = {
        form: { date: new Date(), time: "", workhours: 0, subtotal: 0, total: 0, kids: 0 }
    }

    handleText = (name, value) => {
        let { form } = this.state;
        form[name] = value;
        form.workhours = parseInt(form.workhours);

        if (name == "workhours") {
            if (form.workhours > 0) {
                form.workhours = form.workhours * 250;
                form.subtotal = form.workhours;
            } 
            else {
                form.subtotal = 0;
            }
        }
        if (name == "kids") {
            if (form.kids > 0 && form.kids <4) {                
                form.total = form.subtotal + (form.kids * 125);
            } 
            //Menor a 3 niños
            else if (form.kids > 3) {                
                form.total = form.subtotal + (3 * 125);
                form.kids = 3;
            }             
            else {
                form.total = form.subtotal;
            }
        }
        this.setState({ form });
    }

    render() {
        const { open_modal, close_modal, data, onSearch } = this.props;
        const {form} = this.state;
        return (
            <Modal isVisible={open_modal} animationIn="slideInLeft" animationOut="slideOutRight" swipeDirection="right" onSwipe={close_modal} onBackButtonPress={close_modal} onBackdropPress={() => close_modal()} >
                <ModalContent data={data} close_modal={close_modal} form={form} handleText={this.handleText} />
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
        paddingBottom: 120
    },
    textTotal: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#0086c3"
        // marginBottom: 10,
        // marginTop: 10,

    }
})

export default MyModal;