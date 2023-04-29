import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import MainTasks from "./MainTasks"
import MainHead from "./MainHead"
import Task from "./Task"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


clearAll = async () => {
    await AsyncStorage.clear()
    console.log('Cleared.')
}

// clearAll();

export default function HomeScreen(props) {

    const navigation = props.navigation;

    const [tasks, setTasks] = useState([]); // task objects
    const [mappedTasks, setMappedTasks] = useState([]); // task objects mapped to Task components
    const [mappedPinnedTasks, setMappedPinnedTasks] = useState([]); // pinned task objects mapped to Task components

    // Returns all keys in local storage
    const getAllKeys = async () => {
        let keys = []
        keys = await AsyncStorage.getAllKeys()
        return(keys);
    };

    // Returns value by key
    const getValuesByKey = async (key) => {
        values = await AsyncStorage.getItem(key);
        // console.log(values);
        return JSON.parse(values);
    }

    const setTaskObject = async (allKeys) => {
        const results = []
        for (let key of allKeys) {
            results.push(await getValuesByKey(key));
        }
        return results;
    }

    promisedSetTasks = (newTask) => new Promise(resolve => {
        setTasks((prevTasks) => prevTasks.find(e => e.id == newTask.id) ? prevTasks : [...prevTasks, newTask]);
        resolve(newTask);
    })

    // reads all tasks from local storage
    const manageTasks = async () => {
        let allKeys = await getAllKeys(); // get all keys from local storage
        allKeys = allKeys.filter(element => element !== 'taskCount'); // remove taskCount key from array
        allKeys = allKeys.filter(element => element !== 'labels'); // remove labels key from array
        const savePromises = [];

        const readTasks = await setTaskObject(allKeys);
        for(var i=0; i<readTasks.length; i++){
            savePromises.push(await promisedSetTasks({
                id: allKeys[i],
                title: readTasks[i].title,
                description: readTasks[i].description,
                percent: readTasks[i].completeTaskCount === 0 ? 0: Math.round(readTasks[i].completeWeightSum/readTasks[i].weightSum*100),
                pinned: readTasks[i].pinned,
                labels: readTasks[i].labels
            }));
        }
        return savePromises;
    }

    // maps task list to Task components and updates displayed task list (when new task is added to local storage)
    const updateTasks = async () => {
        await manageTasks().then((ta) => {
            // console.log("TASKS in UpdateTasks():", ta);
            pinnedTasks = ta.filter((e) => e.pinned);
            restOfTasks = ta.filter((e) => !e.pinned);
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
                        labels={task.labels}
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
                        labels={task.labels}
                        navigation={navigation}
                    />
                )
            }));
        })

    };

    const onTaskAdded = () => {
        console.log("New task added?", props.route.params.addedTask);
        if(props.route.params.addedTask){
            console.log("Rerendering...");
            setTimeout(() => {
                updateTasks();
                props.route.params.addedTask = false;
            }, 100);
        }
    }

    useEffect(() => {
        onTaskAdded();
    }, [props.route.params.addedTask]);

    const isFocused = useIsFocused();

    // rerenders tasks every 0.5 sec
    useEffect(() => {
        updateTasks();
        // const isFocused = useIsFocused();
    }, [isFocused]);

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
