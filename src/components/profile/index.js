import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import { Grid, Row, Column, Button, Text, View, Thumbnail, Col } from "native-base";

import styles from "../../styles"
import DefaultPhoto from "../../../assets/icons/user.png";

class Profile extends Component {
    render() {
        const { user } = this.props;
        const image = user.mainPhoto == "" ? DefaultPhoto : { uri: user.mainPhoto };
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
                    {/* <Col /> */}
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
                <Row style={{justifyContent:"center", alignItems:"center"}} >
                <Button block style={styles.buttonPrimary}>
                    <Text style={styles.textWhite}>
                        enviar solicitud
                    </Text>
                </Button>
                </Row>
            </Grid>
        )
    }
}

export default Profile;