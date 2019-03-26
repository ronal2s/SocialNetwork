import React, { Component } from "react";
import { Text, Spinner, Grid, Col, Row, Button, Content, List, Header, Left, Body, Right, Icon, Title, Footer, FooterTab, } from "native-base";
import { ScrollView, Image, TouchableOpacity, View, Alert, StatusBar } from "react-native";
import Modal from "react-native-modal";
import { DEFAULTPHOTO, DATAMODAL, ROUTES } from "../../const";
import styles from "../../styles";
import Posts from "../../components/posts";



const ProfileHeader = (props) => {
    const { currentUser, dataNumbers } = props;
    const image = currentUser.mainPhoto == "" ? DEFAULTPHOTO : { uri: currentUser.mainPhoto }

    return (
        <Grid>
            <Row>
                <Col >
                    <TouchableOpacity onPress={() => alert("aun nada")} >
                        <Image source={image} style={styles.SidebarProfileThumbnail} />
                    </TouchableOpacity>
                </Col>
                <Grid style={{ marginLeft: -150 }} >
                    <Row>
                        <Col style={{ justifyContent: "center", alignItems: "center" }} >
                            <Text style={styles.textWhite} >
                                {currentUser.user.toUpperCase()}
                            </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TouchableOpacity>
                                <Text style={[styles.textWhite, { textAlign: "center" }]} >
                                    {`${dataNumbers.postsNumber}\nPost`}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                        <Col >
                            <TouchableOpacity>
                                <Text style={[styles.textWhite, { textAlign: "center" }]} >
                                    {`${dataNumbers.friendsNumber}\nAmigos`}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                </Grid>
            </Row>
        </Grid>
    )
}





class Profile extends Component {
    state =
        {
            posts: [], friends: [],

            dataNumbers: { requestsNumber: 0, friendsNumber: 0, postsNumber: 0 },
            loading: true,
        }

    GetMyPosts = async () => {
        const { auth, currentUser } = this.props;
        let { dataNumbers } = this.state;
        auth.app.database().ref(ROUTES.Posts).child(currentUser.user).orderByChild("date").on("value", (snapshot) => {
            let dataFirebase = [];
            //Convirtiendo la data a un array, proque me lo da en objetos {objeto1: {}, objeto2:{}}
            var newItem = null;
            snapshot.forEach(item => {
                newItem = item.val();
                // newItem.key = item.key;
                //Agregando los actionButtons                
                dataFirebase.push(newItem);
            })
            dataNumbers.postsNumber = dataFirebase.length;
            this.setState({ posts: dataFirebase, dataNumbers, loading: false })
        })
    }


    GetMyFriends = async () => {
        const { auth, currentUser } = this.props;
        let { friends, dataNumbers } = this.state;
        friends = [];
        let newItem = null;
        auth.app.database().ref(ROUTES.Amigos).child(currentUser.user).on("value", snapshot => {
            snapshot.forEach(item => {
                newItem = item.val();
                friends.push(newItem);
            });
            dataNumbers.friendsNumber = friends.length;
            this.setState({ friends, dataNumbers });
        });
    }

    getData = () => {
        this.GetMyPosts();
        this.GetMyFriends();
    }

    render() {
        const { currentUser, open, close_modal } = this.props;
        const { posts, loading, dataNumbers } = this.state;
        return (
            <Modal isVisible={open} onModalShow={this.getData} animationIn="slideInLeft" animationOut="slideOutRight"
                onBackButtonPress={close_modal} onBackdropPress={close_modal} style={[styles.modalDark, { margin: 0 }]} >
                {/* <View>                     */}

                    <ScrollView>
                        <Content>
                            <ProfileHeader dataNumbers={dataNumbers} currentUser={currentUser} />
                        </Content>
                        {loading && <Spinner color="white" />}
                        {/* <ScrollView> */}
                        <Posts data={posts} OnDeletePost={this.OnDeletePostAlert} />
                    </ScrollView>
                    <Footer>
                        <FooterTab>
                            <Button style={styles.buttonPrimary} onPress={close_modal} >
                                <Text style={styles.textWhite}>
                                    Atrás
                                </Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                {/* </View> */}
            </Modal>

        )
    }
}

export default Profile;