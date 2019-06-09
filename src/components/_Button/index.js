import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon, Text, Spinner } from 'native-base'

export default class MyItem extends Component {
    Default = () => { }
    render() {
        const { width, marginTop, loading, paddingRight, iconName, text, full, iconLeft, info, danger, warning, color, onPress } = this.props;
        const _onPress = onPress ? onPress : this.Default;
        return (
            <Button onPress={_onPress} iconLeft={iconLeft} full={full} info={info} danger={danger} warning={warning}
                style={{ backgroundColor: color, marginTop, width, paddingRight }} >
                <Icon name={iconName} type="MaterialCommunityIcons" />
                {loading ? <Spinner color="white" /> :
                    <Text>{text}</Text>
                }
            </Button>
        )

    }
}
