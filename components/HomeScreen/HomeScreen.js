import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, Text, Alert, View, Modal, Pressable, ToastAndroid } from 'react-native';
import MainTasks from "./MainTasks"
import MainHead from "./MainHead"
import Task from "./Task"
import SortMenu from "./SortMenu"
import OptionsMenu from "./OptionsMenu"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

initializeStorageElement = async (key, value) => {
    isInitialised = await AsyncStorage.getItem(key);
    if(isInitialised === null)
        await AsyncStorage.setItem(key, value);
}

initializeStorageElement('taskCount', JSON.stringify(0));
initializeStorageElement('labels', JSON.stringify([]));

const colors = {
    light_green: '#AED3C5',
    dark_green: '#13573F',
    white: '#FFF',
    light_gray: '#EEE',
    gray: '#666',
    dark_gray: '#333',
    black: '#000',
    red: '#DE3F3F',
}

const appColors = {
    header_background: colors.dark_green,
    header_taskBackground: colors.dark_green,
    header_completeBar: colors.light_green,
    header_emptyBar: colors.dark_green,
    header_outline: colors.light_green,
    header_labelText: colors.light_green,
    header_labels: colors.light_green,
    header_text: colors.white,
    header_percentage: colors.dark_green,

    body_background: colors.light_gray,
    body_taskBackground: colors.white,
    body_completeBar: colors.dark_green,
    body_emptyBar: colors.light_green,
    body_labelText: colors.dark_green,
    body_labels: colors.light_green,
    body_text: colors.dark_green,
    body_percentage: colors.white,
    body_outline: colors.dark_green,

    button_background: colors.dark_green,
    button_text: colors.white,

    options_background: colors.white,
    options_option: colors.dark_green,
    options_deleteOption: colors.red,
    options_border: colors.light_gray,

    shadow: colors.gray,
    border: colors.light_green,

    otherText: colors.dark_gray,
}

export default function HomeScreen(props) {

    const navigation = props.navigation;

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

    // style
    const styles = StyleSheet.create({
        container: {
            height: '100%',
            backgroundColor: appColors.header_background,
            alignContent: 'stretch',
        },
        scroll: {
            justifyContent: 'center',
            minHeight: '100%',
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
    });

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
        values = await AsyncStorage.getItem(key);
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

    const sortTasks = (tasksToSort) => {
        let sortedTasks;        
        switch(sortingOrder){
            case 'date':
                if(sortAsc)
                    sortedTasks = tasksToSort.sort((a, b) => Date.parse(a.dateCreated) - Date.parse(b.dateCreated));
                else
                    sortedTasks = tasksToSort.sort((a, b) => Date.parse(b.dateCreated) - Date.parse(a.dateCreated));
                break;
            case 'title':
                if(sortAsc){
                    sortedTasks = tasksToSort.sort((a, b) => {
                        if(a.title.toLowerCase() < b.title.toLowerCase()) return -1;
                        if(a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                    });
                }
                else{
                    sortedTasks = tasksToSort.sort((a, b) => {
                        if(a.title.toLowerCase() > b.title.toLowerCase()) return -1;
                        if(a.title.toLowerCase() < b.title.toLowerCase()) return 1;
                    });
                }
                break;
            case 'progress':
                if(sortAsc)
                    sortedTasks = tasksToSort.sort((a, b) => a.percent - b.percent);
                else
                    sortedTasks = tasksToSort.sort((a, b) => b.percent - a.percent);
                break;
            case 'deadline':
                if(sortAsc)
                    sortedTasks = tasksToSort.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
                else
                    sortedTasks = tasksToSort.sort((a, b) => Date.parse(b.dueDate) - Date.parse(a.dueDate));
                break;
        }
        return sortedTasks;
    }

    // maps task list to Task components and updates displayed task list
    const updateTasks = async () => {
        ta = [...tasks];
        pinnedTasks = ta.filter((e) => e.pinned);
        restOfTasks = ta.filter((e) => !e.pinned);

        const sortedTasks = sortTasks(restOfTasks);
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

    const isFocused = useIsFocused();
    // rerender when: navigating back from other screens, sorting conditions or order change, tasks are updated
    useEffect(() => {
        updateTasks();
    }, [isFocused, sortingOrder, sortAsc, tasks]);

    // read tasks from local storage when loaded
    useEffect(() => {
        manageTasks();
    }, []);

    // pin selected task
    const pinSelectedTask = async () => {
        const taskToPin = await getValuesByKey(selectedTask);
        AsyncStorage.mergeItem(selectedTask, JSON.stringify({ pinned: !taskToPin.pinned }));
        setModalVisible(false);
        manageTasks();
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

    const updateSortMenuVisibility = () => {
        setSortMenuVisible(prevState => !prevState);
    }

    const updateOptionsMenuVisibility = () => {
        setModalVisible(prevState => !prevState);
    }

    return (
        <SafeAreaView style={styles.container}>
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
                onPress={() => navigation.navigate('add_task', { appColors: appColors })}
            >
                <Image style={styles.addTask} source={require("../../assets/add_white.png")} resizeMode='contain' />
            </TouchableOpacity>
        </SafeAreaView>
    );
}