/* eslint jsx-a11y/accessible-emoji: 0 */
import React from 'react';
import { Text } from 'react-native';
import NavBar, { NavTitle, NavButton } from 'react-native-nav';
import { Constants } from 'expo';

export default function NavBarCustom(props) {
  const name = props.friendUser == undefined? "" : props.friendUser.user;
  return (
    <NavBar>
      <NavButton />
      <NavTitle>
        💬 {name}
      </NavTitle>
      <NavButton />
    </NavBar>
  );
}