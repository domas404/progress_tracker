import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Alert } from 'react-native';
import Task from "./Task"
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function MainTasks(props) {

    const navigation = props.navigation;

    const [sessionTaskCount, setSessionTaskCount] = useState(0);

    const sortingOrder = 'Date';

    const styles = StyleSheet.create({
        mainTasksContainer: {
            width: '100%',
            backgroundColor: '#eee',
            alignItems: 'center',
            // justifyContent: 'center',
            // flex: 2,
            // minHeight: '100%',
            flexGrow: 1,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingBottom: 20,
        },
        sortByContainer: {
            height: 25,
            width: '80%',
            alignItems: 'center',
            marginTop: 15,
            justifyContent: "space-between",
            flexDirection: 'row'
        },
        all: {
            fontWeight: 700,
            color: '#13573F',
            fontSize: 16
        },
        sortBy: {
            fontWeight: 700,
            color: '#13573F',
            fontSize: 16
        }
    })


    const [tasks, setTasks] = useState([]);
    const [mappedTasks, setMappedTasks] = useState([]);

    const getAllKeys = async () => {
        let keys = []
        keys = await AsyncStorage.getAllKeys()
        return(keys);
    };

    const getValuesByKey = async (key) => {
        values = await AsyncStorage.getItem(key);
        return JSON.parse(values);
    }

    const manageTasks = async () => {
        let allKeys = await getAllKeys();
        allKeys = allKeys.filter(element => element !== 'taskCount');
        const tasksWithInfo = allKeys.map(async (key) => {
            let task = await getValuesByKey(key);
            // console.log(task);
            let newTask = {
                id: key,
                title: task.title,
                percent: task.completeTaskCount === 0 ? 0: task.completeTaskCount/task.subTaskCount*100,
                pinned: false,
            }
            setTasks((prevTasks) => prevTasks.find(e => e.id == newTask.id) ? prevTasks : [...prevTasks, newTask]);
        })
    }

    const updateTasks = () => {
        manageTasks();
        setMappedTasks(() => tasks.map((task) => {
            return (
                <Task
                    id={task.id}
                    title={task.title}
                    percent={task.percent}
                    pinned={task.pinned}
                    key={task.id}
                    navigation={navigation}
                />
            )
        }));
    };

    useEffect(() => {
        setTimeout(() => {
            updateTasks();
        }, 500);
    }, );

    // console.log(mappedTasks);

    return (
        <View style={styles.mainTasksContainer}>
            <View style={styles.sortByContainer}>
                <Text style={styles.all}>All</Text>
                <Text style={styles.sortBy}>Sort By: {sortingOrder}</Text>
            </View>
            {/* <Task title="Progress tracking app" percent={80} pinned={false} ></Task> */}
            {mappedTasks}
        </View>
    )
}