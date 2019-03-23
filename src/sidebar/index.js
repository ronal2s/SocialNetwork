import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground } from 'react-native'
import { Container, Content, Icon, List, ListItem, Thumbnail, Button, Left, Right, Grid, Col, Row, Body } from 'native-base'
import styles from '../styles'

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
        const { handlePages, screen } = this.props;
        return <Container style={[styles.SidebarBkg, { flex: 1 }]} >
            <View style={styles.SidebarProfileView} >
                <Thumbnail style={[styles.SidebarProfileThumbnail]} source={{ uri: "https://scontent.fsti1-1.fna.fbcdn.net/v/t1.0-1/p160x160/48969897_1062476723957480_5734202762351083520_n.jpg?_nc_cat=111&_nc_ht=scontent.fsti1-1.fna&oh=2498b9bfc458f6190da55c6dbf09be4c&oe=5CF265BB" }} />
                <Text style={styles.SidebarProfileLabel}>Renys De La Cruz</Text>
                {/* <Text note style={{color: "white"}} >Billetera RD$: 3,500.00</Text> */}
            </View>
            <Content style={styles.sidebarItems} >
                <List>
                    <MyListItem props={this.props} name="Inicio"/>
                    
                    <ListItem style={styles.divider} itemDivider>
                        <Text style={styles.listTextUnselected} >Ajustes</Text>
                    </ListItem>                    
                    <MyListItem props={this.props} name="Cerrar sesión"/>

                </List>
            </Content>
        </Container>

    }
}

export default SideBar;

