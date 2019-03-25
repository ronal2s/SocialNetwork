import React, { Component } from "react";
import { Image } from "react-native"
import { Card, CardItem, Left, Right, Body, Text, Button, Icon, Spinner } from "native-base"
import DefaultLoading from "../../../assets/loading2.gif"
import { SCREEN_WIDTH } from "../../const"
const CardsPhotos = (props) => {
    const { data, OnDeletePost, currentUser } = props;
    return data.map((v, i) => {
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
                            <Icon name="delete" style={{color: "gray"}} type="MaterialCommunityIcons" />
                        </Button>
                    </Right>
                </CardItem >
                <CardItem cardBody style={{ backgroundColor: "#282828" }}>
                    <Image source={{ uri: v.photo }} style={{ width: SCREEN_WIDTH, height: 300, resizeMode:"stretch"}} 
                    // loadingIndicatorSource={DefaultLoading}
                    progressiveRenderingEnabled={true}
                    // loadingIndicatorSource={<Spinner color="white"/>}
                    />                    
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


class Posts extends Component {    

    render() {
        const { data, OnDeletePost } = this.props;
        return (
            <CardsPhotos data={data} OnDeletePost={OnDeletePost} />
        )
    }
}

export default Posts;