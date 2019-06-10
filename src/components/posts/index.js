import React, { Component } from "react";
import { Image, ScrollView, TouchableOpacity, Linking } from "react-native"
import { Card, CardItem, Left, Right, Body, Text, Button, Icon, Spinner, View, Container, Thumbnail } from "native-base"
import { SCREEN_WIDTH } from "../../const"
import styles from "../../styles";
import NoPosts from "../../../assets/photo.png"

//Recordar hacer esto un componente
const NoContent = (props) => {
    const { searchedUser } = props;
    if (!searchedUser) {
        return (
            <Container style={styles.containerCentered} >
                <View >
                    <Thumbnail square style={{width: 100, height: 100}} source={NoPosts} />
                    <Text style={styles.textWhite} >
                        Sin contenido
                    </Text>
                </View>
            </Container>
        )
    }
    return <Text />
}

const CardsPhotos = (props) => {
    const { data, OnDeletePost, currentUser, OnOpenComments, OpenMap } = props;
    let haveLocation = null;
    
    return data.length > 0? data.map((v, i) => {
        haveLocation = v.location != "" && v.location != undefined;
        return (
            <Card transparent key={i} >
                <CardItem style={{ backgroundColor: "#282828" }}>
                    <Left>
                        {/* <Thumbnail style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: v.photo }} /> */}
                        <Body>
                            <Text style={{ color: "gray" }} >
                                {`@${v.user}`}
                            </Text>
                        </Body>
                    </Left>
                    <Right>
                        <Button transparent onPress={() => OnDeletePost(v.date)} >
                            <Icon name="delete" style={{ color: "gray" }} type="MaterialCommunityIcons" />
                        </Button>
                    </Right>
                </CardItem >
                <CardItem cardBody style={{ backgroundColor: "#282828" }}>
                    <Image source={{ uri: v.photo }} style={{ width: SCREEN_WIDTH, height: 300, resizeMode: "stretch" }}
                        // loadingIndicatorSource={DefaultLoading}
                        progressiveRenderingEnabled={true}
                    // loadingIndicatorSource={<Spinner color="white"/>}
                    />
                </CardItem>
                <CardItem style={{ backgroundColor: "#282828" }}>
                    <View>
                        <Text note>
                            {v.description}
                        </Text>
                        {haveLocation && <TouchableOpacity onPress={() => OpenMap(v.location)}>
                            <Text style={styles.textWhite}>
                                Mostrar ubicación
                            </Text>
                        </TouchableOpacity>}
                      
                    </View>
                </CardItem>                
                <CardItem style={{ backgroundColor: "#282828" }}>
                    <Left>
                        <Button transparent>
                            <Icon name="favorite-border" type="MaterialIcons" style={{ color: "gray" }} />
                            <Text style={{ color: "gray" }}>
                                Me gusta
                                </Text>
                        </Button>
                        <Button transparent onPress={() => OnOpenComments(v)} >
                            <Icon name="comment" type="MaterialCommunityIcons" style={{ color: "gray" }} />
                            <Text style={{ color: "gray" }}>
                                Comentarios
                                </Text>
                        </Button>
                    </Left>
                </CardItem>
            </Card>
        )
    }): <NoContent/>
}



class Posts extends Component {
    state =
        {
            showingMapView: false
        }
    OpenMap = (location) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        Linking.openURL(`http://maps.google.com/?q=${latitude},${longitude}`)
    }
    render() {
        const { data, OnDeletePost, OnOpenComments } = this.props;
        const { showingMapView } = this.state;
        return (
            <ScrollView>
                <CardsPhotos data={data} OnDeletePost={OnDeletePost} OnOpenComments={OnOpenComments} showingMapView={showingMapView} OpenMap={this.OpenMap} />
            </ScrollView>
        )
    }
}

export default Posts;