import React, { Component } from 'react'
import { Image, StyleSheet, View, Animated, Linking, TouchableOpacity } from 'react-native'
import { DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Button, Icon, Container, Spinner } from 'native-base'
import ModalComments from "../../modals/modalComments";
import styles from '../../styles'
import SCREEN_IMPORT from 'Dimensions'
import { ROUTES, DEFAULTPHOTO } from '../../const';
import NoPosts from "../../../assets/photo.png"

const SCREEN_WIDTH = SCREEN_IMPORT.get('window').width;


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
    const { data, myFriends, loading, OnOpenComments, OpenMap } = props;
    let imageProfile = null;
    let haveLocation = null;
    if (!loading) {
        return data.length > 0? data.map((v, i) => {
            imageProfile = myFriends[v.user].mainPhoto == "" ? DEFAULTPHOTO : { uri: myFriends[v.user].mainPhoto };
            haveLocation = v.location != "" && v.location != undefined;
            return (
                <Card transparent key={i} >
                    <CardItem style={{ backgroundColor: "#282828" }}>
                        <Left>
                            <Thumbnail style={{ width: 50, height: 50, borderRadius: 25 }} source={imageProfile} />
                            <Body>
                                <Text style={{ color: "gray" }} >{`@${v.user}`}</Text>
                            </Body>
                        </Left>
                        <Right>
                            <Text note>
                                {new Date(v.date * -1).toLocaleDateString()}
                            </Text>
                        </Right>
                    </CardItem >
                    <CardItem cardBody style={{ backgroundColor: "#282828" }}>
                        <Image progressiveRenderingEnabled source={{ uri: v.photo }} style={{ width: SCREEN_WIDTH, height: 300, resizeMode: "stretch" }} />
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
                            <Button transparent onPress={() => alert("No disponible en este demo")} >
                                <Icon name="favorite-border" type="MaterialIcons" style={{ color: "gray" }} />
                                <Text style={{color: "gray"}}>
                                Me gusta
                                </Text>
                                {/* Validar si ESTE usuario le dio like o no */}
                            </Button>
                            <Button transparent onPress={() => OnOpenComments(v)} >
                                <Icon name="comment" type="MaterialCommunityIcons" style={{ color: "gray" }} />
                                <Text style={{color: "gray"}}>
                                    Comentarios
                                </Text>
                            </Button>
                        </Left>
                    </CardItem>
                </Card>
            )
        }): <NoContent/>
    }
    return <Spinner color="white" />
}

class Employees extends Component {

    state = {
        x: new Animated.Value(100),
        posts: [], myFriends: {}, 
        loading: false, commentsVisible: false, actualPost: null
    }

    componentDidMount() {

        this.slide();
        this.GetMyFriendsPosts();
    }

    GetMyFriendsPosts = async () => {
        let { auth, currentUser } = this.props;
        let { posts, myFriends } = this.state;
        this.setState({ loading: true })
        auth.app.database().ref(ROUTES.Amigos).child(currentUser.user).once("value", snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(item => {
                    //Creando un objeto completo de más objetos
                    myFriends[item.val().user] = item.val();
                })

                //Ahora a buscar los posts de cada amigo
                let postRef = auth.app.database().ref(ROUTES.Posts)
                Object.keys(myFriends).forEach((userKey, i) => {
                    postRef.child(userKey).orderByChild("date").on("child_added", snapshot => {
                        posts.push(snapshot.val())
                        //Ordenar por fecha
                        posts.sort((a, b) => new Date(b.date * -1) - new Date(a.date * -1))
                        this.setState({ posts });                        
                    })
                })
            }
            setTimeout(() => this.setState({ myFriends, loading: false }), 2000)
            
            console.log(posts)
        })
    }



    slide = () => {
        Animated.spring(this.state.x, {
            toValue: 0,
        }).start();
    };


    static navigationOptions = {
        header: null
    }
    _card = el => {
        console.log('Card: ' + el.name)
    };

    OnOpenComments = (post) =>
    {
        let { actualPost } = this.state;
        actualPost = post;
        this.setState({commentsVisible: true, actualPost})
    }

    OnCloseComments = () =>
    {
        this.setState({commentsVisible: false})
    }
    OpenMap = (location) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        Linking.openURL(`http://maps.google.com/?q=${latitude},${longitude}`)
    }
    render() {
        const { loading, posts, actualPost, myFriends, commentsVisible } = this.state;
        const { open_modal, close_modal, navigation, handlePages,currentUser, auth } = this.props;
        // console.log("TODO: ", this.state.posts)
        return (
            <Animated.ScrollView
                style={[{ transform: [{ translateX: this.state.x }], }, styles.DarkColorBackground]}>

                <CardsPhotos data={posts} myFriends={myFriends} loading={loading} OnOpenComments={this.OnOpenComments} OpenMap={this.OpenMap} />
                <ModalComments open={commentsVisible} close_modal={this.OnCloseComments} auth={auth} post={actualPost} currentUser={currentUser} />
            </Animated.ScrollView>
        )
    }
}



export default Employees;
