import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import TaskHead from "./TaskHead"
import MainSubTasks from "./MainSubTasks"
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubTask from "./SubTask"

export default function TaskScreen(props) {

    // console.log(props);

    const [subTasks, setSubTasks] = useState([]); // task objects
    const [mappedSubTasks, setMappedSubTasks] = useState([]); // task objects mapped to Task components
    const [taskProps, setTaskProps] = useState({});
    // const [mappedPinnedTasks, setMappedPinnedTasks] = useState([]); // task objects that are pinned mapped to Task components

    // Returns value by key
    const getValuesByKey = async (key) => {
        values = await AsyncStorage.getItem(key);
        return JSON.parse(values);
    }

    // reads all tasks from local storage
    const manageTasks = async () => {
        let key = props.route.params.id;
        taskInfo = await getValuesByKey(key);
        setTaskProps(taskInfo);
        let allSubtasks = taskInfo.taskList;
        // console.log("Subtasks", allSubtasks);

        const subTasksWithInfo = allSubtasks.map(async (subtask) => {
            let newSubTask = {
                id: subtask.id,
                title: subtask.title,
                weight: subtask.weight,
                complete: subtask.complete
            }
            setSubTasks((prevSubTasks) => prevSubTasks.find(e => e.id == newSubTask.id) ? prevSubTasks : [...prevSubTasks, newSubTask]);
        })
    }

    // updates task list to display (when new task is added to local storage)
    const updateTasks = () => {
        manageTasks();
        setMappedSubTasks(() => subTasks.map((task) => {
            return (
                <SubTask
                    id={task.id}
                    title={task.title}
                    key={task.id}
                    complete={task.complete}
                    weight={task.weight}
                    // navigation={navigation}
                />
            )
        }));
    };

    // rerenders tasks every 0.5 sec
    useEffect(() => {
        // setTimeout(() => {
            updateTasks();
        // }, 500);
    }, []);


    const navigation = props.navigation;
    // console.log(props.route.params);
    // console.log(props.route);
    // const taskInfo = props.props;

    // console.log("Props:", props);

    // console.log("Mapped Subtasks:", mappedSubTasks);

    console.log("Task properties:", taskProps);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <TaskHead
                    name={taskProps.title}
                    percent={taskProps.completeTaskCount === 0 ? 0: taskProps.completeTaskCount/taskProps.subTaskCount*100}
                    description={taskProps.description}
                />
                <MainSubTasks taskList={mappedSubTasks} />
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
        height: '100%',
        backgroundColor: '#13573F',
        alignContent: 'stretch',
    },
    scroll: {
        justifyContent: 'center',
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