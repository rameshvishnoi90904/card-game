import React, {useRef, useEffect} from 'react';
import {StyleSheet, Text, Pressable, Animated} from 'react-native';

const Card = ({testID, value, isFlipped, onClick, isDisabled, isInactive}) => {
  const progress = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(0);
  useEffect(() => {
    const handler = ({value}) => {
      progressValue.current = Math.round(value);
    };
    progress.addListener(handler);
    return () => {
      progress.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    if (!(isFlipped || isInactive) && progressValue.current == 180) {
      Animated.spring(progress, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: false,
      }).start();
    }
  }, [isFlipped, isInactive]);

  const onClickHandler = () => {
    if (!isFlipped && !isDisabled) {
      onClick();
      Animated.spring(progress, {
        toValue: !isFlipped ? 180 : 0,
        friction: 8,
        tension: 10,
        useNativeDriver: false,
      }).start();
    }
  };

  const frontInterpolate = progress.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  const backInterpolate = progress.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const frontAnimatedStyle = {
    transform: [{rotateY: frontInterpolate}],
  };

  const backAnimatedStyle = {
    transform: [{rotateY: backInterpolate}],
  };
  return (
    <Pressable
      style={styles.cardWrapper}
      onPress={onClickHandler}
      testID={testID}>
      <Animated.View
        style={[styles.cardContainer, styles.cardFront, frontAnimatedStyle]}>
        <Text style={styles.cardText}>{value}</Text>
      </Animated.View>

      <Animated.View
        style={[styles.cardContainer, styles.cardBack, backAnimatedStyle]}>
        <Text style={styles.cardText}>?</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: 120,
    height: 140,
    marginTop: 8,
    borderRadius: 8,
  },
  cardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 8,
  },
  cardFront: {
    backgroundColor: '#f97316',
  },
  cardBack: {
    backgroundColor: 'rgb(80,80,80)',
  },
  flipCard: {
    transform: [{rotateY: '180deg'}],
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Card;
