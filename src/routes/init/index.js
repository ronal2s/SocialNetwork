import React, { Component } from 'react'
import { Image, StyleSheet, View, Animated } from 'react-native'
import { DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Button, Icon, Container, Spinner } from 'native-base'
import iconBoy from '../../../assets/icons/boy.png'
import styles from '../../styles'
import SCREEN_IMPORT from 'Dimensions'
import { ROUTES, DEFAULTPHOTO } from '../../const';

const SCREEN_WIDTH = SCREEN_IMPORT.get('window').width;

const CardsPhotos = (props) => {
    const { data, myFriends, loading } = props;    
    let imageProfile = null;
    if(data.length > 0)
    {
        return data.map((v, i) => {
            imageProfile = myFriends[v.user].mainPhoto == ""? DEFAULTPHOTO: {uri: myFriends[v.user].mainPhoto};
            return (
                <Card transparent key={i} >
                    <CardItem style={{ backgroundColor: "#282828" }}>
                        <Left>
                            <Thumbnail style={{ width: 50, height: 50, borderRadius: 25 }} source={imageProfile} />
                            <Body>
                                <Text style={{ color: "gray" }} >{`@${v.user}`}</Text>
                            </Body>
                        </Left>
                    </CardItem >
                    <CardItem cardBody style={{ backgroundColor: "#282828" }}>
                        <Image source={{ uri: v.photo }} style={{ width: SCREEN_WIDTH, height: 300, resizeMode: "stretch" }} />
                    </CardItem>
                    <CardItem style={{ backgroundColor: "#282828" }}>
                        <Text note>
                            {v.description}
                        </Text>
                    </CardItem>
                    <CardItem style={{ backgroundColor: "#282828" }}>
                        <Left>
                            <Button transparent>
                                <Icon name="favorite-border" type="MaterialIcons" style={{ color: "gray" }} />
                                {/* Validar si ESTE usuario le dio like o no */}
                            </Button>
                            <Button transparent>
                                <Icon name="comment" type="MaterialCommunityIcons" style={{ color: "gray" }} />
                            </Button>
                        </Left>
                    </CardItem>
                </Card>
            )
        })
    }
    return <Spinner color="white"/>
}

class Employees extends Component {

    state = {
        x: new Animated.Value(100),
        posts: [], myFriends: {}, loading: false
    }

    componentDidMount() {

        this.slide();
        this.GetMyFriendsPosts();
    }

    GetMyFriendsPosts = async () => {
        let { auth, currentUser } = this.props;
        let { posts, myFriends } = this.state;
        this.setState({loading: true})
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
                        posts.sort((a, b) => new Date(b.date * -1) - new Date(a.date * -1))
                        this.setState({posts});
                        // snapshot.forEach(item => {
                            //     posts.push(item.val());
                            //     // this.setState({posts});
                            // })
                        })
                        //Ordenar por fecha
                    })
                }
                this.setState({myFriends, loading: false})
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

    render() {
        const { loading, posts, myFriends } = this.state;
        const { open_modal, close_modal, navigation, handlePages } = this.props;
        // console.log("TODO: ", this.state.posts)
        return (
            <Animated.ScrollView
                style={[{ transform: [{ translateX: this.state.x }], }, styles.DarkColorBackground]}>

                <CardsPhotos data={posts} myFriends={myFriends} loading={loading} />

            </Animated.ScrollView>
        )
    }
}



export default Employees;
