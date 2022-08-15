import React from 'react';
import {SafeAreaView, StyleSheet, Text, Pressable} from 'react-native';

function LaunchScreen({navigation}) {
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 28, fontWeight: 'bold'}}>
        Welcome to Card Game
      </Text>
      <Pressable
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('GameScreen')}>
        <Text style={styles.buttonText}>Start Game</Text>
      </Pressable>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    borderRadius: 30,
    backgroundColor: '#1890ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default LaunchScreen;
