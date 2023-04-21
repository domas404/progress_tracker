import { StyleSheet, Text, View, Image, SafeAreaView, RefreshControl, Dimensions, ScrollView, Button, TouchableOpacity } from 'react-native';
import MainTasks from "./MainTasks"
import MainHead from "./MainHead"

export default function HomeScreen({navigation}) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <MainHead />
                <MainTasks navigation={navigation} />
            </ScrollView>
            <TouchableOpacity
                style={styles.addTaskContainer}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('add_task')}
            >
                <Image style={styles.addTask} source={require("../../assets/add_white.png")} resizeMode='contain' />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: '100%',
        backgroundColor: '#13573F',
        alignContent: 'stretch',
    },
    scroll: {
        // backgroundColor: '#13573F',
        // alignItems: 'stretch',
        justifyContent: 'center',
        // flex: 1,
        minHeight: '100%',
    },
    addTaskContainer: {
        backgroundColor: '#13573F',
        borderRadius: 35,
        position: 'absolute',
        bottom: 30,
        right: 20,
        padding: 20
    },
    addTask: {
        height: 30,
        width: 30,
    }
});
