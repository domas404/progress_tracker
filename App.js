import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./components/HomeScreen/HomeScreen"
import TaskScreen from "./components/TaskScreen/TaskScreen"
import AddTaskScreen from './components/AddTaskScreen/AddTaskScreen';
import AddSubTaskScreen from './components/AddSubTaskScreen/AddSubTaskScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen
            name="home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="task"
            component={TaskScreen}
          />
          <Stack.Screen
            name="add_task"
            component={AddTaskScreen}
          />
          <Stack.Screen
            name="add_subtask"
            component={AddSubTaskScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
}