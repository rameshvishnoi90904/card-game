import {AppRegistry} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import {name as appName} from './app.json';
import AppNavigator from './src/AppNavigator';

const App = () => {
    return(
        <NavigationContainer>
            <AppNavigator/>
        </NavigationContainer>
    )
} 
AppRegistry.registerComponent(appName, () => App);
