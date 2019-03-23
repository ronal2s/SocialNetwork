import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Container, Header, Left, Right, Body, Button, Icon, Title } from 'native-base'
import styles from '../styles'
class HeaderContainer extends Component {
    render() {
        const { open, showSearcher, openModal } = this.props;
        return (
            <Header style={styles.header} noShadow>
                <Left>
                    <Button transparent onPress={() => open()} >
                        <Icon style={styles.headerIcon} name="menu" />
                    </Button>
                </Left>
                <Body >
                    <Title style={[styles.headerTitle, {marginLeft: showSearcher? 100: 100}]}>Inicio</Title>
                </Body>
                {showSearcher ?
                    <Right>
                        <Button transparent onPress={() => openModal()}>
                            <Icon name="search" style={styles.icons} />
                        </Button>
                    </Right> : <Right />
                }
            </Header>
        )
    }
}

export default HeaderContainer;