import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, Text, Alert, View, Modal, Pressable, ToastAndroid } from 'react-native';
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

    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [sortMenuPosition, setSortMenuPosiiton] = useState({ x: 100, y: 100 })

    const toggleSortMenu = (measurements) => {
        // setSortMenuVisible(prevState => !prevState);
        let newPosition = { x: Math.round(measurements.px), y: Math.round(measurements.py)};
        setSortMenuPosiiton(newPosition);
        setSortMenuVisible(prevState => !prevState);
    }

    // sorting orders: date, title, progress, deadline
    const [sortingOrder, setSortingOrder] = useState('date');
    const [sortAsc, setSortAsc] = useState(true);

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
        optionsMenuContainer: {
            position: 'absolute',
            top: optionsMenuPosition.y,
            right: 65,
            backgroundColor: appColors.options_background,
            width: 180,
            borderRadius: 24,
            shadowColor: '#666',
            elevation: 4,
        },
        optionsMenuOption: {
            padding: 16,
            marginLeft: 10,
            marginRight: 10,
            borderBottomColor: appColors.options_border,
            borderBottomWidth: 1,
        },
        deleteOptionsMenuOption: {
            padding: 16,
            marginLeft: 10,
            marginRight: 10,
        },
        option: {
            color: appColors.options_option,
            fontWeight: 700,
            fontSize: 16,
        },
        deleteOption: {
            color: appColors.options_deleteOption,
            fontWeight: 700,
            fontSize: 16,
        },
        modalBackground: {
            height: '100%',
            width: '100%'
        },
        sortMenuContainer: {
            position: 'absolute',
            top: sortMenuPosition.y + 10,
            right: 20,
            backgroundColor: appColors.options_background,
            width: 200,
            borderRadius: 24,
            shadowColor: appColors.shadow,
            elevation: 4,
        },
        sortMenuOption: {
            padding: 16,
            marginLeft: 5,
            marginRight: 5,
            borderBottomColor: appColors.options_border,
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        lastSortMenuOption: {
            padding: 16,
            marginLeft: 5,
            marginRight: 5,
            flexDirection: 'row',
            alignItems: 'center',
        },
        sortMenuIcon: {
            height: 20,
            width: 20,
            marginRight: 7,
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

    // reads all tasks from local storage
    const manageTasks = async () => {
        let allKeys = await getAllKeys(); // get all keys from local storage
        allKeys = allKeys.filter(element => element !== 'taskCount'); // remove taskCount key from array
        allKeys = allKeys.filter(element => element !== 'labels'); // remove labels key from array

        const readTasks = await setTaskObject(allKeys);
        setTasks(readTasks);
    }

    const sortTasks = (tasksToSort) => {
        let sortedTasks;
        // console.log("tasksToSort:", tasksToSort);
        
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

    // maps task list to Task components and updates displayed task list (when new task is added to local storage)
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

    const onTaskAdded = () => {
        if(props.route.params.addedTask){
            updateTasks();
            props.route.params.addedTask = false;
        }
    }

    const [isTaskPinned, setIsTaskPinned] = useState({});

    const checkIfPinned = (id) => {
        const index = tasks.findIndex((t) => t.id == id);
        const taskToCheck = tasks[index];
        setIsTaskPinned({ taskId: id, isPinned: taskToCheck.pinned })
    }

    const MenuComponent = () => {
        return (
            <Modal
                style={styles.modal}
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                animationType="fade"
            >
                <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)} />
                <View style={styles.optionsMenuContainer}>
                    <TouchableOpacity style={styles.optionsMenuOption} onPress={() => pinSelectedTask()}>
                        <Text style={styles.option}>{isTaskPinned.isPinned ? "Unpin" : "Pin"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionsMenuOption}>
                        <Text style={styles.option}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionsMenuOption} onPress={() => archiveSelectedTask()}>
                        <Text style={styles.option}>Archive</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteOptionsMenuOption} onPress={() => deleteSelectedTask()}>
                        <Text style={styles.deleteOption}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    };

    const SortMenuComponent = () => {
        return (
            <Modal
                style={styles.modal}
                transparent
                visible={sortMenuVisible}
                onRequestClose={() => setSortMenuVisible(prevState => !prevState)}
                animationType="fade"
            >
                <Pressable style={styles.modalBackground} onPress={() => setSortMenuVisible(prevState => !prevState)} />
                <View style={styles.sortMenuContainer}>
                    <TouchableOpacity style={styles.sortMenuOption} onPress={() => manageSorting('date')} >
                        <Image style={styles.sortMenuIcon} source={require("../../assets/calendar_green.png")} resizeMode='contain' />
                        <Text style={styles.option}>Date created</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sortMenuOption} onPress={() => manageSorting('title')} >
                        <Image style={styles.sortMenuIcon} source={require("../../assets/text_green.png")} resizeMode='contain' />
                        <Text style={styles.option}>Title</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sortMenuOption} onPress={() => manageSorting('progress')} >
                        <Image style={styles.sortMenuIcon} source={require("../../assets/bar_chart_green.png")} resizeMode='contain' />
                        <Text style={styles.option}>Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.lastSortMenuOption} onPress={() => manageSorting('deadline')} >
                        <Image style={styles.sortMenuIcon} source={require("../../assets/deadline_green.png")} resizeMode='contain' />
                        <Text style={styles.option}>Due date</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    useEffect(() => {
        onTaskAdded();
    }, [props.route.params.addedTask]);

    const isFocused = useIsFocused();

    useEffect(() => {
        updateTasks();
        // const isFocused = useIsFocused();
        // console.log(sortAsc);
    }, [isFocused, sortingOrder, sortAsc, tasks]);

    useEffect(() => {
        manageTasks();
    }, []);

    const pinSelectedTask = async () => {
        // console.log(selectedTask);
        const taskToPin = await getValuesByKey(selectedTask);
        // const taskToPin = getValuesByKey(id);
        AsyncStorage.mergeItem(selectedTask, JSON.stringify({ pinned: !taskToPin.pinned }));
        setModalVisible(false);
        updateTasks();
    }

    const deleteSelectedTask = async () => {
        const taskToDelete = await getValuesByKey(selectedTask);
        // console.log(taskToDelete);
        Alert.alert(`Delete '${taskToDelete.title}'?`, 'This action permanetly deletes task with all of its contents.', [
            {
                text: 'Delete',
                onPress: () => {
                    setModalVisible(false);
                    AsyncStorage.removeItem(selectedTask);
                    updateTasks();
                    ToastAndroid.show("Task deleted", ToastAndroid.SHORT);
                }
            },
            {
                text: 'Cancel',
                onPress: () => setModalVisible(false),
            },
        ]);
    }

    const archiveSelectedTask = async () => {
        const taskToArchive = await getValuesByKey(selectedTask);
        // console.log("Archive");
        setModalVisible(false);
        AsyncStorage.mergeItem(selectedTask, JSON.stringify({ archived: !taskToArchive.archived }));
        updateTasks();
        ToastAndroid.show("Task archived", ToastAndroid.SHORT);
    }

    const manageSorting = (order) => {
        setSortingOrder(order);
        setSortMenuVisible(prevState => !prevState);
    }

    const changeSortingOrder = () => {
        setSortAsc(prevState => !prevState);
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
                { modalVisible && <MenuComponent /> }
                { sortMenuVisible && <SortMenuComponent /> }
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