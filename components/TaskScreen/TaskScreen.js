import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import TaskHead from "./TaskHead"
import MainSubTasks from "./MainSubTasks"

export default function TaskScreen(props) {
    const navigation = props.navigation;
    // console.log(props.route.params);
    // console.log(props.route);
    // const taskInfo = props.props;

    console.log("Props:", props);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <TaskHead
                    name={props.route.params.title}
                    percent={props.route.params.percent}
                    description={props.route.params.description}
                />
                <MainSubTasks />
            </ScrollView>
            <TouchableOpacity
                style={styles.addTaskContainer}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('add_subtask', { id: props.route.params.id })}
            >
                <Image style={styles.addTask} source={require("../../assets/add_white.png")} resizeMode='contain' />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#13573F',
    },
    scroll: {
        backgroundColor: '#13573F',
        alignItems: 'center',
        justifyContent: 'center',
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