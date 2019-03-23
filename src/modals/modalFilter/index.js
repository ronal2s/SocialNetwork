import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Input, Item, Picker, Icon, Form, Button } from 'native-base'
import Modal from 'react-native-modal'


const FilterContent = (props) => {
    return <View style={styles.modal_filter}>
        <Text style={styles.titles} >Filtro de búsqueda</Text>
        <Item picker rounded>
            <Picker

                mode="dropdown"
                placeholder="Seleccionar"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={props.valueFilter}
                onValueChange={props.handlePicker}
            >
                {props.data.map((v, i) => {
                    return <Picker.Item key={i} label={v} value={i}/>
                })}
                <Picker.Item label="Seleccionar" value="0"/>                
            </Picker>
        </Item>
        <Form style={{marginTop: 10, marginBottom: 10}} >
            <Item rounded>
                <Input value={props.textFilter} placeholder="Buscar" onChangeText={(text) => props.handleText(text)} />
            </Item>
        </Form>
            <Button style={styles.button} block bordered rounded onPress={() => props.onSearch()} >
                <Text style={styles.button}>Buscar</Text>
            </Button>
    </View>
}



class Employees extends Component {

    state = {        
        valueFilter: "0",
        textFilter:""
    }

    handlePicker = (value: string) =>
    {
        this.setState({valueFilter: value})
    }
    

    handleText = (text) =>
    {
        this.setState({textFilter: text})
    }

    render() {
        const { textFilter, valueFilter } = this.state;
        const { open_modal, close_modal, data, onSearch } = this.props;
        return (
                <Modal isVisible={open_modal} animationIn="slideInLeft" animationOut="slideOutRight" swipeDirection="right" onSwipe={close_modal} onBackButtonPress={close_modal} onBackdropPress={() => close_modal()} >
                    <FilterContent textFilter={textFilter} onSearch={() => onSearch(textFilter, valueFilter)} data={data} valueFilter={valueFilter} handleText={this.handleText} handlePicker={this.handlePicker} />
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
    accordion: {
        backgroundColor: "white"
    },
    modal_filter: {
        ////// flex: 1,
        backgroundColor: "white",
        borderRadius: 4,
        padding: 22
    },
    button: {
        color: "#0086c3"
    },
    titles: {
        fontWeight: "bold", 
        fontSize: 22, 
        textAlign: "center",
        color: "#0086c3"
    }
})

export default Employees;