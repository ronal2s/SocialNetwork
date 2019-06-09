import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Container, Header, Left, Right, Body, Button, Icon, Title } from 'native-base'
import styles from '../styles'
class HeaderContainer extends Component {
    render() {
        const { screen, OnOpenMessages } = this.props;
        return (
            <Header style={styles.header} noShadow>
                <Left>
                    <Icon name="alpha-l-box" type="MaterialCommunityIcons" style={styles.textWhite} />
                </Left>
                <Body >
                    <Title style={[styles.headerTitle]}>
                        {screen}
                    </Title>
                </Body>
                <Right>
                    <TouchableOpacity onPress={OnOpenMessages}>
                        <Icon name="comment" type="MaterialCommunityIcons" style={styles.textWhite} />
                    </TouchableOpacity>
                </Right>
            </Header>
        )
    }
}

export default HeaderContainer;