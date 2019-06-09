import React, { Component, PureComponent } from "react"
import { Image, AsyncStorage } from "react-native"
import { View, Spinner, Text } from "native-base"
import LogoIcon from "../../../assets/logo.png"
import { LinearGradient, Constants, } from "expo"
import styles from "../../styles"
export default class Loading extends PureComponent {

    render() {
        const { handlePages, auth } = this.props;
        console.log(auth)
        return (
            // <LinearGradient
            //     colors={['red', '#232323', '#282828']}
            //     style={styles.loginMain}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>                
                    <Image source={LogoIcon} width={100} height={100} />
                    <Spinner color="#232323" />
                </View>
            // {/* </LinearGradient> */}
        )
    }
}