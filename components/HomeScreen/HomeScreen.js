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

    const [optionsMenuPosition, setOptionsMenuPosition] = useState({ x: 100, y: 100 });
    const [scrollPosition, setScrollPosition] = useState(0);
    const [selectedTask, setSelectedTask] = useState();

    const onOptionsMenuPress = (id, measurements) => {
        // console.log(measurements);
        let newPosition = { x: Math.round(measurements.px), y: Math.round(measurements.py)};
        setOptionsMenuPosition(newPosition);
        setSelectedTask(id);
        checkIfPinned(id);
        setTimeout(() => {
            setModalVisible(prevState => !prevState);
        }, 30);
    }

    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [sortMenuPosition, setSortMenuPosiiton] = useState({ x: 100, y: 100 })

    const toggleSortMenu = (measurements) => {
        // setSortMenuVisible(prevState => !prevState);
        let newPosition = { x: Math.round(measurements.px), y: Math.round(measurements.py)};
        setSortMenuPosiiton(newPosition);

        // console.log("Sort menu posiiton:", newPosition);

        setTimeout(() => {
            setSortMenuVisible(prevState => !prevState);
        }, 30);
    }

    // sorting orders: date, title, progress, deadline
    const [sortingOrder, setSortingOrder] = useState('date');
    const [sortAsc, setSortAsc] = useState(true);

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
            padding: 20,
            shadowColor: appColors.mono4,
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
            backgroundColor: appColors.mono1,
            width: 180,
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
            color: appColors.darkAccent,
            fontWeight: 700,
            fontSize: 16,
        },
        deleteOption: {
            color: '#DE3F3F',
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
            backgroundColor: appColors.mono1,
            width: 200,
            borderRadius: 24,
            shadowColor: appColors.mono4,
            elevation: 4,
        },
        sortMenuOption: {
            padding: 16,
            marginLeft: 5,
            marginRight: 5,
            borderBottomColor: appColors.mono2,
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
            // console.log("Task", i, readTasks[i]);
            savePromises.push(await promisedSetTasks({
                id: allKeys[i],
                title: readTasks[i].title,
                description: readTasks[i].description,
                percent: readTasks[i].completeTaskCount === 0 ? 0: Math.round(readTasks[i].completeWeightSum/readTasks[i].weightSum*100),
                pinned: readTasks[i].pinned,
                labels: readTasks[i].labels,
                dateCreated: readTasks[i].dateCreated,
                dueDate: readTasks[i].dueDate,
            }));
        }
        return savePromises;
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
        await manageTasks().then((ta) => {
            // console.log(ta);
            // console.log("TASKS in UpdateTasks():", ta);
            pinnedTasks = ta.filter((e) => e.pinned);
            restOfTasks = ta.filter((e) => !e.pinned);
            const sortedTasks = sortTasks(restOfTasks);
            // console.log(sortedTasks);
            // all tasks
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

    const [isTaskPinned, setIsTaskPinned] = useState({});

    const checkIfPinned = async (id) => {
        const taskToCheck = await getValuesByKey(id);
        // console.log(taskToCheck.pinned);
        setIsTaskPinned({ taskId: id, isPinned: taskToCheck.pinned })
    }

    const [modalVisible, setModalVisible] = useState(false);

    const MenuComponent = () => {
        return (
            <Modal
                style={styles.modal}
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(prevState => !prevState)}
                animationType="fade"
            >
                <Pressable style={styles.modalBackground} onPress={() => setModalVisible(prevState => !prevState)} />
                <View style={[styles.optionsMenuContainer]}>
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
    }


    useEffect(() => {
        onTaskAdded();
    }, [props.route.params.addedTask]);

    const isFocused = useIsFocused();

    // rerenders tasks every 0.5 sec
    useEffect(() => {
        updateTasks();
        // const isFocused = useIsFocused();
        // console.log("rerendered.");
    }, [isFocused, sortingOrder, sortAsc]);

    const pinSelectedTask = async () => {
        // console.log(selectedTask);
        const taskToPin = await getValuesByKey(selectedTask);
        // const taskToPin = getValuesByKey(id);
        AsyncStorage.mergeItem(selectedTask, JSON.stringify({ pinned: !taskToPin.pinned }));
        setModalVisible(prevState => !prevState);
        updateTasks();
    }

    const deleteSelectedTask = async () => {
        const taskToDelete = await getValuesByKey(selectedTask);
        // console.log(taskToDelete);
        Alert.alert(`Delete '${taskToDelete.title}'?`, 'This action permanetly deletes task with all of its contents.', [
            {
                text: 'Delete',
                onPress: () => {
                    setModalVisible(prevState => !prevState);
                    AsyncStorage.removeItem(selectedTask);
                    updateTasks();
                    ToastAndroid.show("Task deleted", ToastAndroid.SHORT);
                }
            },
            {
                text: 'Cancel',
                onPress: () => setModalVisible(prevState => !prevState),
            },
        ]);
    }

    const archiveSelectedTask = async () => {
        const taskToArchive = await getValuesByKey(selectedTask);
        // console.log(taskToArchive.archived);
        setModalVisible(prevState => !prevState);
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
            <ScrollView
                contentContainerStyle={styles.scroll}
                onMomentumScrollEnd={(event) => {
                    let newPosition = event.nativeEvent.contentOffset.y
                    setScrollPosition(newPosition);
                    // console.log("Scroll position:", scrollPosition, "Menu Position:", optionsMenuPosition.y);
                }}
            >
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


