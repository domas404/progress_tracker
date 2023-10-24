import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, Alert, ToastAndroid, StatusBar, View } from 'react-native';
import MainTasks from "./MainTasks"
import MainHead from "./MainHead"
import Task from "./Task"
import SortMenu from "./SortMenu"
import OptionsMenu from "./OptionsMenu"
import SortTasks from "./SortTasks"
import AppColors from "./AppColors"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

initializeStorageElement = async (key, value) => {
    isInitialised = await AsyncStorage.getItem(key);
    if(isInitialised === null)
        await AsyncStorage.setItem(key, value);
}

initializeStorageElement('taskCount', JSON.stringify(0));
initializeStorageElement('labels', JSON.stringify([]));

clearAsyncStorage = async() => {
    AsyncStorage.clear();
}

const appColors = AppColors();

// style
const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: appColors.header_background,
        alignContent: 'stretch',
    },
    topNavContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        backgroundColor: appColors.header_background,
        borderBottomWidth: 1,
        borderBottomColor: appColors.header_outline,
        // top: 40,
        height: 60,
    },
    scroll: {
        justifyContent: 'center',
        minHeight: '100%',
        // top: '10%',
    },
    addTaskContainer: {
        backgroundColor: appColors.button_background,
        borderRadius: 35,
        position: 'absolute',
        bottom: 30,
        right: 20,
        padding: 20,
        shadowColor: appColors.shadow,
        elevation: 2,
    },
    addTask: {
        height: 30,
        width: 30,
    },
    dateContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: '5%',
        // backgroundColor: appColors.header_background,
        // position: 'absolute',
        // top: 20,
    },
    icon: {
        width: 28,
        height: 28,
        tintColor: appColors.icon
    },
    iconContainer: {
        padding: 8,
    },
    logo: {
        height: 46,
        width: 46,
    }
});

