import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, Text, Alert, ToastAndroid } from 'react-native';
import MainTasks from "./MainTasks"
import MainHead from "./MainHead"
import Task from "./Task"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

initializeStorageElement = async (key, value) => {
    isInitialised = await AsyncStorage.getItem(key);
    if(isInitialised === null)
        await AsyncStorage.setItem(key, value);
}

initializeStorageElement('taskCount', JSON.stringify(0));
initializeStorageElement('labels', JSON.stringify([]));

const appColors = {
    lightAccent: '#AED3C5',
    darkAccent: '#13573F',
    mono1: '#FFF',
    mono2: '#EEE',
    mono3: '#AEAEAE',
    mono4: '#444',
}

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
                        appColors={appColors}
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
                        appColors={appColors}
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
                <MainHead navigation={navigation} mappedTasks={mappedPinnedTasks} appColors={appColors} />
                <MainTasks navigation={navigation} mappedTasks={mappedTasks} appColors={appColors} />
            </ScrollView>
            <TouchableOpacity
                style={styles.addTaskContainer}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('add_task', { appColors: appColors })}
            >
                <Image style={styles.addTask} source={require("../../assets/add_white.png")} resizeMode='contain' />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.removeTasksContainer}
                activeOpacity={0.8}
                onPress={ () => {
                    Alert.alert('Delete', 'Delete everything fr?', [
                        {
                          text: 'Cancel',
                          onPress: () => console.log("Cancel"),
                        },
                        {
                            text: 'OK',
                            onPress: () => clearAll()
                        },
                      ]);
                }}
            >
                <Text style={styles.delete}>DELETE ALL</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: appColors.darkAccent,
        alignContent: 'stretch',
    },
    scroll: {
        justifyContent: 'center',
        minHeight: '100%',
    },
    addTaskContainer: {
        backgroundColor: appColors.darkAccent,
        borderRadius: 35,
        position: 'absolute',
        bottom: 30,
        right: 20,
        padding: 20
    },
    addTask: {
        height: 30,
        width: 30,
    },
    removeTasksContainer: {
        backgroundColor: appColors.darkAccent,
        borderRadius: 35,
        position: 'absolute',
        bottom: 30,
        left: 20,
        padding: 15
    },
    delete: {
        color: appColors.mono1,
        fontSize: 16,
        fontWeight: 700,
        paddingRight: 10,
        paddingLeft: 10,
    }
});
