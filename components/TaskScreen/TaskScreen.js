import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import TaskHead from "./TaskHead"
import MainSubTasks from "./MainSubTasks"
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubTask from "./SubTask"

export default function TaskScreen(props) {
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
    const [mappedSubTasks, setMappedSubTasks] = useState([]); // task objects mapped to Task components
    const [taskProps, setTaskProps] = useState({});

    // Returns value by key
    const getValuesByKey = async (key) => {
        values = await AsyncStorage.getItem(key);
        return JSON.parse(values);
    }

    // reads all tasks from local storage
    const manageTasks = async () => {
        let key = props.route.params.id;       // task key
        taskInfo = await getValuesByKey(key);  // task info
        setTaskProps(taskInfo);                // task info stored in state
        let allSubtasks = taskInfo.taskList;   // extract subtasks
        setSubTasks(allSubtasks);              // subtasks stored in state
    }

    // when subtask is checked/unchecked
    const onCheckSubTask = async (subTaskId) => {
        let key = props.route.params.id;
        taskProperties = await getValuesByKey(key);
        // console.log("Task properties before:", taskProperties);
        const index = taskProperties.taskList.findIndex((e) => e.id == subTaskId);
        taskProperties.taskList[index].complete = !taskProperties.taskList[index].complete;

        taskProperties.completeTaskCount = taskProperties.completeTaskCount +
            (taskProperties.taskList[index].complete ? 1 : -1);

        taskProperties.completeWeightSum = taskProperties.taskList[index].complete ?
            taskProperties.completeWeightSum + taskProperties.taskList[index].weight
            :
            taskProperties.completeWeightSum - taskProperties.taskList[index].weight;

        const jsonObject = JSON.stringify(taskProperties);
        setTaskProps(taskProperties);
        await AsyncStorage.mergeItem(key, jsonObject);

        // console.log("Task properties after:", taskProperties);
    }

    // add button sets to true, save button sets to false
    const [newSubTaskAdded, setNewSubTaskAdded] = useState(false);

    // values of the new task
    const [newSubTaskToAdd, setNewSubTaskToAdd] = useState({});

    // updates task list to display (when new task is added to local storage)

    const updateTasks = async () => {
        const ta = [...subTasks];
        let taskToAdd = 0;
        if(newSubTaskAdded){
            taskToAdd = ({
                complete: false,
                id: taskProps.taskLog + 1,
                title: '',
                weight: 1,
            });
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
            setNewSubTaskToAdd(taskToAdd);
            // ta.push(taskToAdd);
        }
        // console.log("ta:", ta);
        ta.sort((a, b) => b.id - a.id);
        newTa = ta.map((task) => {
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
                    // navigation={navigation}
                />
            )
        });
        if(taskToAdd !== 0)
            newTa = [mappedTaskToAdd, ...newTa];
        // console.log("newTa:", newTa);
        setMappedSubTasks(newTa);
    };

    const onSubTaskAdded = () => {
        console.log("New task added?", props.route.params.addedSubTask);
        if(props.route.params.addedSubTask){
            console.log("Rerendering...");
            setTimeout(() => {
                updateTasks();
                props.route.params.addedSubTask = false;
            }, 100);
        }
    }


    const storeNewSubTask = async (value) => {
        // console.log(props);
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
    }

    const addNewSubtask = (id, title, weight) => {
        // console.log("Subtask added/updated with:");
        // console.log("Id:", id, "Title:", title, "Weight:", weight);
        // create or update?
        const subtaskExists = subTasks.some((task) => task.id == id);
        console.log(subtaskExists);

        const valueToAdd = {
            complete: false,
            id: id,
            title: title,
            weight: weight
        }

        if(subtaskExists){
            // merge
        } else {
            storeNewSubTask(valueToAdd);
            setNewSubTaskAdded(prevState => !prevState);
            setSubTasks(prevState => {
                return [...prevState, valueToAdd];
            })
        }
        // manageTasks();
    }

    useEffect(() => {
        onSubTaskAdded();
    }, [props.route.params.addedSubTask]);

    // renders when new subtask is initiated or added
    useEffect(() => {
        updateTasks();
    }, [subTasks, newSubTaskAdded]);

    // initial run
    useEffect(() => {
        manageTasks();
    }, []);

    const navigation = props.navigation;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='handled' >
                <TaskHead
                    name={taskProps.title}
                    percent={taskProps.completeTaskCount === 0 ? 0: Math.round(taskProps.completeWeightSum/taskProps.weightSum*100)}
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
                    // navigation.navigate('add_subtask', { id: props.route.params.id, appColors: props.route.params.appColors });
                }}
            >
                <Image style={styles.addTask} source={require("../../assets/add_white.png")} resizeMode='contain' />
            </TouchableOpacity>
        </SafeAreaView>
    )
}