import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import MainTasks from "./MainTasks"
import MainHead from "./MainHead"
import Task from "./Task"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({navigation}) {

    const [tasks, setTasks] = useState([]); // task objects
    const [mappedTasks, setMappedTasks] = useState([]); // task objects mapped to Task components
    const [mappedPinnedTasks, setMappedPinnedTasks] = useState([]); // task objects that are pinned mapped to Task components

    // Returns all keys in local storage
    const getAllKeys = async () => {
        let keys = []
        keys = await AsyncStorage.getAllKeys()
        return(keys);
    };

    // Returns value by key
    const getValuesByKey = async (key) => {
        values = await AsyncStorage.getItem(key);
        return JSON.parse(values);
    }

    // reads all tasks from local storage
    const manageTasks = async () => {
        let allKeys = await getAllKeys(); // get all keys from local storage
        allKeys = allKeys.filter(element => element !== 'taskCount'); // remove taskCount key from array

        // maps data of tasks from local storage into array of objects (tasks)
        const tasksWithInfo = allKeys.map(async (key) => {
            let task = await getValuesByKey(key); // gets all task data by key
            console.log(task);
            let newTask = { // creates object with provided data
                id: key,
                title: task.title,
                description: task.description,
                percent: task.completeTaskCount === 0 ? 0: task.completeTaskCount/task.subTaskCount*100,
                pinned: task.pinned,
            }
            // adds task to task array if there's no task with exact id
            setTasks((prevTasks) => prevTasks.find(e => e.id == newTask.id) ? prevTasks : [...prevTasks, newTask]);
        })
    }

    // updates task list to display (when new task is added to local storage)
    const updateTasks = () => {
        manageTasks();
        pinnedTasks = tasks.filter((e) => e.pinned);
        restOfTasks = tasks.filter((e) => !e.pinned);
        // console.log(tasks);
        // all tasks
        setMappedTasks(() => restOfTasks.map((task) => {
            return (
                <Task
                    id={task.id}
                    title={task.title}
                    percent={task.percent}
                    description={task.description}
                    pinned={task.pinned}
                    key={task.id}
                    navigation={navigation}
                />
            )
        }));
        // pinned tasks
        setMappedPinnedTasks(() => pinnedTasks.map((task) => {
            return (
                <Task
                    id={task.id}
                    title={task.title}
                    percent={task.percent}
                    description={task.description}
                    pinned={task.pinned}
                    key={task.id}
                    navigation={navigation}
                />
            )
        }));
    };

    // rerenders tasks every 0.5 sec
    useEffect(() => {
        setTimeout(() => {
            updateTasks();
        }, 1000);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <MainHead navigation={navigation} mappedTasks={mappedPinnedTasks} />
                <MainTasks navigation={navigation} mappedTasks={mappedTasks} />
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
