import { AppLoading, Asset, Linking } from 'expo';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Bubble, GiftedChat, SystemMessage } from 'react-native-gifted-chat';
// import Sentry from 'sentry-expo';

import AccessoryBar from './AccessoryBar';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import NavBar from './NavBar';
import messagesData from './data/messages';
import earlierMessages from './data/earlierMessages';
import Modal from 'react-native-modal';
import { ROUTES } from '../../const';

// Sentry.config('https://2a164b1e89424a5aafc186da811308cb@sentry.io/276804').install();

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
});

const filterBotMessages = (message) => !message.system && message.user && message.user._id && message.user._id === 2;
const findStep = (step) => (_, index) => index === step - 1;

// const user = {
//   _id: 1,
//   name: 'Developer',
// };

const otherUser = {
  _id: 2,
  name: 'React Native',
  avatar: 'https://facebook.github.io/react/img/logo_og.png',
};

const exampleData =
  [
    {
      "_id": "0de36dc4-3340-4727-88e9-28af651ae85b",
      "sent": true,
      "text": "Cvv",
      "user": {
        "_id": 1,
        "name": "Developer",
      },
    }
  ]

export default class App extends Component {

  state = {
    step: 0,
    // messages: exampleData,
    messages: [],
    loadEarlier: true,
    typingText: null,
    isLoadingEarlier: false,
  };

  _isMounted = false;

  async componentWillMount() {
    this._isMounted = true;
    // init with only system messages
    // this.setState({ messages: messagesData.filter((message) => message.system), appIsReady: true });
    this.setState({ appIsReady: true });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier = () => {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, earlierMessages),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  };

  onSend = (messagesSent = []) => {
    const step = this.state.step + 1;
    // this.setState((previousState) => {
    //   const sentMessages = [{ ...messages[0], sent: true, received: true }];
    //   return {
    //     messages: GiftedChat.append(previousState.messages, sentMessages),
    //     step,
    //   };
    // });
    let { messages } = this.state;
    let { auth, currentUser, friendUser } = this.props;
    const actualMessages = [{ ...messagesSent[0], sent: true }];
    let data = GiftedChat.append(messages, actualMessages)
    auth.app.database().ref(ROUTES.Mensajes).child(currentUser.user).child(friendUser.user).set(data, err => {
      if (!err) {
        this.setState({ messages: data })
      } else {
        alert("Un error ha ocurrido");
        console.log(err)
      }
    })
  };

  botSend = (step = 0) => {
    const newMessage = messagesData
      .reverse()
      .filter(filterBotMessages)
      .find(findStep(step));
    if (newMessage) {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, newMessage),
      }));
    }
  };

  parsePatterns = (linkStyle) => {
    return [
      {
        pattern: /#(\w+)/,
        style: { ...linkStyle, color: 'darkorange' },
        onPress: () => Linking.openURL('http://gifted.chat'),
      },
    ];
  };

  renderCustomView(props) {
    return <CustomView {...props} />;
  }

  onReceive = (text) => {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text,
          createdAt: new Date(),
          user: otherUser,
        }),
      };
    });
  };

  onSendFromUser = (messages = []) => {
    const createdAt = new Date();
    const messagesToUpload = messages.map((message) => ({
      ...message,
      user,
      createdAt,
      _id: Math.round(Math.random() * 1000000),
    }));
    this.onSend(messagesToUpload);
  };

  renderAccessory = () => <AccessoryBar onSend={this.onSendFromUser} />;

  renderCustomActions = (props) => {
    return <CustomActions {...props} onSend={this.onSendFromUser} />;
  };

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
      />
    );
  };

  renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  };

  renderFooter = (props) => {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      );
    }
    return null;
  };

  OnEntering = () => {
    this.GetMessages();
  }

  AppendMessages = (messages) => GiftedChat.append([], messages);

  GetMessages = () => {
    let { auth, currentUser, friendUser } = this.props;
    let { messages } = this.state;
    auth.app.database().ref(ROUTES.Mensajes).child(currentUser.user).child(friendUser.user).on("child_added", snapshot => {//En vez de value, child_added
      if (snapshot.exists()) {
        snapshot.forEach(item => {
          messages.push(item.val());
        })
        console.log("LA CRETA COÑO :)")
        this.AppendMessages([{
          "_id": "0de36dc4-3340-4727-88e9-28af651ae85b",
          "sent": true,
          "text": "Cvv",
          "user": {
            "_id": 1,
            "name": "Developer",
          },
        }])
        this.setState({ appIsReady: true, messages }, () => this.forceUpdate());
        // this.setState({ messages })
      } else {
        console.log("NO HAY MENSAJES CON: ", friendUser.user)
      }
    })
  }

  render() {
    const { open, close_modal, currentUser, friendUser } = this.props;
    const user = {
      _id: 1,
      name: 'Developer',
    };
    console.log("LOS MENSAJES: ", this.state.messages)
    if (!this.state.appIsReady) {
      return <AppLoading />;
    }
    return (
      <Modal isVisible={open} onBackButtonPress={close_modal} onBackdropPress={close_modal} style={{ margin: 0 }} onModalShow={this.OnEntering} >
        <View style={styles.container} accessible accessibilityLabel="main" testID="main">
          <NavBar friendUser={friendUser} />
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            // keyboardShouldPersistTaps="never"
            // loadEarlier={this.state.loadEarlier}
            // onLoadEarlier={this.onLoadEarlier}
            // isLoadingEarlier={this.state.isLoadingEarlier}
            // parsePatterns={this.parsePatterns}
            // user={{_id: currentUser.user, name: currentUser.user}}
            user={user}

          // renderBubble={this.renderBubble}
          // renderSystemMessage={this.renderSystemMessage}
          // renderCustomView={this.renderCustomView}

          />
        </View>
      </Modal>
    );
  }

}