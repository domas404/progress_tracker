import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import TaskHead from "./TaskHead"
import MainSubTasks from "./MainSubTasks"
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubTask from "./SubTask"

export default function TaskScreen(props) {

    const navigation = props.navigation;
    // console.log(props.route.params);

    const styles = StyleSheet.create({
        container: {
            height: '100%',
            backgroundColor: props.route.params.appColors.darkAccent,
            alignContent: 'stretch',
        },
        scroll: {
            justifyContent: 'center',
            minHeight: '100%',
        },
        addTaskContainer: {
            backgroundColor: props.route.params.appColors.darkAccent,
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

    const [subTasks, setSubTasks] = useState([]);             // subtask objects
    const [mappedSubTasks, setMappedSubTasks] = useState([]); // subtask objects mapped to SubTask components
    const [taskProps, setTaskProps] = useState({});           // task properties

    // Returns value by key
    const getValuesByKey = async (key) => {
        values = await AsyncStorage.getItem(key);
        return JSON.parse(values);
    }

    // reads task values and all its subtasks from local storage
    const manageTasks = async () => {
        let key = props.route.params.id;       // task key
        taskInfo = await getValuesByKey(key);  // task info
        setTaskProps(taskInfo);                // task info stored in state
        let allSubtasks = taskInfo.taskList;   // extract subtasks
        setSubTasks(allSubtasks);              // subtasks stored in state
        // console.log("manageTasks called.");
    }

    // when subtask is checked or unchecked
    const onCheckSubTask = async (subTaskId) => {
        let key = props.route.params.id;      // task key
        let taskProperties = {...taskProps};  // copy of all task properties
        const subTasksCopy = [...subTasks];   // copy of all subTasks
        const index = subTasksCopy.findIndex((e) => e.id == subTaskId); // find changed subtask index in subtasks
        const subTaskChanged = subTasksCopy[index]; // assign values of subtask
        
        subTaskChanged.complete = !subTaskChanged.complete; // update subtask's state of completion
        taskProperties.completeTaskCount = taskProperties.completeTaskCount +
            (subTaskChanged.complete ? 1 : -1); // update task's complete task count

        taskProperties.completeWeightSum = subTaskChanged.complete ?
            taskProperties.completeWeightSum + subTaskChanged.weight
            :
            taskProperties.completeWeightSum - subTaskChanged.weight; // update task's complete task weight sum

        const jsonObject = JSON.stringify(taskProperties);
        await AsyncStorage.mergeItem(key, jsonObject);
        manageTasks();
    }

    // add button sets to true, save button sets to false
    const [newSubTaskAdded, setNewSubTaskAdded] = useState(false);

    // updates subtask list to display
    const updateTasks = () => {
        const ta = [...subTasks]; // copy of all subtasks
        let taskToAdd = 0;        // subtask to add (defaults to 0)
        if(newSubTaskAdded){      // if new subtask is being added
            taskToAdd = ({        // initialize taskToAdd default values
                complete: false,
                id: taskProps.taskLog + 1,
                title: '',
                weight: 1,
            });
            // create new subtask's component to display
            mappedTaskToAdd = <SubTask
                id={taskToAdd.id}
                title={taskToAdd.title}
                key={taskToAdd.id}
                complete={taskToAdd.complete}
                weight={taskToAdd.weight}
                parentId={props.route.params.id}
                onCheckSubTask={onCheckSubTask}
                appColors={props.route.params.appColors}
                addNewSubtask={addNewSubtask}
                autoFocus={true}
            />
        }
        ta.sort((a, b) => b.id - a.id); // sort subtasks from newest to oldest
        newTa = ta.map((task) => {      // map all existing subtasks to components to display
            return (
                <SubTask
                    id={task.id}
                    title={task.title}
                    key={task.id}
                    complete={task.complete}
                    weight={task.weight}
                    parentId={props.route.params.id}
                    onCheckSubTask={onCheckSubTask}
                    appColors={props.route.params.appColors}
                    addNewSubtask={addNewSubtask}
                    autoFocus={false}
                />
            )
        });
        if(taskToAdd !== 0) // if new subtask is being added
            newTa = [mappedTaskToAdd, ...newTa]; // put the new subtask's component at the start of the list
        setMappedSubTasks(newTa); // save all mapped subtasks to state
    };

    // stores a new subtask
    const storeNewSubTask = async (value) => {
        key = props.route.params.id;
        let taskCount = taskProps.subTaskCount + 1;   // increment task count
        newListOfSubTasks = [...subTasks, value];
        const propsToUpdate = {
            taskList: newListOfSubTasks,
            subTaskCount: taskCount,
            taskLog: value.id,
            weightSum: taskProps.weightSum + value.weight,
        };
        const jsonValue = JSON.stringify(propsToUpdate);
        await AsyncStorage.mergeItem(key, jsonValue);
        manageTasks();
    }

    // updates existing subtask
    const updateOldSubTask = async (value) => {
        key = props.route.params.id;
        let subTasksCopy = [...subTasks];
        let subTaskToUpdateIndex = subTasksCopy.findIndex((task) => task.id == value.id);
        let subTaskToUpdate = {...subTasksCopy[subTaskToUpdateIndex], ...value};
        subTasksCopy[subTaskToUpdateIndex] = subTaskToUpdate;

        const propsToUpdate = {
            taskList: subTasksCopy,
            completeWeightSum: subTaskToUpdate.complete ?
                taskProps.completeWeightSum - subTasks[subTaskToUpdateIndex].weight + value.weight
                :
                taskProps.completeWeightSum,
            weightSum: taskProps.weightSum - subTasks[subTaskToUpdateIndex].weight + value.weight,
        };

        const jsonValue = JSON.stringify(propsToUpdate);
        await AsyncStorage.mergeItem(key, jsonValue);
        manageTasks();
    }

    // if subtask exists - updates, else - creates
    const addNewSubtask = (complete, id, title, weight) => {
        const subtaskExists = subTasks.some((task) => task.id == id);
        const valueToAdd = {
            complete: complete,
            id: id,
            title: title,
            weight: weight
        }
        if(subtaskExists){
            updateOldSubTask(valueToAdd);
        } else {
            storeNewSubTask(valueToAdd);
            setNewSubTaskAdded(prevState => !prevState);
        }
    }

    // renders when new subtask is initiated or added
    useEffect(() => {
        updateTasks();
    }, [subTasks, newSubTaskAdded]);

    // initial render
    useEffect(() => {
        manageTasks();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='handled' >
                <TaskHead
                    name={taskProps.title}
                    percent={taskProps.completeTaskCount === 0 ? 0 : Math.round(taskProps.completeWeightSum/taskProps.weightSum*100)}
                    description={taskProps.description}
                    labels={taskProps.labels}
                    appColors={props.route.params.appColors}
                    dueDate={taskProps.dueDate}
                    navigation={navigation}
                />
                <MainSubTasks
                    taskList={mappedSubTasks}
                    appColors={props.route.params.appColors}
                />
            </ScrollView>
            <TouchableOpacity
                style={styles.addTaskContainer}
                activeOpacity={0.8}
                onPress={() => {
                    setNewSubTaskAdded(prevState => !prevState);
                }}
            >
                <Image style={styles.addTask} source={require("../../assets/add_white.png")} resizeMode='contain' />
            </TouchableOpacity>
        </SafeAreaView>
    )
}