export default function HomeScreen(props) {

    const navigation = props.navigation;
    const isFocused = useIsFocused();

    // options menu handling
    const [optionsMenuPosition, setOptionsMenuPosition] = useState({ x: 100, y: 100 });
    const [selectedTask, setSelectedTask] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const onOptionsMenuPress = (id, measurements) => {
        let newPosition = { x: Math.round(measurements.px), y: Math.round(measurements.py)};
        setOptionsMenuPosition(newPosition);
        setSelectedTask(id);
        checkIfPinned(id);
        setModalVisible(true);
    }

    // sort menu handling
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [sortMenuPosition, setSortMenuPosiiton] = useState({ x: 100, y: 100 })

    const toggleSortMenu = (measurements) => {
        let newPosition = { x: Math.round(measurements.px), y: Math.round(measurements.py)};
        setSortMenuPosiiton(newPosition);
        setSortMenuVisible(prevState => !prevState);
    }

    // sorting orders: date, title, progress, deadline
    const [sortingOrder, setSortingOrder] = useState('date');
    const [sortAsc, setSortAsc] = useState(true);

    // tasks
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
        const values = await AsyncStorage.getItem(key);
        return JSON.parse(values);
    }

    // Reads all tasks from local storage
    const setTaskObject = async (allKeys) => {
        const results = [];
        let task;
        for (let key of allKeys) {
            task = await getValuesByKey(key);
            results.push({
                id: key,
                title: task.title,
                description: task.description,
                percent: task.completeTaskCount === 0 ? 0: Math.round(task.completeWeightSum/task.weightSum*100),
                pinned: task.pinned,
                labels: task.labels,
                dateCreated: task.dateCreated,
                dueDate: task.dueDate,
            });
        }
        return results;
    }

    // Reads all relevant task keys from local storage & updates tasks state
    const manageTasks = async () => {
        let allKeys = await getAllKeys(); // get all keys from local storage
        allKeys = allKeys.filter(element => element !== 'taskCount'); // remove taskCount key from array
        allKeys = allKeys.filter(element => element !== 'labels'); // remove labels key from array

        const readTasks = await setTaskObject(allKeys);
        setTasks(readTasks);
    }

    // maps task list to Task components and updates displayed task list
    const updateTasks = async () => {
        ta = [...tasks];
        pinnedTasks = ta.filter((e) => e.pinned);
        restOfTasks = ta.filter((e) => !e.pinned);

        const sortedTasks = SortTasks(restOfTasks, sortingOrder, sortAsc);
        setMappedTasks(() => sortedTasks.map((task) => {
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
    };

    // checks if task is pinned (in order to display 'pin' or 'unpin' option in options menu, depending if task is pinned)
    const [isTaskPinned, setIsTaskPinned] = useState({});

    const checkIfPinned = (id) => {
        const index = tasks.findIndex((t) => t.id == id);
        const taskToCheck = tasks[index];
        setIsTaskPinned({ taskId: id, isPinned: taskToCheck.pinned })
    }

    // rerender when new task is added
    useEffect(() => {
        if(props.route.params.addedTask)
            manageTasks();
    }, [props.route.params.addedTask]);

    // rerender when: navigating back from other screens, sorting conditions or order change, tasks are updated
    useEffect(() => {
        updateTasks();
    }, [isFocused, sortingOrder, sortAsc, tasks]);

    // read tasks from local storage when loaded
    useEffect(() => {
        manageTasks();
    }, [isFocused]);

    // pin selected task
    const pinSelectedTask = async () => {
        const taskToPin = await getValuesByKey(selectedTask);
        AsyncStorage.mergeItem(selectedTask, JSON.stringify({ pinned: !taskToPin.pinned }));
        setModalVisible(false);
        manageTasks();
    }

    const editSelectedTask = async () => {
        // console.log("selectedTask", selectedTask);
        const index = tasks.findIndex((e) => e.id == selectedTask);
        const taskToEdit = tasks[index];
        // console.log(taskToEdit);
        navigation.navigate(
            'add_task',
            {
                appColors: appColors,
                editTask: true,
                taskId: selectedTask,
                taskInfo: taskToEdit
            }
        );
        setModalVisible(false);
    }

    // delete selected task
    const deleteSelectedTask = async () => {
        const taskToDelete = await getValuesByKey(selectedTask);
        Alert.alert(`Delete '${taskToDelete.title}'?`, 'This action permanetly deletes task with all of its contents.', [
            {
                text: 'Delete',
                onPress: () => {
                    setModalVisible(false);
                    AsyncStorage.removeItem(selectedTask);
                    manageTasks();
                    ToastAndroid.show("Task deleted", ToastAndroid.SHORT);
                }
            },
            {
                text: 'Cancel',
                onPress: () => setModalVisible(false),
            },
        ]);
    }

    // archive selected task
    const archiveSelectedTask = async () => {
        const taskToArchive = await getValuesByKey(selectedTask);
        setModalVisible(false);
        AsyncStorage.mergeItem(selectedTask, JSON.stringify({ archived: !taskToArchive.archived }));
        updateTasks();
        ToastAndroid.show("Task archived", ToastAndroid.SHORT);
    }

    // manage sorting order and menu visibility
    const manageSorting = (order) => {
        setSortingOrder(order);
        setSortMenuVisible(prevState => !prevState);
    }

    // change sorting direction
    const changeSortingOrder = () => {
        setSortAsc(prevState => !prevState);
    }

    // toggle sort menu visibility from SortTasks
    const updateSortMenuVisibility = () => {
        setSortMenuVisible(prevState => !prevState);
    }

    // toggle options menu visibility from OptionsMenu
    const updateOptionsMenuVisibility = () => {
        setModalVisible(prevState => !prevState);
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle={appColors.header_text}
                backgroundColor={appColors.header_background}
                // translucent
            />
            <View style={styles.topNavContainer}>
                <View style={styles.dateContainer}>
                    <TouchableOpacity
                        // onPress={() => clearAsyncStorage()}
                        style={styles.iconContainer}
                    >
                        <Image style={styles.icon} source={require("../../assets/setting_light_green.png")} resizeMode='contain' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        // onPress={() => props.navigation.navigate('home')}
                        style={styles.iconContainer}
                    >
                        <Image style={styles.logo} source={require("../../assets/astronaut.png")} resizeMode='contain' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        // onPress={() => props.navigation.navigate('home')}
                        style={styles.iconContainer}
                    >
                        <Image style={styles.icon} source={require("../../assets/filters_light_green.png")} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>
                <MainHead
                    navigation={navigation}
                    mappedTasks={mappedPinnedTasks}
                    appColors={appColors}
                />
                <MainTasks
                    navigation={navigation}
                    mappedTasks={mappedTasks}
                    appColors={appColors}
                    openSortMenu={toggleSortMenu}
                    changeSortingOrder={changeSortingOrder}
                    sortingOrder={sortingOrder}
                />
                {
                    modalVisible && <OptionsMenu
                        appColors={appColors}
                        modalVisible={modalVisible}
                        optionsMenuPosition={optionsMenuPosition}
                        updateOptionsMenuVisibility={updateOptionsMenuVisibility}
                        isTaskPinned={isTaskPinned}
                        pinSelectedTask={pinSelectedTask}
                        editSelectedTask={editSelectedTask}
                        archiveSelectedTask={archiveSelectedTask}
                        deleteSelectedTask={deleteSelectedTask}
                    />
                }
                {
                    sortMenuVisible && <SortMenu
                        appColors={appColors}
                        manageSorting={manageSorting}
                        sortMenuPosition={sortMenuPosition}
                        sortMenuVisible={sortMenuVisible}
                        updateSortMenuVisibility={updateSortMenuVisibility}
                    />
                }
            </ScrollView>
            <TouchableOpacity
                style={styles.addTaskContainer}
                activeOpacity={0.8}
                onPress={() => {
                    navigation.navigate(
                        'add_task',
                        {
                            appColors: appColors,
                            editTask: false,
                            taskId: undefined,
                            taskInfo: undefined
                        }
                    )
                }}
            >
                <Image style={styles.addTask} source={require("../../assets/add_white.png")} resizeMode='contain' />
            </TouchableOpacity>
        </SafeAreaView>
    );
}