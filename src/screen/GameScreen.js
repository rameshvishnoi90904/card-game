import React, {useState, useEffect, useRef, useReducer} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  View,
  Modal,
  Pressable,
} from 'react-native';
import Card from '../components/Card';
import reducer from '../reducer.js';

function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
function shuffleCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currIndex = i - 1;
    swap(array, currIndex, randomIndex);
  }
  return array;
}

function init(initialCount) {
  return {count: initialCount};
}

const GameScreen = ({navigation}) => {
  const [state, dispatch] = useReducer(reducer, 0, init);
  const CARD_PAIRS_VALUE = 6;
  const [uniqueCardsArray, setUniqueCardsArray] = useState([]);
  const [cards, setCards] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const timeout = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);

  useEffect(() => {
    let list = [];
    while (list.length < CARD_PAIRS_VALUE) {
      let value = Math.floor(Math.random() * 100 + 1);
      if (list.indexOf(value) == -1) {
        list.push(value);
      }
    }

    setUniqueCardsArray(list);
    setCards(() => shuffleCards(list.concat(list)));
  }, []);

  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first] === cards[second]) {
      setClearedCards(prev => ({...prev, [cards[first]]: true}));
      setOpenCards([]);
      return;
    }
    // Flip cards after a 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };

  useEffect(() => {
    if (openCards.length === 2) {
      setTimeout(evaluate, 1000);
    }
  }, [openCards]);
  useEffect(() => {
    if (uniqueCardsArray.length > 0) {
      checkCompletion();
    }
  }, [clearedCards]);

  const checkIsFlipped = index => {
    return openCards.includes(index);
  };

  const checkIsInactive = card => {
    return Boolean(clearedCards[card]);
  };

  const handleCardClick = index => {
    // Have a maximum of 2 items in array at once.
    if (openCards.length === 1) {
      setOpenCards(prev => [...prev, index]);
      // increase the moves once we opened a pair
      dispatch({type: 'increment'});
      disable();
    } else {
      // If two cards are already open, we cancel timeout set for flipping cards back
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  const checkCompletion = () => {
    // We are storing clearedCards as an object since its more efficient
    //to search in an object instead of an array
    if (Object.keys(clearedCards).length === uniqueCardsArray.length) {
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (showModal) {
      // setTimeout(() => {
      //     setShowModal(false)
      //     navigation.goBack();
      // }, 1000);
    }
  }, [showModal]);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    dispatch({type: 'reset'});

    // set a shuffled deck of cards
    setCards(() => shuffleCards(uniqueCardsArray.concat(uniqueCardsArray)));
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const onBackPress = () => {
    handleClose();
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Pressable onPress={handleRestart} style={styles.restartButton}>
          <Text style={styles.restartText}>Restart</Text>
        </Pressable>
        <View style={styles.scoreContainer}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            STEP : {state.count}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.cardListContainer}
        contentContainerStyle={{
          justifyContent: 'space-around',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {cards.map((value, index) => {
          return (
            <Card
              testID={`test-${index}`}
              key={index}
              index={index}
              value={value}
              isDisabled={shouldDisableAllCards}
              isInactive={checkIsInactive(value)}
              isFlipped={checkIsFlipped(index)}
              onClick={() => handleCardClick(index)}
            />
          );
        })}
      </ScrollView>
      <Modal
        visible={showModal}
        transparent={true}
        onRequestClose={() => {
          setShowModal(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Hurray 🎊 You completed the challenge</Text>
            <Text>You completed the Game in {state.count} moves</Text>
            <View style={styles.buttonWrapper}>
              <Pressable style={styles.buttonContainer} onPress={onBackPress}>
                <Text style={styles.buttonText}>Go Back</Text>
              </Pressable>
              <Pressable style={styles.buttonContainer} onPress={handleRestart}>
                <Text style={styles.buttonText}>Restart</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 10,
  },
  cardListContainer: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(212,212,212,0.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  restartButton: {
    borderRadius: 30,
    backgroundColor: '#1890ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  restartText: {
    fontSize: 16,
    color: 'white',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default GameScreen;
