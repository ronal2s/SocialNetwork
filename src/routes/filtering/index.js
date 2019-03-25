import React, { Component } from "react";
import { ScrollView, Image } from "react-native";
import { View, List, ListItem, Thumbnail, Text, Item, Input, Icon, Container, Content } from "native-base";

import styles from "../../styles"
import IconSearch from "../../../assets/icons/user.png"
import Profile from "../../components/profile"

const NoContent = (props) => {
    const { searchedUser } = props;
    if (!searchedUser) {
        return (
            <Container style={styles.containerCentered} >
                <View >
                    <Thumbnail style={[styles.SidebarProfileThumbnail]} source={IconSearch} />
                    <Text style={styles.textWhite} >
                        Sin contenido
                    </Text>
                </View>
            </Container>
        )
    }
    return <Text />
}

class Filtering extends Component {
    state =
        {
            searchedUser: null,
            filterText: ""
        }

    OnSearchPress = () => {
        const { auth } = this.props;
        let { searchedUser, filterText } = this.state;

        auth.app.database().ref("/USUARIOS").orderByChild("user").equalTo(filterText).on("value", (snapshot) => {
            if (snapshot.exists()) {

                let key = Object.keys(snapshot.val())[0];
                console.log(key)
                searchedUser = snapshot.val()[key]
                // console.log("USUARIO: ", searchedUser[key]);
                console.log("USUARIO: ", searchedUser);
            } else {
                searchedUser = null;
            }
            this.setState({ searchedUser });
        })

    }

    handleText = (value) => {
        let { filterText, searchedUser } = this.state;
        if (value[value.length - 1] != ' ') {
            this.setState({ filterText: value, searchedUser });
        }
    }

    render() {
        const { auth } = this.props;
        const { searchedUser, filterText } = this.state;
        console.log(searchedUser)
        return (
            <ScrollView >
                {/* <Item style={{ borderBottomWidth: 0 }} > */}
                <Content padder>
                    <Item style={{ borderBottomColor: "gray" }} >
                        <Icon name="search" style={styles.textWhite} />
                        <Input value={filterText} placeholder="Buscar" autoCapitalize="none" style={styles.textWhite}
                            onChangeText={this.handleText} onSubmitEditing={this.OnSearchPress} />
                    </Item>
                </Content>
                {searchedUser && <Profile user={searchedUser} />}
                <NoContent searchedUser={searchedUser} />
            </ScrollView>
        )
    }
}

export default Filtering;