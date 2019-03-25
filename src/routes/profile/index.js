import React, { Component } from "react";
import { Text, Spinner } from "native-base";
import { ScrollView } from "react-native"

import Posts from "../../components/posts"

class Profile extends Component {
    state =
        {
            posts: [],
            loading: true
        }

    async componentWillMount() {
        // this.getSnapshotBeforeUpdate()
        this.GetMyPosts();
    }

    GetMyPosts = async () => {
        const { auth, currentUser } = this.props;
        let { posts } = this.state;
        auth.app.database().ref("/POSTS").child(currentUser.usuario).orderByChild("date").on("value", (snapshot) => {
            let dataFirebase = [];
            //Convirtiendo la data a un array, proque me lo da en objetos {objeto1: {}, objeto2:{}}
            var newItem = null;
            snapshot.forEach(item => {
                newItem = item.val();
                // newItem.key = item.key;
                //Agregando los actionButtons                
                dataFirebase.push(newItem);
            })            
            this.setState({ posts: dataFirebase, loading: false })
            console.log(dataFirebase)
        })
    }

    render() {
        const { auth, currentUser } = this.props;
        const { posts, loading } = this.state;
        return (

            <ScrollView>
                {loading && <Spinner color="white"/>}
                <Posts data={posts} />
            </ScrollView>

        )
    }
}

export default Profile;