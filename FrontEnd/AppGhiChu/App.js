import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import CreateNoteScreen from './screens/CreateNoteScreen';
import EditNoteScreen from './screens/EditNoteScreen';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

// Component để xử lý navigation dựa trên auth state
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Đã đăng nhập
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen 
            name="CreateNote" 
            component={CreateNoteScreen} 
            options={{ 
              headerShown: true,
              title: 'Tạo ghi chú mới',
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#007AFF',
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          />
          <Stack.Screen 
            name="EditNote" 
            component={EditNoteScreen}
            options={{ 
              headerShown: true,
              title: 'Chỉnh sửa ghi chú',
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#007AFF',
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          />
        </>
      ) : (
        // Chưa đăng nhập
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
