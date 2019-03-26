import React, { Component } from "react";
import { Image, TouchableOpacity, ScrollView } from "react-native";
import { Grid, Row, Column, Button, Text, View, Thumbnail, Col, Card, CardItem } from "native-base";

import styles from "../../styles"
import DefaultPhoto from "../../../assets/icons/user.png";
import { SCREEN_WIDTH } from "../../const"

class Profile extends Component {
    render() {
        const { user, lastPosts, currentUser, OnSendRequest } = this.props;
        console.log("Usuario actual: ", currentUser.user, user.user)
        const image = user.mainPhoto == "" ? DefaultPhoto : { uri: user.mainPhoto };
        const onPressMyself = currentUser.user == user.user? () => alert("Así se ve tu perfil para desconocidos"): OnSendRequest;
        const buttonTitle = currentUser.user == user.user?"Información": "Enviar solicitud";
        return (
            <Grid>
                <Row>
                    <Col>
                        <View style={styles.profileView} >
                            <TouchableOpacity >
                                <Thumbnail style={[styles.SidebarProfileThumbnail]} source={image} />
                            </TouchableOpacity>
                            <Text style={styles.SidebarProfileLabel}>
                                {user.user.toUpperCase()}
                            </Text>
                        </View>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Text style={[styles.textWhite, { textAlign: "center" }]} >
                            {`Amigos\n${user.friends}`}
                        </Text>
                    </Col>
                    <Col>
                        <Text style={[styles.textWhite, { textAlign: "center" }]}>
                            {`Posts\n${user.posts}`}
                        </Text>
                    </Col>
                </Row>
                <Row style={{ justifyContent: "center", alignItems: "center" }} >
                    <Button block style={styles.buttonPrimary}  onPress={onPressMyself} >
                        <Text style={styles.textWhite}>
                            {buttonTitle}
                    </Text>
                    </Button>
                </Row>
                <Row>
                    {/* Validar el blur dependiendo si es mi amiga o no */}
                    <ScrollView>
                    {lastPosts != undefined && lastPosts.map((v, i) => {
                        return (
                            <Card transparent key={i} >
                                <CardItem cardBody style={{ backgroundColor: "#282828" }}>
                                    <Image blurRadius={20} source={{ uri: v.photo }} style={{ width: SCREEN_WIDTH, height: 300, resizeMode: "stretch" }} />
                                </CardItem>
                            </Card>
                        )
                    })}
                    </ScrollView>
                </Row>
            </Grid>
        )
    }
}

export default Profile;