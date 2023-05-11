import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./components/HomeScreen/HomeScreen"
import TaskScreen from "./components/TaskScreen/TaskScreen"
import AddTaskScreen from './components/AddTaskScreen/AddTaskScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen
                    name="home"
                    component={HomeScreen}
                    initialParams={{'addedTask':false}}
                />
                <Stack.Screen
                    name="task"
                    component={TaskScreen}
                    initialParams={{'addedSubTask':false}}
                />
                <Stack.Screen
                    name="add_task"
                    component={AddTaskScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}