import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LaunchScreen from './screen/LaunchScreen';
import GameScreen from './screen/GameScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Home" component={LaunchScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} options={{ title: '' }}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;