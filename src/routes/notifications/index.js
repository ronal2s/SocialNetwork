import React, { Component } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Text, Right, Left, Body, List, ListItem, Button, Thumbnail, Footer, FooterTab, Textarea, Form, Input, Spinner, Icon, View } from 'native-base'
import styles from "../../styles"
import { ROUTES, DEFAULTPHOTO } from '../../const';

//Nuevas fotos
const MainContent = (props) => {
    const { data, loading, } = props;
    let imageProfile = null;
    if (!loading) {
        if (data.length > 0) {
            return data.map((v, i) => {
                imageProfile = v.mainPhoto == "" ? DEFAULTPHOTO : { uri: v.mainPhoto }
                return (
                    <ListItem key={i} avatar noBorder >
                        <Left>
                            <Thumbnail source={imageProfile} />
                        </Left>
                        <Body>
                            <Text style={styles.textWhite}>{v.msj}</Text>
                        </Body>
                        <Right>
                            <Text note>
                                {new Date(v.date * -1).toLocaleDateString()}
                            </Text>
                        </Right>
                    </ListItem>
                )
            })
        }
        else {
            return <Text style={[styles.textWhite, { textAlign: "center" }]} >Sin notificaciones</Text>
        }
    }

    return <Spinner color="white" />


}



class MyNoti extends Component {

    state =
        {
            notifications: [],
            loading: true
        }

    componentWillMount() {
        this.getData();
    }

    getData = () => {
        let { auth, post, currentUser } = this.props;
        let { notifications, loading } = this.state;
        this.setState({ loading: true, notifications: [] })

        auth.app.database().ref(ROUTES.Notificaciones).child(currentUser.user).orderByChild("date").on("value", snapshot => {
            if (snapshot.exists()) {
                notifications = [];
                snapshot.forEach(item => {
                    notifications.push(item.val())
                })
                this.setState({ notifications, loading: false })
            } else {
                this.setState({ loading: false, notifications: [] })
            }
        })

    }


    render() {
        const { auth, currentUser } = this.props;
        const { notifications, loading, } = this.state;
        return (
            <List>
                <MainContent data={notifications} loading={loading} />
                {/* <Text>ASDA</Text> */}
            </List>
        )
    }
}

export default MyNoti;