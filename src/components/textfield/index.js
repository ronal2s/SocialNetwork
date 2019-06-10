import React, { Component } from "react";
import { Item, Input } from "native-base";
import styles from "../../styles"

class TextField extends Component {
    render() {
        const { onChangeText, name, placeholder, nextInput, password, appearance, keyboardType, returnKeyType,autoCapitalize } = this.props;
        return (
            <Item rounded style={styles.RegisterItemsForm} >
                <Input secureTextEntry={password} keyboardAppearance={appearance}
                    onChangeText={(text) => onChangeText(name, text)} placeholder={placeholder} 
                    keyboardType={keyboardType} autoCapitalize={autoCapitalize} returnKeyType={returnKeyType}
                    onSubmitEditing={nextInput}
                    />
            </Item>
        )
    }
}

export default TextField;