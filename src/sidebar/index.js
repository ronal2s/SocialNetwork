import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, TouchableOpacity } from 'react-native'
import { Container, Content, Icon, List, ListItem, Thumbnail, Button, Left, Right, Grid, Col, Row, Body, Spinner } from 'native-base'
import styles from '../styles'
import DefaultPhoto from "../../assets/icons/user.png";
// import DefaultPhoto from "../../assets/loading.gif";
const MyListItem = (globalProps) => {

    const { props, name } = globalProps;
    return <ListItem button itemDivider={false} noIndent style={props.screen == name ? styles.listItemSelected : styles.listItemUnselected} onPress={() => props.handlePages(name)}>
        <Left>
            <Text style={props.screen == name ? styles.listTextSelected : styles.listTextUnselected} >{name}</Text>
        </Left>
        <Right>
            <Icon name="arrow-forward" />
        </Right>
    </ListItem>
}

class SideBar extends Component {
    render() {
        const { handlePages, screen, currentUser, OnChangeProfilePhoto, isUploadingPhoto } = this.props;
        const ProfileImg = currentUser.fotoPrincipal == "" ? DefaultPhoto : { uri: currentUser.fotoPrincipal };
        console.log("FOTOOO: ", currentUser.fotoPrincipal)
        return <Container style={[styles.SidebarBkg, { flex: 1 }]} >
            <View style={styles.SidebarProfileView} >
                <TouchableOpacity onPress={OnChangeProfilePhoto}>
                    <Thumbnail style={[styles.SidebarProfileThumbnail]} source={ProfileImg} />
                </TouchableOpacity>
                <Text style={styles.SidebarProfileLabel}>
                    {currentUser.usuario.toUpperCase()}
                </Text>
                {isUploadingPhoto && <Spinner color="white" />}
                {/* <Text note style={{color: "white"}} >Billetera RD$: 3,500.00</Text> */}
            </View>
            <Content style={styles.sidebarItems} >
                <List>
                    <MyListItem props={this.props} name="Inicio" />

                    <ListItem style={styles.divider} itemDivider>
                        <Text style={styles.listTextUnselected} >Ajustes</Text>
                    </ListItem>
                    <MyListItem props={this.props} name="Cerrar sesión" />

                </List>
            </Content>
        </Container>

    }
}

export default SideBar;

