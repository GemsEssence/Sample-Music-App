/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import StackNavigation from './src/navigation/stack';
import { PlayerProvider } from './src/context/playerContext';

function App(): React.JSX.Element {
  return (
    <PlayerProvider>
      <StackNavigation />
    </PlayerProvider>
  );
}

export default App;
