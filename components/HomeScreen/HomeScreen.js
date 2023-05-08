import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, Text, Alert, ToastAndroid, View, Modal, Pressable } from 'react-native';
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

    const [optionsMenu, setOptionsMenu] = useState(false);
    const [optionsMenuPosition, setOptionsMenuPosition] = useState({ x: 100, y: 100 });
    const [scrollPosition, setScrollPosition] = useState();

    const onOptionsMenuPress = (id, measurements) => {
        console.log(measurements);
        // setOptionsMenu(prevState => !prevState);
        let newPosition = { x: measurements.px, y: measurements.py}
        setOptionsMenuPosition(newPosition);
        // console.log(modalVisible);
        setModalVisible(prevState => !prevState);
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
            position: 'relative'
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
        },
        optionsMenuContainer: {
            position: 'absolute',
            top: Math.round(optionsMenuPosition.y - scrollPosition),
            right: 65,
            backgroundColor: appColors.mono1,
            // height: '50%',
            width: '50%',
            borderRadius: 24,
            shadowColor: appColors.mono4,
            elevation: 4,
        },
        optionsMenuOption: {
            padding: 16,
            marginLeft: 10,
            marginRight: 10,
            borderBottomColor: appColors.mono2,
            borderBottomWidth: 1,
        },
        deleteOptionsMenuOption: {
            padding: 16,
            marginLeft: 10,
            marginRight: 10,
        },
        option: {
            // marginTop: 10,
            // marginBottom: 10,
            color: appColors.darkAccent,
            fontWeight: 700,
            fontSize: 16,
        },
        deleteOption: {
            // marginTop: 10,
            // marginBottom: 10,
            color: '#DE3F3F',
            fontWeight: 700,
            fontSize: 16,
        },
        modalBackground: {
            height: '100%',
            width: '100%'
        },
        modal: {
            
        }
    });

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
                        optionsMenu={onOptionsMenuPress}
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
                        optionsMenu={onOptionsMenuPress}
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

    const [modalVisible, setModalVisible] = useState(false);

    const MenuComponent = () => {
        return (
            <Modal
                style={styles.modal}
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(prevState => !prevState)}
            >
                <Pressable style={styles.modalBackground} onPress={() => setModalVisible(prevState => !prevState)} />
                <View style={[styles.optionsMenuContainer]}>
                    <TouchableOpacity style={styles.optionsMenuOption}>
                        <Text style={styles.option}>Pin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionsMenuOption}>
                        <Text style={styles.option}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionsMenuOption}>
                        <Text style={styles.option}>Archive</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteOptionsMenuOption}>
                        <Text style={styles.deleteOption}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
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
            <ScrollView
                contentContainerStyle={styles.scroll}
                onMomentumScrollEnd={(event) => {
                    let newPosition = event.nativeEvent.contentOffset.y
                    setScrollPosition(newPosition);
                    // console.log("Scroll position:", scrollPosition, "Menu Position:", optionsMenuPosition.y);
                }}
            >
                <MainHead navigation={navigation} mappedTasks={mappedPinnedTasks} appColors={appColors} />
                <MainTasks navigation={navigation} mappedTasks={mappedTasks} appColors={appColors} />
                { modalVisible && <MenuComponent /> }
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


