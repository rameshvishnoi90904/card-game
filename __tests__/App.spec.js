import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from '../src/AppNavigator';
import GameScreen from '../src/screen/GameScreen';

describe('Card Game', () => {
  const component = (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );

  it('renders the correct message', () => {
    render(component);
    expect(screen.queryByText('Welcome to Card Game')).toBeTruthy();
  });

  test('start game', async () => {
    render(component);
    const toClick = await screen.findByText('Start Game');
    fireEvent(toClick, 'press');

    const items = await screen.findAllByText('?');
    expect(items.length).toBe(12);
  });

  test('check all cards', async () => {
    render(<GameScreen />);

    const items = await screen.findAllByText('?');
    expect(items.length).toBe(12);
  });

  test('click 2 cards and score update', async () => {
    render(<GameScreen />);

    const score = await screen.getByText('STEP : 0');
    expect(score).toBeTruthy();

    const toClickCard = await screen.getByTestId('test-0');
    fireEvent(toClickCard, 'press');

    const toClickCard2 = await screen.getByTestId('test-1');
    fireEvent(toClickCard2, 'press');

    const updatedScore = await screen.getByText('STEP : 1');

    expect(updatedScore).toBeTruthy();
  });

  test('restart game', async () => {
    render(<GameScreen />);

    const toClickCard = await screen.getByTestId('test-0');
    fireEvent(toClickCard, 'press');

    const toClickCard2 = await screen.getByTestId('test-1');
    fireEvent(toClickCard2, 'press');

    const restartButton = await screen.getByText('Restart');
    fireEvent(restartButton, 'press');

    const score = await screen.getByText('STEP : 0');
    expect(score).toBeTruthy();
  });
});
