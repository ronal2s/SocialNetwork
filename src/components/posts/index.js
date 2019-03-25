import React, { Component } from "react";
import { Image } from "react-native"
import { Card, CardItem, Left, Right, Body, Text, Button, Icon, Spinner } from "native-base"
import DefaultLoading from "../../../assets/loading2.gif"
const CardsPhotos = (props) => {
    const { data } = props;
    return data.map((v, i) => {
        console.log("QUE LO QUE PAZAAAAAA", v)
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
                </CardItem >
                <CardItem style={{ backgroundColor: "#282828" }}>
                    <Image source={{ uri: v.photo }} style={{ width: "100%", height: 300, }} 
                    // loadingIndicatorSource={DefaultLoading}
                    loadingIndicatorSource={<Spinner color="white"/>}
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
        const { data } = this.props;
        return (
            <CardsPhotos data={data} />
        )
    }
}

export default Posts;