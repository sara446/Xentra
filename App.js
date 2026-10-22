import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import { ModalProvider } from './src/components/AppModal';

export default function App() {
  return (
    <SafeAreaProvider>
      <ModalProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </ModalProvider>
    </SafeAreaProvider>
  );
}
