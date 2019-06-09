import { Permissions, Location, ImagePicker, Linking } from 'expo';

import { Alert } from 'react-native';

export default async function getPermissionAsync(permission) {
  const { status } = await Permissions.askAsync(permission);
  if (status !== 'granted') {
    const { name } = Constants.manifest;
    const permissionName = permission.toLowerCase().replace('_', ' ');
    Alert.alert(
      'Cannot be done 😞',
      `If you would like to use this feature, you'll need to enable the ${permissionName} permission in your phone settings.`,
      [
        {
          text: "Let's go!",
          onPress: () => Linking.openURL('app-settings:'),
        },
        { text: 'Nevermind', onPress: () => {}, style: 'cancel' },
      ],
      { cancelable: true },
    );

    return false;
  }
  return true;
}
